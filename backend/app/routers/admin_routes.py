import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import (
    User, MachineryListing, CropListing, WorkerProfile,
    VerificationRequest, Report, Review, AuditLog,
    WorkerRequest, MachineryBooking, BuyerInquiry
)
from app.schemas import (
    UserOut, VerificationOut, VerificationReview, ReportOut,
    MachineryOut, CropOut
)
from app.auth import require_roles

router = APIRouter(prefix="/api/admin", tags=["Administrator Dashboard"])

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles(["admin"]))
):
    return {
        "total_users": db.query(User).count(),
        "farmers_count": db.query(User).filter(User.role == "farmer").count(),
        "workers_count": db.query(User).filter(User.role == "worker").count(),
        "machinery_owners_count": db.query(User).filter(User.role == "machinery_owner").count(),
        "buyers_count": db.query(User).filter(User.role == "buyer").count(),
        "machinery_listings_count": db.query(MachineryListing).count(),
        "crop_listings_count": db.query(CropListing).count(),
        "worker_requests_count": db.query(WorkerRequest).count(),
        "machinery_bookings_count": db.query(MachineryBooking).count(),
        "buyer_inquiries_count": db.query(BuyerInquiry).count(),
        "pending_verifications": db.query(VerificationRequest).filter(VerificationRequest.status == "pending").count(),
        "pending_reports": db.query(Report).filter(Report.status == "pending").count()
    }

@router.get("/users", response_model=List[UserOut])
def list_all_users(
    role: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles(["admin"]))
):
    query = db.query(User)
    if role and role != "all":
        query = query.filter(User.role == role)
    if search and search.strip():
        s = f"%{search.strip()}%"
        query = query.filter(
            (User.full_name.ilike(s)) | (User.mobile_number.ilike(s)) | (User.district.ilike(s))
        )
    return query.order_by(User.created_at.desc()).all()

@router.patch("/users/{user_id}/status")
def toggle_user_active_status(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles(["admin"]))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User status set to {'active' if user.is_active else 'suspended'}", "is_active": user.is_active}

@router.get("/verifications", response_model=List[VerificationOut])
def list_verifications(
    status_filter: Optional[str] = "pending",
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles(["admin"]))
):
    query = db.query(VerificationRequest)
    if status_filter and status_filter != "all":
        query = query.filter(VerificationRequest.status == status_filter)
    return query.order_by(VerificationRequest.created_at.desc()).all()

@router.post("/verifications/{req_id}/review", response_model=VerificationOut)
def review_verification(
    req_id: int,
    data: VerificationReview,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles(["admin"]))
):
    req = db.query(VerificationRequest).filter(VerificationRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Verification request not found.")

    req.status = data.status
    req.reviewer_notes = data.reviewer_notes
    req.reviewed_at = datetime.datetime.utcnow()

    # Update user verification status
    user = req.user
    if data.status == "approved":
        user.verification_status = "verified"
        user.verification_notes = f"Approved on {datetime.datetime.utcnow().strftime('%Y-%m-%d')}: {data.reviewer_notes or 'Official docs verified.'}"
    elif data.status == "rejected":
        user.verification_status = "not_verified"
        user.verification_notes = f"Rejected: {data.reviewer_notes or 'Incomplete or unclear documentation.'}"

    # Log action
    log = AuditLog(
        user_id=admin_user.id,
        action=f"verification_{data.status}",
        entity_type="verification_request",
        entity_id=req.id,
        details=f"Admin {admin_user.full_name} reviewed user {user.full_name}"
    )
    db.add(log)
    db.commit()
    db.refresh(req)
    return req

@router.get("/reports", response_model=List[ReportOut])
def list_reports(
    status_filter: Optional[str] = "pending",
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles(["admin"]))
):
    query = db.query(Report)
    if status_filter and status_filter != "all":
        query = query.filter(Report.status == status_filter)
    return query.order_by(Report.created_at.desc()).all()

@router.patch("/reports/{report_id}/resolve")
def resolve_report(
    report_id: int,
    action: str = Query(..., description="resolved or dismissed"),
    admin_notes: Optional[str] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles(["admin"]))
):
    rep = db.query(Report).filter(Report.id == report_id).first()
    if not rep:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found.")

    rep.status = action
    rep.admin_notes = admin_notes
    db.commit()
    return {"message": f"Report marked as {action}"}
