from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskListCreateAPIView,TaskDetailAPIView


urlpatterns=[
    path('tasks/',TaskListCreateAPIView.as_view(),name='task-list-create'),
    path('tasks/<int:pk>',TaskDetailAPIView.as_view(),name='task-detail')
]