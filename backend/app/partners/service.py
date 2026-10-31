import json
from sqlalchemy import or_
from app.database.connection import SessionLocal
from app.database.models import User, PartnerProfile, WasteListing, CollectionRequest, WasteCategory

def get_verified_partners(category=None, location=None, search=None):
    db = SessionLocal()
    try:
        query = db.query(PartnerProfile).join(User).filter(
            User.is_active == True,
            PartnerProfile.verification_status == "approved"
        )

        if location:
            loc_term = f"%{location}%"
            query = query.filter(
                or_(
                    PartnerProfile.service_area.ilike(loc_term),
                    PartnerProfile.address.ilike(loc_term)
                )
            )

        if search:
            s_term = f"%{search}%"
            query = query.filter(
                or_(
                    PartnerProfile.business_name.ilike(s_term),
                    PartnerProfile.description.ilike(s_term),
                    PartnerProfile.service_area.ilike(s_term)
                )
            )

        partners = query.all()
        results = []
        for p in partners:
            p_dict = p.to_dict()
            # If category specified, verify partner accepts this category
            if category:
                accepted = p_dict.get("accepted_categories", [])
                if category not in accepted:
                    continue
            results.append(p_dict)

        return results
    finally:
        db.close()


def get_partner_dashboard_stats(partner_user_id: int):
    db = SessionLocal()
    try:
        partner_profile = db.query(PartnerProfile).filter_by(user_id=partner_user_id).first()
        requests = db.query(CollectionRequest).filter_by(partner_id=partner_user_id).all()

        pending_requests = [r for r in requests if r.status == "Pending"]
        accepted_requests = [r for r in requests if r.status == "Accepted"]
        scheduled_requests = [r for r in requests if r.status == "Scheduled"]
        completed_requests = [r for r in requests if r.status == "Completed"]

        # Calculate total waste collected by unit
        waste_collected_by_unit = {}
        for r in completed_requests:
            if r.listing:
                unit = r.listing.unit or "quintal"
                waste_collected_by_unit[unit] = waste_collected_by_unit.get(unit, 0.0) + (r.listing.quantity or 0.0)

        total_spent = sum(r.offered_price or 0.0 for r in completed_requests)

        # Find open listings matching partner's accepted categories
        accepted_categories = []
        if partner_profile:
            accepted_categories = partner_profile.to_dict().get("accepted_categories", [])

        matching_listings_query = db.query(WasteListing).filter(WasteListing.status == "available")
        if accepted_categories:
            matching_listings_query = matching_listings_query.join(WasteCategory).filter(
                WasteCategory.slug.in_(accepted_categories)
            )
        matching_listings = matching_listings_query.order_by(WasteListing.created_at.desc()).limit(15).all()

        return {
            "partner_profile": partner_profile.to_dict() if partner_profile else None,
            "pending_requests_count": len(pending_requests),
            "accepted_requests_count": len(accepted_requests),
            "scheduled_pickups_count": len(scheduled_requests),
            "completed_collections_count": len(completed_requests),
            "waste_collected_by_unit": waste_collected_by_unit,
            "total_spent": round(total_spent, 2),
            "requests": [r.to_dict() for r in sorted(requests, key=lambda x: x.updated_at or x.created_at, reverse=True)],
            "matching_listings": [l.to_dict() for l in matching_listings]
        }
    finally:
        db.close()
