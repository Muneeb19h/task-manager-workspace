#serializer takes complex data types (like Task(tasks_task) in this case database objects) 
# and converts them into clean JSON data that frontend can easily read and interact with later#
from rest_framework import serializers
from django.utils import timezone
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        
        #Due date validations (No past dates)
    def validate_due_date(self,value):
        if value< timezone.now().date():
            raise serializers.ValidationError("The due date cannot be set in the past")
        return value
    
        #Title Cannot be just numbers
    def validate_title(self,value):
        if value.isdigit():
            raise serializers.ValidationError("The title cannot consist of numbers only")
        return value