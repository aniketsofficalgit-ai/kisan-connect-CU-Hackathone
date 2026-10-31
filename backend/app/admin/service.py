from app.database.connection import SessionLocal
from app.database.models import User, PartnerProfile, WasteListing, CollectionRequest

def get_admin_dashboard_metrics():
    db = SessionLocal()
    try:
        total_farmers = db.query(User).filter_by(role="farmer").count()
        total_partners = db.query(User).filter_by(role="partner").count()
        active_listings = db.query(WasteListing).filter_by(status="available").count()
        
        all_requests = db.query(CollectionRequest).all()
        completed_collections = [r for r in all_requests if r.status == "Completed"]
        completed_count = len(completed_collections)

        pending_partners = db.query(PartnerProfile).filter_by(verification_status="pending").count()

        # Calculate total waste collected in equivalent tonnes
        total_tonnes = 0.0
        for r in completed_collections:
            if r.listing:
                qty = r.listing.quantity or 0.0
                unit = (r.listing.unit or "").lower()
                if "tonne" in unit:
                    total_tonnes += qty
                elif "quintal" in unit:
                    total_tonnes += (qty * 0.1) # 1 quintal = 0.1 tonne
                elif "kg" in unit:
                    total_tonnes += (qty * 0.001)

        # Environmental impact calculations
        # Approx 1 tonne crop residue burning produces ~1.5 tonnes CO2
        co2_saved_tonnes = round(total_tonnes * 1.5, 2)
        # Approx 2 tonnes of stubble per acre
        acres_saved = round(total_tonnes / 2.0, 1) if total_tonnes > 0 else 0.0
        # Farmer earnings total
        total_farmer_payout = sum(r.offered_price or 0.0 for r in completed_collections)

        return {
            "total_farmers": total_farmers,
            "total_partners": total_partners,
            "active_listings": active_listings,
            "completed_collections": completed_count,
            "total_waste_collected_tonnes": round(total_tonnes, 2),
            "pending_partners_count": pending_partners,
            "co2_saved_tonnes": co2_saved_tonnes,
            "stubble_acres_saved": acres_saved,
            "total_farmer_payout": round(total_farmer_payout, 2)
        }
    finally:
        db.close()
