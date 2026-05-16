#A serializer takes complex data types (like Task in this case database objects) 
# and converts them into clean JSON data that frontend can easily read and interact with later#
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'