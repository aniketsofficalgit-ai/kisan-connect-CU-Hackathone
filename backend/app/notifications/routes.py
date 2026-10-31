from flask import Blueprint, jsonify, g
from app.auth.service import login_required
from app.database.connection import SessionLocal
from app.database.models import Notification
from app.notifications.service import get_user_notifications

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route("/", methods=["GET"])
@login_required()
def get_notifications():
    data = get_user_notifications(g.user_id)
    return jsonify(data), 200

@notifications_bp.route("/<int:notif_id>/read", methods=["PUT"])
@login_required()
def mark_read(notif_id):
    db = SessionLocal()
    try:
        notif = db.query(Notification).filter_by(id=notif_id, user_id=g.user_id).first()
        if notif:
            notif.is_read = True
            db.commit()
        return jsonify({"message": "Marked as read"}), 200
    finally:
        db.close()

@notifications_bp.route("/mark-all-read", methods=["PUT"])
@login_required()
def mark_all_read():
    db = SessionLocal()
    try:
        db.query(Notification).filter_by(user_id=g.user_id, is_read=False).update({"is_read": True})
        db.commit()
        return jsonify({"message": "All notifications marked as read"}), 200
    finally:
        db.close()
