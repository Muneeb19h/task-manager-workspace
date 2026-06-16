from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from tasks.serializers import TaskSerializer

class TaskBaseAPIView(APIView):
    serializer_class = TaskSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_serializer(self, *args, **kwargs):
        return self.serializer_class(*args, **kwargs)