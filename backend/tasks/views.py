from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Task
from .serializers import TaskSerializer

class TaskListCreateAPIView(APIView):
    #registring serializer class globally
    serializer_class=TaskSerializer

    #Feeding metadata to Borwser UI for form
    def get_serializer(self,*args,**kwargs):
        return self.serializer_class(*args,**kwargs)
    
    #List all tasks
    def get(self,request):
        tasks=Task.objects.all().order_by('-created_at')
        serializer=self.get_serializer(tasks,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    #Create a New task
    def post(self,request):
        #converting comming data(from form) into serializers
        serializer=self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class TaskDetailAPIView(APIView):
    #replacing repeatation with one get_obj func
    def get_object(self,request,pk):
        return get_object_or_404(Task,pk=pk)
    
    #reterive single task
    def get(self,request,pk):
       task=self.get_object(pk)
       serializer=TaskSerializer(task)
       return Response(serializer.data,status=status.HTTP_200_OK)
    
    #update task
    def put(self,request,pk):
        task=self.get_object(pk)
        #existing database task and new data to serializer
        serializer=TaskSerializer(task,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    #Delete a Task
    def delete(self,request,pk):
        task=self.get_object(pk)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)