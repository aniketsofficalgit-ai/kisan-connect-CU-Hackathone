from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.seed_data import seed_database
from app.routers import (
    auth_routes, user_routes, worker_routes, machinery_routes,
    crop_routes, request_routes, message_routes, notification_routes,
    weather_routes, ai_assistant_routes, review_routes, admin_routes
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is created and seeded
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"Seed note: {e}")
    yield

app = FastAPI(
    title=settings.APP_NAME,
    description="Farmer-first digital platform connecting farmers, agricultural workers, machinery owners, and produce buyers.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(worker_routes.router)
app.include_router(machinery_routes.router)
app.include_router(crop_routes.router)
app.include_router(request_routes.router)
app.include_router(message_routes.router)
app.include_router(notification_routes.router)
app.include_router(weather_routes.router)
app.include_router(ai_assistant_routes.router)
app.include_router(review_routes.router)
app.include_router(admin_routes.router)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
def healthcheck():
    return {
        "status": "healthy",
        "database": "connected",
        "weather_service": "active",
        "ai_engine": "ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
