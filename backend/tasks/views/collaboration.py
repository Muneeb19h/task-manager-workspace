from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from tasks.models import Task, Notification
from .base import TaskBaseAPIView

class TaskListSharedAPIView(TaskBaseAPIView):
    def get(self, request):
        tasks = Task.objects.filter(shared_with=request.user).exclude(user=request.user).order_by('-created_at')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TaskShareActionAPIView(TaskBaseAPIView):
    def put(self, request, pk):
        task = get_object_or_404(Task, pk=pk)
        
        if task.user != request.user:
            return Response(
                {"error": "Access Denied: Only the task owner can share this workspace"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        user_ids = request.data.get('user_ids', [])
        if not isinstance(user_ids, list):
            return Response(
                {"error": "Malformed Payload: 'user_ids' field must be a valid array list."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if request.user.id in user_ids:
            return Response(
                {"error": "Sharing error: owners cannot share a task with themselves."},
                status=status.HTTP_400_BAD_REQUEST
            )

        valid_users = User.objects.filter(id__in=user_ids)
        if not valid_users.exists() and len(user_ids) > 0:
            return Response(
                {"error": "Target Matching Fail: No valid system users found matching the provided IDs."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        task.shared_with.set(valid_users)
        task.save()
        
        channel_layer = get_channel_layer()
        for member in valid_users:
            Notification.objects.create(
                recipient=member,
                notification_type="TASK_SHARED",
                task_title=task.title,
                message=f"Great news! {request.user.username} shared the task '{task.title}' with you."
            )
            async_to_sync(channel_layer.group_send)(
                f"user_notification_{member.id}",
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