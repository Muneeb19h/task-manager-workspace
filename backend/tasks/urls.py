from django.urls import path
from tasks import views  # This reads from views/__init__.py directory

urlpatterns = [
    path('users/', views.UserListAPIView.as_view(), name='user-list'),
    
    # Analytics Endpoints
    path('analytics/overview/', views.TaskAnalyticsOverviewAPIView.as_view(), name='analytics-overview'),
    path('analytics/trends/', views.TaskAnalyticsTrendsAPIView.as_view(), name='analytics-trends'),
    
    # Core Task Endpoints
    path('tasks/', views.TaskListCreateAPIView.as_view(), name='task-list-create'),
    path('tasks/shared/', views.TaskListSharedAPIView.as_view(), name='task-list-shared'),
    path('tasks/<int:pk>/', views.TaskRetrieveUpdateDestroyAPIView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/share/', views.TaskShareActionAPIView.as_view(), name='task-share-action'),
    
    # Notification Endpoints
    path('notifications/', views.NotificationListAPIView.as_view(), name='notification-list'),
    path('notifications/mark-read/', views.NotificationMarkReadAPIView.as_view(), name='notification-mark-read'),
]