import requests
import json
import sys

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "http://127.0.0.1:5000/api/ai"

test_cases = [
    {
        "id": "Q1_EN_PADDY_STRAW",
        "name": "Paddy Straw Management (English)",
        "payload": {
            "message": "How can I manage paddy straw without burning it?",
            "session_id": "test_session_1",
            "language": "en"
        }
    },
    {
        "id": "Q2_HI_WHEAT_STRAW",
        "name": "Wheat Straw & Turi (Hindi)",
        "payload": {
            "message": "गेहूं की तूड़ी (भूसा) का सही मूल्य और उपयोग क्या है?",
            "session_id": "test_session_2",
            "language": "hi"
        }
    },
    {
        "id": "Q3_HINGLISH_RICE_HUSK",
        "name": "Rice Husk Commercial Buyers (Hinglish)",
        "payload": {
            "message": "Rice husk kahan sell kar sakte hain aur kaunsi industries khareedti hain?",
            "session_id": "test_session_3",
            "language": "en"
        }
    },
    {
        "id": "Q4_EN_VERMICOMPOST",
        "name": "Compost & Vermicomposting (English)",
        "payload": {
            "message": "How do I start vermicomposting using farm organic waste?",
            "session_id": "test_session_4",
            "language": "en"
        }
    },
    {
        "id": "Q5_HI_BIOCNG",
        "name": "Biomass Pellets & Bio-CNG (Hindi)",
        "payload": {
            "message": "गोबर और पराली से बायो-सीएनजी और बायोमास पेलेट्स कैसे बनते हैं?",
            "session_id": "test_session_5",
            "language": "hi"
        }
    },
    {
        "id": "Q6_EN_AGRI_PLASTIC",
        "name": "Agricultural Plastic Recycling (English)",
        "payload": {
            "message": "How should I recycle damaged drip irrigation laterals and plastic mulch films?",
            "session_id": "test_session_6",
            "language": "en"
        }
    },
    {
        "id": "Q7_HINGLISH_SCHEMES",
        "name": "Government Subsidies & CRM (Hinglish)",
        "payload": {
            "message": "Crop Residue Management scheme mein baler aur happy seeder par kitni subsidy milti hai?",
            "session_id": "test_session_7",
            "language": "en"
        }
    },
    {
        "id": "Q8_EN_PLATFORM_SELL",
        "name": "Selling Waste on Kisan Connect (English)",
        "payload": {
            "message": "How do I list and sell agricultural waste on Kisan Connect?",
            "session_id": "test_session_8",
            "language": "en"
        }
    },
    {
        "id": "Q9_FOLLOWUP_EARNINGS",
        "name": "Multi-turn Follow-up: Earnings (Contextual Memory)",
        "payload": {
            "message": "How much income can I earn from this per acre?",
            "session_id": "test_session_8",
            "language": "en",
            "history": [
                {"role": "user", "content": "How do I list and sell agricultural waste on Kisan Connect?"},
                {"role": "assistant", "content": "You can list paddy straw and crop residue on Kisan Connect for buyers to purchase directly."}
            ]
        }
    },
    {
        "id": "Q10_FOLLOWUP_PUNJAB",
        "name": "Multi-turn Follow-up: Geographic Context (Punjab)",
        "payload": {
            "message": "What about in Punjab specifically?",
            "session_id": "test_session_8",
            "language": "en",
            "history": [
                {"role": "user", "content": "How do I list and sell agricultural waste on Kisan Connect?"},
                {"role": "assistant", "content": "You can list paddy straw on Kisan Connect."},
                {"role": "user", "content": "How much income can I earn from this per acre?"},
                {"role": "assistant", "content": "Farmers earn ₹1,500 to ₹3,500 per acre from baled paddy straw."}
            ]
        }
    },
    {
        "id": "Q11_SWITCH_HINDI",
        "name": "Multi-turn Language Switch: Explain in Hindi",
        "payload": {
            "message": "Ise Hindi mein samjhao",
            "session_id": "test_session_8",
            "language": "hi",
            "history": [
                {"role": "user", "content": "What about in Punjab specifically?"},
                {"role": "assistant", "content": "In Punjab, paddy straw can be baled and supplied to bio-CNG plants and boilers."}
            ]
        }
    }
]

print("=" * 70)
print("TESTING KRITI AI CHATBOT WITH GOOGLE GEMINI / DOMAIN ENGINE INTEGRATION")
print("=" * 70)

all_passed = True
for idx, tc in enumerate(test_cases, 1):
    print(f"\n[{idx}/11] Testing: {tc['name']}...")
    try:
        res = requests.post(f"{BASE_URL}/chat", json=tc["payload"], timeout=15)
        if res.status_code != 200:
            print(f"  FAIL: HTTP status {res.status_code}: {res.text}")
            all_passed = False
            continue

        data = res.json()
        reply = data.get("reply", "")
        model = data.get("model", "unknown")
        actions = data.get("actions", [])
        msg_id = data.get("message_id")

        if not reply or len(reply.strip()) < 20:
            print(f"  FAIL: Empty or too short reply ({len(reply)} chars)")
            all_passed = False
            continue

        print(f"  PASS: Model: {model} | MsgID: {msg_id} | Actions: {len(actions)}")
        print(f"  Snippet: {reply[:120].strip()}...")

    except Exception as e:
        print(f"  ERROR: {e}")
        all_passed = False

# Test Star Rating Endpoint
print("\n[12/12] Testing Message Star Rating...")
try:
    res = requests.post(f"{BASE_URL}/rate", json={"message_id": 1, "rating": 5, "feedback": "Super helpful!"}, timeout=5)
    if res.status_code == 200:
        print("  PASS: Star rating submitted successfully.")
    else:
        print(f"  FAIL: Rating endpoint returned {res.status_code}: {res.text}")
        all_passed = False
except Exception as e:
    print(f"  ERROR: {e}")
    all_passed = False

# Test Clear History Endpoint
print("\n[13/13] Testing Clear Chat History ('New Chat')...")
try:
    res = requests.post(f"{BASE_URL}/clear?session_id=test_session_8", timeout=5)
    if res.status_code == 200:
        print("  PASS: Chat history cleared successfully.")
    else:
        print(f"  FAIL: Clear endpoint returned {res.status_code}: {res.text}")
        all_passed = False
except Exception as e:
    print(f"  ERROR: {e}")
    all_passed = False

print("\n" + "=" * 70)
if all_passed:
    print("ALL 13 TEST CASES PASSED SUCCESSFULLY!")
else:
    print("SOME TEST CASES FAILED!")
print("=" * 70)
sys.exit(0 if all_passed else 1)
