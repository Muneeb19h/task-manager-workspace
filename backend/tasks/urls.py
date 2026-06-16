from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationMarkReadAPIView, TaskAnalyticsOverviewAPIView, TaskAnalyticsTrendsAPIView,TaskListCreateAPIView,TaskRetrieveUpdateDestroyAPIView,TaskListSharedAPIView,TaskShareActionAPIView,NotificationListAPIView,UserListAPIView


urlpatterns=[
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('analytics/overview/', TaskAnalyticsOverviewAPIView.as_view(), name='analytics-overview'),
    path('analytics/trends/', TaskAnalyticsTrendsAPIView.as_view(), name='analytics-trends'),
    path('tasks/', TaskListCreateAPIView.as_view(), name='task-list-create'),
    path('tasks/shared/', TaskListSharedAPIView.as_view(), name='task-list-shared'), # GET /api/tasks/shared/
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyAPIView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/share/', TaskShareActionAPIView.as_view(), name='task-share-action'), # PUT /api/tasks/:id/share/
    path('notifications/', NotificationListAPIView.as_asgi() if hasattr(NotificationListAPIView, 'as_asgi') else NotificationListAPIView.as_view(), name='notification-list'),
    path('notifications/mark-read/', NotificationMarkReadAPIView.as_view(), name='notification-mark-read'),
]