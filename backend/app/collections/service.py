import random
from datetime import datetime, timezone
from app.database.connection import SessionLocal
from app.database.models import (
    CollectionRequest, CollectionStatusHistory, WasteListing, User, Notification
)

def generate_request_number():
    year = datetime.now().year
    rand_num = random.randint(1000, 9999)
    return f"KC-REQ-{year}-{rand_num}"

def add_status_history(db, collection_id: int, status: str, comment: str, user_id: int):
    history = CollectionStatusHistory(
        collection_id=collection_id,
        status=status,
        comment=comment,
        updated_by_id=user_id,
        created_at=datetime.now(timezone.utc)
    )
    db.add(history)

def notify_user(db, user_id: int, title: str, message: str, notif_type: str = "status_update", link: str = "/tracking"):
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notif_type,
        link=link,
        created_at=datetime.now(timezone.utc)
    )
    db.add(notif)
