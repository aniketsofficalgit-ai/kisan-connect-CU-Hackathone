from app.database.connection import SessionLocal
from app.database.models import Notification

def get_user_notifications(user_id: int):
    db = SessionLocal()
    try:
        notifs = db.query(Notification).filter_by(user_id=user_id).order_by(Notification.created_at.desc()).limit(30).all()
        unread_count = sum(1 for n in notifs if not n.is_read)
        return {
            "unread_count": unread_count,
            "notifications": [n.to_dict() for n in notifs]
        }
    finally:
        db.close()
