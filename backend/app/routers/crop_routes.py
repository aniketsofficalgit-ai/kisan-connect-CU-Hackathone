from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import User, CropListing
from app.schemas import CropCreate, CropUpdate, CropOut
from app.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/crops", tags=["Crop Marketplace"])

@router.get("", response_model=List[CropOut])
def search_crops(
    category: Optional[str] = Query(None, description="Filter by crop category"),
    district: Optional[str] = Query(None, description="Filter by district"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    min_quantity: Optional[float] = Query(None, description="Minimum available quantity"),
    status: Optional[str] = Query("available", description="Filter by status"),
    search: Optional[str] = Query(None, description="Search crop name, variety, description"),
    db: Session = Depends(get_db)
):
    query = db.query(CropListing).join(User, CropListing.farmer_id == User.id).filter(User.is_active == True)

    if status and status != "all":
        query = query.filter(CropListing.status == status)

    if category and category.strip() and category != "All":
        query = query.filter(CropListing.category.ilike(f"%{category.strip()}%"))

    if district and district.strip():
        query = query.filter(
            or_(
                CropListing.district.ilike(f"%{district.strip()}%"),
                CropListing.village.ilike(f"%{district.strip()}%"),
                User.district.ilike(f"%{district.strip()}%")
            )
        )

    if max_price is not None:
        query = query.filter(CropListing.asking_price <= max_price)

    if min_quantity is not None:
        query = query.filter(CropListing.available_quantity >= min_quantity)

    if search and search.strip():
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                CropListing.crop_name.ilike(s),
                CropListing.variety.ilike(s),
                CropListing.category.ilike(s),
                CropListing.description.ilike(s),
                CropListing.district.ilike(s)
            )
        )

    crops = query.order_by(CropListing.created_at.desc()).all()
    return crops

@router.get("/farmer/my-listings", response_model=List[CropOut])
def get_my_crop_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["farmer"]))
):
    return db.query(CropListing).filter(
        CropListing.farmer_id == current_user.id
    ).order_by(CropListing.created_at.desc()).all()

@router.get("/{crop_id}", response_model=CropOut)
def get_crop_details(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(CropListing).filter(CropListing.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found.")
    return crop

@router.post("", response_model=CropOut, status_code=status.HTTP_201_CREATED)
def create_crop_listing(
    data: CropCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["farmer"]))
):
    new_crop = CropListing(
        farmer_id=current_user.id,
        crop_name=data.crop_name.strip(),
        category=data.category,
        variety=data.variety,
        available_quantity=data.available_quantity,
        quantity_unit=data.quantity_unit,
        asking_price=data.asking_price,
        price_unit=data.price_unit,
        harvest_date=data.harvest_date,
        quality_grade=data.quality_grade,
        village=data.village or current_user.village,
        district=data.district or current_user.district,
        state=data.state or current_user.state,
        description=data.description,
        image_url=data.image_url,
        preferred_contact_method=data.preferred_contact_method,
        status=data.status
    )
    db.add(new_crop)
    db.commit()
    db.refresh(new_crop)
    return new_crop

@router.put("/{crop_id}", response_model=CropOut)
def update_crop_listing(
    crop_id: int,
    updates: CropUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crop = db.query(CropListing).filter(CropListing.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found.")

    if crop.farmer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied to edit this crop listing.")

    update_dict = updates.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(crop, field, val)

    db.commit()
    db.refresh(crop)
    return crop

@router.delete("/{crop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_crop_listing(
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crop = db.query(CropListing).filter(CropListing.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found.")

    if crop.farmer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied to delete this crop listing.")

    db.delete(crop)
    db.commit()
    return None
