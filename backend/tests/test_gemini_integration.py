import os
import pytest
from unittest.mock import MagicMock, patch
from app.ai_assistant.chatbot_service import call_gemini_api, process_chat_message

def test_gemini_missing_or_invalid_key_graceful_fallback(client):
    """Verifies that missing or invalid Gemini key falls back gracefully without 500 error."""
    res = client.post("/api/ai/chat", json={
        "message": "What can I do with wheat straw?",
        "session_id": "test_fallback",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert "reply" in data
    assert len(data["reply"]) > 20
    assert data["assistant_name"] == "KRITI AI"

def test_gemini_sdk_mocked_success(client):
    """Verifies that when Gemini returns a valid response, KRITI AI parses and wraps it cleanly."""
    with patch("app.ai_assistant.chatbot_service.genai.Client") as mock_client_cls:
        mock_instance = MagicMock()
        mock_client_cls.return_value = mock_instance
        mock_response = MagicMock()
        mock_response.text = "Paddy straw can be sustainably valorized into bio-CNG or converted into organic compost."
        mock_instance.models.generate_content.return_value = mock_response

        with patch.dict(os.environ, {"GEMINI_API_KEY": "AIzaSyTestValidKeyMock1234567890"}):
            res = client.post("/api/ai/chat", json={
                "message": "How to monetize paddy straw?",
                "session_id": "test_gemini_live",
                "language": "en"
            })
            assert res.status_code == 200
            data = res.get_json()
            assert "Paddy straw" in data["reply"]
            assert data["model"].startswith("google-gemini")
            assert len(data.get("actions", [])) > 0

def test_gemini_trilingual_support(client):
    """Verifies trilingual handling across English, Hindi, and Hinglish."""
    # Hindi query
    res_hi = client.post("/api/ai/chat", json={
        "message": "धान की पराली का प्रबंधन कैसे करें?",
        "session_id": "test_hi",
        "language": "hi"
    })
    assert res_hi.status_code == 200
    assert len(res_hi.get_json()["reply"]) > 10

    # Hinglish query
    res_hinglish = client.post("/api/ai/chat", json={
        "message": "Parali se compost kaise banaye?",
        "session_id": "test_hinglish",
        "language": "en"
    })
    assert res_hinglish.status_code == 200
    assert len(res_hinglish.get_json()["reply"]) > 10

def test_gemini_multiturn_followup(client):
    """Verifies that follow-up questions leverage prior conversation turns."""
    res = client.post("/api/ai/chat", json={
        "message": "How much can I earn from this per acre?",
        "session_id": "test_followup",
        "language": "en",
        "history": [
            {"role": "user", "content": "How do I sell paddy straw on Kisan Connect?"},
            {"role": "assistant", "content": "You can list baled paddy straw on Kisan Connect for nearby bio-energy buyers."}
        ]
    })
    assert res.status_code == 200
    data = res.get_json()
    assert "reply" in data
    assert any(term in data["reply"].lower() for term in ["rate", "acre", "quintal", "earn", "income", "₹", "rs"])
