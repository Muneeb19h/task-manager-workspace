from datetime import datetime, time
from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver
from .models import Task
from .mongo_client import get_task_collection


def _serialize_task(task: Task) -> dict:
    due_datetime = None
    if task.due_date:
        due_datetime = datetime.combine(task.due_date, time.min)

    return {
        '_id': int(task.id),
        'task_id': int(task.id),
        'user_id': int(task.user_id),
        'title': task.title,
        'status': task.status,
        'description': task.description or '',
        'due_date': due_datetime,
        'created_at': task.created_at,
        'updated_at': task.updated_at,
        'shared_with_ids': list(task.shared_with.values_list('id', flat=True)),
    }


def _get_collection():
    return get_task_collection()


@receiver(post_save, sender=Task)
def sync_task_to_mongo(sender, instance: Task, **kwargs):
    collection = _get_collection()
    if collection is None:
        return

    document = _serialize_task(instance)
    collection.replace_one({'_id': document['_id']}, document, upsert=True)


@receiver(post_delete, sender=Task)
def delete_task_from_mongo(sender, instance: Task, **kwargs):
    collection = _get_collection()
    if collection is None:
        return

    collection.delete_one({'_id': int(instance.id)})


@receiver(m2m_changed, sender=Task.shared_with.through)
def sync_task_shared_with(sender, instance: Task, action: str, **kwargs):
    if action not in ('post_add', 'post_remove', 'post_clear'):
        return

    collection = _get_collection()
    if collection is None:
        return

    shared_ids = list(instance.shared_with.values_list('id', flat=True))
    collection.update_one(
        {'_id': int(instance.id)},
        {'$set': {'shared_with_ids': shared_ids}}
    )
