from flask import Blueprint, jsonify, g
from app.auth.service import login_required
from app.farmers.service import get_farmer_dashboard_stats
from app.database.connection import SessionLocal
from app.database.models import User, WasteListing, CollectionRequest

farmers_bp = Blueprint("farmers", __name__)

@farmers_bp.route("/dashboard", methods=["GET"])
@login_required(roles=["farmer", "admin"])
def farmer_dashboard():
    stats = get_farmer_dashboard_stats(g.user_id)
    return jsonify({"stats": stats}), 200

@farmers_bp.route("/my-listings", methods=["GET"])
@login_required(roles=["farmer", "admin"])
def get_my_listings():
    db = SessionLocal()
    try:
        listings = db.query(WasteListing).filter_by(farmer_id=g.user_id).order_by(WasteListing.created_at.desc()).all()
        return jsonify({"listings": [l.to_dict() for l in listings]}), 200
    finally:
        db.close()

@farmers_bp.route("/my-requests", methods=["GET"])
@login_required(roles=["farmer", "admin"])
def get_my_collection_requests():
    db = SessionLocal()
    try:
        requests = db.query(CollectionRequest).filter_by(farmer_id=g.user_id).order_by(CollectionRequest.updated_at.desc()).all()
        return jsonify({"requests": [r.to_dict() for r in requests]}), 200
    finally:
        db.close()
