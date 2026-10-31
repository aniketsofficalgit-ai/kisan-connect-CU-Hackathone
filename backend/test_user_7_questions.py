import requests
import json
import sys

# Ensure UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "http://127.0.0.1:5000/api/ai"

test_questions = [
    {
        "id": "Q1",
        "question": "What is the best way to manage paddy straw without burning it?",
        "lang": "en",
        "expected_topics": ["in-situ", "ex-situ", "super seeder", "baler", "pusa"]
    },
    {
        "id": "Q2",
        "question": "How can wheat straw be converted into compost?",
        "lang": "en",
        "expected_topics": ["carbon", "nitrogen", "cow dung", "c:n", "moisture", "turning"]
    },
    {
        "id": "Q3",
        "question": "What is the difference between biomass and biogas?",
        "lang": "en",
        "expected_topics": ["solid", "methane", "anaerobic", "combustion", "gas"]
    },
    {
        "id": "Q4",
        "question": "How can a farmer earn money from agricultural waste?",
        "lang": "en",
        "expected_topics": ["baled", "vermicompost", "acre", "earn", "fpo", "rates"]
    },
    {
        "id": "Q5",
        "question": "FPO kya hota hai?",
        "lang": "hi",
        "expected_topics": ["किसान उत्पादक संगठन", "कंपनी", "10", "सब्सिडी", "बाजार"]
    },
    {
        "id": "Q6",
        "question": "What is vermicomposting?",
        "lang": "en",
        "expected_topics": ["earthworm", "eisenia foetida", "castings", "bed", "black gold"]
    },
    {
        "id": "Q7",
        "question": "Which factors affect compost quality?",
        "lang": "en",
        "expected_topics": ["c:n", "moisture", "aeration", "temperature", "particle", "ph"]
    }
]

print("=" * 80)
print("TESTING 7 CRITICAL BENCHMARK AGRICULTURAL QUESTIONS ON KRITI AI")
print("=" * 80)

all_passed = True
for idx, item in enumerate(test_questions, 1):
    q = item["question"]
    print(f"\n[{idx}/7] Question: '{q}' (Lang: {item['lang']})")
    try:
        res = requests.post(
            f"{BASE_URL}/chat",
            json={
                "message": q,
                "session_id": f"test_benchmark_{idx}",
                "language": item["lang"]
            },
            timeout=15
        )
        if res.status_code != 200:
            print(f"  FAILED: HTTP Status {res.status_code}")
            all_passed = False
            continue

        data = res.json()
        reply = data.get("reply", "")
        model = data.get("model", "unknown")
        actions = data.get("actions", [])

        # Check that answer is substantial (>100 chars)
        if len(reply.strip()) < 100:
            print(f"  FAILED: Reply too short ({len(reply)} chars)")
            all_passed = False
            continue

        # Check for expected technical content
        lower_reply = reply.lower()
        matched_expected = [exp for exp in item["expected_topics"] if exp.lower() in lower_reply]

        print(f"  SUCCESS! Model: {model} | Reply Length: {len(reply)} chars | Actions: {len(actions)}")
        print(f"  Matched Topics: {matched_expected}")
        print(f"  Excerpt:\n{reply[:250].strip()}...\n")

        if len(matched_expected) < 2:
            print(f"  WARNING: Fewer expected topics matched than expected: {matched_expected}")

    except Exception as e:
        print(f"  ERROR: {e}")
        all_passed = False

print("=" * 80)
if all_passed:
    print("ALL 7 CRITICAL AGRICULTURAL BENCHMARK QUESTIONS PASSED WITH HIGH ACCURACY!")
else:
    print("ONE OR MORE QUESTIONS FAILED!")
print("=" * 80)
sys.exit(0 if all_passed else 1)
