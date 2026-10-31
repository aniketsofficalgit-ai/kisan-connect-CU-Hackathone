from sqlalchemy import or_
from app.database.connection import SessionLocal
from app.database.models import WasteListing, WasteCategory

def list_categories():
    db = SessionLocal()
    try:
        categories = db.query(WasteCategory).all()
        return [c.to_dict() for c in categories]
    finally:
        db.close()

def filter_waste_listings(category_slug=None, search=None, status="available", limit=50):
    db = SessionLocal()
    try:
        query = db.query(WasteListing)
        if status:
            query = query.filter(WasteListing.status == status)
        
        if category_slug:
            query = query.join(WasteCategory).filter(WasteCategory.slug == category_slug)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    WasteListing.title.ilike(search_term),
                    WasteListing.description.ilike(search_term),
                    WasteListing.village_district.ilike(search_term),
                    WasteListing.location_address.ilike(search_term)
                )
            )

        listings = query.order_by(WasteListing.created_at.desc()).limit(limit).all()
        return [l.to_dict() for l in listings]
    finally:
        db.close()
