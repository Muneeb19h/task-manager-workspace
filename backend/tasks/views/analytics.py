from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .base import TaskBaseAPIView
from tasks.mongo_analytics import get_mongo_analytics_overview, get_mongo_analytics_trends
from tasks.models import Task

class TaskAnalyticsOverviewAPIView(TaskBaseAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        data = get_mongo_analytics_overview(user_id=request.user.id)
        if data is None:
            return Response({"error": "NoSQL Connection Failure"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(data, status=status.HTTP_200_OK)
    
class TaskAnalyticsTrendsAPIView(TaskBaseAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        data = get_mongo_analytics_trends(user_id=request.user.id)
        if data is None:
            return Response({"error": "NoSQL Connection Failure"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(data, status=status.HTTP_200_OK)