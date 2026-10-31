import pytest
import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_healthcheck(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["status"] == "healthy"
    assert data["team"] == "CLOVER GUARDIAN"

def test_farmer_login(client):
    response = client.post("/api/auth/login", json={
        "email": "ramesh@kisanconnect.com",
        "password": "Farmer@123"
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "access_token" in data
    assert data["user"]["role"] == "farmer"

def test_partner_login(client):
    response = client.post("/api/auth/login", json={
        "email": "greenbio@kisanconnect.com",
        "password": "Partner@123"
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "access_token" in data
    assert data["user"]["role"] == "partner"

def test_admin_login(client):
    response = client.post("/api/auth/login", json={
        "email": "admin@kisanconnect.com",
        "password": "Admin@123"
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_auth_me(client):
    login_res = client.post("/api/auth/login", json={
        "email": "ramesh@kisanconnect.com",
        "password": "Farmer@123"
    })
    token = json.loads(login_res.data)["access_token"]
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["user"]["email"] == "ramesh@kisanconnect.com"

def test_waste_categories(client):
    response = client.get("/api/waste/categories")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "categories" in data
    assert len(data["categories"]) >= 5
    category_slugs = [c["slug"] for c in data["categories"]]
    assert "crop_residue" in category_slugs

def test_waste_listings(client):
    response = client.get("/api/waste/listings")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "listings" in data
    assert len(data["listings"]) > 0
    assert "title" in data["listings"][0]

def test_partner_discovery(client):
    response = client.get("/api/partners/discovery")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "partners" in data
    assert len(data["partners"]) > 0

def test_recycling_guides(client):
    response = client.get("/api/recycling/guides")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "guides" in data
    assert len(data["guides"]) >= 4

def test_ai_assistant_chat(client):
    response = client.post("/api/ai/chat", json={
        "message": "How much can I earn from 10 tonnes of paddy straw?",
        "language": "en"
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "reply" in data
    assert len(data["reply"]) > 20
    assert data["assistant_name"] == "KRITI AI"

def test_kriti_ai_voice_mode(client):
    response = client.post("/api/ai/chat", json={
        "message": "How do I make vermicompost?",
        "language": "en",
        "is_voice": True
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["is_voice"] is True
    assert "vermicompost" in data["reply"].lower() or "earthworm" in data["reply"].lower()
    assert data["assistant_name"] == "KRITI AI"

def test_kriti_ai_government_schemes(client):
    response = client.post("/api/ai/chat", json={
        "message": "What government schemes and subsidies exist for crop residue machinery?",
        "language": "en"
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "crm" in data["reply"].lower() or "subsidy" in data["reply"].lower() or "scheme" in data["reply"].lower()

def test_kriti_ai_suggested_prompts(client):
    response = client.get("/api/ai/suggested-prompts")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "prompts_en" in data
    assert "prompts_hi" in data
    assert len(data["prompts_en"]) >= 5

def test_admin_stats(client):
    login_res = client.post("/api/auth/login", json={
        "email": "admin@kisanconnect.com",
        "password": "Admin@123"
    })
    token = json.loads(login_res.data)["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/admin/stats", headers=headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "metrics" in data
    metrics = data["metrics"]
    assert metrics["total_farmers"] >= 1
    assert metrics["total_partners"] >= 1
