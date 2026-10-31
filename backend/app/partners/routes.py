from flask import Blueprint, request, jsonify, g
from app.auth.service import login_required
from app.database.connection import SessionLocal
from app.database.models import User, PartnerProfile, WasteListing
from app.partners.service import get_verified_partners, get_partner_dashboard_stats

partners_bp = Blueprint("partners", __name__)

@partners_bp.route("/discovery", methods=["GET"])
def discover_partners():
    category = request.args.get("category")
    location = request.args.get("location")
    search = request.args.get("search")

    # Sanitize undefined or empty query params
    if category in [None, "", "undefined", "null"]:
        category = None
    if location in [None, "", "undefined", "null"]:
        location = None
    if search in [None, "", "undefined", "null"]:
        search = None

    partners = get_verified_partners(category, location, search)
    return jsonify({
        "count": len(partners),
        "partners": partners
    }), 200

@partners_bp.route("/details/<int:partner_id>", methods=["GET"])
def get_partner_details(partner_id):
    db = SessionLocal()
    try:
        partner = db.query(PartnerProfile).filter_by(id=partner_id).first()
        if not partner:
            # Try by user_id
            partner = db.query(PartnerProfile).filter_by(user_id=partner_id).first()

        if not partner:
            return jsonify({"error": "Partner profile not found"}), 404

        return jsonify({"partner": partner.to_dict()}), 200
    finally:
        db.close()

@partners_bp.route("/dashboard", methods=["GET"])
@login_required(roles=["partner", "admin"])
def partner_dashboard():
    stats = get_partner_dashboard_stats(g.user_id)
    return jsonify({"stats": stats}), 200

@partners_bp.route("/available-listings", methods=["GET"])
@login_required(roles=["partner", "admin"])
def available_listings():
    stats = get_partner_dashboard_stats(g.user_id)
    return jsonify({"listings": stats.get("matching_listings", [])}), 200
