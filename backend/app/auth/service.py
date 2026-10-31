import jwt
import bcrypt
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask import request, jsonify, g
from config import config
from app.database.models import User, FarmerProfile, PartnerProfile
from app.database.connection import SessionLocal

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: int, role: str, email: str) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "user_id": user_id,
        "email": email,
        "role": role,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp())
    }
    return jwt.encode(payload, config.SECRET_KEY, algorithm=config.ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def login_required(roles=None):
    """
    Decorator for role-based authorization.
    roles can be a string e.g. 'farmer' or list of strings ['farmer', 'admin']
    """
    if isinstance(roles, str):
        roles = [roles]

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify({"error": "Authorization token is missing or invalid"}), 401

            token = auth_header.split(" ")[1]
            payload = decode_access_token(token)
            if not payload:
                return jsonify({"error": "Token is expired or invalid"}), 401

            db = SessionLocal()
            try:
                user = db.query(User).filter_by(id=payload["user_id"]).first()
                if not user or not user.is_active:
                    return jsonify({"error": "User account not found or deactivated"}), 401

                if roles and user.role not in roles:
                    return jsonify({"error": f"Access denied. Requires one of these roles: {roles}"}), 403

                # Attach to Flask g context
                g.current_user = user
                g.user_id = user.id
                g.role = user.role
            finally:
                db.close()

            return f(*args, **kwargs)
        return decorated_function
    return decorator
