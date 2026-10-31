from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import User, WorkerProfile, AuditLog
from app.schemas import (
    UserCreate, UserLogin, UserOut, TokenResponse,
    ForgotPasswordRequest, ResetPasswordRequest
)
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if mobile exists
    existing_phone = db.query(User).filter(User.mobile_number == user_data.mobile_number.strip()).first()
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this mobile number already exists."
        )

    # Check if email exists
    if user_data.email and user_data.email.strip():
        existing_email = db.query(User).filter(User.email == user_data.email.strip().lower()).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )

    valid_roles = ["farmer", "worker", "machinery_owner", "buyer", "admin"]
    if user_data.role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}"
        )

    hashed_pw = hash_password(user_data.password)

    new_user = User(
        full_name=user_data.full_name.strip(),
        mobile_number=user_data.mobile_number.strip(),
        email=user_data.email.strip().lower() if user_data.email else None,
        hashed_password=hashed_pw,
        role=user_data.role,
        village=user_data.village.strip() if user_data.village else None,
        town=user_data.town.strip() if user_data.town else None,
        district=user_data.district.strip(),
        state=user_data.state.strip(),
        preferred_language=user_data.preferred_language or "en",
        verification_status="not_verified"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # If registered as agricultural worker, initialize default worker profile
    if new_user.role == "worker":
        worker_prof = WorkerProfile(
            user_id=new_user.id,
            skills="General Agricultural Labor, Harvesting",
            experience_years=1,
            expected_wage=500.0,
            wage_unit="per_day",
            is_group=False,
            group_size=1,
            preferred_work_area=f"{new_user.district}, {new_user.state}",
            is_available=True
        )
        db.add(worker_prof)
        db.commit()

    # Create audit log
    log = AuditLog(
        user_id=new_user.id,
        action="user_registered",
        entity_type="user",
        entity_id=new_user.id,
        details=f"Registered role: {new_user.role}"
    )
    db.add(log)
    db.commit()

    token = create_access_token({"sub": str(new_user.id), "role": new_user.role})
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    ident = credentials.identifier.strip()
    user = db.query(User).filter(
        or_(
            User.mobile_number == ident,
            User.email == ident.lower()
        )
    ).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mobile number/email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive. Please contact support."
        )

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    ident = req.identifier.strip()
    user = db.query(User).filter(
        or_(
            User.mobile_number == ident,
            User.email == ident.lower()
        )
    ).first()

    if not user:
        # Avoid user enumeration in public API
        return {"message": "If this account exists, password recovery instructions or reset token have been generated."}

    return {
        "message": "Reset token generated successfully. In demo environment, use reset token: 'demo-reset-token'",
        "reset_token": "demo-reset-token",
        "identifier": ident
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    ident = req.identifier.strip()
    user = db.query(User).filter(
        or_(
            User.mobile_number == ident,
            User.email == ident.lower()
        )
    ).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found.")

    user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"message": "Password updated successfully. You may now log in with your new password."}

@router.get("/demo-accounts")
def get_demo_accounts():
    """Returns sample demo accounts clearly labelled for quick test/evaluation."""
    return [
        {
            "role": "farmer",
            "title": "Farmer (Gurpreet Singh)",
            "identifier": "9876543210",
            "email": "farmer@kisanconnect.in",
            "password": "password123",
            "description": "Finds workers, rents machinery, lists crops for sale, checks weather."
        },
        {
            "role": "worker",
            "title": "Agricultural Worker (Ramesh Kumar)",
            "identifier": "9876543211",
            "email": "worker@kisanconnect.in",
            "password": "password123",
            "description": "Sets skills/wage, receives farm work requests, accepts/rejects jobs."
        },
        {
            "role": "machinery_owner",
            "title": "Machinery Owner (Balwinder Dhillon)",
            "identifier": "9876543212",
            "email": "owner@kisanconnect.in",
            "password": "password123",
            "description": "Lists tractors/harvesters, sets rental rates, manages booking requests."
        },
        {
            "role": "buyer",
            "title": "Produce Buyer (Priya Aggarwal)",
            "identifier": "9876543213",
            "email": "buyer@kisanconnect.in",
            "password": "password123",
            "description": "Discovers crops, checks harvest quality, submits purchase inquiries."
        },
        {
            "role": "admin",
            "title": "Administrator",
            "identifier": "9876543214",
            "email": "admin@kisanconnect.in",
            "password": "password123",
            "description": "Platform management, verification reviews, listings moderation, reports."
        }
    ]
