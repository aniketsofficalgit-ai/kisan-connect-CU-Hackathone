import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_six_mandatory_questions(client):
    questions = [
        ("What is stubble burning?", ["stubble", "parali", "fire", "smoke", "combine"]),
        ("How can I convert paddy straw into compost?", ["compost", "paddy", "straw", "moisture", "c:n"]),
        ("How can I earn money by selling agricultural waste?", ["earn", "money", "income", "kisan connect", "₹"]),
        ("What is an FPO?", ["fpo", "farmer producer", "organization", "shares", "aggregation"]),
        ("Which industries purchase rice husk?", ["rice husk", "boiler", "silica", "briquet", "industr"]),
        ("How can I recycle agricultural plastic?", ["plastic", "drip", "mulch", "recycle", "granul"])
    ]

    replies = []
    for q, expected_keywords in questions:
        res = client.post("/api/ai/chat", json={"message": q, "session_id": "test_mandatory_6"})
        assert res.status_code == 200
        data = res.get_json()
        assert data["assistant_name"] == "KRITI AI"
        reply = data["reply"]
        assert len(reply) > 80
        replies.append(reply)

        # Check domain relevance
        found = any(kw.lower() in reply.lower() for kw in expected_keywords)
        assert found, f"Question '{q}' reply did not contain expected domain keywords: {reply[:100]}"

    # Verify all 6 replies are unique and distinct
    assert len(set(replies)) == 6, "Expected 6 distinct replies for 6 different questions"

def test_follow_up_context(client):
    session = "test_multi_turn_session"
    # First turn
    res1 = client.post("/api/ai/chat", json={
        "message": "How can I earn money by selling agricultural waste?",
        "session_id": session
    })
    assert res1.status_code == 200

    # Follow-up turn
    res2 = client.post("/api/ai/chat", json={
        "message": "How much will I earn?",
        "session_id": session,
        "history": [{"role": "user", "content": "How can I earn money by selling agricultural waste?"}]
    })
    assert res2.status_code == 200
    data2 = res2.get_json()
    assert "₹" in data2["reply"] or "rupee" in data2["reply"].lower() or "price" in data2["reply"].lower() or "earn" in data2["reply"].lower()

def test_star_ratings_endpoint(client):
    res = client.post("/api/ai/rate", json={
        "message_id": "test-msg-123",
        "rating": 5,
        "feedback": "Very accurate composting steps!"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["rating"] == 5

def test_clear_chat_endpoint(client):
    res = client.post("/api/ai/clear?session_id=test_clear_session")
    assert res.status_code == 200
    data = res.get_json()
    assert data["assistant"] == "KRITI AI"
