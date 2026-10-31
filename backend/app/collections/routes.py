from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, g
from app.auth.service import login_required
from app.database.connection import SessionLocal
from app.database.models import CollectionRequest, WasteListing, User, PartnerProfile
from app.collections.service import generate_request_number, add_status_history, notify_user

collections_bp = Blueprint("collections", __name__)

@collections_bp.route("/request", methods=["POST"])
@login_required(roles=["farmer", "admin"])
def create_collection_request():
    data = request.get_json() or {}
    listing_id = data.get("listing_id")
    partner_id = data.get("partner_id") # partner's user_id or partner_profile.id
    farmer_notes = data.get("farmer_notes", "")
    requested_pickup_date = data.get("requested_pickup_date", "")

    if not listing_id or not partner_id:
        return jsonify({"error": "Listing ID and Partner ID are required"}), 400

    db = SessionLocal()
    try:
        listing = db.query(WasteListing).filter_by(id=listing_id).first()
        if not listing:
            return jsonify({"error": "Listing not found"}), 404

        # Validate partner
        partner_user = db.query(User).filter_by(id=partner_id, role="partner").first()
        if not partner_user:
            # Check if partner_id was passed as partner_profile.id
            pp = db.query(PartnerProfile).filter_by(id=partner_id).first()
            if pp and pp.user:
                partner_user = pp.user

        if not partner_user:
            return jsonify({"error": "Specified partner not found"}), 404

        req_num = generate_request_number()
        # Calculate estimated price
        est_price = 0.0
        if listing.expected_price:
            est_price = float(listing.expected_price) * float(listing.quantity or 1)

        req = CollectionRequest(
            request_number=req_num,
            listing_id=listing.id,
            farmer_id=g.user_id,
            partner_id=partner_user.id,
            status="Pending",
            farmer_notes=farmer_notes,
            requested_pickup_date=requested_pickup_date,
            offered_price=est_price,
            payment_status="pending"
        )
        db.add(req)
        db.flush()

        # Update listing status to pending
        listing.status = "pending"

        # Add history
        add_status_history(
            db, req.id, "Pending",
            f"Collection request initiated by farmer for {listing.quantity} {listing.unit} of {listing.title}.",
            g.user_id
        )

        # Notify Partner
        notify_user(
            db, partner_user.id,
            "New Collection Request",
            f"Farmer requested collection of {listing.quantity} {listing.unit} of {listing.title}.",
            "collection_request",
            "/partner-dashboard"
        )

        db.commit()
        return jsonify({
            "message": "Collection request sent successfully",
            "request": req.to_dict()
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to send request: {str(e)}"}), 500
    finally:
        db.close()


@collections_bp.route("/requests", methods=["GET"])
@login_required()
def get_user_requests():
    db = SessionLocal()
    try:
        if g.role == "farmer":
            requests = db.query(CollectionRequest).filter_by(farmer_id=g.user_id).order_by(CollectionRequest.updated_at.desc()).all()
        elif g.role == "partner":
            requests = db.query(CollectionRequest).filter_by(partner_id=g.user_id).order_by(CollectionRequest.updated_at.desc()).all()
        else: # admin
            requests = db.query(CollectionRequest).order_by(CollectionRequest.updated_at.desc()).all()

        return jsonify({"requests": [r.to_dict() for r in requests]}), 200
    finally:
        db.close()


@collections_bp.route("/requests/<int:request_id>", methods=["GET"])
@login_required()
def get_request_details(request_id):
    db = SessionLocal()
    try:
        req = db.query(CollectionRequest).filter_by(id=request_id).first()
        if not req:
            return jsonify({"error": "Collection request not found"}), 404

        # Access control
        if g.role != "admin" and req.farmer_id != g.user_id and req.partner_id != g.user_id:
            return jsonify({"error": "Unauthorized to view this request"}), 403

        return jsonify({"request": req.to_dict()}), 200
    finally:
        db.close()


@collections_bp.route("/requests/<int:request_id>/status", methods=["PUT"])
@login_required()
def update_request_status(request_id):
    data = request.get_json() or {}
    new_status = data.get("status")
    comment = data.get("comment", "")
    scheduled_date = data.get("scheduled_pickup_date")
    offered_price = data.get("offered_price")

    valid_statuses = ["Pending", "Accepted", "Scheduled", "Picked Up", "Completed", "Rejected", "Cancelled"]
    if new_status not in valid_statuses:
        return jsonify({"error": f"Invalid status. Must be one of {valid_statuses}"}), 400

    db = SessionLocal()
    try:
        req = db.query(CollectionRequest).filter_by(id=request_id).first()
        if not req:
            return jsonify({"error": "Collection request not found"}), 404

        # Role checks
        if g.role == "partner" and req.partner_id != g.user_id:
            return jsonify({"error": "Unauthorized"}), 403
        if g.role == "farmer" and req.farmer_id != g.user_id:
            return jsonify({"error": "Unauthorized"}), 403

        # Update fields
        req.status = new_status
        req.updated_at = datetime.now(timezone.utc)

        if offered_price is not None:
            try:
                req.offered_price = float(offered_price)
            except ValueError:
                pass

        if scheduled_date:
            req.scheduled_pickup_date = scheduled_date

        if new_status == "Picked Up":
            req.actual_pickup_date = datetime.now().strftime("%Y-%m-%d %I:%M %p")

        if new_status == "Completed":
            req.payment_status = "paid"
            if req.listing:
                req.listing.status = "collected"

        if new_status in ["Rejected", "Cancelled"]:
            if req.listing:
                req.listing.status = "available"

        # Log history
        hist_comment = comment or f"Status updated to {new_status}"
        add_status_history(db, req.id, new_status, hist_comment, g.user_id)

        # Notify the other party
        target_user_id = req.farmer_id if g.user_id == req.partner_id else req.partner_id
        notify_user(
            db, target_user_id,
            f"Collection Update: {new_status}",
            f"Request {req.request_number} is now '{new_status}'. {hist_comment}",
            "status_update",
            "/tracking"
        )

        db.commit()
        return jsonify({
            "message": f"Status updated to {new_status}",
            "request": req.to_dict()
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to update status: {str(e)}"}), 500
    finally:
        db.close()
