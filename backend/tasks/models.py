from django.db import models
from django.contrib.auth.models import User

class StatusChoices(models.TextChoices):
    PENDING='Pending','Pending'
    IN_PROGRESS='In Progress','In Progress'
    COMPLETED='Completed','Completed'
    
    
class Task(models.Model):
    #choices for status
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='tasks')
    title=models.CharField(max_length=200)
    description=models.TextField(blank=True,null=True)
    status=models.CharField(max_length=20,choices=StatusChoices.choices,default=StatusChoices.PENDING)
    due_date=models.DateField()
    
    
    #This reprsents the arry of user IDs with whom the task is shared
    shared_with=models.ManyToManyField(User,related_name='shared_tasks',blank=True)
    # Additional : For tracking Lifecycle of a task
    created_at=models.DateTimeField(auto_now_add=True) #sets timestamp only once ,never changes
    updated_at=models.DateTimeField(auto_now=True)      # changes timestamp every single time we save changes

    def __str__(self):
        return f"{self.title} -Owner:  {self.user.username}" 

