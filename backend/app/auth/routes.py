import json
from flask import Blueprint, request, jsonify, g
from app.database.connection import SessionLocal
from app.database.models import User, FarmerProfile, PartnerProfile, Notification
from app.auth.service import (
    hash_password, verify_password, create_access_token, login_required
)

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip().lower()
    phone = data.get("phone", "").strip()
    password = data.get("password", "")
    role = data.get("role", "farmer").strip().lower()

    if not full_name or not email or not password:
        return jsonify({"error": "Full name, email, and password are required"}), 400

    if role not in ["farmer", "partner", "admin"]:
        return jsonify({"error": "Invalid role. Must be 'farmer', 'partner', or 'admin'"}), 400

    db = SessionLocal()
    try:
        if db.query(User).filter_by(email=email).first():
            return jsonify({"error": "An account with this email already exists"}), 400

        user = User(
            full_name=full_name,
            email=email,
            phone=phone,
            password_hash=hash_password(password),
            role=role,
            is_active=True
        )
        db.add(user)
        db.flush() # get user.id

        if role == "farmer":
            farmer_profile = FarmerProfile(
                user_id=user.id,
                farm_name=data.get("farm_name", f"{full_name}'s Farm"),
                farm_size_acres=float(data.get("farm_size_acres", 5.0) or 5.0),
                address=data.get("address", ""),
                village=data.get("village", ""),
                district=data.get("district", ""),
                state=data.get("state", "Punjab"),
                pincode=data.get("pincode", ""),
                primary_crops=data.get("primary_crops", "Rice, Wheat")
            )
            db.add(farmer_profile)
        elif role == "partner":
            accepted_cats = data.get("accepted_categories", ["crop_residue", "straw_husk"])
            if isinstance(accepted_cats, list):
                accepted_cats = json.dumps(accepted_cats)

            partner_profile = PartnerProfile(
                user_id=user.id,
                business_name=data.get("business_name", f"{full_name} Recycling"),
                business_type=data.get("business_type", "waste_collector"),
                description=data.get("description", "Agricultural waste recycling & collection service"),
                registration_number=data.get("registration_number", ""),
                contact_person=full_name,
                contact_phone=phone,
                contact_email=email,
                service_area=data.get("service_area", "Local District"),
                accepted_categories=accepted_cats,
                minimum_quantity=float(data.get("minimum_quantity", 50.0) or 50.0),
                pricing_details=data.get("pricing_details", "Fair market rate based on moisture & purity"),
                is_verified=False, # Admin approval required for partners
                verification_status="pending",
                operating_hours=data.get("operating_hours", "Mon-Sat: 8:00 AM - 6:00 PM"),
                address=data.get("address", "")
            )
            db.add(partner_profile)

            # Create notification for admin
            admins = db.query(User).filter_by(role="admin").all()
            for admin in admins:
                notif = Notification(
                    user_id=admin.id,
                    title="New Partner Registration",
                    message=f"{partner_profile.business_name} registered and is awaiting verification.",
                    type="partner_approval",
                    link="/admin-dashboard"
                )
                db.add(notif)

        db.commit()

        token = create_access_token(user.id, user.role, user.email)
        return jsonify({
            "message": "Registration successful",
            "access_token": token,
            "token_type": "bearer",
            "user": user.to_dict()
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to register: {str(e)}"}), 500
    finally:
        db.close()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = SessionLocal()
    try:
        user = db.query(User).filter_by(email=email).first()
        if not user or not verify_password(password, user.password_hash):
            return jsonify({"error": "Invalid email or password"}), 401

        if not user.is_active:
            return jsonify({"error": "Your account has been deactivated. Please contact support."}), 403

        token = create_access_token(user.id, user.role, user.email)
        return jsonify({
            "message": "Login successful",
            "access_token": token,
            "token_type": "bearer",
            "user": user.to_dict()
        }), 200

    finally:
        db.close()


@auth_bp.route("/me", methods=["GET"])
@login_required()
def get_current_user_profile():
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(id=g.user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"user": user.to_dict()}), 200
    finally:
        db.close()


@auth_bp.route("/profile", methods=["PUT"])
@login_required()
def update_profile():
    data = request.get_json() or {}
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(id=g.user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        if "full_name" in data and data["full_name"].strip():
            user.full_name = data["full_name"].strip()
        if "phone" in data:
            user.phone = data["phone"].strip()
        if "avatar_url" in data:
            user.avatar_url = data["avatar_url"].strip()

        # Update Farmer Profile if role is farmer
        if user.role == "farmer" and user.farmer_profile:
            fp = user.farmer_profile
            if "farm_name" in data: fp.farm_name = data["farm_name"]
            if "farm_size_acres" in data: fp.farm_size_acres = float(data["farm_size_acres"])
            if "address" in data: fp.address = data["address"]
            if "village" in data: fp.village = data["village"]
            if "district" in data: fp.district = data["district"]
            if "state" in data: fp.state = data["state"]
            if "pincode" in data: fp.pincode = data["pincode"]
            if "primary_crops" in data:
                crops = data["primary_crops"]
                fp.primary_crops = ", ".join(crops) if isinstance(crops, list) else crops

        # Update Partner Profile if role is partner
        if user.role == "partner" and user.partner_profile:
            pp = user.partner_profile
            if "business_name" in data: pp.business_name = data["business_name"]
            if "business_type" in data: pp.business_type = data["business_type"]
            if "description" in data: pp.description = data["description"]
            if "service_area" in data: pp.service_area = data["service_area"]
            if "minimum_quantity" in data: pp.minimum_quantity = float(data["minimum_quantity"])
            if "pricing_details" in data: pp.pricing_details = data["pricing_details"]
            if "operating_hours" in data: pp.operating_hours = data["operating_hours"]
            if "address" in data: pp.address = data["address"]
            if "accepted_categories" in data:
                cats = data["accepted_categories"]
                pp.accepted_categories = json.dumps(cats) if isinstance(cats, list) else cats

        db.commit()
        return jsonify({
            "message": "Profile updated successfully",
            "user": user.to_dict()
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to update profile: {str(e)}"}), 500
    finally:
        db.close()


@auth_bp.route("/change-password", methods=["POST"])
@login_required()
def change_password():
    data = request.get_json() or {}
    old_password = data.get("old_password", "")
    new_password = data.get("new_password", "")

    if not old_password or not new_password:
        return jsonify({"error": "Old and new password are required"}), 400

    if len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    db = SessionLocal()
    try:
        user = db.query(User).filter_by(id=g.user_id).first()
        if not user or not verify_password(old_password, user.password_hash):
            return jsonify({"error": "Current password is incorrect"}), 400

        user.password_hash = hash_password(new_password)
        db.commit()
        return jsonify({"message": "Password changed successfully"}), 200
    finally:
        db.close()
