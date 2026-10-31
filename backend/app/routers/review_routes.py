from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, Review, Report, WorkerProfile
from app.schemas import ReviewCreate, ReviewOut, ReportCreate, ReportOut
from app.auth import get_current_user

router = APIRouter(tags=["Reviews & Reports"])

@router.post("/api/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def submit_review(
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id == data.reviewee_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot review yourself.")

    # Check for duplicate review for the same interaction
    if data.context_id:
        dup = db.query(Review).filter(
            Review.reviewer_id == current_user.id,
            Review.reviewee_id == data.reviewee_id,
            Review.context_type == data.context_type,
            Review.context_id == data.context_id
        ).first()
        if dup:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already submitted a review for this interaction.")

    review = Review(
        reviewer_id=current_user.id,
        reviewee_id=data.reviewee_id,
        context_type=data.context_type,
        context_id=data.context_id,
        rating=data.rating,
        comment=data.comment
    )
    db.add(review)
    db.commit()

    # If reviewee is a worker, update their worker profile rating
    worker_prof = db.query(WorkerProfile).filter(WorkerProfile.user_id == data.reviewee_id).first()
    if worker_prof:
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.reviewee_id == data.reviewee_id).scalar() or 0.0
        rev_count = db.query(Review).filter(Review.reviewee_id == data.reviewee_id).count()
        worker_prof.rating_average = round(float(avg_rating), 1)
        worker_prof.review_count = rev_count
        db.commit()

    db.refresh(review)
    return review

@router.get("/api/reviews/user/{user_id}", response_model=List[ReviewOut])
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.reviewee_id == user_id).order_by(Review.created_at.desc()).all()

@router.post("/api/reports", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def submit_report(
    data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = Report(
        reporter_id=current_user.id,
        reported_user_id=data.reported_user_id,
        listing_type=data.listing_type,
        listing_id=data.listing_id,
        reason=data.reason,
        details=data.details,
        status="pending"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
