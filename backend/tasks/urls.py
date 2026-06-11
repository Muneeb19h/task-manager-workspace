from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskListCreateAPIView,TaskRetrieveUpdateDestroyAPIView,TaskListSharedAPIView,TaskShareActionAPIView


urlpatterns=[
path('tasks/', TaskListCreateAPIView.as_view(), name='task-list-create'),
    path('tasks/shared/', TaskListSharedAPIView.as_view(), name='task-list-shared'), # GET /api/tasks/shared/
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyAPIView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/share/', TaskShareActionAPIView.as_view(), name='task-share-action'), # PUT /api/tasks/:id/share/
]