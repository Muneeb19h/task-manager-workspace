from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from channels.layers import get_channel_layer  # For reaching WebSocket lines
from asgiref.sync import async_to_sync         # Converts async tasks to run in sync view
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q, Count          # Added Count here to fix aggregation queries
from django.utils import timezone
from datetime import timedelta
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import TaskSerializer, NotificationSerializer
from rest_framework import status
from .models import Task, Notification


# Parent (Base class Holds common Form/metadata logic)
class TaskBaseAPIView(APIView):
    # registering serializer class globally
    serializer_class = TaskSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    # Feeding metadata to Browser UI for form Design
    def get_serializer(self, *args, **kwargs):
        return self.serializer_class(*args, **kwargs)


# List & Create View
class TaskListCreateAPIView(TaskBaseAPIView):
    
    # List all tasks
    def get(self, request):
        tasks = Task.objects.filter(Q(user=request.user) | Q(shared_with=request.user)).distinct().order_by('-created_at')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # Create a New task
    def post(self, request):
        # converting coming data(from form) into serializers
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View1: Get/api/tasks/shared
class TaskListSharedAPIView(TaskBaseAPIView):
    """
    Isolates and returns ONLY the tasks that other teammates 
    have shared with the currently logged-in operator.
    """
    def get(self, request):
        tasks = Task.objects.filter(shared_with=request.user).exclude(user=request.user).order_by('-created_at')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TaskShareActionAPIView(TaskBaseAPIView):
    def put(self, request, pk):
        task = get_object_or_404(Task, pk=pk)  # ensuring that task exists
        
        # Security Check
        # only original Creator/Owner is allowed to share the task
        if task.user != request.user:
            return Response(
                {"error": "Access Denied: Only the task owner can share this workspace "},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Expecting an array list of user IDs, e.g., {"user_ids": [2, 3]}
        user_ids = request.data.get('user_ids', [])
        if not isinstance(user_ids, list):
            return Response(
                {"error": "Malformed Payload: 'user_ids' field must be a valid array list."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Reject attempts to share with the owner/self via this endpoint
        if request.user.id in user_ids:
            return Response(
                {"error": "Sharing error: owners cannot share a task with themselves."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify user IDs exist within the database
        valid_users = User.objects.filter(id__in=user_ids)
        
        if not valid_users.exists() and len(user_ids) > 0:
            return Response(
                {"error": "Target Matching Fail: No valid system users found matching the provided IDs."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Set the collaboration array mapping (this overwrites with the new list)
        task.shared_with.set(valid_users)
        task.save()
        
        # 🌟 UPDATED: Save to Database AND Send Real-Time Share Notification
        channel_layer = get_channel_layer()
        for member in valid_users:
            # 1. Persistent Database Record
            Notification.objects.create(
                recipient=member,
                notification_type="TASK_SHARED",
                task_title=task.title,
                message=f"Great news! {request.user.username} shared the task '{task.title}' with you."
            )
            
            # 2. Live WebSocket Push
            async_to_sync(channel_layer.group_send)(
                f"user_notification_{member.id}",  # Target the receiver's private line
                {
                    "type": "send_notification",
                    "notification_type": "TASK_SHARED",
                    "task_title": task.title,
                    "message": f"Great news! {request.user.username} shared the task '{task.title}' with you."
                }
            )
        
        serializer = self.get_serializer(task)
        return Response(
            {
                "message": "Task collaboration network updated successfully.",
                "task": serializer.data
            },
            status=status.HTTP_200_OK
        )


# Detail, Update & Delete View
class TaskRetrieveUpdateDestroyAPIView(TaskBaseAPIView):

    # Replace repeated lookup logic with one helper that applies request user filtering
    def get_object(self, pk):
        """
        UPDATED: Allows a user to view, edit, or delete a task if they own it 
        OR if it has been explicitly shared with them.
        """
        return get_object_or_404(
            Task, 
            Q(pk=pk) & (Q(user=self.request.user) | Q(shared_with=self.request.user))
        )
        
    # Retrieve single task
    def get(self, request, pk):
        task = self.get_object(pk)
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # update task
    def put(self, request, pk):
        task = self.get_object(pk)
        old_status = task.status  # Track status changes for complete replacement updates
        
        serializer = self.get_serializer(task, data=request.data)
        if serializer.is_valid():
            updated_task = serializer.save()
            
            # Trigger notification loop if status field is changed
            self._handle_status_notification(request, updated_task, old_status)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # partial update task state modification
    def patch(self, request, pk):
        task = self.get_object(pk)
        old_status = task.status  # Track status changes for partial state updates
        
        serializer = self.get_serializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            updated_task = serializer.save()
            
            # Trigger notification loop if status field is changed
            self._handle_status_notification(request, updated_task, old_status)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # 🌟 UPDATED HELPER METHOD: Log to Database AND Broadcast status updates to all relevant users
    def _handle_status_notification(self, request, task, old_status):
        if old_status != task.status:
            channel_layer = get_channel_layer()
            
            # Gather a clear set of everyone attached to this task (Owner + Collaborators)
            recipients = set(task.shared_with.values_list('id', flat=True))
            recipients.add(task.user.id)
            
            # Avoid sending an alert notification to the user who just made the update
            if request.user.id in recipients:
                recipients.remove(request.user.id)
                
            for user_id in recipients:
                target_user = User.objects.get(id=user_id)
                
                # 1. Persistent Database Record
                Notification.objects.create(
                    recipient=target_user,
                    notification_type="STATUS_UPDATED",
                    task_title=task.title,
                    message=f"Status Update: '{task.title}' has been moved from '{old_status}' to '{task.status}' by {request.user.username}."
                )
                
                # 2. Live WebSocket Push
                async_to_sync(channel_layer.group_send)(
                    f"user_notification_{user_id}",
                    {
                        "type": "send_notification",
                        "notification_type": "STATUS_UPDATED",
                        "task_title": task.title,
                        "message": f"Status Update: '{task.title}' has been moved from '{old_status}' to '{task.status}' by {request.user.username}."
                    }
                )

    # Delete a Task
    def delete(self, request, pk):
        task = self.get_object(pk)
        # Security Valve: Prevent a shared collaborator from deleting the owner's task
        if task.user != request.user:
            return Response(
                {"error": "Access Denied: Only the original owner can delete this task node."},
                status=status.HTTP_403_FORBIDDEN
            )
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class UserRegisterAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response(
                {"error": "Username and Password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username is already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = User.objects.create_user(
            username=username,
            password=password
        )
        
        return Response(
            {
                "message": "User node initialized successfully.",
                "user": {"username": user.username}
            }, 
            status=status.HTTP_201_CREATED
        )


class NotificationListAPIView(TaskBaseAPIView):
    """
    Returns the persistent history logs of all notifications 
    addressed directly to the requesting operator node.
    """
    def get(self, request):
        # Fetch notifications for the currently logged-in user ordered by latest
        notifications = Notification.objects.filter(recipient=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NotificationMarkReadAPIView(TaskBaseAPIView):
    """
    Marks all notifications belonging to the requesting user as read.
    """
    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response(
            {"message": "All notifications marked read."},
            status=status.HTTP_200_OK
        )


class UserListAPIView(TaskBaseAPIView):
    """
    Returns a clean registry of all active system users 
    excluding the requesting operator node.
    """
    def get(self, request):
        # Fetch all users except the person currently logged in
        users = User.objects.exclude(id=request.user.id).values('id', 'username')
        return Response(list(users), status=status.HTTP_200_OK)
    
    
# 📊 NEW VIEW: GET /analytics/overview
class TaskAnalyticsOverviewAPIView(TaskBaseAPIView):
    """
    Delivers summary metrics (total, completed, pending, in-progress) and pie chart data.
    """
    def get(self, request, format=None):
        try:
            user_tasks = Task.objects.filter(user=request.user)
            total_tasks = user_tasks.count()
            now = timezone.now()

            status_counts = user_tasks.values('status').annotate(count=Count('status'))
            status_map = {item['status']: item['count'] for item in status_counts}
            
            completed = status_map.get('Completed', 0)
            in_progress = status_map.get('In Progress', 0)
            pending = status_map.get('Pending', 0)
            overdue = user_tasks.filter(due_date__lt=now).exclude(status='Completed').count()
            
            completion_rate = round((completed / total_tasks) * 100, 1) if total_tasks > 0 else 0

            return Response({
                "summary": {
                    "total_tasks": total_tasks,
                    "completed": completed,
                    "in_progress": in_progress,
                    "pending": pending,
                    "overdue": overdue,
                    "overdue_count": overdue,
                    "completion_rate": completion_rate
                },
                "status_distribution": [
                    {"name": "Pending", "value": pending},
                    {"name": "In Progress", "value": in_progress},
                    {"name": "Completed", "value": completed}
                ]
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"❌ Overview Analytics Error: {str(e)}")
            return Response({"error": "An internal error occurred running summary stats."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 🗓️ NEW VIEW: GET /analytics/trends
class TaskAnalyticsTrendsAPIView(TaskBaseAPIView):
    """
    Provides data coordinates for Weekly vs Monthly comparison datasets.
    """
    def get(self, request, format=None):
        try:
            user_tasks = Task.objects.filter(user=request.user)
            now = timezone.now()

            # 1. Weekly Trends Dataset (Last 7 Days)
            # Use DateField-friendly lookups: compare DateField to date objects
            weekly_trends = []
            for i in range(6, -1, -1):
                target_date = (now - timedelta(days=i)).date()
                # Completed: tasks updated on that day
                completed_count = user_tasks.filter(status='Completed', updated_at__date=target_date).count()
                # Overdue: tasks with a due_date equal to the target date that are not completed
                # and that are before today (i.e., truly overdue as of now)
                overdue_count = user_tasks.filter(due_date=target_date).exclude(status='Completed')
                if now.date() > target_date:
                    overdue_count = overdue_count.filter(due_date__lt=now.date())
                overdue_count = overdue_count.count()

                weekly_trends.append({
                    "date": target_date.strftime('%a'),
                    "Completed": completed_count,
                    "Overdue": overdue_count
                })

            # 2. Monthly Trends Dataset (Last 6 Months)
            monthly_trends = []
            for i in range(5, -1, -1):
                check_date = now - timedelta(days=i * 30)
                month_start = check_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

                if month_start.month == 12:
                    next_month = month_start.replace(year=month_start.year + 1, month=1)
                else:
                    next_month = month_start.replace(month=month_start.month + 1)

                # Convert month bounds to dates for comparing against DateField `due_date` safely
                month_start_date = month_start.date()
                next_month_date = next_month.date()

                monthly_trends.append({
                    "date": month_start.strftime('%b'),
                    "Completed": user_tasks.filter(
                        status='Completed', 
                        updated_at__gte=month_start, 
                        updated_at__lt=next_month
                    ).count(),
                    "Overdue": user_tasks.filter(
                        due_date__gte=month_start_date, 
                        due_date__lt=next_month_date
                    ).filter(
                        due_date__lt=now.date()
                    ).exclude(status='Completed').count()
                })

            return Response({
                "weekly_trends": weekly_trends,
                "monthly_trends": monthly_trends
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"❌ Trends Analytics Error: {str(e)}")
            return Response({"error": "An internal error occurred running timeline trend parameters."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)