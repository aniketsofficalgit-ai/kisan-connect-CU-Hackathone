import os
import uuid
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, g
from config import config
from app.auth.service import login_required
from app.database.connection import SessionLocal
from app.database.models import WasteListing, WasteCategory, User, Notification
from app.waste_management.service import list_categories, filter_waste_listings

waste_bp = Blueprint("waste", __name__)

@waste_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = list_categories()
    return jsonify({"categories": categories}), 200

@waste_bp.route("/listings", methods=["GET"])
def get_listings():
    category_slug = request.args.get("category")
    search = request.args.get("search")
    status = request.args.get("status", "available")
    limit = int(request.args.get("limit", 50))

    # Sanitize undefined or empty query params
    if category_slug in [None, "", "undefined", "null"]:
        category_slug = None
    if search in [None, "", "undefined", "null"]:
        search = None
    if status in [None, "", "undefined", "null"]:
        status = "available"

    listings = filter_waste_listings(category_slug, search, status, limit)
    return jsonify({"listings": listings}), 200

@waste_bp.route("/listings/<int:listing_id>", methods=["GET"])
def get_listing_detail(listing_id):
    db = SessionLocal()
    try:
        listing = db.query(WasteListing).filter_by(id=listing_id).first()
        if not listing:
            return jsonify({"error": "Waste listing not found"}), 404
        return jsonify({"listing": listing.to_dict()}), 200
    finally:
        db.close()

@waste_bp.route("/upload-image", methods=["POST"])
@login_required()
def upload_waste_image():
    if "image" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in config.ALLOWED_EXTENSIONS:
        return jsonify({"error": f"Invalid file type. Allowed: {', '.join(config.ALLOWED_EXTENSIONS)}"}), 400

    os.makedirs(config.UPLOAD_FOLDER, exist_ok=True)
    filename = f"{uuid.uuid4().hex[:12]}_{secure_filename(file.filename)}"
    save_path = os.path.join(config.UPLOAD_FOLDER, filename)
    file.save(save_path)

    # Relative URL that will be served via /uploads/<filename>
    image_url = f"/uploads/{filename}"
    return jsonify({"image_url": image_url, "message": "Image uploaded successfully"}), 200

@waste_bp.route("/listings", methods=["POST"])
@login_required(roles=["farmer", "admin"])
def create_listing():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    category_id = data.get("category_id")
    category_slug = data.get("category_slug")
    quantity = data.get("quantity")
    unit = data.get("unit", "quintal")
    description = data.get("description", "")
    image_url = data.get("image_url", "")
    location_address = data.get("location_address", "")
    village_district = data.get("village_district", "")
    expected_price = data.get("expected_price")
    pickup_available = bool(data.get("pickup_available", True))

    if not title or not quantity:
        return jsonify({"error": "Title and quantity are required"}), 400

    try:
        quantity = float(quantity)
    except ValueError:
        return jsonify({"error": "Quantity must be a valid number"}), 400

    db = SessionLocal()
    try:
        # Resolve category
        category = None
        if category_id:
            category = db.query(WasteCategory).filter_by(id=category_id).first()
        elif category_slug:
            category = db.query(WasteCategory).filter_by(slug=category_slug).first()

        if not category:
            # Fallback to first category
            category = db.query(WasteCategory).first()

        listing = WasteListing(
            farmer_id=g.user_id,
            category_id=category.id,
            title=title,
            quantity=quantity,
            unit=unit,
            description=description,
            image_url=image_url or "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
            location_address=location_address,
            village_district=village_district,
            pickup_available=pickup_available,
            expected_price=float(expected_price) if expected_price not in (None, "") else None,
            status="available"
        )
        db.add(listing)
        db.flush()

        # Notify relevant partners
        partners = db.query(User).filter_by(role="partner").all()
        for p in partners:
            if p.partner_profile:
                db.add(Notification(
                    user_id=p.id,
                    title="New Waste Listing Available",
                    message=f"A farmer posted {quantity} {unit} of {title} in {village_district or 'your region'}.",
                    type="alert",
                    link="/partner-dashboard"
                ))

        db.commit()
        return jsonify({
            "message": "Waste listing created successfully",
            "listing": listing.to_dict()
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to create listing: {str(e)}"}), 500
    finally:
        db.close()

@waste_bp.route("/listings/<int:listing_id>", methods=["PUT"])
@login_required()
def update_listing(listing_id):
    data = request.get_json() or {}
    db = SessionLocal()
    try:
        listing = db.query(WasteListing).filter_by(id=listing_id).first()
        if not listing:
            return jsonify({"error": "Listing not found"}), 404

        # Verify ownership or admin
        if listing.farmer_id != g.user_id and g.role != "admin":
            return jsonify({"error": "Unauthorized to update this listing"}), 403

        if "title" in data: listing.title = data["title"].strip()
        if "quantity" in data: listing.quantity = float(data["quantity"])
        if "unit" in data: listing.unit = data["unit"]
        if "description" in data: listing.description = data["description"]
        if "image_url" in data: listing.image_url = data["image_url"]
        if "location_address" in data: listing.location_address = data["location_address"]
        if "village_district" in data: listing.village_district = data["village_district"]
        if "expected_price" in data:
            listing.expected_price = float(data["expected_price"]) if data["expected_price"] not in (None, "") else None
        if "pickup_available" in data: listing.pickup_available = bool(data["pickup_available"])
        if "status" in data: listing.status = data["status"]
        if "category_id" in data: listing.category_id = int(data["category_id"])

        db.commit()
        return jsonify({
            "message": "Listing updated successfully",
            "listing": listing.to_dict()
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to update listing: {str(e)}"}), 500
    finally:
        db.close()

@waste_bp.route("/listings/<int:listing_id>", methods=["DELETE"])
@login_required()
def delete_listing(listing_id):
    db = SessionLocal()
    try:
        listing = db.query(WasteListing).filter_by(id=listing_id).first()
        if not listing:
            return jsonify({"error": "Listing not found"}), 404

        if listing.farmer_id != g.user_id and g.role != "admin":
            return jsonify({"error": "Unauthorized to delete this listing"}), 403

        db.delete(listing)
        db.commit()
        return jsonify({"message": "Listing deleted successfully"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to delete listing: {str(e)}"}), 500
    finally:
        db.close()
