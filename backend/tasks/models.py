from django.db import models


class Task(models.Model):
    #choices for status
    class StatusChoices(models.TextChoices):
        PENDING='Pending','Pending'
        IN_PROGRESS='In Progress','In Progress'
        COMPLETED='Completed','Completed'
    title=models.CharField(max_length=200)
    description=models.TextField(blank=True,null=True)
    status=models.CharField(max_length=20,choices=StatusChoices.choices,default=StatusChoices.PENDING)
    due_date=models.DateField()
    created_at=models.DateTimeField(auto_now_add=True) #for Query purposes bcs it would e unique
    updated_at=models.DateTimeField(auto_now=True)      # same purpose

def __str__(self):
    return self.title    

