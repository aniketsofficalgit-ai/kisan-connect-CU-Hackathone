from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database import get_db
from app.models import (
    User, WorkerRequest, MachineryBooking, BuyerInquiry,
    MachineryListing, CropListing, Notification, WorkerProfile, AuditLog
)
from app.schemas import (
    WorkerRequestCreate, WorkerRequestStatusUpdate, WorkerRequestOut,
    MachineryBookingCreate, MachineryBookingStatusUpdate, MachineryBookingOut,
    BuyerInquiryCreate, BuyerInquiryStatusUpdate, BuyerInquiryOut
)
from app.auth import get_current_user

router = APIRouter(prefix="/api/requests", tags=["Requests, Bookings & Inquiries"])

# ==================== WORKER REQUESTS ====================

@router.post("/worker", response_model=WorkerRequestOut, status_code=status.HTTP_201_CREATED)
def create_worker_request(
    data: WorkerRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id == data.worker_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot send a work request to yourself.")

    worker_user = db.query(User).filter(User.id == data.worker_id).first()
    if not worker_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Worker not found.")

    total_amount = data.proposed_wage * data.duration_days * data.workers_count

    req = WorkerRequest(
        farmer_id=current_user.id,
        worker_id=data.worker_id,
        work_type=data.work_type,
        start_date=data.start_date,
        end_date=data.end_date or data.start_date,
        duration_days=data.duration_days,
        workers_count=data.workers_count,
        location=data.location,
        proposed_wage=data.proposed_wage,
        wage_unit=data.wage_unit,
        total_estimated_amount=total_amount,
        notes=data.notes,
        status="pending"
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    # Notify worker
    notif = Notification(
        user_id=data.worker_id,
        title="New Farm Work Request",
        message=f"{current_user.full_name} sent a request for {data.work_type} starting {data.start_date}.",
        notification_type="worker_request",
        reference_id=req.id,
        reference_type="worker_request"
    )
    db.add(notif)
    db.commit()

    return req

@router.patch("/worker/{request_id}/status", response_model=WorkerRequestOut)
def update_worker_request_status(
    request_id: int,
    data: WorkerRequestStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(WorkerRequest).filter(WorkerRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")

    # Permissions check
    if current_user.id not in [req.farmer_id, req.worker_id] and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied.")

    valid_statuses = ["pending", "accepted", "rejected", "cancelled", "completed"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid status: {data.status}")

    req.status = data.status
    if data.response_note:
        req.response_note = data.response_note

    # Update completed counter if completed
    if data.status == "completed":
        worker_prof = db.query(WorkerProfile).filter(WorkerProfile.user_id == req.worker_id).first()
        if worker_prof:
            worker_prof.completed_jobs_count += 1

    # Notify the other party
    notify_recipient = req.farmer_id if current_user.id == req.worker_id else req.worker_id
    notif = Notification(
        user_id=notify_recipient,
        title=f"Work Request {data.status.title()}",
        message=f"{current_user.full_name} updated your request for {req.work_type} to '{data.status}'.",
        notification_type="worker_request",
        reference_id=req.id,
        reference_type="worker_request"
    )
    db.add(notif)
    db.commit()
    db.refresh(req)
    return req

@router.get("/worker/my", response_model=List[WorkerRequestOut])
def get_my_worker_requests(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(WorkerRequest).filter(
        or_(
            WorkerRequest.farmer_id == current_user.id,
            WorkerRequest.worker_id == current_user.id
        )
    )
    if status_filter and status_filter != "all":
        query = query.filter(WorkerRequest.status == status_filter)

    return query.order_by(WorkerRequest.created_at.desc()).all()


# ==================== MACHINERY BOOKINGS ====================

@router.post("/machinery", response_model=MachineryBookingOut, status_code=status.HTTP_201_CREATED)
def create_machinery_booking(
    data: MachineryBookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    machinery = db.query(MachineryListing).filter(MachineryListing.id == data.machinery_id).first()
    if not machinery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Machinery not found.")

    if machinery.owner_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot book your own machinery.")

    if not machinery.is_available or machinery.maintenance_status != "operational":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This equipment is currently not available or under maintenance.")

    # Check for overlapping approved bookings
    overlap = db.query(MachineryBooking).filter(
        MachineryBooking.machinery_id == data.machinery_id,
        MachineryBooking.status == "approved",
        or_(
            and_(MachineryBooking.start_date <= data.end_date, MachineryBooking.end_date >= data.start_date)
        )
    ).first()

    if overlap:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This equipment is already booked from {overlap.start_date} to {overlap.end_date}. Please choose different dates."
        )

    estimated_total = machinery.rental_price * data.rental_units

    booking = MachineryBooking(
        farmer_id=current_user.id,
        machinery_id=data.machinery_id,
        start_date=data.start_date,
        end_date=data.end_date,
        rental_units=data.rental_units,
        unit_type=data.unit_type,
        estimated_amount=estimated_total,
        delivery_needed=data.delivery_needed,
        delivery_address=data.delivery_address,
        notes=data.notes,
        status="pending"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Notify machinery owner
    notif = Notification(
        user_id=machinery.owner_id,
        title="New Machinery Booking Request",
        message=f"{current_user.full_name} requested to rent '{machinery.title}' for {data.rental_units} {data.unit_type}.",
        notification_type="machinery_booking",
        reference_id=booking.id,
        reference_type="machinery_booking"
    )
    db.add(notif)
    db.commit()

    return booking

@router.patch("/machinery/{booking_id}/status", response_model=MachineryBookingOut)
def update_machinery_booking_status(
    booking_id: int,
    data: MachineryBookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(MachineryBooking).filter(MachineryBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    machinery = booking.machinery
    is_owner = (machinery.owner_id == current_user.id)
    is_farmer = (booking.farmer_id == current_user.id)

    if not is_owner and not is_farmer and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied.")

    # If approving, double check conflict
    if data.status == "approved" and is_owner:
        overlap = db.query(MachineryBooking).filter(
            MachineryBooking.machinery_id == booking.machinery_id,
            MachineryBooking.id != booking.id,
            MachineryBooking.status == "approved",
            or_(
                and_(MachineryBooking.start_date <= booking.end_date, MachineryBooking.end_date >= booking.start_date)
            )
        ).first()
        if overlap:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Conflict: Another booking is already approved between {overlap.start_date} and {overlap.end_date}."
            )

    booking.status = data.status
    if data.owner_response_note:
        booking.owner_response_note = data.owner_response_note

    # Notify recipient
    notify_id = booking.farmer_id if is_owner else machinery.owner_id
    notif = Notification(
        user_id=notify_id,
        title=f"Machinery Booking {data.status.title()}",
        message=f"Booking for '{machinery.title}' has been updated to '{data.status}'.",
        notification_type="machinery_booking",
        reference_id=booking.id,
        reference_type="machinery_booking"
    )
    db.add(notif)
    db.commit()
    db.refresh(booking)
    return booking

@router.get("/machinery/my", response_model=List[MachineryBookingOut])
def get_my_machinery_bookings(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(MachineryBooking).join(MachineryListing).filter(
        or_(
            MachineryBooking.farmer_id == current_user.id,
            MachineryListing.owner_id == current_user.id
        )
    )
    if status_filter and status_filter != "all":
        query = query.filter(MachineryBooking.status == status_filter)

    return query.order_by(MachineryBooking.created_at.desc()).all()


# ==================== CROP INQUIRIES ====================

@router.post("/crop-inquiry", response_model=BuyerInquiryOut, status_code=status.HTTP_201_CREATED)
def create_buyer_inquiry(
    data: BuyerInquiryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    crop = db.query(CropListing).filter(CropListing.id == data.crop_id).first()
    if not crop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found.")

    if crop.farmer_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot inquire on your own crop listing.")

    total_amount = data.requested_quantity * data.proposed_price

    inquiry = BuyerInquiry(
        buyer_id=current_user.id,
        crop_id=data.crop_id,
        requested_quantity=data.requested_quantity,
        quantity_unit=data.quantity_unit,
        proposed_price=data.proposed_price,
        price_unit=data.price_unit,
        total_proposed_amount=total_amount,
        message=data.message,
        delivery_preference=data.delivery_preference,
        status="pending"
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    # Notify farmer
    notif = Notification(
        user_id=crop.farmer_id,
        title="New Crop Purchase Offer",
        message=f"{current_user.full_name} submitted an offer of ₹{data.proposed_price} for {data.requested_quantity} {data.quantity_unit} of {crop.crop_name}.",
        notification_type="crop_inquiry",
        reference_id=inquiry.id,
        reference_type="crop_inquiry"
    )
    db.add(notif)
    db.commit()

    return inquiry

@router.patch("/crop-inquiry/{inquiry_id}/status", response_model=BuyerInquiryOut)
def update_crop_inquiry_status(
    inquiry_id: int,
    data: BuyerInquiryStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inquiry = db.query(BuyerInquiry).filter(BuyerInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found.")

    crop = inquiry.crop
    is_farmer = (crop.farmer_id == current_user.id)
    is_buyer = (inquiry.buyer_id == current_user.id)

    if not is_farmer and not is_buyer and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permission denied.")

    inquiry.status = data.status
    if data.farmer_response_note:
        inquiry.farmer_response_note = data.farmer_response_note

    notify_id = inquiry.buyer_id if is_farmer else crop.farmer_id
    notif = Notification(
        user_id=notify_id,
        title=f"Crop Offer {data.status.title()}",
        message=f"Offer on '{crop.crop_name}' is now '{data.status}'.",
        notification_type="crop_inquiry",
        reference_id=inquiry.id,
        reference_type="crop_inquiry"
    )
    db.add(notif)
    db.commit()
    db.refresh(inquiry)
    return inquiry

@router.get("/crop-inquiry/my", response_model=List[BuyerInquiryOut])
def get_my_crop_inquiries(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(BuyerInquiry).join(CropListing).filter(
        or_(
            BuyerInquiry.buyer_id == current_user.id,
            CropListing.farmer_id == current_user.id
        )
    )
    if status_filter and status_filter != "all":
        query = query.filter(BuyerInquiry.status == status_filter)

    return query.order_by(BuyerInquiry.created_at.desc()).all()


# ==================== CENTRAL COMBINED REQUESTS VIEW ====================

@router.get("/all-unified")
def get_all_unified_requests(
    request_type: Optional[str] = Query(None, description="worker, machinery, crop, or all"),
    status_filter: Optional[str] = Query(None, description="Status filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Combines worker requests, machinery bookings, and crop inquiries into a single unified list
    for the unified Requests & Bookings page.
    """
    items = []

    # 1. Worker Requests
    if not request_type or request_type in ["worker", "all"]:
        w_query = db.query(WorkerRequest).filter(
            or_(WorkerRequest.farmer_id == current_user.id, WorkerRequest.worker_id == current_user.id)
        )
        if status_filter and status_filter != "all":
            w_query = w_query.filter(WorkerRequest.status == status_filter)
        for w in w_query.all():
            items.append({
                "type": "worker_request",
                "id": w.id,
                "title": f"Labor: {w.work_type}",
                "other_party": w.worker.full_name if current_user.id == w.farmer_id else w.farmer.full_name,
                "date": w.start_date,
                "amount": w.total_estimated_amount,
                "status": w.status,
                "created_at": w.created_at.isoformat(),
                "details": f"{w.duration_days} day(s), {w.workers_count} worker(s) @ ₹{w.proposed_wage}/{w.wage_unit}",
                "location": w.location,
                "is_sender": (current_user.id == w.farmer_id)
            })

    # 2. Machinery Bookings
    if not request_type or request_type in ["machinery", "all"]:
        m_query = db.query(MachineryBooking).join(MachineryListing).filter(
            or_(MachineryBooking.farmer_id == current_user.id, MachineryListing.owner_id == current_user.id)
        )
        if status_filter and status_filter != "all":
            m_query = m_query.filter(MachineryBooking.status == status_filter)
        for m in m_query.all():
            items.append({
                "type": "machinery_booking",
                "id": m.id,
                "title": f"Rental: {m.machinery.title}",
                "other_party": m.machinery.owner.full_name if current_user.id == m.farmer_id else m.farmer.full_name,
                "date": f"{m.start_date} to {m.end_date}",
                "amount": m.estimated_amount,
                "status": m.status,
                "created_at": m.created_at.isoformat(),
                "details": f"{m.rental_units} {m.unit_type} rental. Delivery: {'Yes' if m.delivery_needed else 'No'}",
                "location": m.machinery.location_district,
                "is_sender": (current_user.id == m.farmer_id)
            })

    # 3. Crop Inquiries
    if not request_type or request_type in ["crop", "all"]:
        c_query = db.query(BuyerInquiry).join(CropListing).filter(
            or_(BuyerInquiry.buyer_id == current_user.id, CropListing.farmer_id == current_user.id)
        )
        if status_filter and status_filter != "all":
            c_query = c_query.filter(BuyerInquiry.status == status_filter)
        for c in c_query.all():
            items.append({
                "type": "crop_inquiry",
                "id": c.id,
                "title": f"Produce: {c.crop.crop_name}",
                "other_party": c.crop.farmer.full_name if current_user.id == c.buyer_id else c.buyer.full_name,
                "date": c.created_at.strftime("%Y-%m-%d"),
                "amount": c.total_proposed_amount,
                "status": c.status,
                "created_at": c.created_at.isoformat(),
                "details": f"{c.requested_quantity} {c.quantity_unit} @ ₹{c.proposed_price}/{c.price_unit}",
                "location": c.crop.district,
                "is_sender": (current_user.id == c.buyer_id)
            })

    # Sort combined descending by created_at
    items.sort(key=lambda x: x["created_at"], reverse=True)
    return items
