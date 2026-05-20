from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskListCreateAPIView,TaskRetrieveUpdateDestroyAPIView


urlpatterns=[
    path('tasks/',TaskListCreateAPIView.as_view(),name='task-list-create'),
    path('tasks/<int:pk>/',TaskRetrieveUpdateDestroyAPIView.as_view(),name='task-detail')
]