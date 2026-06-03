from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Task
from .serializers import TaskSerializer


#Parent (Base class Holds common Form/metadata logic)
class TaskBaseAPIView(APIView):
    #registring serializer class globally
    serializer_class=TaskSerializer

    permission_classes = [IsAuthenticated]
    #Feeding metadata to Borwser UI for form Design
    def get_serializer(self,*args,**kwargs):
        return self.serializer_class(*args,**kwargs)
    

#List & Create View
class TaskListCreateAPIView(TaskBaseAPIView):
    
    #List all tasks
    def get(self,request):
        tasks=Task.objects.filter(user=request.user).order_by('-created_at') 
        serializer=self.get_serializer(tasks,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    #Create a New task
    def post(self,request):
        #converting comming data(from form) into serializers
        serializer=self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
    
    
# Detail, Update & Delete View
class TaskRetrieveUpdateDestroyAPIView(TaskBaseAPIView):

    #replacing repeatation with one get_obj func(for 404)
    def get_object(self,pk,user):
        return get_object_or_404(Task,pk=pk,user=user)
    
    #reterive single task
    def get(self,request,pk):
       task=self.get_object(pk)
       serializer=self.get_serializer(task)
       return Response(serializer.data,status=status.HTTP_200_OK)
    
    #update task
    def put(self,request,pk):
        task=self.get_object(pk)
        #existing database task and new data to serializer
        serializer=self.get_serializer(task,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    # partial update task state modification
    def patch(self, request, pk):
        task = self.get_object(pk)
        # partial=True flags the serializer to allow selective field updates
        serializer = self.get_serializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #Delete a Task
    def delete(self,request,pk):
        task=self.get_object(pk)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)