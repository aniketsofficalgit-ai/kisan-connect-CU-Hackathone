from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import (
    User, WorkerProfile, VerificationRequest, WorkerRequest,
    MachineryBooking, BuyerInquiry, CropListing, MachineryListing, Notification
)
from app.schemas import UserUpdate, UserOut, VerificationCreate, VerificationOut
from app.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users & Profiles"])

@router.put("/profile", response_model=UserOut)
def update_profile(
    updates: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/profile/{user_id}", response_model=UserOut)
def get_user_public_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return user

@router.post("/verification/submit", response_model=VerificationOut)
def submit_verification(
    data: VerificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if existing pending request
    existing = db.query(VerificationRequest).filter(
        VerificationRequest.user_id == current_user.id,
        VerificationRequest.status == "pending"
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending verification request under review."
        )

    verif = VerificationRequest(
        user_id=current_user.id,
        document_type=data.document_type,
        document_number=data.document_number,
        document_url=data.document_url,
        status="pending"
    )
    current_user.verification_status = "pending"

    # Notification
    notif = Notification(
        user_id=current_user.id,
        title="Verification Submitted",
        message="Your verification documents have been submitted for review by the Kisan Connect admin team.",
        notification_type="verification",
        reference_type="verification"
    )

    db.add(verif)
    db.add(notif)
    db.commit()
    db.refresh(verif)
    return verif

@router.get("/verification/status")
def get_verification_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    requests = db.query(VerificationRequest).filter(
        VerificationRequest.user_id == current_user.id
    ).order_by(VerificationRequest.created_at.desc()).all()

    return {
        "verification_status": current_user.verification_status,
        "verification_notes": current_user.verification_notes,
        "history": requests
    }

@router.get("/dashboard-stats")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Provides role-tailored dashboard metrics and quick counters."""
    role = current_user.role
    unread_notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()

    stats = {
        "role": role,
        "unread_notifications": unread_notifications,
        "verification_status": current_user.verification_status,
    }

    if role == "farmer":
        stats.update({
            "active_worker_requests": db.query(WorkerRequest).filter(
                WorkerRequest.farmer_id == current_user.id,
                WorkerRequest.status.in_(["pending", "accepted"])
            ).count(),
            "active_machinery_bookings": db.query(MachineryBooking).filter(
                MachineryBooking.farmer_id == current_user.id,
                MachineryBooking.status.in_(["pending", "approved"])
            ).count(),
            "my_crop_listings": db.query(CropListing).filter(
                CropListing.farmer_id == current_user.id,
                CropListing.status == "available"
            ).count(),
            "incoming_buyer_inquiries": db.query(BuyerInquiry).join(CropListing).filter(
                CropListing.farmer_id == current_user.id,
                BuyerInquiry.status == "pending"
            ).count(),
        })
    elif role == "worker":
        worker_prof = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
        stats.update({
            "pending_requests": db.query(WorkerRequest).filter(
                WorkerRequest.worker_id == current_user.id,
                WorkerRequest.status == "pending"
            ).count(),
            "upcoming_jobs": db.query(WorkerRequest).filter(
                WorkerRequest.worker_id == current_user.id,
                WorkerRequest.status == "accepted"
            ).count(),
            "completed_jobs": worker_prof.completed_jobs_count if worker_prof else 0,
            "is_available": worker_prof.is_available if worker_prof else True,
            "rating_average": worker_prof.rating_average if worker_prof else 0.0,
            "review_count": worker_prof.review_count if worker_prof else 0,
            "expected_wage": worker_prof.expected_wage if worker_prof else 500.0,
        })
    elif role == "machinery_owner":
        stats.update({
            "total_machinery": db.query(MachineryListing).filter(
                MachineryListing.owner_id == current_user.id
            ).count(),
            "pending_bookings": db.query(MachineryBooking).join(MachineryListing).filter(
                MachineryListing.owner_id == current_user.id,
                MachineryBooking.status == "pending"
            ).count(),
            "active_rentals": db.query(MachineryBooking).join(MachineryListing).filter(
                MachineryListing.owner_id == current_user.id,
                MachineryBooking.status == "approved"
            ).count(),
            "completed_rentals": db.query(MachineryBooking).join(MachineryListing).filter(
                MachineryListing.owner_id == current_user.id,
                MachineryBooking.status == "completed"
            ).count(),
        })
    elif role == "buyer":
        stats.update({
            "active_inquiries": db.query(BuyerInquiry).filter(
                BuyerInquiry.buyer_id == current_user.id,
                BuyerInquiry.status.in_(["pending", "counter_offered"])
            ).count(),
            "accepted_deals": db.query(BuyerInquiry).filter(
                BuyerInquiry.buyer_id == current_user.id,
                BuyerInquiry.status == "accepted"
            ).count(),
            "completed_purchases": db.query(BuyerInquiry).filter(
                BuyerInquiry.buyer_id == current_user.id,
                BuyerInquiry.status == "completed"
            ).count(),
        })
    elif role == "admin":
        stats.update({
            "total_users": db.query(User).count(),
            "pending_verifications": db.query(VerificationRequest).filter(VerificationRequest.status == "pending").count(),
            "total_machinery": db.query(MachineryListing).count(),
            "total_crops": db.query(CropListing).count(),
        })

    return stats
