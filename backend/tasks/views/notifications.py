from rest_framework import status
from rest_framework.response import Response
from tasks.models import Notification
from tasks.serializers import NotificationSerializer
from .base import TaskBaseAPIView

class NotificationListAPIView(TaskBaseAPIView):
    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class NotificationMarkReadAPIView(TaskBaseAPIView):
    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response(
            {"message": "All notifications marked read."},
            status=status.HTTP_200_OK
        )