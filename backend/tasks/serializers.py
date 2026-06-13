#serializer takes complex data types (like Task(tasks_task) in this case database objects) 
# and converts them into clean JSON data that frontend can easily read and interact with later#
from rest_framework import serializers
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Task,Notification


class UserSharedSummarySerializer(serializers.ModelSerializer):
    """light weight summary nested serializer for user references"""
    class Meta:
        model=User
        fields=['id','username','email']
class TaskSerializer(serializers.ModelSerializer):
    owner_details=UserSharedSummarySerializer(source='user',read_only=True)
    shared_with_details=UserSharedSummarySerializer(source='shared_with',many=True,read_only=True)
    class Meta:
        model = Task
        fields = ['id','user','owner_details','title','description','status','due_date','shared_with','shared_with_details','created_at','updated_at']
        extra_kwargs = {
            'user': {'read_only': True},
        }
        
        
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'task_title', 'message', 'is_read', 'created_at']
        #Due date validations (No past dates)
    def validate_due_date(self,value):
        if self.instance:
            # If the date hasn't been changed by the user, let it pass cleanly
            if self.instance.due_date == value:
                return value
        if value< timezone.now().date():
            raise serializers.ValidationError("The due date cannot be set in the past")
        return value
    
        #Title Cannot be just numbers
    def validate_title(self,value):
        if value.isdigit():
            raise serializers.ValidationError("The title cannot consist of numbers only")
        return value
    
    # in description only meaningful notes should be provided
    def validate_description(self,value):
        if not value or len(value.strip()) == 0:
            return ""
        if value and len(value.strip())<10:
            raise serializers.ValidationError("If description is provided, it must be 10 Characters long")
        return value