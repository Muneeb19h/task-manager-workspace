from datetime import datetime, timedelta, date, time
from typing import Optional, Tuple, List
from .mongo_client import get_task_collection


def _get_collection():
    return get_task_collection()


def _date_to_utc_date(dt: date) -> datetime:
    return datetime.combine(dt, time.min)


def _build_week_labels(now: datetime) -> List[Tuple[date, str]]:
    return [
        ((now - timedelta(days=i)).date(), (now - timedelta(days=i)).strftime('%a'))
        for i in range(6, -1, -1)
    ]


def _build_month_labels(now: datetime) -> List[Tuple[date, str]]:
    labels = []
    year = now.year
    month = now.month
    for _ in range(5, -1, -1):
        month_offset = month - _
        if month_offset <= 0:
            label_year = year - 1
            label_month = month_offset + 12
        else:
            label_year = year
            label_month = month_offset
        labels.append((date(label_year, label_month, 1), date(label_year, label_month, 1).strftime('%b')))
    return labels


def get_mongo_analytics_overview(user_id: int, now: Optional[datetime] = None):
    try:
        collection = _get_collection()
        if collection is not None:
            now_dt = now or datetime.utcnow()
            today = datetime.combine(now_dt.date(), datetime.min.time())

            pipeline = [
                {"$match": {"user_id": user_id}},
                {
                    "$facet": {
                        "status_counts": [
                            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
                        ],
                        "total_tasks": [{"$count": "count"}],
                        "overdue_count": [
                            {
                                "$match": {
                                    "due_date": {"$lt": today},
                                    "status": {"$ne": "Completed"}
                                }
                            },
                            {"$count": "count"}
                        ]
                    }
                }
            ]

            result = list(collection.aggregate(pipeline))
            if not result:
                return {
                    "summary": {
                        "total_tasks": 0,
                        "completed": 0,
                        "in_progress": 0,
                        "pending": 0,
                        "overdue": 0,
                        "overdue_count": 0,
                        "completion_rate": 0
                    },
                    "status_distribution": [
                        {"name": "Pending", "value": 0},
                        {"name": "In Progress", "value": 0},
                        {"name": "Completed", "value": 0}
                    ]
                }

            stats = result[0]
            status_counts = {item['_id']: item['count'] for item in stats.get('status_counts', [])}
            total = stats.get('total_tasks', [{}])[0].get('count', 0) if stats.get('total_tasks') else 0
            overdue = stats.get('overdue_count', [{}])[0].get('count', 0) if stats.get('overdue_count') else 0

            completed = status_counts.get('Completed', 0)
            in_progress = status_counts.get('In Progress', 0)
            pending = status_counts.get('Pending', 0)
            completion_rate = round((completed / total) * 100, 1) if total > 0 else 0

            return {
                "summary": {
                    "total_tasks": total,
                    "completed": completed,
                    "in_progress": in_progress,
                    "pending": pending,
                    "overdue": overdue,
                    "overdue_count": overdue,
                    "completion_rate": completion_rate
                },
                "status_distribution": [
                    {"name": "Pending", "value": pending},
                    {"name": "In Progress", "value": in_progress},
                    {"name": "Completed", "value": completed}
                ]
            }
    except Exception:
        pass

    return get_sql_analytics_overview(user_id, now)


def get_mongo_analytics_trends(user_id: int, now: Optional[datetime] = None):
    try:
        collection = _get_collection()
        if collection is not None:
            now_dt = now or datetime.utcnow()
            weekly_labels = _build_week_labels(now_dt)
            monthly_labels = _build_month_labels(now_dt)
            earliest_week = _date_to_utc_date(weekly_labels[0][0])
            earliest_month = _date_to_utc_date(monthly_labels[0][0])

            pipeline = [
                {
                    "$match": {
                        "user_id": user_id,
                        "$or": [
                            {"updated_at": {"$gte": earliest_week}},
                            {"due_date": {"$gte": earliest_week}}
                        ]
                    }
                },
                {
                    "$facet": {
                        "completed_weekly": [
                            {"$match": {"status": "Completed", "updated_at": {"$gte": earliest_week}}},
                            {
                                "$project": {
                                    "day": {
                                        "$dateToString": {
                                            "format": "%Y-%m-%d",
                                            "date": "$updated_at"
                                        }
                                    }
                                }
                            },
                            {"$group": {"_id": "$day", "count": {"$sum": 1}}}
                        ],
                        "overdue_weekly": [
                            {"$match": {"status": {"$ne": "Completed"}, "due_date": {"$gte": earliest_week, "$lt": now_dt}}},
                            {
                                "$project": {
                                    "day": {
                                        "$dateToString": {
                                            "format": "%Y-%m-%d",
                                            "date": "$due_date"
                                        }
                                    }
                                }
                            },
                            {"$group": {"_id": "$day", "count": {"$sum": 1}}}
                        ],
                        "completed_monthly": [
                            {"$match": {"status": "Completed", "updated_at": {"$gte": earliest_month}}},
                            {
                                "$project": {
                                    "month": {
                                        "$dateToString": {
                                            "format": "%Y-%m",
                                            "date": "$updated_at"
                                        }
                                    }
                                }
                            },
                            {"$group": {"_id": "$month", "count": {"$sum": 1}}}
                        ],
                        "overdue_monthly": [
                            {"$match": {"status": {"$ne": "Completed"}, "due_date": {"$gte": earliest_month, "$lt": now_dt}}},
                            {
                                "$project": {
                                    "month": {
                                        "$dateToString": {
                                            "format": "%Y-%m",
                                            "date": "$due_date"
                                        }
                                    }
                                }
                            },
                            {"$group": {"_id": "$month", "count": {"$sum": 1}}}
                        ]
                    }
                }
            ]

            result = list(collection.aggregate(pipeline))
            if not result:
                return {
                    "weekly_trends": [{"date": label, "Completed": 0, "Overdue": 0} for _, label in weekly_labels],
                    "monthly_trends": [{"date": label, "Completed": 0, "Overdue": 0} for _, label in monthly_labels]
                }

            stats = result[0]
            completed_weekly = {item['_id']: item['count'] for item in stats.get('completed_weekly', [])}
            overdue_weekly = {item['_id']: item['count'] for item in stats.get('overdue_weekly', [])}
            completed_monthly = {item['_id']: item['count'] for item in stats.get('completed_monthly', [])}
            overdue_monthly = {item['_id']: item['count'] for item in stats.get('overdue_monthly', [])}

            weekly_trends = []
            for current_date, label in weekly_labels:
                day_key = current_date.strftime('%Y-%m-%d')
                weekly_trends.append({
                    "date": label,
                    "Completed": completed_weekly.get(day_key, 0),
                    "Overdue": overdue_weekly.get(day_key, 0)
                })

            monthly_trends = []
            for month_date, label in monthly_labels:
                month_key = month_date.strftime('%Y-%m')
                monthly_trends.append({
                    "date": label,
                    "Completed": completed_monthly.get(month_key, 0),
                    "Overdue": overdue_monthly.get(month_key, 0)
                })

            return {
                "weekly_trends": weekly_trends,
                "monthly_trends": monthly_trends
            }
    except Exception:
        pass

    return get_sql_analytics_trends(user_id, now)


def get_sql_analytics_overview(user_id: int, now: Optional[datetime] = None):
    from tasks.models import Task
    from django.db.models import Count
    from django.utils import timezone

    now = now or timezone.now()
    today = now.date()

    user_tasks = Task.objects.filter(user_id=user_id)
    total = user_tasks.count()

    status_counts_qs = user_tasks.values('status').annotate(count=Count('id'))
    status_counts = {item['status']: item['count'] for item in status_counts_qs}

    overdue = user_tasks.filter(due_date__lt=today).exclude(status='Completed').count()

    completed = status_counts.get('Completed', 0)
    in_progress = status_counts.get('In Progress', 0)
    pending = status_counts.get('Pending', 0)
    completion_rate = round((completed / total) * 100, 1) if total > 0 else 0

    return {
        "summary": {
            "total_tasks": total,
            "completed": completed,
            "in_progress": in_progress,
            "pending": pending,
            "overdue": overdue,
            "overdue_count": overdue,
            "completion_rate": completion_rate
        },
        "status_distribution": [
            {"name": "Pending", "value": pending},
            {"name": "In Progress", "value": in_progress},
            {"name": "Completed", "value": completed}
        ]
    }


def get_sql_analytics_trends(user_id: int, now: Optional[datetime] = None):
    from tasks.models import Task
    from django.db.models import Count
    from django.utils import timezone

    now = now or timezone.now()
    weekly_labels = _build_week_labels(now)
    monthly_labels = _build_month_labels(now)
    earliest_week = weekly_labels[0][0]
    earliest_month = monthly_labels[0][0]
    today = now.date()

    user_tasks = Task.objects.filter(user_id=user_id)

    # Weekly completed:
    completed_weekly_qs = user_tasks.filter(
        status='Completed',
        updated_at__date__gte=earliest_week
    ).values('updated_at__date').annotate(count=Count('id'))
    completed_weekly = {
        item['updated_at__date'].strftime('%Y-%m-%d'): item['count']
        for item in completed_weekly_qs if item['updated_at__date']
    }

    # Weekly overdue:
    overdue_weekly_qs = user_tasks.filter(
        due_date__gte=earliest_week,
        due_date__lt=today
    ).exclude(status='Completed').values('due_date').annotate(count=Count('id'))
    overdue_weekly = {
        item['due_date'].strftime('%Y-%m-%d'): item['count']
        for item in overdue_weekly_qs if item['due_date']
    }

    # Monthly completed:
    completed_monthly_qs = user_tasks.filter(
        status='Completed',
        updated_at__date__gte=earliest_month
    ).values('updated_at__date').annotate(count=Count('id'))
    completed_monthly = {}
    for item in completed_monthly_qs:
        dt = item['updated_at__date']
        if dt:
            key = dt.strftime('%Y-%m')
            completed_monthly[key] = completed_monthly.get(key, 0) + item['count']

    # Monthly overdue:
    overdue_monthly_qs = user_tasks.filter(
        due_date__gte=earliest_month,
        due_date__lt=today
    ).exclude(status='Completed').values('due_date').annotate(count=Count('id'))
    overdue_monthly = {}
    for item in overdue_monthly_qs:
        dt = item['due_date']
        if dt:
            key = dt.strftime('%Y-%m')
            overdue_monthly[key] = overdue_monthly.get(key, 0) + item['count']

    # Build weekly trends array
    weekly_trends = []
    for current_date, label in weekly_labels:
        day_key = current_date.strftime('%Y-%m-%d')
        weekly_trends.append({
            "date": label,
            "Completed": completed_weekly.get(day_key, 0),
            "Overdue": overdue_weekly.get(day_key, 0)
        })

    # Build monthly trends array
    monthly_trends = []
    for month_date, label in monthly_labels:
        month_key = month_date.strftime('%Y-%m')
        monthly_trends.append({
            "date": label,
            "Completed": completed_monthly.get(month_key, 0),
            "Overdue": overdue_monthly.get(month_key, 0)
        })

    return {
        "weekly_trends": weekly_trends,
        "monthly_trends": monthly_trends
    }
