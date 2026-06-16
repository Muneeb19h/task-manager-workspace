from functools import lru_cache
from django.conf import settings


@lru_cache(maxsize=1)
def get_mongo_client():
    mongo_uri = getattr(settings, 'MONGO_URI', None)
    if not mongo_uri:
        return None

    try:
        from pymongo import MongoClient
    except ImportError:
        return None

    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    return client


def get_task_collection():
    client = get_mongo_client()
    if not client:
        return None

    db_name = getattr(settings, 'MONGO_DB_NAME', 'task_manager')
    collection_name = getattr(settings, 'MONGO_TASK_COLLECTION', 'tasks')
    return client[db_name][collection_name]
