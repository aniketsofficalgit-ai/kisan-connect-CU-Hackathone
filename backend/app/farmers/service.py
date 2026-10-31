from sqlalchemy import func
from app.database.connection import SessionLocal
from app.database.models import WasteListing, CollectionRequest, CollectionStatusHistory, User

def get_farmer_dashboard_stats(farmer_id: int) -> dict:
    db = SessionLocal()
    try:
        listings = db.query(WasteListing).filter_by(farmer_id=farmer_id).all()
        total_listings_count = len(listings)
        
        # Calculate total waste listed by unit
        waste_by_unit = {}
        for l in listings:
            unit = l.unit or "quintal"
            waste_by_unit[unit] = waste_by_unit.get(unit, 0.0) + (l.quantity or 0.0)

        requests = db.query(CollectionRequest).filter_by(farmer_id=farmer_id).all()
        
        active_requests_count = sum(1 for r in requests if r.status in ["Pending", "Accepted", "Scheduled", "Picked Up"])
        completed_requests = [r for r in requests if r.status == "Completed"]
        completed_count = len(completed_requests)

        total_earnings = sum(r.offered_price or 0.0 for r in completed_requests)
        pending_earnings = sum(r.offered_price or 0.0 for r in requests if r.status in ["Accepted", "Scheduled", "Picked Up"])

        # Calculate total waste collected (completed)
        collected_waste_summary = []
        collected_units = {}
        for r in completed_requests:
            if r.listing:
                u = r.listing.unit or "quintal"
                collected_units[u] = collected_units.get(u, 0.0) + (r.listing.quantity or 0.0)
        
        for u, q in collected_units.items():
            collected_waste_summary.append(f"{round(q, 1)} {u}")

        # Recent activities (sorted descending by updated_at)
        sorted_requests = sorted(requests, key=lambda x: x.updated_at or x.created_at, reverse=True)[:5]
        recent_activities = []
        for r in sorted_requests:
            recent_activities.append({
                "id": r.id,
                "request_number": r.request_number,
                "title": r.listing.title if r.listing else "Agricultural Waste",
                "partner_name": (r.partner.partner_profile.business_name if r.partner and r.partner.partner_profile else r.partner.full_name) if r.partner else "Partner",
                "status": r.status,
                "offered_price": r.offered_price,
                "updated_at": r.updated_at.isoformat() if r.updated_at else r.created_at.isoformat() if r.created_at else None
            })

        return {
            "total_listings_count": total_listings_count,
            "waste_by_unit": waste_by_unit,
            "waste_collected_summary": ", ".join(collected_waste_summary) if collected_waste_summary else "0 quintal",
            "active_requests_count": active_requests_count,
            "completed_collections_count": completed_count,
            "total_earnings": round(total_earnings, 2),
            "pending_earnings": round(pending_earnings, 2),
            "recent_activities": recent_activities,
            "listings": [l.to_dict() for l in listings[:6]]
        }
    finally:
        db.close()
