from typing import Optional, List
from fastapi import APIRouter, Query
from app.services.weather_service import fetch_weather_data, DISTRICT_COORDINATES
from app.schemas import WeatherResponse

router = APIRouter(prefix="/api/weather", tags=["Localized Weather"])

@router.get("", response_model=WeatherResponse)
async def get_weather(
    district: Optional[str] = Query("Ludhiana", description="District or city name"),
    lat: Optional[float] = Query(None, description="GPS Latitude"),
    lon: Optional[float] = Query(None, description="GPS Longitude")
):
    data = await fetch_weather_data(district_name=district or "Ludhiana", lat=lat, lon=lon)
    return data

@router.get("/districts")
def get_supported_districts():
    """Returns list of major agricultural districts with their state names."""
    return [
        {"name": info["name"], "state": info["state"], "key": key}
        for key, info in DISTRICT_COORDINATES.items()
    ]
