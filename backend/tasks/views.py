from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from channels.layers import get_channel_layer  # 🌟 Added: For reaching WebSocket lines
from asgiref.sync import async_to_sync        # 🌟 Added: Converts async tasks to run in sync view
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import TaskSerializer
from rest_framework import status
from .models import Task


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
        
        # 🌟 REAL-TIME TRIGGER 1: Notify users that a task was shared with them
        channel_layer = get_channel_layer()
        for member in valid_users:
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
        old_status = task.status  # 🌟 Track status changes for complete replacement updates
        
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
        old_status = task.status  # 🌟 Track status changes for partial state updates
        
        serializer = self.get_serializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            updated_task = serializer.save()
            
            # Trigger notification loop if status field is changed
            self._handle_status_notification(request, updated_task, old_status)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # 🌟 HELPER METHOD: Broadcasts status changes to all relevant collaborators
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