from datetime import datetime, timezone
import json
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="farmer")  # 'farmer', 'partner', 'admin'
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    # Relationships
    farmer_profile = relationship("FarmerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    partner_profile = relationship("PartnerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    waste_listings = relationship("WasteListing", back_populates="farmer", foreign_keys="WasteListing.farmer_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone or "",
            "role": self.role,
            "is_active": self.is_active,
            "avatar_url": self.avatar_url or "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "farmer_profile": self.farmer_profile.to_dict() if self.farmer_profile else None,
            "partner_profile": self.partner_profile.to_dict() if self.partner_profile else None,
        }


class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    farm_name = Column(String(150), default="Green Farm")
    farm_size_acres = Column(Float, default=5.0)
    address = Column(String(255), default="")
    village = Column(String(100), default="")
    district = Column(String(100), default="")
    state = Column(String(100), default="Punjab")
    pincode = Column(String(10), default="")
    latitude = Column(Float, default=30.9010)
    longitude = Column(Float, default=75.8573)
    primary_crops = Column(String(255), default="Rice, Wheat")

    user = relationship("User", back_populates="farmer_profile")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "farm_name": self.farm_name,
            "farm_size_acres": self.farm_size_acres,
            "address": self.address,
            "village": self.village,
            "district": self.district,
            "state": self.state,
            "pincode": self.pincode,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "primary_crops": [c.strip() for c in self.primary_crops.split(",") if c.strip()] if self.primary_crops else []
        }


class PartnerProfile(Base):
    __tablename__ = "partner_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    business_name = Column(String(150), nullable=False)
    business_type = Column(String(50), default="compost_manufacturer") # 'compost_manufacturer', 'biomass_plant', 'plastic_recycler', 'waste_collector'
    description = Column(Text, default="")
    registration_number = Column(String(50), default="")
    contact_person = Column(String(100), default="")
    contact_phone = Column(String(20), default="")
    contact_email = Column(String(120), default="")
    service_area = Column(String(255), default="Ludhiana, Jalandhar, Patiala")
    accepted_categories = Column(Text, default='["crop_residue", "straw_husk"]')
    minimum_quantity = Column(Float, default=100.0) # in kg or quintal
    pricing_details = Column(String(255), default="₹150 - ₹250 per quintal")
    is_verified = Column(Boolean, default=False)
    verification_status = Column(String(20), default="pending") # 'pending', 'approved', 'rejected'
    operating_hours = Column(String(100), default="Mon-Sat: 8:00 AM - 6:00 PM")
    address = Column(String(255), default="")
    latitude = Column(Float, default=30.9010)
    longitude = Column(Float, default=75.8573)
    rating = Column(Float, default=4.8)

    user = relationship("User", back_populates="partner_profile")

    def to_dict(self):
        try:
            cats = json.loads(self.accepted_categories) if self.accepted_categories else []
        except Exception:
            cats = [c.strip() for c in (self.accepted_categories or "").split(",") if c.strip()]

        return {
            "id": self.id,
            "user_id": self.user_id,
            "business_name": self.business_name,
            "business_type": self.business_type,
            "description": self.description or "",
            "registration_number": self.registration_number or "",
            "contact_person": self.contact_person or "",
            "contact_phone": self.contact_phone or "",
            "contact_email": self.contact_email or "",
            "service_area": self.service_area or "",
            "accepted_categories": cats,
            "minimum_quantity": self.minimum_quantity,
            "pricing_details": self.pricing_details or "",
            "is_verified": self.is_verified,
            "verification_status": self.verification_status,
            "operating_hours": self.operating_hours,
            "address": self.address or "",
            "latitude": self.latitude,
            "longitude": self.longitude,
            "rating": self.rating
        }


class WasteCategory(Base):
    __tablename__ = "waste_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_hi = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(Text, default="")
    description_hi = Column(Text, default="")
    icon = Column(String(50), default="Sprout")
    recommended_uses = Column(Text, default="")

    listings = relationship("WasteListing", back_populates="category")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "name_hi": self.name_hi,
            "slug": self.slug,
            "description": self.description,
            "description_hi": self.description_hi,
            "icon": self.icon,
            "recommended_uses": self.recommended_uses
        }


class WasteListing(Base):
    __tablename__ = "waste_listings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("waste_categories.id"), nullable=False)
    title = Column(String(150), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), default="quintal") # 'kg', 'quintal', 'tonne'
    description = Column(Text, default="")
    image_url = Column(String(255), default="")
    location_address = Column(String(255), default="")
    village_district = Column(String(150), default="")
    latitude = Column(Float, default=30.9010)
    longitude = Column(Float, default=75.8573)
    pickup_available = Column(Boolean, default=True)
    expected_price = Column(Float, nullable=True) # in Rupees
    status = Column(String(20), default="available") # 'available', 'pending', 'collected', 'cancelled'
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    farmer = relationship("User", foreign_keys=[farmer_id], back_populates="waste_listings")
    category = relationship("WasteCategory", back_populates="listings")
    collection_requests = relationship("CollectionRequest", back_populates="listing", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "farmer_id": self.farmer_id,
            "farmer_name": self.farmer.full_name if self.farmer else "Unknown",
            "farmer_phone": self.farmer.phone if self.farmer else "",
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else "",
            "category_slug": self.category.slug if self.category else "",
            "title": self.title,
            "quantity": self.quantity,
            "unit": self.unit,
            "description": self.description or "",
            "image_url": self.image_url or "",
            "location_address": self.location_address or "",
            "village_district": self.village_district or "",
            "latitude": self.latitude,
            "longitude": self.longitude,
            "pickup_available": self.pickup_available,
            "expected_price": self.expected_price,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class CollectionRequest(Base):
    __tablename__ = "collection_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_number = Column(String(50), unique=True, index=True, nullable=False)
    listing_id = Column(Integer, ForeignKey("waste_listings.id", ondelete="CASCADE"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    partner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="Pending") # 'Pending', 'Accepted', 'Scheduled', 'Picked Up', 'Completed', 'Rejected', 'Cancelled'
    farmer_notes = Column(Text, default="")
    partner_notes = Column(Text, default="")
    requested_pickup_date = Column(String(50), default="")
    scheduled_pickup_date = Column(String(50), default="")
    actual_pickup_date = Column(String(50), default="")
    offered_price = Column(Float, default=0.0)
    payment_status = Column(String(20), default="pending") # 'pending', 'paid', 'not_applicable'
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    listing = relationship("WasteListing", back_populates="collection_requests")
    farmer = relationship("User", foreign_keys=[farmer_id])
    partner = relationship("User", foreign_keys=[partner_id])
    history = relationship("CollectionStatusHistory", back_populates="collection_request", cascade="all, delete-orphan", order_by="CollectionStatusHistory.created_at.asc()")

    def to_dict(self):
        partner_biz = ""
        if self.partner and self.partner.partner_profile:
            partner_biz = self.partner.partner_profile.business_name

        return {
            "id": self.id,
            "request_number": self.request_number,
            "listing_id": self.listing_id,
            "listing_title": self.listing.title if self.listing else "Agricultural Waste",
            "waste_category": self.listing.category.name if self.listing and self.listing.category else "",
            "quantity": self.listing.quantity if self.listing else 0,
            "unit": self.listing.unit if self.listing else "",
            "farmer_id": self.farmer_id,
            "farmer_name": self.farmer.full_name if self.farmer else "Farmer",
            "farmer_phone": self.farmer.phone if self.farmer else "",
            "partner_id": self.partner_id,
            "partner_name": self.partner.full_name if self.partner else "Partner",
            "partner_business_name": partner_biz or (self.partner.full_name if self.partner else "Partner"),
            "partner_phone": self.partner.phone if self.partner else "",
            "status": self.status,
            "farmer_notes": self.farmer_notes or "",
            "partner_notes": self.partner_notes or "",
            "requested_pickup_date": self.requested_pickup_date or "",
            "scheduled_pickup_date": self.scheduled_pickup_date or "",
            "actual_pickup_date": self.actual_pickup_date or "",
            "offered_price": self.offered_price,
            "payment_status": self.payment_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "history": [h.to_dict() for h in self.history] if self.history else []
        }


class CollectionStatusHistory(Base):
    __tablename__ = "collection_status_history"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collection_requests.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), nullable=False)
    comment = Column(Text, default="")
    updated_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    collection_request = relationship("CollectionRequest", back_populates="history")
    updated_by = relationship("User", foreign_keys=[updated_by_id])

    def to_dict(self):
        return {
            "id": self.id,
            "collection_id": self.collection_id,
            "status": self.status,
            "comment": self.comment or "",
            "updated_by": self.updated_by.full_name if self.updated_by else "System",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="alert") # 'collection_request', 'status_update', 'partner_approval', 'alert'
    link = Column(String(255), default="")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="notifications")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "link": self.link or "",
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    session_id = Column(String(100), index=True, default="guest")
    sender = Column(String(20), nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True) # 1 to 5 stars
    feedback = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "session_id": self.session_id,
            "sender": self.sender,
            "content": self.content,
            "rating": self.rating,
            "feedback": self.feedback or "",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class EducationalResource(Base):
    __tablename__ = "educational_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    title_hi = Column(String(150), nullable=False)
    waste_category = Column(String(100), nullable=False)
    reuse_method = Column(String(150), nullable=False)
    summary = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)
    safety_guidelines = Column(Text, nullable=False)
    environmental_benefits = Column(Text, nullable=False)
    estimated_value_potential = Column(String(100), default="₹1,500 - ₹3,000 per acre")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "title_hi": self.title_hi,
            "waste_category": self.waste_category,
            "reuse_method": self.reuse_method,
            "summary": self.summary,
            "instructions": self.instructions,
            "safety_guidelines": self.safety_guidelines,
            "environmental_benefits": self.environmental_benefits,
            "estimated_value_potential": self.estimated_value_potential
        }
