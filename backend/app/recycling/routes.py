from flask import Blueprint, jsonify, request
from app.database.connection import SessionLocal
from app.database.models import EducationalResource

recycling_bp = Blueprint("recycling", __name__)

@recycling_bp.route("/guides", methods=["GET"])
def get_recycling_guides():
    category = request.args.get("category")
    db = SessionLocal()
    try:
        query = db.query(EducationalResource)
        if category:
            query = query.filter(EducationalResource.waste_category.ilike(f"%{category}%"))
        guides = query.all()
        return jsonify({"guides": [g.to_dict() for g in guides]}), 200
    finally:
        db.close()

@recycling_bp.route("/guides/<int:guide_id>", methods=["GET"])
def get_guide_detail(guide_id):
    db = SessionLocal()
    try:
        guide = db.query(EducationalResource).filter_by(id=guide_id).first()
        if not guide:
            return jsonify({"error": "Educational guide not found"}), 404
        return jsonify({"guide": guide.to_dict()}), 200
    finally:
        db.close()
