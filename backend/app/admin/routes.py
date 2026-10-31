from flask import Blueprint, request, jsonify, g
from app.auth.service import login_required
from app.database.connection import SessionLocal
from app.database.models import User, PartnerProfile, WasteListing, CollectionRequest, Notification
from app.admin.service import get_admin_dashboard_metrics

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/stats", methods=["GET"])
@login_required(roles=["admin"])
def get_stats():
    metrics = get_admin_dashboard_metrics()
    return jsonify({"metrics": metrics}), 200

@admin_bp.route("/users", methods=["GET"])
@login_required(roles=["admin"])
def get_all_users():
    role = request.args.get("role")
    db = SessionLocal()
    try:
        query = db.query(User)
        if role:
            query = query.filter_by(role=role)
        users = query.order_by(User.created_at.desc()).all()
        return jsonify({"users": [u.to_dict() for u in users]}), 200
    finally:
        db.close()

@admin_bp.route("/users/<int:user_id>/toggle-status", methods=["PUT"])
@login_required(roles=["admin"])
def toggle_user_status(user_id):
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        if user.id == g.user_id:
            return jsonify({"error": "Cannot deactivate your own admin account"}), 400

        user.is_active = not user.is_active
        db.commit()
        return jsonify({
            "message": f"User status changed to {'active' if user.is_active else 'inactive'}",
            "is_active": user.is_active
        }), 200
    finally:
        db.close()

@admin_bp.route("/pending-partners", methods=["GET"])
@login_required(roles=["admin"])
def get_pending_partners():
    db = SessionLocal()
    try:
        partners = db.query(PartnerProfile).filter_by(verification_status="pending").all()
        return jsonify({"partners": [p.to_dict() for p in partners]}), 200
    finally:
        db.close()

@admin_bp.route("/partners/<int:partner_id>/verify", methods=["PUT"])
@login_required(roles=["admin"])
def verify_partner(partner_id):
    data = request.get_json() or {}
    status = data.get("status", "approved") # 'approved' or 'rejected'
    notes = data.get("notes", "")

    if status not in ["approved", "rejected"]:
        return jsonify({"error": "Status must be 'approved' or 'rejected'"}), 400

    db = SessionLocal()
    try:
        partner = db.query(PartnerProfile).filter_by(id=partner_id).first()
        if not partner:
            partner = db.query(PartnerProfile).filter_by(user_id=partner_id).first()

        if not partner:
            return jsonify({"error": "Partner profile not found"}), 404

        partner.verification_status = status
        partner.is_verified = (status == "approved")

        # Notify partner
        notif = Notification(
            user_id=partner.user_id,
            title=f"Partner Account {status.capitalize()}",
            message=f"Your recycling partner verification request has been {status}. {notes}",
            type="partner_approval",
            link="/partner-dashboard"
        )
        db.add(notif)
        db.commit()

        return jsonify({
            "message": f"Partner verification status updated to {status}",
            "partner": partner.to_dict()
        }), 200
    finally:
        db.close()

@admin_bp.route("/listings", methods=["GET"])
@login_required(roles=["admin"])
def get_all_listings():
    db = SessionLocal()
    try:
        listings = db.query(WasteListing).order_by(WasteListing.created_at.desc()).all()
        return jsonify({"listings": [l.to_dict() for l in listings]}), 200
    finally:
        db.close()

@admin_bp.route("/collection-requests", methods=["GET"])
@login_required(roles=["admin"])
def get_all_requests():
    db = SessionLocal()
    try:
        requests = db.query(CollectionRequest).order_by(CollectionRequest.updated_at.desc()).all()
        return jsonify({"requests": [r.to_dict() for r in requests]}), 200
    finally:
        db.close()
