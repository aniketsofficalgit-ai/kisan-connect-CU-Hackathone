import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory for the backend
BASE_DIR = Path(__file__).resolve().parent

# Load .env file from backend or root directory
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")

class Config:
    PROJECT_NAME = "Kisan Connect"
    VERSION = "1.0.0"
    TAGLINE = "Turning Farm Waste into Valuable Resources"
    TEAM_NAME = "CLOVER GUARDIAN"
    TEAM_MEMBERS = ["Prakhar", "Ayush", "Raj", "Aniket Dubey"]

    # Security
    SECRET_KEY = os.getenv("SECRET_KEY", "clover-guardian-kisan-connect-secure-key-2026")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))

    # Database
    # Supports MySQL or fallback SQLite
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DB = os.getenv("MYSQL_DB", "kisan_connect")

    DEFAULT_SQLITE_URL = f"sqlite:///{BASE_DIR / 'kisan_connect.db'}"
    DATABASE_URL = os.getenv("DATABASE_URL")

    # Uploads
    UPLOAD_FOLDER = BASE_DIR / "uploads"
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

    # AI Configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # Server & CORS
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"]

    @classmethod
    def get_database_uri(cls):
        """Returns the appropriate database URI, preferring MySQL if configured or available, otherwise SQLite."""
        if cls.DATABASE_URL:
            return cls.DATABASE_URL
        if os.getenv("USE_MYSQL", "false").lower() in ("true", "1", "yes"):
            return f"mysql+pymysql://{cls.MYSQL_USER}:{cls.MYSQL_PASSWORD}@{cls.MYSQL_HOST}:{cls.MYSQL_PORT}/{cls.MYSQL_DB}?charset=utf8mb4"
        return cls.DEFAULT_SQLITE_URL

config = Config()
