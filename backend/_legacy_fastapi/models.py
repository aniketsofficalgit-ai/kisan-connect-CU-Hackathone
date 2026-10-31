import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    mobile_number = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, index=True)  # farmer, worker, machinery_owner, buyer, admin
    village = Column(String(100), nullable=True)
    town = Column(String(100), nullable=True)
    district = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    preferred_language = Column(String(10), default="en")  # en, hi, pa
    verification_status = Column(String(20), default="not_verified")  # not_verified, pending, verified
    verification_notes = Column(Text, nullable=True)
    profile_image_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    worker_profile = relationship("WorkerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    machinery_listings = relationship("MachineryListing", back_populates="owner", cascade="all, delete-orphan")
    crop_listings = relationship("CropListing", back_populates="farmer", cascade="all, delete-orphan")
    
    # Requests as farmer
    sent_worker_requests = relationship("WorkerRequest", foreign_keys="WorkerRequest.farmer_id", back_populates="farmer")
    machinery_bookings = relationship("MachineryBooking", foreign_keys="MachineryBooking.farmer_id", back_populates="farmer")
    
    # Inquiries as buyer
    sent_buyer_inquiries = relationship("BuyerInquiry", foreign_keys="BuyerInquiry.buyer_id", back_populates="buyer")
    
    # Requests received as worker
    received_worker_requests = relationship("WorkerRequest", foreign_keys="WorkerRequest.worker_id", back_populates="worker")
    
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    verification_requests = relationship("VerificationRequest", back_populates="user", cascade="all, delete-orphan")
    reviews_given = relationship("Review", foreign_keys="Review.reviewer_id", back_populates="reviewer")
    reviews_received = relationship("Review", foreign_keys="Review.reviewee_id", back_populates="reviewee")


class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    skills = Column(Text, nullable=False)  # Comma-separated or JSON list of skills
    experience_years = Column(Integer, default=1)
    expected_wage = Column(Float, nullable=False)
    wage_unit = Column(String(20), default="per_day")  # per_day, per_hour
    is_group = Column(Boolean, default=False)
    group_size = Column(Integer, default=1)
    preferred_work_area = Column(String(200), nullable=True)
    is_available = Column(Boolean, default=True)
    rating_average = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    completed_jobs_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="worker_profile")


class MachineryListing(Base):
    __tablename__ = "machinery_listings"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # Tractors, Harvesters, Seeders, Cultivators, Sprayers, Irrigation, Threshers, Other
    make_model = Column(String(100), nullable=True)
    horse_power = Column(String(50), nullable=True)
    rental_price = Column(Float, nullable=False)
    pricing_unit = Column(String(20), default="per_hour")  # per_hour, per_day, per_acre
    location_village = Column(String(100), nullable=True)
    location_district = Column(String(100), nullable=False, index=True)
    location_state = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    specifications = Column(Text, nullable=True)  # Details like fuel type, attachments, condition
    image_url = Column(String(500), nullable=True)
    is_available = Column(Boolean, default=True)
    includes_operator = Column(Boolean, default=False)
    includes_fuel = Column(Boolean, default=False)
    maintenance_status = Column(String(30), default="operational")  # operational, under_maintenance, standby
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="machinery_listings")
    bookings = relationship("MachineryBooking", back_populates="machinery", cascade="all, delete-orphan")


class CropListing(Base):
    __tablename__ = "crop_listings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    crop_name = Column(String(100), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # Grains, Pulses, Vegetables, Fruits, Oilseeds, Spices, Cash Crops, Other
    variety = Column(String(100), nullable=True)
    available_quantity = Column(Float, nullable=False)
    quantity_unit = Column(String(20), default="quintal")  # quintal, kg, ton, bag
    asking_price = Column(Float, nullable=False)
    price_unit = Column(String(20), default="per_quintal")  # per_quintal, per_kg, per_ton
    harvest_date = Column(String(50), nullable=True)
    quality_grade = Column(String(50), default="Standard")  # Grade A, Grade B, Standard, Organic
    village = Column(String(100), nullable=True)
    district = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    preferred_contact_method = Column(String(30), default="either")  # phone, chat, either
    status = Column(String(30), default="available")  # available, under_negotiation, sold, delisted
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    farmer = relationship("User", back_populates="crop_listings")
    inquiries = relationship("BuyerInquiry", back_populates="crop", cascade="all, delete-orphan")


class WorkerRequest(Base):
    __tablename__ = "worker_requests"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    work_type = Column(String(100), nullable=False)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=True)
    duration_days = Column(Integer, default=1)
    workers_count = Column(Integer, default=1)
    location = Column(String(200), nullable=False)
    proposed_wage = Column(Float, nullable=False)
    wage_unit = Column(String(20), default="per_day")
    total_estimated_amount = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(30), default="pending")  # pending, accepted, rejected, cancelled, completed
    response_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    farmer = relationship("User", foreign_keys=[farmer_id], back_populates="sent_worker_requests")
    worker = relationship("User", foreign_keys=[worker_id], back_populates="received_worker_requests")


class MachineryBooking(Base):
    __tablename__ = "machinery_bookings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    machinery_id = Column(Integer, ForeignKey("machinery_listings.id", ondelete="CASCADE"), nullable=False)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=False)
    rental_units = Column(Float, nullable=False)  # number of hours or days
    unit_type = Column(String(20), default="hours")  # hours, days
    estimated_amount = Column(Float, nullable=False)
    delivery_needed = Column(Boolean, default=False)
    delivery_address = Column(String(250), nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(30), default="pending")  # pending, approved, rejected, cancelled, completed
    owner_response_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    farmer = relationship("User", foreign_keys=[farmer_id], back_populates="machinery_bookings")
    machinery = relationship("MachineryListing", back_populates="bookings")


class BuyerInquiry(Base):
    __tablename__ = "buyer_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    crop_id = Column(Integer, ForeignKey("crop_listings.id", ondelete="CASCADE"), nullable=False)
    requested_quantity = Column(Float, nullable=False)
    quantity_unit = Column(String(20), default="quintal")
    proposed_price = Column(Float, nullable=False)
    price_unit = Column(String(20), default="per_quintal")
    total_proposed_amount = Column(Float, nullable=False)
    message = Column(Text, nullable=True)
    delivery_preference = Column(String(50), default="buyer_pickup")  # buyer_pickup, farmer_delivery
    status = Column(String(30), default="pending")  # pending, accepted, rejected, counter_offered, completed
    farmer_response_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="sent_buyer_inquiries")
    crop = relationship("CropListing", back_populates="inquiries")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    participant1_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    participant2_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String(200), nullable=True)
    context_type = Column(String(50), nullable=True)  # worker_request, machinery_booking, crop_inquiry, general
    context_id = Column(Integer, nullable=True)
    last_message_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    participant1 = relationship("User", foreign_keys=[participant1_id])
    participant2 = relationship("User", foreign_keys=[participant2_id])
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="system")  # worker_request, machinery_booking, crop_inquiry, message, verification, weather_alert, system
    reference_id = Column(Integer, nullable=True)
    reference_type = Column(String(50), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reviewee_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    context_type = Column(String(50), nullable=False)  # worker, machinery, buyer, farmer
    context_id = Column(Integer, nullable=True)  # request/booking/inquiry id
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")
    reviewee = relationship("User", foreign_keys=[reviewee_id], back_populates="reviews_received")


class VerificationRequest(Base):
    __tablename__ = "verification_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(50), nullable=False)  # aadhaar, kisan_credit_card, land_record, driving_license, trade_license
    document_number = Column(String(100), nullable=False)
    document_url = Column(String(500), nullable=True)
    status = Column(String(30), default="pending")  # pending, approved, rejected
    reviewer_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="verification_requests")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reported_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    listing_type = Column(String(50), nullable=True)  # crop, machinery, worker, general
    listing_id = Column(Integer, nullable=True)
    reason = Column(String(100), nullable=False)
    details = Column(Text, nullable=False)
    status = Column(String(30), default="pending")  # pending, investigating, resolved, dismissed
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    reporter = relationship("User", foreign_keys=[reporter_id])
    reported_user = relationship("User", foreign_keys=[reported_user_id])


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    session_id = Column(String(100), index=True, nullable=False)
    user_query = Column(Text, nullable=False)
    assistant_response = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    topic = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
