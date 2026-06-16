from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from tasks.models import Task, Notification
from .base import TaskBaseAPIView

class TaskListCreateAPIView(TaskBaseAPIView):
    def get(self, request):
        tasks = Task.objects.filter(Q(user=request.user) | Q(shared_with=request.user)).distinct().order_by('-created_at')
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskRetrieveUpdateDestroyAPIView(TaskBaseAPIView):
    def get_object(self, pk):
        return get_object_or_404(
            Task, 
            Q(pk=pk) & (Q(user=self.request.user) | Q(shared_with=self.request.user))
        )
        
    def get(self, request, pk):
        task = self.get_object(pk)
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        task = self.get_object(pk)
        old_status = task.status
        serializer = self.get_serializer(task, data=request.data)
        if serializer.is_valid():
            updated_task = serializer.save()
            self._handle_status_notification(request, updated_task, old_status)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        task = self.get_object(pk)
        old_status = task.status
        serializer = self.get_serializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            updated_task = serializer.save()
            self._handle_status_notification(request, updated_task, old_status)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        task = self.get_object(pk)
        if task.user != request.user:
            return Response(
                {"error": "Access Denied: Only the original owner can delete this task node."},
                status=status.HTTP_403_FORBIDDEN
            )
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def _handle_status_notification(self, request, task, old_status):
        if old_status != task.status:
            channel_layer = get_channel_layer()
            recipients = set(task.shared_with.values_list('id', flat=True))
            recipients.add(task.user.id)
            
            if request.user.id in recipients:
                recipients.remove(request.user.id)
                
            for user_id in recipients:
                target_user = User.objects.get(id=user_id)
                Notification.objects.create(
                    recipient=target_user,
                    notification_type="STATUS_UPDATED",
                    task_title=task.title,
                    message=f"Status Update: '{task.title}' has been moved from '{old_status}' to '{task.status}' by {request.user.username}."
                )
                async_to_sync(channel_layer.group_send)(
                    f"user_notification_{user_id}",
                    {
                        "type": "send_notification",
                        "notification_type": "STATUS_UPDATED",
                        "task_title": task.title,
                        "message": f"Status Update: '{task.title}' has been moved from '{old_status}' to '{task.status}' by {request.user.username}."
                    }
                )