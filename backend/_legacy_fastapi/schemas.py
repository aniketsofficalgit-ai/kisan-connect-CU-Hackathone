import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ----------------- User Schemas -----------------
class UserBase(BaseModel):
    full_name: str
    mobile_number: str
    email: Optional[str] = None
    role: str  # farmer, worker, machinery_owner, buyer, admin
    village: Optional[str] = None
    town: Optional[str] = None
    district: str
    state: str
    preferred_language: str = "en"

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    password_confirm: Optional[str] = None

class UserLogin(BaseModel):
    identifier: str  # mobile or email
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    village: Optional[str] = None
    town: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    preferred_language: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    identifier: str  # mobile or email

class ResetPasswordRequest(BaseModel):
    identifier: str
    reset_token: Optional[str] = "demo-reset-token"
    new_password: str = Field(..., min_length=6)

class UserOut(UserBase):
    id: int
    verification_status: str
    verification_notes: Optional[str] = None
    profile_image_url: Optional[str] = None
    bio: Optional[str] = None
    is_active: bool
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ----------------- Worker Profile Schemas -----------------
class WorkerProfileBase(BaseModel):
    skills: str  # e.g. "Harvesting, Sowing, Tractor Driving"
    experience_years: int = 1
    expected_wage: float
    wage_unit: str = "per_day"  # per_day, per_hour
    is_group: bool = False
    group_size: int = 1
    preferred_work_area: Optional[str] = None
    is_available: bool = True

class WorkerProfileCreate(WorkerProfileBase):
    pass

class WorkerProfileUpdate(BaseModel):
    skills: Optional[str] = None
    experience_years: Optional[int] = None
    expected_wage: Optional[float] = None
    wage_unit: Optional[str] = None
    is_group: Optional[bool] = None
    group_size: Optional[int] = None
    preferred_work_area: Optional[str] = None
    is_available: Optional[bool] = None

class WorkerProfileOut(WorkerProfileBase):
    id: int
    user_id: int
    rating_average: float
    review_count: int
    completed_jobs_count: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class WorkerDetailOut(WorkerProfileOut):
    user: UserOut

# ----------------- Machinery Listing Schemas -----------------
class MachineryBase(BaseModel):
    title: str
    category: str
    make_model: Optional[str] = None
    horse_power: Optional[str] = None
    rental_price: float
    pricing_unit: str = "per_hour"
    location_village: Optional[str] = None
    location_district: str
    location_state: str
    description: Optional[str] = None
    specifications: Optional[str] = None
    image_url: Optional[str] = None
    is_available: bool = True
    includes_operator: bool = False
    includes_fuel: bool = False
    maintenance_status: str = "operational"

class MachineryCreate(MachineryBase):
    pass

class MachineryUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    make_model: Optional[str] = None
    horse_power: Optional[str] = None
    rental_price: Optional[float] = None
    pricing_unit: Optional[str] = None
    location_village: Optional[str] = None
    location_district: Optional[str] = None
    location_state: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    includes_operator: Optional[bool] = None
    includes_fuel: Optional[bool] = None
    maintenance_status: Optional[str] = None

class MachineryOut(MachineryBase):
    id: int
    owner_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    owner: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- Crop Listing Schemas -----------------
class CropBase(BaseModel):
    crop_name: str
    category: str
    variety: Optional[str] = None
    available_quantity: float
    quantity_unit: str = "quintal"
    asking_price: float
    price_unit: str = "per_quintal"
    harvest_date: Optional[str] = None
    quality_grade: str = "Standard"
    village: Optional[str] = None
    district: str
    state: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    preferred_contact_method: str = "either"
    status: str = "available"

class CropCreate(CropBase):
    pass

class CropUpdate(BaseModel):
    crop_name: Optional[str] = None
    category: Optional[str] = None
    variety: Optional[str] = None
    available_quantity: Optional[float] = None
    quantity_unit: Optional[str] = None
    asking_price: Optional[float] = None
    price_unit: Optional[str] = None
    harvest_date: Optional[str] = None
    quality_grade: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    status: Optional[str] = None

class CropOut(CropBase):
    id: int
    farmer_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    farmer: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- Requests & Bookings Schemas -----------------
class WorkerRequestCreate(BaseModel):
    worker_id: int
    work_type: str
    start_date: str
    end_date: Optional[str] = None
    duration_days: int = 1
    workers_count: int = 1
    location: str
    proposed_wage: float
    wage_unit: str = "per_day"
    notes: Optional[str] = None

class WorkerRequestStatusUpdate(BaseModel):
    status: str  # accepted, rejected, cancelled, completed
    response_note: Optional[str] = None

class WorkerRequestOut(BaseModel):
    id: int
    farmer_id: int
    worker_id: int
    work_type: str
    start_date: str
    end_date: Optional[str] = None
    duration_days: int
    workers_count: int
    location: str
    proposed_wage: float
    wage_unit: str
    total_estimated_amount: float
    notes: Optional[str] = None
    status: str
    response_note: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    farmer: Optional[UserOut] = None
    worker: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

class MachineryBookingCreate(BaseModel):
    machinery_id: int
    start_date: str
    end_date: str
    rental_units: float
    unit_type: str = "hours"
    delivery_needed: bool = False
    delivery_address: Optional[str] = None
    notes: Optional[str] = None

class MachineryBookingStatusUpdate(BaseModel):
    status: str  # approved, rejected, cancelled, completed
    owner_response_note: Optional[str] = None

class MachineryBookingOut(BaseModel):
    id: int
    farmer_id: int
    machinery_id: int
    start_date: str
    end_date: str
    rental_units: float
    unit_type: str
    estimated_amount: float
    delivery_needed: bool
    delivery_address: Optional[str] = None
    notes: Optional[str] = None
    status: str
    owner_response_note: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    farmer: Optional[UserOut] = None
    machinery: Optional[MachineryOut] = None

    model_config = ConfigDict(from_attributes=True)

class BuyerInquiryCreate(BaseModel):
    crop_id: int
    requested_quantity: float
    quantity_unit: str = "quintal"
    proposed_price: float
    price_unit: str = "per_quintal"
    message: Optional[str] = None
    delivery_preference: str = "buyer_pickup"

class BuyerInquiryStatusUpdate(BaseModel):
    status: str  # accepted, rejected, counter_offered, completed
    farmer_response_note: Optional[str] = None

class BuyerInquiryOut(BaseModel):
    id: int
    buyer_id: int
    crop_id: int
    requested_quantity: float
    quantity_unit: str
    proposed_price: float
    price_unit: str
    total_proposed_amount: float
    message: Optional[str] = None
    delivery_preference: str
    status: str
    farmer_response_note: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    buyer: Optional[UserOut] = None
    crop: Optional[CropOut] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- Chat & Messaging Schemas -----------------
class MessageCreate(BaseModel):
    content: str

class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    is_read: bool
    created_at: datetime.datetime
    sender: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

class ConversationCreate(BaseModel):
    recipient_id: int
    subject: Optional[str] = None
    context_type: Optional[str] = None
    context_id: Optional[int] = None
    initial_message: Optional[str] = None

class ConversationOut(BaseModel):
    id: int
    participant1_id: int
    participant2_id: int
    subject: Optional[str] = None
    context_type: Optional[str] = None
    context_id: Optional[int] = None
    last_message_at: datetime.datetime
    created_at: datetime.datetime
    participant1: Optional[UserOut] = None
    participant2: Optional[UserOut] = None
    unread_count: int = 0
    last_message: Optional[MessageOut] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- Notifications -----------------
class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    reference_id: Optional[int] = None
    reference_type: Optional[str] = None
    is_read: bool
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

# ----------------- Reviews -----------------
class ReviewCreate(BaseModel):
    reviewee_id: int
    context_type: str  # worker, machinery, buyer, farmer
    context_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    reviewer_id: int
    reviewee_id: int
    context_type: str
    context_id: Optional[int] = None
    rating: int
    comment: Optional[str] = None
    created_at: datetime.datetime
    reviewer: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- Verification & Reports -----------------
class VerificationCreate(BaseModel):
    document_type: str
    document_number: str
    document_url: Optional[str] = None

class VerificationReview(BaseModel):
    status: str  # approved, rejected
    reviewer_notes: Optional[str] = None

class VerificationOut(BaseModel):
    id: int
    user_id: int
    document_type: str
    document_number: str
    document_url: Optional[str] = None
    status: str
    reviewer_notes: Optional[str] = None
    created_at: datetime.datetime
    reviewed_at: Optional[datetime.datetime] = None
    user: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

class ReportCreate(BaseModel):
    reported_user_id: Optional[int] = None
    listing_type: Optional[str] = None
    listing_id: Optional[int] = None
    reason: str
    details: str

class ReportOut(BaseModel):
    id: int
    reporter_id: int
    reported_user_id: Optional[int] = None
    listing_type: Optional[str] = None
    listing_id: Optional[int] = None
    reason: str
    details: str
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime.datetime
    reporter: Optional[UserOut] = None
    reported_user: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)

# ----------------- AI Voice Assistant Schemas -----------------
class AIChatRequest(BaseModel):
    query: str
    language: str = "en"  # en, hi, pa
    session_id: Optional[str] = "default"

class AIChatResponse(BaseModel):
    response: str
    language: str
    audio_base64: Optional[str] = None
    disclaimer: str
    topic: Optional[str] = None
    related_actions: Optional[List[dict]] = None

# ----------------- Weather Schemas -----------------
class WeatherForecastDay(BaseModel):
    date: str
    day_name: str
    temp_max: float
    temp_min: float
    precipitation_prob: int
    weather_condition: str
    icon: str

class WeatherResponse(BaseModel):
    location: str
    district: str
    state: str
    latitude: float
    longitude: float
    current_temperature: float
    feels_like: float
    humidity: int
    wind_speed: float
    rain_probability: int
    weather_condition: str
    icon: str
    agricultural_advisory: str
    spraying_suitability: str  # Good, Moderate, Unfavorable
    irrigation_advice: str
    forecast: List[WeatherForecastDay]
    last_updated: str
    source: str
