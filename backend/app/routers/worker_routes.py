from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import User, WorkerProfile, Review
from app.schemas import WorkerProfileUpdate, WorkerProfileOut, WorkerDetailOut
from app.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/workers", tags=["Agricultural Workers"])

@router.get("", response_model=List[WorkerDetailOut])
def search_workers(
    skill: Optional[str] = Query(None, description="Search by skill e.g. Harvesting, Sowing, Spraying"),
    district: Optional[str] = Query(None, description="Filter by district"),
    max_wage: Optional[float] = Query(None, description="Maximum expected daily wage"),
    min_experience: Optional[int] = Query(None, description="Minimum years of experience"),
    is_available: Optional[bool] = Query(None, description="Filter by availability"),
    is_group: Optional[bool] = Query(None, description="Filter by individual vs group"),
    search: Optional[str] = Query(None, description="General search query"),
    db: Session = Depends(get_db)
):
    query = db.query(WorkerProfile).join(User, WorkerProfile.user_id == User.id).filter(User.is_active == True)

    if skill and skill.strip():
        query = query.filter(WorkerProfile.skills.ilike(f"%{skill.strip()}%"))

    if district and district.strip():
        d = district.strip()
        query = query.filter(
            or_(
                User.district.ilike(f"%{d}%"),
                WorkerProfile.preferred_work_area.ilike(f"%{d}%")
            )
        )

    if max_wage is not None:
        query = query.filter(WorkerProfile.expected_wage <= max_wage)

    if min_experience is not None:
        query = query.filter(WorkerProfile.experience_years >= min_experience)

    if is_available is not None:
        query = query.filter(WorkerProfile.is_available == is_available)

    if is_group is not None:
        query = query.filter(WorkerProfile.is_group == is_group)

    if search and search.strip():
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.full_name.ilike(s),
                WorkerProfile.skills.ilike(s),
                User.district.ilike(s),
                WorkerProfile.preferred_work_area.ilike(s)
            )
        )

    # Order by rating and availability
    workers = query.order_by(WorkerProfile.is_available.desc(), WorkerProfile.rating_average.desc()).all()
    return workers

@router.get("/my-profile", response_model=WorkerDetailOut)
def get_my_worker_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["worker"]))
):
    profile = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    if not profile:
        profile = WorkerProfile(
            user_id=current_user.id,
            skills="General Agricultural Labor",
            expected_wage=500.0,
            wage_unit="per_day",
            is_available=True
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/my-profile", response_model=WorkerDetailOut)
def update_my_worker_profile(
    updates: WorkerProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["worker"]))
):
    profile = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    if not profile:
        profile = WorkerProfile(
            user_id=current_user.id,
            skills="General Labor",
            expected_wage=500.0,
            is_available=True
        )
        db.add(profile)

    update_dict = updates.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile

@router.get("/{worker_id}", response_model=WorkerDetailOut)
def get_worker_detail(worker_id: int, db: Session = Depends(get_db)):
    # worker_id can be WorkerProfile id or User id
    profile = db.query(WorkerProfile).filter(
        or_(
            WorkerProfile.id == worker_id,
            WorkerProfile.user_id == worker_id
        )
    ).first()

    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agricultural worker profile not found.")
    return profile
