# your_task_app/admin.py
from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    # 'user' here will display the username of the person who owns the task
    list_display = ('id', 'title', 'status', 'due_date', 'user')
    
    # Allows you to filter the list view by specific users in the sidebar
    list_filter = ('user', 'status')