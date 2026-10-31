from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import User, MachineryListing
from app.schemas import MachineryCreate, MachineryUpdate, MachineryOut
from app.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/machinery", tags=["Agricultural Machinery"])

@router.get("", response_model=List[MachineryOut])
def search_machinery(
    category: Optional[str] = Query(None, description="Filter by machinery category"),
    district: Optional[str] = Query(None, description="Filter by district"),
    max_price: Optional[float] = Query(None, description="Maximum rental rate"),
    pricing_unit: Optional[str] = Query(None, description="per_hour, per_day"),
    is_available: Optional[bool] = Query(None, description="Filter by availability status"),
    search: Optional[str] = Query(None, description="General search query"),
    db: Session = Depends(get_db)
):
    query = db.query(MachineryListing).join(User, MachineryListing.owner_id == User.id).filter(User.is_active == True)

    if category and category.strip() and category != "All":
        query = query.filter(MachineryListing.category.ilike(f"%{category.strip()}%"))

    if district and district.strip():
        query = query.filter(
            or_(
                MachineryListing.location_district.ilike(f"%{district.strip()}%"),
                MachineryListing.location_village.ilike(f"%{district.strip()}%"),
                User.district.ilike(f"%{district.strip()}%")
            )
        )

    if max_price is not None:
        query = query.filter(MachineryListing.rental_price <= max_price)

    if pricing_unit and pricing_unit.strip():
        query = query.filter(MachineryListing.pricing_unit == pricing_unit.strip())

    if is_available is not None:
        query = query.filter(MachineryListing.is_available == is_available)

    if search and search.strip():
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                MachineryListing.title.ilike(s),
                MachineryListing.category.ilike(s),
                MachineryListing.make_model.ilike(s),
                MachineryListing.description.ilike(s),
                MachineryListing.location_district.ilike(s)
            )
        )

    listings = query.order_by(MachineryListing.is_available.desc(), MachineryListing.created_at.desc()).all()
    return listings

@router.get("/owner/my-listings", response_model=List[MachineryOut])
def get_my_machinery_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["machinery_owner"]))
):
    return db.query(MachineryListing).filter(
        MachineryListing.owner_id == current_user.id
    ).order_by(MachineryListing.created_at.desc()).all()

@router.get("/{machinery_id}", response_model=MachineryOut)
def get_machinery_details(machinery_id: int, db: Session = Depends(get_db)):
    listing = db.query(MachineryListing).filter(MachineryListing.id == machinery_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Machinery listing not found.")
    return listing

@router.post("", response_model=MachineryOut, status_code=status.HTTP_201_CREATED)
def create_machinery_listing(
    data: MachineryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["machinery_owner"]))
):
    new_listing = MachineryListing(
        owner_id=current_user.id,
        title=data.title.strip(),
        category=data.category,
        make_model=data.make_model,
        horse_power=data.horse_power,
        rental_price=data.rental_price,
        pricing_unit=data.pricing_unit,
        location_village=data.location_village or current_user.village,
        location_district=data.location_district or current_user.district,
        location_state=data.location_state or current_user.state,
        description=data.description,
        specifications=data.specifications,
        image_url=data.image_url,
        is_available=data.is_available,
        includes_operator=data.includes_operator,
        includes_fuel=data.includes_fuel,
        maintenance_status=data.maintenance_status
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing

@router.put("/{machinery_id}", response_model=MachineryOut)
def update_machinery_listing(
    machinery_id: int,
    updates: MachineryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(MachineryListing).filter(MachineryListing.id == machinery_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    if listing.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied to edit this listing.")

    update_dict = updates.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(listing, field, val)

    db.commit()
    db.refresh(listing)
    return listing

@router.delete("/{machinery_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_machinery_listing(
    machinery_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(MachineryListing).filter(MachineryListing.id == machinery_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    if listing.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied to delete this listing.")

    db.delete(listing)
    db.commit()
    return None
