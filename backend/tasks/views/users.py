from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .base import TaskBaseAPIView

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
        user = User.objects.create_user(username=username, password=password)
        
        return Response(
            {
                "message": "User node initialized successfully.",
                "user": {"username": user.username}
            }, 
            status=status.HTTP_201_CREATED
        )

class UserListAPIView(TaskBaseAPIView):
    def get(self, request):
        users = User.objects.exclude(id=request.user.id).values('id', 'username')
        return Response(list(users), status=status.HTTP_200_OK)