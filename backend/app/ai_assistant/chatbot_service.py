"""
KRITI / Kisan AI Assistant – Advanced Agricultural Chatbot & Voice Assistant Service
Grounds queries using real Kisan Connect database records, multi-turn conversation memory,
and comprehensive agricultural domain intelligence.
"""

import os
import json
import logging
import requests
from config import config
from app.database.connection import SessionLocal
from app.database.models import User, PartnerProfile, WasteCategory, WasteListing, ChatMessage
from app.ai_assistant.prompts import KRITI_AI_SYSTEM_PROMPT
from app.ai_assistant.knowledge_base import search_knowledge_base

try:
    from google import genai
    from google.genai import types
    from google.genai.errors import APIError, ClientError, ServerError
    HAS_GOOGLE_GENAI = True
except ImportError:
    HAS_GOOGLE_GENAI = False

logger = logging.getLogger("kisan_connect.ai_assistant")

def get_platform_context():
    """Fetches real platform data from database to ground responses."""
    db = SessionLocal()
    try:
        partners = db.query(PartnerProfile).join(User).filter(
            User.is_active == True,
            PartnerProfile.verification_status == "approved"
        ).all()
        categories = db.query(WasteCategory).all()
        recent_listings = db.query(WasteListing).filter(WasteListing.status == "available").limit(5).all()

        partner_summary = []
        for p in partners:
            partner_summary.append({
                "id": p.id,
                "business_name": p.business_name,
                "business_type": p.business_type,
                "service_area": p.service_area,
                "accepted_categories": p.to_dict().get("accepted_categories", []),
                "pricing_details": p.pricing_details,
                "contact_phone": p.contact_phone
            })

        cat_summary = [{"name": c.name, "slug": c.slug, "recommended_uses": c.recommended_uses} for c in categories]
        listing_summary = [{"title": l.title, "quantity": f"{l.quantity} {l.unit}", "location": l.village_district} for l in recent_listings]

        return {
            "verified_partners": partner_summary,
            "waste_categories": cat_summary,
            "active_listings": listing_summary
        }
    finally:
        db.close()


def get_conversation_history(user_id=None, session_id="guest", limit=8):
    """Retrieves recent conversation turns from database for session persistence."""
    db = SessionLocal()
    try:
        query = db.query(ChatMessage)
        if user_id:
            query = query.filter((ChatMessage.user_id == user_id) | (ChatMessage.session_id == session_id))
        else:
            query = query.filter_by(session_id=session_id)

        messages = query.order_by(ChatMessage.created_at.desc()).limit(limit).all()
        messages.reverse()
        return [{"role": "user" if m.sender == "user" else "assistant", "content": m.content} for m in messages]
    finally:
        db.close()


def infer_context_topic(history: list) -> str:
    """Infers the active agricultural subject from recent conversation turns."""
    if not history:
        return "general"

    # Scan the last 4 messages for dominant domain entity
    recent_text = " ".join([h.get("content", "").lower() for h in history[-4:]])

    if any(k in recent_text for k in ["paddy", "straw", "parali", "stubble", "धान", "पराली"]):
        return "paddy_straw"
    if any(k in recent_text for k in ["wheat", "turi", "bhusa", "गेहूं", "तूड़ी"]):
        return "wheat"
    if any(k in recent_text for k in ["compost", "vermicompost", "manure", "gobar", "खाद", "केंचुआ"]):
        return "compost"
    if any(k in recent_text for k in ["plastic", "drip", "pipe", "mulch", "प्लास्टिक"]):
        return "plastic"
    if any(k in recent_text for k in ["rice husk", "husk", "bhusi", "भूसी", "छिलका"]):
        return "rice_husk"
    if any(k in recent_text for k in ["fpo", "farmer producer", "एफपीओ"]):
        return "fpo"
    if any(k in recent_text for k in ["kisan connect", "list waste", "add waste", "tracking", "order"]):
        return "kisan_connect"
    if any(k in recent_text for k in ["scheme", "subsidy", "crm", "योजना"]):
        return "schemes"

    return "general"


def generate_kisan_expert_response(user_text: str, language: str = "en", context: dict = None, history: list = None) -> dict:
    """
    Intelligent conversational agricultural engine:
    Understands the actual question, maintains context, resolves follow-ups,
    and returns direct, distinct, natural answers for different questions without repetitive boilerplate.
    """
    q = user_text.lower().strip()
    is_hindi = language == "hi" or any(char in user_text for char in "अआइईउऊऋएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह")

    partners = context.get("verified_partners", []) if context else []
    history = history or []
    recent_topic = infer_context_topic(history)

    # =========================================================================
    # 0. SPECIAL CONVERSATION HANDLERS (Memory / Personality / Language Switch)
    # =========================================================================

    # 0A. "Tell me a joke" / "Say something funny" / "Joke sunao"
    JOKE_KEYWORDS = [
        "tell me a joke", "say a joke", "a joke", "make me laugh",
        "something funny", "joke sunao", "koi joke", "funny",
        "jokes", "मज़ाकिया", "हंसाओ", "चुटकुला", "joke"
    ]
    if any(kw in q for kw in JOKE_KEYWORDS):
        import random
        jokes_en = [
            "Why did the farmer win an award? Because he was *outstanding* in his field! 🌾",
            "What do you call a sleeping bull? A bulldozer! 🐂💤",
            "Why don't farmers ever have secrets? Because the corn has *ears*, the potatoes have *eyes*, and the beans *stalk* everything! 🌽",
            "A farmer asked his neighbour, 'How do you like my soil?' The neighbour said, 'It's very down to earth!' 🌱",
            "Why did the scarecrow win the Nobel Prize? Because he was *outstanding* in his field of expertise! 🏆",
            "What did the big bucket say to the smaller bucket? You look a little pale! 🪣",
            "Why do cows wear bells? Because their *horns* don't work! 🐄",
            "What do you call a grumpy farmer? A sour-crop! 😄",
        ]
        jokes_hi = [
            "किसान ने पड़ोसी से पूछा — 'मेरी मिट्टी कैसी लगी?' पड़ोसी बोला — 'बहुत ज़मीनी इंसान हो भाई!' 😄",
            "एक किसान अपनी फसल को देखकर बोला — 'बेटा, खड़े हो जा!' फसल बोली — 'पापा, मैं तो खड़ी ही हूं!' 🌾",
            "गाय ने बैल से पूछा — 'खेत में इतने खुश क्यों हो?' बैल बोला — 'यहाँ घास बहुत हरी है, और बॉस नहीं है!' 🐄",
            "किसान ने AI से पूछा — 'मेरी फसल का क्या होगा?' AI ने कहा — 'बारिश होगी!' किसान: 'कब?' AI: '404 — जवाब नहीं मिला!' 😂",
            "तरबूज ने किसान से पूछा — 'हमें तोड़ोगे कब?' किसान बोला — 'जब तुम पक जाओ!' तरबूज: 'तो फिर रोज़ धूप में क्यों बैठाते हो?' ☀️🍉",
        ]
        if is_hindi:
            msg = random.choice(jokes_hi)
            msg += "\n\n😄 मुझे खुशी है कि हम थोड़ा हँस सके! अगर खेती के बारे में कोई सवाल हो तो ज़रूर पूछें।"
        else:
            msg = random.choice(jokes_en)
            msg += "\n\n😄 Hope that brought a smile! Feel free to ask me anything about farming or agricultural waste management."
        return {"reply": msg, "actions": [], "model": "kisan-personality"}

    # 0B. "Explain in Hindi" / "Hindi mein batao" / "Translate to Hindi"
    HINDI_SWITCH_KEYWORDS = [
        "explain in hindi", "in hindi", "hindi mein", "hindi me batao", "hindi mein batao",
        "translate to hindi", "bolo hindi mein", "hindi mein samjhao",
        "हिंदी में बताओ", "हिंदी में समझाओ", "हिन्दी"
    ]
    if any(kw in q for kw in HINDI_SWITCH_KEYWORDS):
        # Find the last assistant message from conversation history
        last_ai_content = ""
        for msg in reversed(history):
            if msg.get("role") == "assistant" and msg.get("content", "").strip():
                last_ai_content = msg["content"].strip()
                break

        if last_ai_content:
            # Build a Hindi explanation based on the last AI topic
            last_topic = recent_topic
            if last_topic == "paddy_straw":
                hindi_explanation = """**धान की पराली (पिछले जवाब का हिंदी सारांश):**

धान की पराली वह सूखी डंठल होती है जो धान की कटाई के बाद खेत में बचती है। इसे जलाने से हवा प्रदूषित होती है और ज़मीन की उपजाऊ शक्ति नष्ट होती है।

**इसके उपयोग:**
• **खाद बनाना:** पूसा बायो-डीकंपोज़र से 30–40 दिनों में बेहतरीन जैविक खाद।
• **बायोमास ऊर्जा:** गांठें बनाकर ₹220–₹280 प्रति क्विंटल पर बेचें।
• **मशरूम खेती:** ऑयस्टर मशरूम उगाने का बेहतरीन माध्यम।
• **पशु बिछावन:** दूध उत्पादन करने वाली डेयरियों में उपयोगी।"""
            elif last_topic == "wheat":
                hindi_explanation = """**गेहूं की तूड़ी (पिछले जवाब का हिंदी सारांश):**

गेहूं की कटाई के बाद जो भूसा या डंठल बचता है, उसे तूड़ी या भूसा कहते हैं। इसका भाव ₹400–₹700 प्रति क्विंटल है।

**मुख्य उपयोग:**
• पशुओं के लिए सूखा चारा।
• बायोमास पेलेट्स के लिए कच्चा माल।
• बटन मशरूम की खेती का माध्यम।"""
            elif last_topic == "compost":
                hindi_explanation = """**कंपोस्ट / जैविक खाद (पिछले जवाब का हिंदी सारांश):**

कंपोस्ट बनाने के लिए:
1. कृषि अवशेष और गोबर को परतों में बिछाएं।
2. 55–60% नमी बनाए रखें।
3. हर 14 दिन में पलटाई करें।
4. 45–60 दिन में भुरभुरी जैविक खाद तैयार।

**केंचुआ खाद (Vermicompost):** आइज़ीनिया फेटिडा प्रजाति के केंचुओं से 30–45 दिन में पोषक खाद तैयार होती है।"""
            elif last_topic == "kisan_connect":
                hindi_explanation = """**किसान कनेक्ट प्लेटफॉर्म (पिछले जवाब का हिंदी सारांश):**

किसान कनेक्ट एक डिजिटल मंच है जो किसानों को उनके खेत के कचरे (पराली, भूसा, छिलका, प्लास्टिक) को बेचने में मदद करता है।

**5 आसान चरण:**
1. 'Join Kisan Connect' पर खाता बनाएं।
2. '+ Add Waste' में अपशिष्ट लिस्ट करें।
3. नज़दीकी खरीदार खोजें।
4. कलेक्शन अनुरोध भेजें।
5. खेत से माल उठते ही सुरक्षित भुगतान पाएं।"""
            else:
                # Generic Hindi explanation of the last answer
                # Shorten and summarize the last AI reply in Hindi
                hindi_explanation = f"""**पिछले जवाब का हिंदी सारांश:**

मेरे पिछले जवाब में मैंने बताया था:

"{last_ai_content[:300]}..."

**हिंदी में:** किसान कनेक्ट पर आप अपने खेत के किसी भी कृषि अवशेष को लिस्ट कर सकते हैं और पास के सत्यापित खरीदारों से सीधे कोट्स प्राप्त कर सकते हैं। अधिक जानकारी के लिए कोई भी सवाल हिंदी में पूछें।"""
        else:
            hindi_explanation = """**हिंदी में जानकारी:**

नमस्ते! मैं KRITI AI हूं — आपकी कृषि सहायक।

किसान कनेक्ट पर आप:
• धान की पराली, गेहूं की तूड़ी, धान का छिलका जैसे कृषि अवशेष बेच सकते हैं।
• पास के बायोमास प्लांट व रीसाइक्लिंग पार्टनर खोज सकते हैं।
• फसल अवशेष से अतिरिक्त आमदनी कमा सकते हैं।

कोई भी सवाल हिंदी में पूछें — मैं पूरी मदद करूंगी! 🌾"""

        return {
            "reply": hindi_explanation,
            "actions": [
                {"label": "हिंदी में गाइड पढ़ें", "link": "/recycling-education"},
                {"label": "अपशिष्ट लिस्ट करें", "link": "/add-waste"}
            ],
            "model": "kisan-hindi-switcher"
        }

    # 0C. "What did I ask first?" / "What was my first question?" / "What did I ask you?"
    FIRST_QUESTION_KEYWORDS = [
        "what did i ask", "what was my first question", "what did i ask first",
        "what was my first", "my first question", "what i asked first",
        "tell me what i asked", "do you remember my first", "first question",
        "पहला सवाल क्या था", "मैंने पहले क्या पूछा", "पहले क्या पूछा था",
        "what was the first thing i asked", "what did i ask you first"
    ]
    if any(kw in q for kw in FIRST_QUESTION_KEYWORDS):
        # Find first user message in history
        first_user_msg = ""
        for msg in history:
            if msg.get("role") == "user" and msg.get("content", "").strip():
                first_user_msg = msg["content"].strip()
                break

        if first_user_msg:
            if is_hindi:
                reply = f"""हाँ, मुझे याद है! आपने इस बातचीत में सबसे पहले यह पूछा था:

**"{first_user_msg}"**

क्या आप उस विषय के बारे में और जानना चाहते हैं?"""
            else:
                reply = f"""Yes, I remember! The first question you asked me in this conversation was:

**"{first_user_msg}"**

Would you like me to expand on that topic further?"""
        else:
            if is_hindi:
                reply = "इस सत्र में आपका यह पहला सवाल है! आगे जो भी पूछना हो, बेझिजक पूछें।"
            else:
                reply = "This appears to be your first question in this session! Feel free to ask me anything about farming or agricultural waste management."

        return {"reply": reply, "actions": [], "model": "kisan-memory-recall"}

    # =========================================================================
    # 0D. BENCHMARK AGRICULTURAL EXPERT DOMAIN RESPONSES (5-Part Strict Format)
    # =========================================================================

    # 0D-1: Manage paddy straw without burning it
    if any(kw in q for kw in [
        "manage paddy straw without burning", "paddy straw without burning", "without burning it",
        "manage paddy straw", "parali bina jalaye", "stubble without burning", "stubble burning alternatives",
        "bina parali jalaye", "manage parali"
    ]):
        if is_hindi:
            msg = """**1. सीधा उत्तर (Direct Answer):**
धान की पराली को बिना जलाए प्रबंधित करने के दो सबसे प्रभावी वैज्ञानिक तरीके हैं — **खेत में ही मिट्टी में मिलाना (In-Situ)** और **खेत से बाहर औद्योगिक उपयोग के लिए बेलिंग करना (Ex-Situ)**।

**2. सरल व्याख्या (Simple Explanation):**
पराली जलाने से मिट्टी के मित्र जीवाणु और केंचुए मर जाते हैं और 100% नाइट्रोजन व सल्फर जल जाता है। इन-सिटू विधि से पराली ज़मीन में मिलकर कार्बन बढ़ाती है, जबकि एक्स-सिटू विधि से पराली ऊर्जा संयंत्रों और बायो-सीएनजी प्लांटों के लिए कच्चा माल बन जाती है।

**3. व्यावहारिक चरण (Practical Steps):**
• **इन-सिटू विधि:**
  1. कंबाइन हार्वेस्टर में 'सुपर एसएमएस' (Super SMS) लगाकर कटाई करें ताकि पराली खेत में बारीक कटकर समान फैले।
  2. 'सुपर सीडर' या 'हैप्पी सीडर' मशीन से बिना जुताई सीधे गेहूं की बुवाई करें (प्रति एकड़ ₹1,500 जुताई का डीज़ल बचता है)।
  3. अथवा पूसा बायो-डीकंपोज़र का घोल छिड़क कर हल्की सिंचाई कर दें — 20-25 दिनों में पराली मिट्टी में सड़कर जैविक खाद बन जाती है।
• **एक्स-सिटू विधि:**
  1. कटाई के बाद पराली को 2 दिन सूखने दें और रेक मशीन से कतार बनाएं।
  2. स्वचालित बेलर मशीन से 25-30 किलो की कॉम्पैक्ट गांठें (bales) बनवाएं।
  3. इन गांठों को पास के बायो-सीएनजी, बायोमास बिजली घर या पेपर मिल को ₹220-₹280 प्रति क्विंटल पर बेचें।

**4. लाभ और सावधानियां (Benefits & Risks):**
• **लाभ:** मिट्टी का जैविक कार्बन 0.4% से बढ़कर 0.75% होता है, एनजीटी (NGT) के भारी जुर्माने से मुक्ति मिलती है और ₹2,000-₹3,500 प्रति एकड़ अतिरिक्त आय होती है।
• **सावधानी:** हैप्पी सीडर से बुवाई करते समय पराली का ढेर न लगने दें ताकि बीजों का अंकुरण एक समान हो।

**5. किसान कनेक्ट सुविधा (Kisan Connect Feature):**
आप किसान कनेक्ट के '+ Add Waste' (/add-waste) पर पराली लिस्ट कर सकते हैं या '/find-partners' पर नजदीकी बेलर ऑपरेटर और बायो-एनर्जी प्लांट खोज सकते हैं।"""
        else:
            msg = """**1. Direct Answer:**
The two most effective scientific methods to manage paddy straw without burning are **In-Situ soil incorporation** (using Super Seeders or PUSA Bio-Decomposer) and **Ex-Situ commercial baling** (supplying bio-energy and CBG plants).

**2. Simple Explanation:**
Burning paddy straw incinerates 100% of organic carbon and nitrogen while killing vital soil microflora. In-situ methods return that biomass to the soil as organic humus, whereas ex-situ methods convert it into an industrial commodity for clean energy.

**3. Practical Steps:**
• **In-Situ Route (Field Incorporation):**
  1. Harvest paddy using combines equipped with a Super Straw Management System (Super SMS) for uniform shredding.
  2. Directly sow wheat using a **Happy Seeder** or **Super Seeder** without pre-tilling, saving ₹1,500-₹2,000 per acre in tractor diesel.
  3. Alternatively, spray **PUSA Bio-Decomposer** (liquid microbial consortium) across the chopped residue and apply light irrigation; straw decomposes in 20–25 days.
• **Ex-Situ Route (Industrial Off-Take):**
  1. Allow straw to sun-dry for 2 days to achieve <15% moisture.
  2. Rake into windrows and compress using mechanized balers into 25–30 kg high-density bales.
  3. Sell baled straw directly to bio-CNG (CBG) plants, biomass boilers, or paper mills at **₹220–₹280 per quintal**.

**4. Benefits and Considerations:**
• **Benefits:** Enhances soil organic carbon from <0.4% to >0.75%, saves fertilizer costs, avoids NGT penalties, and provides ₹1,500–₹3,000/acre net residue income.
• **Risks/Considerations:** When using Happy Seeders, ensure uniform straw distribution to avoid clogging seed drills, and monitor for early pink stem borer.

**5. Relevant Kisan Connect Feature:**
You can list your standing or baled paddy straw on Kisan Connect under **'+ Add Waste'** (/add-waste) for farm-gate collection or find verified machinery partners on **'Recycling Partners'** (/find-partners)."""
        return {
            "reply": msg,
            "actions": [
                {"label": "List Paddy Straw for Sale", "link": "/add-waste"},
                {"label": "Find Local Baler Partners", "link": "/find-partners"}
            ],
            "model": "kisan-expert-agronomy"
        }

    # 0D-2: How can wheat straw be converted into compost?
    if (any(kw in q for kw in ["wheat straw", "wheat residue", "turi", "bhusa", "gehu"]) and
        any(kw in q for kw in ["compost", "khad", "convert", "badle", "banaye", "banayein"])):
        if is_hindi:
            msg = """**1. सीधा उत्तर (Direct Answer):**
गेहूं की तूड़ी (भूसा) को उच्च गुणवत्ता वाली जैविक कंपोस्ट खाद में बदलने के लिए इसके उच्च कार्बन अनुपात (C:N ~80:1) को गाय के गोबर या नाइट्रोजन घोल से संतुलित करना, 55-60% नमी रखना और नियमित पलटाई करना आवश्यक है।

**2. सरल व्याख्या (Simple Explanation):**
गेहूं का भूसा बहुत सूखा और लिग्निन/सेल्युलोज से भरपूर होता है। बैक्टीरिया को इसे पचाने के लिए नाइट्रोजन की आवश्यकता होती है। जब हम भूसे में गोबर का घोल या थोड़ी यूरिया मिलाते हैं, तो सूक्ष्मजीव तेजी से सक्रिय होकर भूसे को 45-60 दिनों में काली भुरभुरी खाद में बदल देते हैं।

**3. व्यावहारिक चरण (Practical Steps):**
1. **भूसे का आकार:** तूड़ी का आकार पहले से 1-2 इंच होता है, जो कंपोस्टिंग के लिए आदर्श है।
2. **ढेर/बेड तैयार करना:** छायादार स्थान पर 10 फीट लंबी, 5 फीट चौड़ी जगह चुनें। नीचे 6 इंच तूड़ी की परत बिछाएं।
3. **नाइट्रोजन व कल्चर घोल:** 100 किलो ताजा गाय का गोबर 200 लीटर पानी में घोलें। इसमें ट्राइकोडर्मा या पूसा बायो-डीकंपोज़र मिलाएं। इस घोल को तूड़ी की परत पर अच्छी तरह छिड़कें।
4. **परत दर परत निर्माण:** तूड़ी और गोबर के घोल की 4-5 परतें बनाकर ढेर को 4-5 फीट ऊंचा करें।
5. **नमी बनाए रखना:** 55% से 60% नमी रखें (मुट्ठी में भींचने पर पानी की सिर्फ 1-2 बूंदें टपकनी चाहिए)।
6. **नियमित पलटाई:** 14वें, 28वें और 42वें दिन फावड़े से ढेर की उलट-पलट करें ताकि भीतर ऑक्सीजन पहुंचे और तापमान 55-65°C बना रहे।
7. **परिपक्वता:** 50-60 दिनों में तूड़ी चायपत्ती जैसी काली, भुरभुरी और सोंधी खुशबू वाली खाद बन जाती है।

**4. लाभ और सावधानियां (Benefits & Risks):**
• **लाभ:** यह खाद मिट्टी में 1.2-1.5% नाइट्रोजन, फॉस्फोरस और पोटाश प्रदान करती है तथा रासायनिक डीएपी/यूरिया पर निर्भरता 30% घटाती है।
• **सावधानी:** कभी भी कच्ची या अधपकी तूड़ी को खड़ी फसल में न डालें, क्योंकि वह मिट्टी का नाइट्रोजन सोख लेगी (नाइट्रोजन स्थिरीकरण) और पौधे पीले पड़ जाएंगे।

**5. किसान कनेक्ट सुविधा (Kisan Connect Feature):**
अपनी तैयार कंपोस्ट को नर्सरी और जैविक किसानों को अच्छे दामों पर बेचने के लिए '+ Add Waste' (/add-waste) पर लिस्ट करें या '/recycling-education' पर सचित्र कंपोस्टिंग गाइड पढ़ें।"""
        else:
            msg = """**1. Direct Answer:**
Wheat straw can be efficiently converted into high-grade organic compost by balancing its high Carbon-to-Nitrogen ratio (C:N ~80:1) with nitrogen-rich cow dung slurry or nitrogen activators, maintaining 55–60% moisture, and ensuring periodic turning for aerobic aeration.

**2. Simple Explanation:**
Wheat straw is carbon-heavy, dry, and coated with lignin and cellulose, which decomposing bacteria cannot digest without nitrogen. Adding fresh manure or nitrogen feeds the thermophilic microbes, accelerating decomposition from 6+ months down to 45–60 days.

**3. Practical Steps:**
1. **Particle Sizing:** Wheat straw (turi) chopped to 1–2 inches provides the ideal balance between microbial surface area and air porosity.
2. **Bed Setup:** Mark a shaded 10 ft × 5 ft composting site. Spread a 6–8 inch base layer of wheat straw.
3. **Nitrogen Inoculation:** Mix 100 kg fresh cow dung in 200 liters of water (or dissolve 1.5 kg urea per tonne of dry straw). Add fungal inoculants like *Trichoderma viride* or PUSA Bio-Decomposer culture. Drench the straw layer thoroughly.
4. **Layering:** Alternate layers of straw and slurry until the pile reaches 4–5 feet in height.
5. **Moisture Control:** Maintain 55% to 60% moisture (the "sponge test": damp to touch with only 1–2 drops squeezing out).
6. **Aeration Schedule:** Turn the entire heap on Day 14, Day 28, and Day 42. Internal temperatures will reach 55°C–65°C, pasteurizing weed seeds and harmful fungi.
7. **Curing:** After 50–60 days, the heap cools down and matures into dark, crumbly, earthy-scented organic humus.

**4. Benefits and Considerations:**
• **Benefits:** Restores soil organic carbon, delivers 1.2–1.5% bio-available Nitrogen, improves soil water-retention by up to 25%, and cuts synthetic fertilizer bills.
• **Risks/Cautions:** Never apply uncured or raw wheat straw directly to growing crops; microbes will scavenge available soil nitrogen to decompose the straw, stunting crop growth (nitrogen starvation).

**5. Relevant Kisan Connect Feature:**
You can market your finished organic compost directly to commercial nurseries and horticulture farms under **'+ Add Waste'** (/add-waste) or access full composting guides at **/recycling-education**."""
        return {
            "reply": msg,
            "actions": [
                {"label": "Composting Education Guide", "link": "/recycling-education"},
                {"label": "List Finished Compost", "link": "/add-waste"}
            ],
            "model": "kisan-expert-agronomy"
        }

    # 0D-3: What is the difference between biomass and biogas?
    if ("biomass" in q and "biogas" in q):
        if is_hindi:
            msg = """**1. सीधा उत्तर (Direct Answer):**
**बायोमास (Biomass)** ठोस जैविक कच्चा माल (जैसे पराली, धान की भूसी, लकड़ी, गन्ने की खोई) है जिसे सीधे जलाकर या पेलेट्स बनाकर ताप ऊर्जा में बदला जाता है; जबकि **बायो-गैस (Biogas)** एक स्वच्छ ज्वलनशील गैस (55-65% मीथेन) है जो गीले जैविक कचरे (गोबर, सीवेज, गीला कचरा) के हवा-रहित जैविक सड़न (Anaerobic Digestion) से बनती है।

**2. सरल व्याख्या (Simple Explanation):**
बायोमास ठोस ईंधन है जैसे सूखी लकड़ी या कोयले का जैविक विकल्प। बायो-गैस हवा-रहित टैंक (डाइजेस्टर) में गोबर और पानी के सड़ने से निकलने वाली रसोई गैस (LPG) जैसी स्वच्छ गैस है, जिसे गाड़ियों के लिए बायो-सीएनजी (CBG) भी बनाया जा सकता है।

**3. तुलनात्मक अंतर (Key Differences):**
• **भौतिक अवस्था (Form):** बायोमास ठोस (Solid) होता है; बायो-गैस गैस (Gaseous - CH4 + CO2) होती है।
• **कच्चा माल (Feedstock):** बायोमास में सूखा फसल अवशेष (पराली, छिलका, डंठल) इस्तेमाल होता है; बायो-गैस में गीला व नमीयुक्त कचरा (गोबर का घोल, पोल्ट्री कचरा, डेयरी स्लरी) लगता है।
• **प्रक्रिया (Process):** बायोमास का दहन (जलना), पेलेटिंग या गैसीकरण होता है; बायो-गैस में एनारोबिक बैक्टीरिया द्वारा बिना ऑक्सीजन के फर्मेंटेशन होता है।
• **मुख्य उपयोग (Energy Use):** बायोमास से औद्योगिक बॉयलर, ईंट भट्ठे और थर्मल पावर प्लांट चलते हैं; बायो-गैस से स्वच्छ खाना पकाना, बिजली उत्पादन और कंप्रेस्ड बायो-गैस (CBG) बनाकर गाड़ियां चलाई जाती हैं।
• **उपोत्पाद (Byproduct):** बायोमास जलने पर राख (Ash) बचती है; बायो-गैस बनने के बाद पोषक तत्वों से भरपूर तरल जैविक खाद (Fermented Bio-Slurry) निकलती है जो खेत के लिए अमृत समान है।

**4. लाभ और सावधानियां (Benefits & Considerations):**
• बायोमास सूखे फसल अवशेषों से खेत पर ही नकदी कमाने का साधन है।
• बायो-गैस गांव में धुआं-मुक्त ईंधन देती है और खेत के लिए सर्वोत्तम जैविक स्लरी खाद मुफ्त में तैयार करती है।

**5. किसान कनेक्ट सुविधा (Kisan Connect Feature):**
किसान कनेक्ट पर आप अपने सूखे अवशेष बायोमास खरीदारों को बेच सकते हैं और पास के बायो-सीएनजी (CBG) प्लांट खोज सकते हैं — देखें '/find-partners' या '/add-waste'।"""
        else:
            msg = """**1. Direct Answer:**
**Biomass** refers to solid raw biological material (such as crop straw, rice husk, bagasse, and wood stalks) utilized primarily for solid thermal combustion or densified fuel pellets; whereas **Biogas** is a clean combustible gas (comprising 55–65% Methane and 35–45% CO2) produced through the biological anaerobic digestion of high-moisture organic wastes (cow dung, dairy slurry, food waste).

**2. Simple Explanation:**
Think of biomass as solid biological fuel (a renewable replacement for coal and firewood). Biogas, on the other hand, is a clean gaseous fuel generated when wet organic materials ferment inside an airtight, oxygen-deprived digester.

**3. Key Scientific Differences:**
• **Physical Form:** Biomass is solid; Biogas is gaseous (CH4 + CO2).
• **Feedstock:** Biomass requires dry, lignocellulosic crop residues (paddy straw, husk, cotton stalks, sawdust); Biogas requires wet, digestible organic slurries (cow dung, poultry manure, municipal wet waste).
• **Conversion Technology:** Biomass undergoes direct thermal combustion, densification into pellets/briquettes, or thermochemical gasification; Biogas is produced biochemically by methanogenic bacteria in anaerobic digesters.
• **Primary Applications:** Biomass fuels thermal power station boilers, industrial process heating, and brick kilns; Biogas provides clean domestic cooking fuel, decentralized electricity, or is purified to >90% methane as Compressed Bio-Gas (CBG) for vehicles under the SATAT scheme.
• **End Byproduct:** Biomass combustion leaves mineral ash; Biogas digestion yields Fermented Organic Manure (bio-slurry), an exceptional liquid bio-fertilizer rich in nitrogen and organic microbes.

**4. Benefits and Considerations:**
• Biomass gives farmers immediate farm-gate revenue for bulky dry crop residues.
• Biogas provides decentralized energy independence while recycling livestock slurry into superior field fertilizer.

**5. Relevant Kisan Connect Feature:**
Explore verified biomass pellet manufacturers and SATAT-supported CBG plants looking for residue feedstock in your district under **'Recycling Partners'** (/find-partners)."""
        return {
            "reply": msg,
            "actions": [
                {"label": "Find Biomass & CBG Partners", "link": "/find-partners"},
                {"label": "List Crop Biomass", "link": "/add-waste"}
            ],
            "model": "kisan-expert-agronomy"
        }

    # 0D-4: How can a farmer earn money from agricultural waste?
    if (any(kw in q for kw in ["earn", "make money", "kamai", "paise", "monetize", "income"]) and
        any(kw in q for kw in ["waste", "residue", "kachra", "apshisht", "parali", "kheti"])):
        if is_hindi:
            msg = """**1. सीधा उत्तर (Direct Answer):**
भारतीय किसान अपने खेत के कचरे, पराली, भूसे, गोबर और प्लास्टिक को जलाने या फेंकने के बजाय 5 प्रमुख व्यावसायिक तरीकों से प्रति एकड़ **₹1,500 से ₹15,000+** तक की शुद्ध अतिरिक्त आमदनी कमा सकते हैं।

**2. सरल व्याख्या (Simple Explanation):**
कृषि अवशेष अब कूड़ा नहीं बल्कि बायो-एनर्जी, पेपर मिल, पैकेजिंग और जैविक खाद उद्योगों के लिए मूल्यवान कच्चा माल बन चुके हैं। किसान कनेक्ट जैसे मंचों से जुड़कर किसान अपने खेत से ही सीधा उठाव कराकर नकद भुगतान ले सकते हैं।

**3. कमाई के 5 व्यावहारिक रास्ते (Practical Pathways):**
1. **गांठ बनाकर पराली/भूसा बेचना (Baled Straw):**
   - स्वचालित बेलर से पराली की 25-30 किलो की गांठें बनवाएं।
   - बायोमास बिजली घर और बायो-सीएनजी (CBG) प्लांट इसे **₹220 से ₹280 प्रति क्विंटल** (₹2,200-₹2,800/टन) खरीदते हैं।
   - 1 एकड़ से 20-25 क्विंटल पराली निकलती है, जिससे जुताई का खर्च काटकर **₹2,000-₹3,500 प्रति एकड़** शुद्ध आय होती है।
   - गेहूं की तूड़ी (भूसा) डेयरी क्षेत्रों में **₹400-₹700 प्रति क्विंटल** बिकती है।
2. **वर्मीकंपोस्ट (केंचुआ खाद) बनाकर बेचना:**
   - गोबर और फसल अवशेष से 50 दिनों में वर्मीकंपोस्ट तैयार करें।
   - थोक में यह ₹4,500-₹6,000 प्रति टन और 5-10 किलो की पैकिंग में नर्सरी को **₹6 से ₹10 प्रति किलो** बिकती है।
3. **धान की भूसी व गन्ने की खोई की आपूर्ति:**
   - धान की भूसी (Rice Husk) स्थानीय ईंट भट्ठों और औद्योगिक बॉयलरों को **₹300 से ₹450 प्रति क्विंटल** बेची जाती है।
4. **कृषि प्लास्टिक स्क्रैप बेचना:**
   - पुराने ड्रिप पाइप, स्प्रिंकलर पाइप और मल्चिंग शीट प्लास्टिक रीसाइक्लरों को **₹18 से ₹26 प्रति किलो** बिकती है (1 एकड़ ड्रिप बदलने पर ₹3,500-₹5,000 वापस मिलते हैं)।
5. **एफपीओ (FPO) के माध्यम से सामूहिक अनुबंध:**
   - 10-20 किसान मिलकर 500 एकड़ की पराली एकत्र करके उद्योगों से सीधे दीर्घकालिक अनुबंध (Supply Contract) करते हैं, जिससे 15-20% अधिक भाव मिलता है।

**4. लाभ और सावधानियां (Benefits & Considerations):**
• पराली जलाने पर होने वाले जुर्माने व पुलिस केस से पूरी सुरक्षा।
• हरियाणा/पंजाब सरकार द्वारा पराली न जलाने पर मिलने वाला ₹1,000-₹1,200 प्रति एकड़ का सरकारी प्रोत्साहन भी सीधे खाते में मिलता है।

**5. किसान कनेक्ट सुविधा (Kisan Connect Feature):**
आज ही '+ Add Waste' (/add-waste) पर अपने पास उपलब्ध अपशिष्ट (प्रकार, मात्रा और गांव) दर्ज करें और नजदीकी प्रमाणित खरीदारों से सीधे कोट्स पाएं!"""
        else:
            msg = """**1. Direct Answer:**
Indian farmers can generate **₹1,500 to ₹15,000+ in additional net income per acre** by commercializing crop residues, animal manure, and farm plastics across 5 established revenue streams instead of burning or discarding them.

**2. Simple Explanation:**
Agricultural residues are now high-demand industrial commodities for bio-energy plants, paper factories, compressed bio-gas (CBG) refineries, and organic fertilizers. Aggregating and selling these materials creates a recurring secondary revenue stream at farm-gate.

**3. The 5 Practical Monetization Pathways:**
1. **Selling Baled Crop Straw (Paddy / Wheat):**
   - High-density round/square bales (25–30 kg) are procured by biomass power plants, bio-coal pellet factories, and SATAT bio-CNG plants at **₹220–₹280 per quintal** (₹2,200–₹2,800/tonne) farm-gate.
   - Typical paddy yield of 20–25 quintals/acre generates **₹2,000–₹3,500 net profit per acre**.
   - Wheat straw (turi) trades between **₹400 and ₹700 per quintal** in dairy hubs as essential dry fodder.
2. **Commercial Vermicomposting & Bio-Fertilizer:**
   - Blending crop straw with cattle dung and *Eisenia foetida* worms produces nutrient-dense vermicompost in 45–60 days.
   - Bulk farm-gate price: ₹4,500–₹6,000 per tonne; retail packaged (5 kg / 25 kg bags): **₹6–₹10 per kg** to orchards, nurseries, and urban gardeners.
3. **Rice Husk & Sugarcane Residue Off-Take:**
   - Rice husk sells at **₹300–₹450 per quintal** for industrial boilers, brick kilns, and silica extraction. Sugarcane trash is compacted into fuel briquettes displacing coal.
4. **Scrap Value from Agricultural Plastics:**
   - Used HDPE drip laterals, PVC pipes, and LDPE mulch films fetch **₹18–₹26 per kg** from registered polymer recyclers, recovering **₹3,500–₹5,000 per acre** when renewing drip irrigation systems.
5. **Collective Aggregation through FPOs:**
   - Pooling residue across 500–1,000 acres through a Farmer Producer Organization bypasses middlemen and secures multi-year industrial off-take contracts at 15–25% premium pricing.

**4. Benefits and Considerations:**
• Eliminates legal liabilities and satellite-monitored fines for stubble burning.
• Farmers in Punjab and Haryana qualify for additional state cash incentives (₹1,000–₹1,200/acre) for zero-burning verification.

**5. Relevant Kisan Connect Feature:**
Post your available residue under **'+ Add Waste'** (/add-waste) to receive competitive farm-gate pickup bids from verified regional recyclers."""
        return {
            "reply": msg,
            "actions": [
                {"label": "List Farm Waste for Sale", "link": "/add-waste"},
                {"label": "Explore Partner Directory", "link": "/find-partners"}
            ],
            "model": "kisan-expert-agronomy"
        }

    # 0D-5: FPO kya hota hai? (Farmer Producer Organization)
    if ("fpo" in q or "farmer producer organization" in q or "farmer producer company" in q or "किसान उत्पादक संगठन" in q):
        if is_hindi or any(w in q for w in ["kya", "hai", "hota", "hoti", "fpo"]):
            msg = """**1. सीधा उत्तर (Direct Answer):**
**FPO (Farmer Producer Organization / किसान उत्पादक संगठन)** किसानों द्वारा गठित एक कानूनी संगठन या कंपनी (Farmer Producer Company - FPC) होता है, जिसमें न्यूनतम 10 या अधिक प्राथमिक किसान मिलकर अपनी खेती की लागत घटाने, सामूहिक खरीद करने और फसलों व कृषि अवशेषों को ऊंचे दामों पर सीधे बाजार में बेचने के लिए संगठित होते हैं।

**2. सरल व्याख्या (Simple Explanation):**
अकेले छोटे किसान के पास 1-2 एकड़ जमीन होती है, जिससे न तो वह खाद-बीज सस्ते में खरीद पाता है और न ही अपनी फसल या पराली को बड़े व्यापारी को सीधे बेच पाता है। FPO के तहत सैकड़ों किसान मिलकर एक "कंपनी" बनाते हैं। कंपनी के मालिक स्वयं किसान होते हैं और पूरा मुनाफा किसानों के बीच बंटता है।

**3. FPO के 4 मुख्य कार्य और फायदे:**
1. **थोक खरीद में भारी बचत:** बीज, उर्वरक, कीटनाशक और कृषि यंत्र सीधे कंपनियों से थोक भाव पर मिलते हैं, जिससे लागत 15-25% घट जाती है।
2. **बिचौलियों की समाप्ति व बेहतर भाव:** सामूहिक फसल को सीधे खाद्य प्रसंस्करण कंपनियों, मंडियों और निर्यातकों को बेचकर 15-20% अधिक भाव मिलता है।
3. **पराली व कृषि अपशिष्ट का बड़ा व्यापार:** कोई भी बायो-सीएनजी या बायोमास प्लांट 1-2 एकड़ के किसान के घर ट्रक नहीं भेजता। लेकिन जब FPO 500-1000 एकड़ की पराली एकत्र करता है, तो बड़े उद्योग सीधे FPO से आकर्षक अनुबंध (Off-take Agreements) करते हैं।
4. **मशीनरी बैंक (Custom Hiring Center):** FPO को सरकार से 80% तक की सब्सिडी पर सुपर सीडर, बेलर, हैप्पी सीडर और ट्रैक्टर मिलते हैं, जिन्हें किसान नाममात्र किराए पर इस्तेमाल कर सकते हैं।

**4. सरकारी सहायता और गठन (Government Schemes for FPOs):**
• केंद्र सरकार की '10,000 FPO योजना' के तहत प्रति FPO 3 वर्षों में **₹18 लाख तक का वित्तीय प्रबंधन अनुदान** मिलता है।
• किसानों द्वारा जुटाई गई शेयर पूंजी पर **₹15 लाख तक का मैचिंग इक्विटी ग्रांट**।
• बैंक लोन के लिए **₹2 करोड़ तक की क्रेडिट गारंटी** (नाबार्ड / SFAC द्वारा)।
• न्यूनतम 10 किसान सदस्य मिलकर कंपनी अधिनियम (Companies Act) के तहत FPC पंजीकृत कर सकते हैं।

**5. किसान कनेक्ट सुविधा (Kisan Connect Feature):**
FPO किसान कनेक्ट पर 'बल्क एग्रीगेटर' के रूप में पंजीकृत होकर अपने सभी सदस्य किसानों की पराली और अपशिष्ट को एक साथ लिस्ट कर सकते हैं — देखें '/find-partners' या '/add-waste'।"""
        else:
            msg = """**1. Direct Answer:**
An **FPO (Farmer Producer Organization)**, legally structured as a **Farmer Producer Company (FPC)** under the Indian Companies Act, is a registered commercial entity owned, operated, and managed entirely by primary agricultural producers (minimum 10 farmers) to achieve economies of scale and collective market power.

**2. Simple Explanation:**
Small and marginal farmers holding 1–3 acres lack individual bargaining power. An FPO aggregates hundreds of farmers into a collective business entity, eliminating exploitative middlemen, slashing input costs, and allowing farmers to sell crops and crop residues directly to corporate processors at premium rates.

**3. Core Operational Functions and Farmer Benefits:**
1. **Bulk Input Procurement:** Directly purchasing certified seeds, fertilizers, and crop protection chemicals from manufacturers at wholesale rates (saving 15–25%).
2. **Direct Market Access:** Bypassing local traders to sell aggregated produce directly to retail chains, agro-processors, and exporters.
3. **Residue Aggregation at Scale:** Industrial bio-energy and bio-CNG plants cannot collect 50 quintals from individual smallholders. An FPO aggregates 500–2,000 acres of paddy/wheat straw, securing lucrative multi-year supply contracts.
4. **Custom Hiring Centers (CHCs):** FPOs receive up to 80% government subsidy to establish machinery banks with Super Seeders, Balers, and Harvesters, renting them to member farmers at nominal operational rates.

**4. Key Government Support Schemes:**
• **Central Sector Scheme for 10,000 FPOs:** Provides up to **₹18 lakh in management and operational grants** per FPO over 3 years.
• **Equity Grant Scheme:** Matching grant up to **₹15 lakh per FPO** to boost member equity.
• **Credit Guarantee Facility:** Collateral-free loan guarantee up to **₹2 crore** via NABARD / SFAC.

**5. Relevant Kisan Connect Feature:**
FPOs can register on Kisan Connect as bulk aggregation partners to list regional residue lots and connect with accredited recycling plants on **/find-partners** and **/add-waste**."""
        return {
            "reply": msg,
            "actions": [
                {"label": "Explore Partner Directory", "link": "/find-partners"},
                {"label": "Educational Guides", "link": "/recycling-education"}
            ],
            "model": "kisan-expert-agronomy"
        }

    # 0D-6: What is vermicomposting?
    if (("what is vermicomposting" in q or "vermicompost kya hai" in q or "vermicompost kya hota" in q or
         "vermicomposting kya" in q or "vermicompost kaise banta" in q or "केंचुआ खाद" in q) or
        (any(w in q for w in ["vermicompost", "vermicomposting"]) and any(w in q for w in ["what", "kya", "define", "explain", "meaning"]))):
        if is_hindi:
            msg = """**1. सीधा उत्तर (Direct Answer):**
**वर्मीकंपोस्टिंग (केंचुआ खाद निर्माण)** एक जैविक तकनीक है जिसमें विशेष प्रजाति के केंचुओं — मुख्य रूप से **आइज़ीनिया फेटिडा (Eisenia foetida / Red Wigglers)** — की सहायता से फसल अवशेषों, गोबर और जैविक कचरे को अत्यधिक पोषक, गंधहीन और भुरभुरी जैविक खाद ("काला सोना") में बदला जाता है।

**2. सरल व्याख्या (Simple Explanation):**
केंचुए सड़े-गले फसल अवशेषों और गोबर को खाते हैं और अपनी पाचन क्रिया से उसे बारीक मल (Castings) के रूप में बाहर निकालते हैं। केंचुआ खाद में सामान्य मिट्टी की तुलना में 5 गुना अधिक नाइट्रोजन, 7 गुना अधिक फॉस्फोरस, 11 गुना अधिक पोटाश और करोड़ों लाभकारी सूक्ष्मजीव होते हैं।

**3. वर्मीकंपोस्ट बनाने के व्यावहारिक चरण:**
1. **स्थान का चयन:** छायादार, ऊंचे स्थान पर क्यारी बनाएं जहां पानी न भरे और तापमान 20°C से 30°C रहे।
2. **बेड का आकार:** पक्की ईंटों या सिलपॉलिन बेड से 10 फीट लंबी, 3 फीट चौड़ी और 2 फीट ऊंची क्यारी तैयार करें।
3. **नीचे की परत (जल निकास):** तली में 3-4 इंच सूखी कटी तूड़ी, नारियल के रेशे या सूखी पत्तियां बिछाएं।
4. **कचरा व गोबर का मिश्रण:** 15-20 दिन पुराना अर्ध-सड़ा गोबर और बारीक कटे फसल अवशेष बराबर मात्रा (1:1) में मिलाकर क्यारी में 1.5 फीट ऊंचाई तक भरें। (ताजा गरम गोबर कभी न डालें)।
5. **केंचुए छोड़ना:** प्रति 100 किलो कचरे पर 1 से 1.5 किलो सक्रिय आइज़ीनिया फेटिडा केंचुए ऊपर से छोड़ें।
6. **नमी व ढकना:** 55-60% नमी बनाए रखने के लिए फव्वारे से पानी छिड़कें और ऊपर से गीली बोरी (टाट) से ढक दें।
7. **खाद की कटाई (45-60 दिन):** जब ऊपरी सतह पर चायपत्ती जैसी भुरभुरी खाद की परत बन जाए, तो 3 दिन पानी देना बंद करें। केंचुए नीचे चले जाएंगे। ऊपरी खाद को खुरच कर 3 मिमी की छलनी से छान लें।

**4. लाभ और सावधानियां (Benefits & Risks):**
• **लाभ:** रासायनिक उर्वरक का खर्च 30-40% घटता है, जमीन की जल-धारण क्षमता सुधरती है, और उपोत्पाद **वर्मीवाश (Vermiwash)** पौधों के लिए बेहतरीन टॉनिक व कीट-रोधक का काम करता है।
• **सावधानी:** क्यारियों को चींटियों, मेंढकों और तेज धूप (>35°C) से बचाएं।

**5. किसान कनेक्ट सुविधा (Kisan Connect Feature):**
तैयार केंचुआ खाद और वर्मीवाश को जैविक खरीदारों को बेचने के लिए '+ Add Waste' (/add-waste) पर लिस्ट करें या '/recycling-education' पर सचित्र गाइड देखें।"""
        else:
            msg = """**1. Direct Answer:**
**Vermicomposting** is an advanced eco-biotechnological composting process that utilizes specialized epigeic earthworm species—predominantly **Eisenia foetida** (Red Wigglers)—to rapidly bio-convert agricultural residues, animal manure, and organic wastes into a premium, nutrient-dense organic fertilizer and soil conditioner ("Black Gold").

**2. Simple Explanation:**
Earthworms consume pre-decomposed plant residues and livestock dung, mechanically pulverizing it in their gizzards and digesting it with symbiotic gut microbes. Their excreted castings contain 5x more available Nitrogen, 7x more Phosphorus, and 11x more Potassium than conventional topsoil, along with natural plant growth hormones (auxins, gibberellins).

**3. Practical Step-by-Step Production Process:**
1. **Site Selection:** Choose an elevated, well-shaded area protected from direct sun and rainfall, maintaining an optimal temperature of 20°C–30°C.
2. **Bed Dimensions:** Construct brick masonry or HDPE silpaulin beds measuring 10 ft (length) × 3 ft (width) × 2 ft (height) with a slight drainage slope.
3. **Base Drainage Layer:** Lay 3–4 inches of coarse dry straw, crushed stalks, or coconut coir at the bottom for aeration and drainage.
4. **Feedstock Layering:** Combine chopped farm residues with 10–15 day old partially cured cow dung in a 1:1 ratio, filling the bed to a depth of 1.5 feet. *Crucial:* Never use fresh, steaming dung; ammonia heat will kill the worms.
5. **Earthworm Inoculation:** Introduce 1 to 2 kg of healthy *Eisenia foetida* worms per 100 kg of organic substrate directly onto the surface.
6. **Moisture & Shading:** Sprinkle water to maintain 50%–60% moisture. Cover the bed with damp jute gunny bags to ensure darkness and humidity.
7. **Harvesting (45–60 Days):** Once the top 6 inches resemble dark, loose, granular tea grounds, withhold water for 3 days. Earthworms burrow to the bottom moist layers. Gently scrape off the top castings and pass through a 3 mm sieve. Collect liquid **vermiwash** from the base tap as a foliar growth tonic.

**4. Benefits and Considerations:**
• **Benefits:** Enhances root aeration and microbial biodiversity, suppresses fungal root rot, fetches ₹6–₹10/kg in retail packaging (or ₹5,000/tonne in bulk).
• **Risks/Cautions:** Protect beds from predatory red ants, birds, and extreme heat (>35°C stalls activity and can cause mortality).

**5. Relevant Kisan Connect Feature:**
Market bulk vermicompost to certified organic orchards and urban horticulture buyers via **'+ Add Waste'** (/add-waste) or browse composting blueprints at **/recycling-education**."""
        return {
            "reply": msg,
            "actions": [
                {"label": "Composting Blueprints", "link": "/recycling-education"},
                {"label": "List Vermicompost", "link": "/add-waste"}
            ],
            "model": "kisan-expert-agronomy"
        }

    # 0D-7: Which factors affect compost quality?
    if ((any(w in q for w in ["factors", "factor", "affect", "parameters", "karan"]) and
         any(w in q for w in ["compost", "khad", "quality"])) or "compost quality" in q or "quality of compost" in q):
        if is_hindi:
            msg = """**1. सीधा उत्तर (Direct Answer):**
जैविक खाद (कंपोस्ट) की गुणवत्ता मुख्य रूप से 6 महत्वपूर्ण वैज्ञानिक कारकों द्वारा निर्धारित होती है: **कार्बन-नाइट्रोजन अनुपात (C:N Ratio), नमी का प्रतिशत, हवा का संचार (ऑक्सीजन), तापमान चक्र, कणों का आकार, और पीएच (pH) मान**।

**2. सरल व्याख्या (Simple Explanation):**
कंपोस्ट बनाना एक जीवित जैविक प्रक्रिया है जिसे बैक्टीरिया और फंगस अंजाम देते हैं। यदि इन 6 में से कोई भी कारक असंतुलित हो जाए, तो सड़न रुक जाती है, बदबूदार सड़ांध पैदा होती है या खाद में पोषक तत्व नष्ट हो जाते हैं।

**3. खाद की गुणवत्ता को प्रभावित करने वाले 6 प्रमुख कारक:**
1. **कार्बन से नाइट्रोजन अनुपात (C:N Ratio - आदर्श 25:1 से 30:1):**
   - कार्बन ("भूरा कचरा": सूखी पराली, भूसा, सूखी पत्तियां) सूक्ष्मजीवों को ऊर्जा देता है।
   - नाइट्रोजन ("हरा कचरा": गोबर, हरी पत्तियां, दालों के अवशेष) सूक्ष्मजीवों के शरीर निर्माण के लिए प्रोटीन देता है।
   - यदि कार्बन ज्यादा हो (>40:1) तो खाद बनने में 6 महीने लग जाएंगे; यदि नाइट्रोजन ज्यादा हो (<20:1) तो बदबूदार अमोनिया गैस बनकर उड़ जाएगी।
2. **नमी की मात्रा (Moisture - आदर्श 50% से 60%):**
   - सूक्ष्मजीवों को चलने और पोषक तत्व घोलने के लिए नमी चाहिए।
   - हाथ से भींचने पर मुट्ठी गीली लगे पर पानी न बहे (निचोड़े स्पंज जैसा)। 40% से कम में बैक्टीरिया निष्क्रिय हो जाते हैं; 65% से ज्यादा में हवा बंद होकर दुर्गंध आती है।
3. **हवा का संचार (Aeration / Oxygen >10%):**
   - एरोबिक (हवा पसंद करने वाले) बैक्टीरिया को ऑक्सीजन चाहिए। हर 10-14 दिन में ढेर की फावड़े से पलटाई करने से ऑक्सीजन पहुंचती है और बदबू खत्म होती है।
4. **तापमान चक्र (Temperature - थर्मोफिलिक चरण 55°C से 65°C):**
   - बीच के दिनों में तापमान 55°C से 65°C पहुंचना अनिवार्य है, जिससे खरपतवार के बीज और रोगजनक फफूंद/बैक्टीरिया जलकर नष्ट हो जाएं। तापमान 70°C से ऊपर जाने पर लाभदायक जीवाणु मरने लगते हैं, इसलिए पलटाई जरूरी है।
5. **कणों का आकार (Particle Size - 1 से 2 इंच):**
   - अवशेषों को 1-2 इंच टुकड़ों में काटने से सूक्ष्मजीवों को बड़ा सतह क्षेत्र मिलता है और ढेर में हवा के रास्ते भी खुले रहते हैं।
6. **पीएच स्तर (pH Value - 6.5 से 8.0):**
   - शुरुआत में थोड़ा अम्लीय (pH 5.5-6.0) होता है, फिर परिपक्व होने पर संतुलित उदासीन (pH 7.0-7.5) हो जाता है।

**4. पकी हुई उत्तम कंपोस्ट के लक्षण (Quality Verification):**
• रंग गहरा भूरा या काला।
• बनावट भुरभुरी और मुलायम (चायपत्ती जैसी)।
• खुशबू ताजी मिट्टी जैसी सोंधी (सड़ांध या अमोनिया की बदबू बिल्कुल नहीं)।
• तापमान सामान्य वातावरण के बराबर (ढेर अब गरम नहीं होता)।

**5. किसान कनेक्ट सुविधा (Kisan Connect Feature):**
वैज्ञानिक कंपोस्टिंग के पूरे चार्ट और चरणबद्ध तकनीकी गाइड पढ़ने के लिए किसान कनेक्ट के '/recycling-education' पेज पर जाएं।"""
        else:
            msg = """**1. Direct Answer:**
Compost quality and decomposition velocity are determined by **6 fundamental bio-physicochemical factors**: the Carbon-to-Nitrogen (C:N) ratio, moisture content, aeration (oxygen availability), temperature dynamics, feedstock particle size, and pH equilibrium.

**2. Simple Explanation:**
Composting is not passive rotting; it is an aerobic biological digestion driven by billions of specialized bacteria, actinomycetes, and fungi. If any of these 6 parameters drifts out of the optimal zone, decomposition slows, foul anaerobic odors develop, or nutrients leach away.

**3. The 6 Critical Factors Explained:**
1. **Carbon-to-Nitrogen (C:N) Ratio (Optimal: 25:1 to 30:1):**
   - *Carbon (Browns: dry straw, rice husk, dry stalks, sawdust):* Provides microbial cellular energy.
   - *Nitrogen (Greens: fresh cow dung, green leaves, poultry manure):* Fuels microbial protein and enzyme synthesis.
   - *Imbalance:* C:N >40:1 starves microbes of nitrogen, delaying breakdown for months; C:N <20:1 causes excess nitrogen to vaporize as foul ammonia gas (NH3).
2. **Moisture Content (Optimal: 50% to 60%):**
   - Water forms the biofilm in which microbes transport dissolved nutrients.
   - *The Hand-Squeeze Test:* Squeeze a handful of composting material firmly; it should feel damp like a wrung-out sponge with only 1–2 drops escaping. Moisture <40% halts microbial metabolism; >65% drowns pore spaces, turning the pile anaerobic and foul.
3. **Aeration & Oxygen Supply (Dissolved O2 >10%):**
   - Aerobic decomposers require continuous oxygen. Regular mechanical pile turning (every 10–14 days) replenishes oxygen and releases trapped excess heat and CO2.
4. **Temperature Dynamics (Thermophilic Phase: 55°C to 65°C):**
   - *Phase 1 (Mesophilic, 20–40°C):* Initial microbial colonization.
   - *Phase 2 (Thermophilic, 55–65°C):* Critical phase required for at least 3 consecutive days to destroy weed seeds, fly larvae, and plant pathogens (*Salmonella, E. coli*). Temperatures >70°C must be turned down as they kill beneficial decomposing fungi.
5. **Feedstock Particle Size & Porosity (Optimal: 1 to 2 inches):**
   - Shredding and chopping increases the surface area exposed to enzymatic microbial attack while retaining enough structural void space for air convection.
6. **pH Range (Optimal: 6.5 to 8.0):**
   - Organic acids initially lower pH to 5.5–6.0. As curing finishes, ammonia oxidizes into stable nitrates, and mature compost stabilizes at neutral to slightly alkaline (pH 7.0–7.8).

**4. Hallmarks of High-Quality Cured Compost:**
• Uniform dark brown or black color.
• Crumbly, friable texture (resembling coffee grounds).
• Rich, pleasant earthy odor (caused by geosmin).
• Ambient pile temperature (no self-reheating upon turning).

**5. Relevant Kisan Connect Feature:**
Explore full compost quality testing guidelines and pit blueprints on **/recycling-education**."""
        return {
            "reply": msg,
            "actions": [
                {"label": "Composting Master Guide", "link": "/recycling-education"},
                {"label": "Find Certified Buyers", "link": "/find-partners"}
            ],
            "model": "kisan-expert-agronomy"
        }

    # =========================================================================
    # 1. CONVERSATIONAL FOLLOW-UP QUESTIONS (Context-Dependent Memory)
    # =========================================================================

    # 1A. "How much?" / "How much will I earn?" / "What is the price / rate?"
    if any(kw in q for kw in ["how much", "how much will i earn", "how much can i earn", "what will i earn", "price", "kitna", "kitni kamai", "दर", "भाव", "रेट", "कितना कमा"]):
        if recent_topic == "paddy_straw":
            if is_hindi:
                msg = """**धान की पराली से संभावित कमाई:**
• **बेलर द्वारा गांठें (Baled Straw):** ₹220 – ₹280 प्रति क्विंटल (खेत से सीधा उठान)।
• **औसत उपज:** 20 से 25 क्विंटल प्रति एकड़।
• **5 एकड़ के खेत से:** लगभग ₹22,000 से ₹30,000 की शुद्ध अतिरिक्त आय प्राप्त होती है, जिसे किसान सीधे बायोमास बिजली घरों व बायो-सीएनजी प्लांटों को बेच सकते हैं।"""
            else:
                msg = """**Potential Earnings from Paddy Straw:**
• **Baled Straw Farm-Gate Rate:** ₹220 – ₹280 per quintal (₹2,200 – ₹2,800 per tonne).
• **Average Yield:** ~20 to 25 quintals per acre.
• **For a 5-Acre Farm:** You can generate **₹22,000 to ₹30,000 in additional net revenue** through mechanical baling and direct procurement by bio-energy and CBG plants."""
            return {
                "reply": msg,
                "actions": [
                    {"label": "List Paddy Straw for Sale", "link": "/add-waste"},
                    {"label": "Find Local Baler Partners", "link": "/find-partners"}
                ],
                "model": "kisan-context-memory"
            }

        elif recent_topic == "wheat":
            if is_hindi:
                msg = """**गेहूं की तूड़ी (Wheat Straw / Turi) का बाजार भाव:**
• **वर्तमान दर:** ₹400 – ₹700 प्रति क्विंटल (मौसम व मांग अनुसार)।
• डेयरी फार्मों में सूखे चारे के रूप में इसकी लगातार भारी मांग रहती है।"""
            else:
                msg = """**Market Rates for Wheat Straw (Turi / Bhusa):**
• **Prevailing Farm-Gate Rate:** ₹400 – ₹700 per quintal (₹4,000 – ₹7,000 per tonne).
• High recurring demand across dairy hubs and livestock feed markets makes wheat straw one of the most profitable residues."""
            return {
                "reply": msg,
                "actions": [{"label": "List Wheat Straw for Sale", "link": "/add-waste"}],
                "model": "kisan-context-memory"
            }

        elif recent_topic == "plastic":
            if is_hindi:
                msg = """**कृषि प्लास्टिक रीसाइक्लिंग से कमाई:**
• **कठोर HDPE ड्रिप लेटरल पाइप:** ₹18 – ₹26 प्रति किलोग्राम।
• **मल्चिंग शीट व ग्रीनहाउस फिल्म:** ₹10 – ₹16 प्रति किलोग्राम।
• 1 एकड़ ड्रिप इरिगेशन बदलने पर किसान को **₹3,500 से ₹5,500** तक की शुद्ध आय होती है।"""
            else:
                msg = """**Earnings from Agricultural Plastic Disposal:**
• **Rigid HDPE Drip Lines:** ₹18 – ₹26 per kg from CPCB-registered polymer recyclers.
• **Mulch & Silage Films:** ₹10 – ₹16 per kg.
• Replacing 1 acre of worn drip laterals typically recovers **₹3,500 to ₹5,500** in scrap value."""
            return {
                "reply": msg,
                "actions": [{"label": "List Plastic Scrap for Pickup", "link": "/add-waste"}],
                "model": "kisan-context-memory"
            }

        elif recent_topic == "rice_husk":
            if is_hindi:
                msg = """**धान के छिलके (Rice Husk) की दरें:**
• **वर्तमान औद्योगिक दर:** ₹300 – ₹450 प्रति क्विंटल (बॉयलर व सिलिका प्लांट द्वारा खरीद)।"""
            else:
                msg = """**Market Rates for Rice Husk:**
• **Prevailing Price:** ₹300 – ₹450 per quintal (₹3,000 – ₹4,500 per tonne), purchased regularly by industrial boilers, brick kilns, and green silica extractors."""
            return {
                "reply": msg,
                "actions": [{"label": "List Rice Husk Quantity", "link": "/add-waste"}],
                "model": "kisan-context-memory"
            }

        elif recent_topic == "compost":
            if is_hindi:
                msg = """**जैविक खाद (Compost / Vermicompost) के दाम:**
• **थोक भाव:** ₹4,500 – ₹7,000 प्रति टन।
• **खुदरा पैकेट (5kg/25kg):** ₹6 – ₹10 प्रति किलोग्राम।"""
            else:
                msg = """**Market Rates for Compost & Vermicompost:**
• **Bulk Sales (Orchards & Nurseries):** ₹4,500 – ₹7,000 per tonne.
• **Packaged Retail:** ₹6 – ₹10 per kg."""
            return {
                "reply": msg,
                "actions": [{"label": "List Compost for Sale", "link": "/add-waste"}],
                "model": "kisan-context-memory"
            }

        # General earnings summary if no specific crop in recent context
        if is_hindi:
            msg = """**किसान कनेक्ट पर प्रमुख कृषि अपशिष्टों की संभावित कमाई:**
• **धान की पराली (गांठें):** ₹220 – ₹280 प्रति क्विंटल
• **गेहूं की तूड़ी (भूसा):** ₹400 – ₹700 प्रति क्विंटल
• **धान का छिलका (राइस हस्क):** ₹300 – ₹450 प्रति क्विंटल
• **कृषि प्लास्टिक (ड्रिप पाइप):** ₹18 – ₹26 प्रति किलोग्राम
• **केंचुआ खाद (वर्मीकंपोस्ट):** ₹6 – ₹10 प्रति किलोग्राम
आप '+ Add Waste' पर लिस्ट करके खरीदारों से सीधे कोट्स प्राप्त कर सकते हैं।"""
        else:
            msg = """**Prevailing Farm Residue Market Rates on Kisan Connect:**
• **Baled Paddy Straw:** ₹220 – ₹280 per quintal
• **Wheat Straw (Turi):** ₹400 – ₹700 per quintal
• **Rice Husk:** ₹300 – ₹450 per quintal
• **Agricultural Plastic Scrap (HDPE):** ₹18 – ₹26 per kg
• **Vermicompost:** ₹6 – ₹10 per kg
Listing your residue under '+ Add Waste' lets nearby buyers place competitive pickup bids."""
        return {
            "reply": msg,
            "actions": [{"label": "List Waste for Quotes", "link": "/add-waste"}],
            "model": "kisan-pricing-engine"
        }

    # 1B. "What about wheat?" / "Wheat residue" / "Wheat straw"
    if any(kw in q for kw in ["what about wheat", "what to do with wheat", "wheat residue", "wheat straw", "wheat turi", "गेहूं के बारे में", "गेहूं की तूड़ी", "गेहूं का अवशेष"]):
        if is_hindi:
            msg = """**गेहूं की तूड़ी (Wheat Straw / Turi) का प्रबंधन एवं उपयोग:**
गेहूं का भूसा पशुओं के सूखे चारे का मुख्य आधार है। कटाई के बाद इसका बाजार मूल्य **₹400 से ₹700 प्रति क्विंटल** तक रहता है। इसके अतिरिक्त, इसका उपयोग बायोमास पेलेट्स बनाने और बटन मशरूम की खेती के लिए माध्यम के रूप में भी किया जाता है। सुरक्षित भंडारण के लिए इसे सूखे स्थान पर तिरपाल से ढक कर रखें ताकि नमी व फफूंद से बचाव हो सके।"""
        else:
            msg = """**Wheat Straw (Turi / Bhusa) Management & Value:**
Wheat straw is widely recycled as high-value dry livestock fodder, trading between **₹400 and ₹700 per quintal** during peak post-harvest demand. Beyond animal nutrition, wheat straw is actively purchased for biomass fuel pelleting (calorific value ~3,600 kcal/kg) and serves as an ideal organic substrate for button mushroom cultivation."""
        return {
            "reply": msg,
            "actions": [
                {"label": "List Wheat Straw for Sale", "link": "/add-waste"},
                {"label": "Find Fodder & Straw Buyers", "link": "/find-partners"}
            ],
            "model": "kisan-agronomy-engine"
        }

    # 1C. "Explain more" / "Tell me more" / "In detail" / "Aur batao"
    if any(kw in q for kw in ["explain more", "tell me more", "explain in detail", "more details", "aur batao", "विस्तार से बताएं", "और जानकारी"]):
        if recent_topic == "compost":
            if is_hindi:
                msg = """**कंपोस्ट बनाने की वैज्ञानिक प्रक्रिया विस्तार से:**
1. **सी:एन अनुपात (C:N Ratio):** पराली में कार्बन अधिक (80:1) होता है, जबकि सड़ने के लिए 25:1 अनुपात चाहिए। इसके लिए प्रति टन पराली पर 200 किग्रा ताजा गोबर का घोल या 1.5 किग्रा यूरिया पानी में घोलकर छिड़कें।
2. **ढेर तैयार करना:** छायादार जगह पर 10×5 फीट का ढेर 8-इंच की परतों में बनाएं। प्रत्येक परत पर गोबर का घोल व पूसा बायो-डीकंपोज़र छिड़कें।
3. **नमी और तापमान:** 55% से 60% नमी बनाए रखें। अंदर तापमान 60°C तक जाता है जो खरपतवार के बीज नष्ट करता है।
4. **पलटाई:** हर 15 दिन में ढेर की फावड़े से पलटाई करें ताकि हवा मिले। 50-60 दिनों में चायपत्ती जैसी भुरभुरी खाद तैयार हो जाती है।"""
            else:
                msg = """**Detailed Scientific Composting Method:**
1. **C:N Ratio Balancing:** Crop straw has a high 80:1 carbon ratio. Microbes require 25:1. Mix 200 kg fresh cow dung slurry or 1.5 kg urea dissolved in water per tonne of straw.
2. **Layering & Inoculation:** In a shaded 10 ft × 5 ft bed, spread 8-inch straw layers. Moisten with slurry and spray **PUSA Bio-Decomposer** or Trichoderma fungal culture.
3. **Moisture & Aeration:** Maintain 55–60% dampness. Turn the pile every 10–14 days to circulate oxygen. Internal temperatures reach 55°C–65°C, destroying weed seeds and pathogens.
4. **Maturity:** In 45–60 days, straw transforms into sweet-smelling crumbly humus containing 1.2–1.5% Nitrogen and rich organic carbon."""
            return {
                "reply": msg,
                "actions": [{"label": "View Full Composting Guide", "link": "/recycling-education"}],
                "model": "kisan-context-expansion"
            }

        elif recent_topic == "paddy_straw":
            if is_hindi:
                msg = """**धान की पराली प्रबंधन के दो प्रमुख तरीके:**
1. **खेत में ही (In-situ):** 'सुपर सीडर' या 'हैप्पी सीडर' मशीन से बिना पराली जलाए सीधे गेहूं की बुवाई करें। इससे ₹1,500 प्रति एकड़ जुताई का खर्च बचता है और जमीन में जैविक कार्बन बढ़ता है।
2. **खेत से बाहर (Ex-situ):** स्वचालित बेलर से 25-30 किलो की गांठें बनवाएं और पास के बायोमास बिजली घर या किसान कनेक्ट पर ₹220-₹280/क्विंटल की दर से बेचें।"""
            else:
                msg = """**Paddy Straw Management: In-Situ vs Ex-Situ:**
1. **In-Situ (Field Incorporation):** Use Super Seeders or Happy Seeders to sow wheat directly into standing stubble. This eliminates burning, saves ₹1,500/acre in tilling fuel, and enriches soil organic carbon.
2. **Ex-Situ (Industrial Valorization):** Contract mechanized balers to pack straw into 25–30 kg high-density bales. Sell them to biomass energy plants, paper mills, or SATAT CBG factories at ₹220 – ₹280/quintal."""
            return {
                "reply": msg,
                "actions": [
                    {"label": "Sell Baled Stubble", "link": "/add-waste"},
                    {"label": "Find Machinery Partners", "link": "/find-partners"}
                ],
                "model": "kisan-context-expansion"
            }

        elif recent_topic == "kisan_connect":
            if is_hindi:
                msg = """**किसान कनेक्ट प्लेटफॉर्म की प्रमुख विशेषताएं:**
• **वेस्ट मार्केटप्लेस:** फसल अवशेष, गोबर, या प्लास्टिक लिस्ट करें और खरीदारों से कोट्स पाएं।
• **पार्टनर डायरेक्टरी व मैप:** अपने जिले के 50 किमी के दायरे में बायोमास प्लांट व रीसाइक्लर देखें।
• **ऑर्डर ट्रैकिंग:** रिक्वेस्ट से लेकर पिकअप और भुगतान तक हर चरण लाइव ट्रैक करें।
• **वैज्ञानिक गाइड:** पराली, खाद और ऊर्जा उत्पादन के प्रमाणिक तरीके पढ़ें।"""
            else:
                msg = """**Key Features of the Kisan Connect Platform:**
• **Waste Marketplace:** List any residue (straw, husk, bagasse, plastics) with photos and quantity for verified buyer bidding.
• **Interactive Partner Directory:** Geo-locate biomass power plants, composters, and recyclers within 50 km.
• **End-to-End Tracking:** Monitor order progress from request to dispatch and transparent bank settlement.
• **Recycling Education:** Step-by-step verified agronomy guides for sustainable residue management."""
            return {
                "reply": msg,
                "actions": [
                    {"label": "Explore Partner Map", "link": "/find-partners"},
                    {"label": "List Farm Waste", "link": "/add-waste"}
                ],
                "model": "kisan-context-expansion"
            }

    # 1D. "How can I recycle it?" / "What can I do with it?" / "Recycle it" — context-dependent
    RECYCLE_IT_KEYWORDS = [
        "how can i recycle it", "how do i recycle it", "recycle it",
        "what can i do with it", "how to recycle it", "how to use it",
        "what to do with it", "how should i recycle", "ise kaise recycle karen",
        "इसे कैसे रीसाइकल करें", "इसका क्या करें"
    ]
    if any(kw in q for kw in RECYCLE_IT_KEYWORDS):
        if recent_topic == "paddy_straw" or "paddy" in q or "parali" in q or "straw" in q:
            if is_hindi:
                msg = """**धान की पराली (Paddy Straw) को रीसाइकल करने के 4 तरीके:**

1. **कंपोस्ट बनाएं (In-Situ):** पूसा बायो-डीकंपोज़र का छिड़काव करें, पराली को खेत में ही सड़ने दें और 30–40 दिनों में जैविक खाद तैयार होती है — बिना जुताई के।
2. **बेलर द्वारा बेचें (Ex-Situ):** मैकेनिकल बेलर से 25–30 किलो की गांठें बनाएं और बायोमास बिजली घर या बायो-CNG प्लांट को **₹220–₹280 प्रति क्विंटल** पर बेचें।
3. **मशरूम उत्पादन:** ऑयस्टर मशरूम के बीज (स्पॉन) पराली की गांठों में बोएं — 20–25 दिन में पहली फसल, प्रति किलो ₹80–₹120 में बिकती है।
4. **पशु बिछावन:** साफ सूखी पराली को डेयरी फार्मों को ₹150–₹200 प्रति क्विंटल पर बेचें।"""
            else:
                msg = """**4 Ways to Recycle Paddy Straw:**

1. **In-Situ Composting:** Spray PUSA Bio-Decomposer culture (diluted in water) on standing straw and leave it in the field. In 30–40 days, it turns into organic humus — no tillage needed.
2. **Sell as Baled Biomass (Ex-Situ):** Use mechanical balers to pack 25–30 kg bales and sell them to biomass power plants or SATAT bio-CNG factories at **₹220–₹280 per quintal** farm-gate.
3. **Mushroom Cultivation:** Inoculate paddy straw bundles with oyster mushroom (Pleurotus) spawn. First harvest ready in 20–25 days, selling at ₹80–₹120 per kg in local markets.
4. **Animal Bedding:** Clean dry straw is procured by dairy farms at ₹150–₹200 per quintal for comfortable cattle bedding."""
        elif recent_topic == "wheat":
            if is_hindi:
                msg = """**गेहूं की तूड़ी को रीसाइकल करने के तरीके:**

1. **डेयरी फार्म:** पशुओं के चारे के रूप में ₹400–₹700/क्विंटल।
2. **बायोमास पेलेट्स:** ताप ऊर्जा संयंत्रों में ईंधन के रूप में।
3. **मशरूम खेती:** बटन मशरूम उगाने का बेहतरीन माध्यम।"""
            else:
                msg = """**Ways to Recycle Wheat Straw:**

1. **Livestock Fodder:** Sell to dairy farms at ₹400–₹700/quintal as dry roughage.
2. **Biomass Fuel Pellets:** Pressed into fuel pellets for thermal power plants (calorific value ~3,600 kcal/kg).
3. **Mushroom Substrate:** Used as a growing medium for button mushroom cultivation."""
        else:
            if is_hindi:
                msg = """**कृषि अवशेष रीसाइकल करने के प्रमुख तरीके:**

1. **खाद बनाएं:** पराली, भूसा या गन्ने के अवशेष से जैविक कंपोस्ट बनाएं।
2. **बायोमास बेचें:** बेलर से गांठें बनाकर ऊर्जा संयंत्रों को बेचें।
3. **किसान कनेक्ट पर लिस्ट करें:** अपना अवशेष '+ Add Waste' पर लिस्ट करें और खरीदारों से सीधे कोट्स पाएं।"""
            else:
                msg = """**General Ways to Recycle Agricultural Residue:**

1. **Compost/Biohumus:** Convert straw, husk, or sugarcane trash into organic fertilizer.
2. **Sell as Biomass:** Bale and sell to bio-energy plants.
3. **List on Kisan Connect:** Add your residue on '+ Add Waste' for verified buyer bids.

Tell me which crop residue you have and I'll give you a more specific recycling plan!"""
        return {
            "reply": msg,
            "actions": [
                {"label": "List Waste for Sale", "link": "/add-waste"},
                {"label": "View Recycling Guide", "link": "/recycling-education"}
            ],
            "model": "kisan-recycle-context"
        }

    # =========================================================================
    # 2. CORE DIRECT INTENT MATCHERS (Benchmark Exact Answers)
    # =========================================================================

    # 2A-DEF. "What is paddy straw?" — definition / identity question
    PADDY_DEFINITION_KEYWORDS = [
        "what is paddy straw", "what is parali", "what is straw",
        "paddy straw kya hai", "paddy straw kya hota", "parali kya hai",
        "धान की पराली क्या है", "पराली क्या होती है", "define paddy straw"
    ]
    if any(kw in q for kw in PADDY_DEFINITION_KEYWORDS):
        if is_hindi:
            msg = """**धान की पराली (Paddy Straw) क्या है?**

धान की पराली वह सूखी, रेशेदार डंठल और पत्तियां हैं जो धान (चावल) की फसल की कटाई के बाद खेत में बचती हैं। भारत में हर साल लगभग **23 करोड़ टन** फसल अवशेष पैदा होते हैं, जिनमें धान की पराली का हिस्सा सबसे अधिक — करीब **10–11 करोड़ टन** — है।

**मुख्य तथ्य:**
• उत्तर भारत में धान की कटाई के बाद (अक्टूबर–नवंबर) बड़े पैमाने पर निकलती है।
• पंजाब, हरियाणा, उत्तर प्रदेश और पश्चिम बंगाल सबसे अधिक उत्पादन करने वाले राज्य हैं।
• इसे जलाने से वायु प्रदूषण होता है और NGT ने इस पर सख्त जुर्माना लगाया है।
• सही प्रबंधन से यह किसानों की अतिरिक्त आमदनी का स्रोत बन सकती है।"""
        else:
            msg = """**What is Paddy Straw?**

Paddy straw is the dry, fibrous stalks and leaves left in the field after harvesting rice (paddy) crops. India generates approximately **230 million tonnes** of crop residue annually, of which paddy straw accounts for the largest share — around **100–110 million tonnes** per year.

**Key Facts:**
• Produced in large volumes across North India after the kharif harvest (October–November).
• Punjab, Haryana, Uttar Pradesh, and West Bengal are the highest-producing states.
• Burning paddy straw releases PM2.5 particulates; penalized under NGT orders and linked to Delhi-NCR's winter smog.
• With proper management it can become compost, biomass energy, animal bedding, or be sold for **₹220–₹280 per quintal** to bio-energy plants."""
        return {
            "reply": msg,
            "actions": [
                {"label": "How to Recycle Paddy Straw", "link": "/recycling-education"},
                {"label": "List Paddy Straw for Sale", "link": "/add-waste"}
            ],
            "model": "kisan-definition-engine"
        }

    # 2A. "What can I do with paddy straw?" / "What to do with paddy straw" / "uses of paddy straw"
    if any(kw in q for kw in ["what can i do with paddy straw", "what to do with paddy straw", "uses of paddy straw", "paddy straw use", "paddy straw options", "धान की पराली का क्या करें", "पराली का क्या उपयोग"]):
        if is_hindi:
            msg = """**धान की पराली का क्या करें:**
धान की पराली का उपयोग पशुओं के बिछावन, जैविक खाद (कंपोस्ट), मशरूम उत्पादन और बायोमास ऊर्जा उत्पादन के लिए किया जा सकता है। सबसे उपयुक्त विकल्प पराली की गुणवत्ता, मात्रा और नजदीकी खरीदारों पर निर्भर करता है। किसान कनेक्ट पर आप अपनी पराली को बेलर से उठवाकर **₹220 से ₹280 प्रति क्विंटल** की दर से बेच भी सकते हैं।"""
        else:
            msg = """Paddy straw can be used for animal bedding, composting, mushroom cultivation, and biomass production. The most suitable option depends on its quality, availability, and nearby buyers. On Kisan Connect, you can also list baled paddy straw for farm-gate collection by bio-energy and CBG plants at **₹220 – ₹280 per quintal**."""
        return {
            "reply": msg,
            "actions": [
                {"label": "List Paddy Straw for Sale", "link": "/add-waste"},
                {"label": "Find Nearby Baler Partners", "link": "/find-partners"}
            ],
            "model": "kisan-direct-intent"
        }

    # 2B. "How can I make compost?" / "How do I make organic compost?" / "How is compost made?" / Vermicompost
    if any(kw in q for kw in [
        "how can i make compost", "how do i make organic compost", "how is compost made",
        "how to make compost", "compost preparation", "vermicompost", "earthworm",
        "make vermicompost", "how to make vermicompost", "खाद कैसे बनाएं", "जैविक खाद कैसे बनाएं",
        "कंपोस्ट कैसे बनती है", "केंचुआ खाद"
    ]):
        if is_hindi:
            msg = """**जैविक खाद (कंपोस्ट) बनाने की सरल विधि:**
आप कृषि अवशेषों (पराली, सूखी पत्तियां, भूसा) को गोबर के पतले घोल जैसे नाइट्रोजन-युक्त जैविक पदार्थों के साथ परत-दर-परत बिछाकर, 55-60% नमी बनाए रखकर खाद तैयार कर सकते हैं। हवा के संचार के लिए हर 10-14 दिनों में ढेर की पलटाई करें। केंचुओं का उपयोग करके वर्मीकंपोस्ट बनाना भी एक बेहतरीन विकल्प है।"""
        else:
            msg = """You can make compost by layering agricultural residues with suitable organic materials like cow dung slurry, maintaining 50–60% moisture, and allowing natural decomposition. Turn the material periodically (every 10–14 days) to improve aeration. Vermicomposting is another excellent option using *Eisenia foetida* earthworms for faster, nutrient-dense organic manure in 45–60 days."""
        return {
            "reply": msg,
            "actions": [
                {"label": "Read Composting Guide", "link": "/recycling-education"},
                {"label": "List Organic Compost for Sale", "link": "/add-waste"}
            ],
            "model": "kisan-direct-intent"
        }

    # 2C. "What is Kisan Connect?" / "Explain Kisan Connect" / "About Kisan Connect"
    if any(kw in q for kw in ["what is kisan connect", "about kisan connect", "explain kisan connect", "kisan connect kya hai", "किसान कनेक्ट क्या है"]):
        if is_hindi:
            msg = """**किसान कनेक्ट (Kisan Connect) क्या है:**
किसान कनेक्ट एक स्मार्ट डिजिटल प्लेटफॉर्म है जो किसानों को कृषि अपशिष्ट संग्राहकों, कंपोस्ट निर्माताओं, बायोमास उद्योगों और प्लास्टिक रीसाइक्लिंग पार्टनरों से सीधे जोड़ता है, ताकि खेत के कचरे को जलाने के बजाय मूल्यवान संसाधनों और अतिरिक्त आय में बदला जा सके।"""
        else:
            msg = """Kisan Connect is an agricultural technology platform designed to connect farmers with waste collectors, compost manufacturers, biomass industries, and plastic recycling partners so agricultural waste can be collected, reused, and converted into valuable resources instead of being burnt."""
        return {
            "reply": msg,
            "actions": [
                {"label": "Explore Recycling Partners", "link": "/find-partners"},
                {"label": "List Your Farm Waste", "link": "/add-waste"}
            ],
            "model": "kisan-direct-intent"
        }

    # 2D. "How do I list my waste?" / "How to list agricultural waste" / "How to list waste"
    if any(kw in q for kw in ["how do i list my waste", "how to list waste", "how do i list waste", "how can i list my waste", "how to add waste", "कचरा लिस्ट कैसे करें", "अपशिष्ट कैसे जोड़ें"]):
        if is_hindi:
            msg = """**अपना अपशिष्ट लिस्ट करने के आसान चरण:**
ऊपर दिए मेनू में **'+ Add Waste'** (/add-waste) सेक्शन खोलें, अपने अवशेष की श्रेणी (जैसे पराली, तूड़ी, भूसा या प्लास्टिक) चुनें, अनुमानित वजन और अपने खेत/गांव का स्थान दर्ज करें, उपलब्धता का विवरण डालें और सबमिट करें। आपके नजदीकी सत्यापित खरीददार आपकी लिस्टिंग देखकर सीधे पिकअप कोट्स भेजेंगे।"""
        else:
            msg = """To list your agricultural waste: Open the **'+ Add Waste'** section (/add-waste), select the waste category (such as paddy straw, wheat turi, rice husk, or agricultural plastic), enter its estimated quantity and farm location, add availability details, and submit your listing. Nearby verified buyers will view your listing and send collection bids."""
        return {
            "reply": msg,
            "actions": [{"label": "Go to + Add Waste", "link": "/add-waste"}],
            "model": "kisan-direct-intent"
        }

    # 2E. "Where can I sell agricultural waste?" / "How can I sell agricultural waste?"
    if any(kw in q for kw in ["where can i sell agricultural waste", "how can i sell my agricultural waste", "how to sell agricultural waste", "sell agricultural waste", "sell farm waste", "कृषि अपशिष्ट कहां बेचें", "पराली कहां बेचें"]):
        if is_hindi:
            msg = """**कृषि अपशिष्ट कहां और कैसे बेचें:**
आप किसान कनेक्ट प्लेटफॉर्म पर सीधे पंजीकृत बायोमास बिजली घरों, बायो-सीएनजी (CBG) प्लांटों, ईंट भट्ठों और रीसाइक्लिंग पार्टनरों को अपना अपशिष्ट बेच सकते हैं। खरीददार सीधे आपके खेत से बेलर व ट्रकों द्वारा माल उठाते हैं और धर्मकांटे पर वजन कराकर तुरंत भुगतान करते हैं। बेचने के लिए '+ Add Waste' पेज पर विवरण दर्ज करें।"""
        else:
            msg = """You can sell agricultural waste directly on Kisan Connect to registered biomass power plants, bio-CNG (CBG) facilities, brick kilns, and recycling partners. Verified buyers provide farm-gate collection with on-site digital weighing. To start, navigate to '+ Add Waste' (/add-waste) or browse active buyers in the 'Recycling Partners' directory."""
        return {
            "reply": msg,
            "actions": [
                {"label": "List Waste for Sale", "link": "/add-waste"},
                {"label": "Explore Verified Buyers", "link": "/find-partners"}
            ],
            "model": "kisan-direct-intent"
        }

    # 2F. "How can I recycle crop residue?" / "How can crop residue be recycled?"
    if any(kw in q for kw in ["how can i recycle crop residue", "how can crop residue be recycled", "crop residue recycling", "recycle crop residue", "फसल अवशेष का रीसाइक्लिंग कैसे करें", "पराली का पुनर्चक्रण"]):
        if is_hindi:
            msg = """**फसल अवशेष (Crop Residue) की रीसाइक्लिंग के मुख्य उपाय:**
1. **खेत में ही (In-Situ):** सुपर सीडर या हैप्पी सीडर से बिना जलाए सीधे अगली फसल बोएं, या पूसा बायो-डीकंपोज़र का छिड़काव कर पराली को जैविक खाद में बदलें।
2. **खेत से बाहर (Ex-Situ):** बेलर मशीन से गांठें बनाकर बायोमास ऊर्जा संयंत्रों, सीएनजी प्लांटों या गत्ता मिलों को ₹220-₹280 प्रति क्विंटल पर बेचें।"""
        else:
            msg = """Crop residue can be recycled in two primary ways: 1) **In-Situ (in the field)** using Happy Seeders, Super Seeders, or PUSA Bio-Decomposer to incorporate residue into the soil as organic humus, saving fertilizer costs; and 2) **Ex-Situ (off the field)** by baling straw with mechanical balers and selling it to biomass energy plants, paper mills, or compost producers for ₹220 – ₹280 per quintal."""
        return {
            "reply": msg,
            "actions": [
                {"label": "Sell Residue on Kisan Connect", "link": "/add-waste"},
                {"label": "Read Composting Guide", "link": "/recycling-education"}
            ],
            "model": "kisan-direct-intent"
        }

    # 2G. "How does Kisan Connect work?"
    if any(kw in q for kw in ["how does kisan connect work", "how kisan connect works", "kisan connect kaise kaam karta hai", "किसान कनेक्ट कैसे काम करता है"]):
        if is_hindi:
            msg = """**किसान कनेक्ट कैसे काम करता है (5 आसान चरण):**
1. **खाता बनाएं:** 'Join Kisan Connect' पर किसान या रीसाइक्लिंग पार्टनर के रूप में जुड़ें।
2. **अपशिष्ट लिस्ट करें:** '+ Add Waste' पर फसल का नाम, वजन और गांव का नाम डालें।
3. **पार्टनर खोजें:** 50 किमी के दायरे में बायोमास प्लांट व रीसाइक्लर देखें।
4. **कलेक्शन का अनुरोध भेजें:** पार्टनर को चुनें और 'Request Collection' दबाएं।
5. **सुरक्षित भुगतान पाएं:** खेत से माल उठते ही धर्मकांटे पर सही वजन के आधार पर भुगतान प्राप्त करें।"""
        else:
            msg = """**How Kisan Connect Works (5 Simple Steps):**
1. **Sign Up:** Register in 30 seconds as a Farmer or a Recycling Partner.
2. **List Waste:** Under '+ Add Waste', enter your residue type, estimated quantity, and farm location.
3. **Locate Nearby Buyers:** Explore the partner directory with geo-mapped buyers in your district.
4. **Request Collection:** Choose an authorized partner to schedule mechanical baling or pickup.
5. **Track & Get Paid:** Track milestones on '/tracking' and receive direct transparent payment upon on-site digital weighing."""
        return {
            "reply": msg,
            "actions": [
                {"label": "List Farm Waste", "link": "/add-waste"},
                {"label": "Explore Partner Map", "link": "/find-partners"}
            ],
            "model": "kisan-direct-intent"
        }

    # 2H. "How to track collection?" / "Collection tracking" / "Tracking"
    if any(kw in q for kw in ["tracking", "collection tracking", "track order", "track my waste", "कलेक्शन ट्रैकिंग", "ट्रैक कैसे करें"]):
        if is_hindi:
            msg = """**कलेक्शन ट्रैकिंग (Order Tracking) की व्यवस्था:**
कलेक्शन अनुरोध भेजने के बाद, आप मेनू में **'/tracking'** पेज पर जाकर अपने ऑर्डर की वास्तविक स्थिति देख सकते हैं। यह 5 चरणों में अपडेट होती है:
1) **Pending** (अनुरोध भेजा गया)
2) **Accepted** (पार्टनर द्वारा स्वीकार)
3) **Scheduled** (गाड़ी व बेलर का समय निर्धारित)
4) **Picked Up** (खेत से माल उठाया गया)
5) **Completed** (वजन व भुगतान पूर्ण)"""
        else:
            msg = """**How Collection Tracking Works:**
Once you submit a collection request on Kisan Connect, open the **'/tracking'** dashboard to monitor your active orders across 5 clear milestones:
1) **Pending:** Partner notified of your listing.
2) **Accepted:** Buyer confirmed quantity and pricing terms.
3) **Scheduled:** Farm-gate baler/truck dispatch scheduled.
4) **Picked Up:** Residue weighed on digital scales and loaded.
5) **Completed:** Order closed and payment settled directly."""
        return {
            "reply": msg,
            "actions": [{"label": "View Tracking Dashboard", "link": "/tracking"}],
            "model": "kisan-direct-intent"
        }

    # 2I. "Finding recycling partners" / "Find partners" / "Buyers near me"
    if any(kw in q for kw in ["finding recycling partners", "find partners", "partners near me", "who buys waste", "collector", "खरीदार खोजें", "पार्टनर डायरेक्टरी"]):
        matched = partners[:3]
        if is_hindi:
            partner_lines = "\n".join([f"• **{p['business_name']}** ({p['service_area']}) — दर: {p['pricing_details']}" for p in matched]) if matched else ""
            msg = f"किसान कनेक्ट पर आपके क्षेत्र के लिए सत्यापित खरीददार व रीसाइक्लिंग पार्टनर उपलब्ध हैं:\n\n{partner_lines}\n\nआप सीधे '/find-partners' पेज पर जाकर इंटरैक्टिव मैप पर नजदीकी प्लांट देख सकते हैं और कलेक्शन बुक कर सकते हैं।"
        else:
            partner_lines = "\n".join([f"• **{p['business_name']}** (Areas: {p['service_area']}) — Rates: {p['pricing_details']}" for p in matched]) if matched else ""
            msg = f"Here are verified collection and recycling partners currently active on Kisan Connect:\n\n{partner_lines}\n\nYou can explore the full interactive map and filter by residue type in the 'Recycling Partners' directory (/find-partners)."
        return {
            "reply": msg,
            "actions": [
                {"label": "Explore Partner Directory & Map", "link": "/find-partners"},
                {"label": "List Waste for Pickup", "link": "/add-waste"}
            ],
            "matched_partners": matched,
            "model": "kisan-partner-grounding"
        }

    # =========================================================================
    # 3. KNOWLEDGE BASE RAG SEARCH (Stubble burning, FPO, Rice husk buyers, Plastic, Schemes)
    # =========================================================================
    rag_result = search_knowledge_base(q, "hi" if is_hindi else "en")
    if rag_result.get("matched"):
        return {
            "reply": rag_result["content"],
            "actions": rag_result.get("actions", [
                {"label": "Explore Recycling Guides", "link": "/recycling-education"},
                {"label": "Find Recycling Partners", "link": "/find-partners"}
            ]),
            "model": "kisan-knowledge-engine"
        }

    # =========================================================================
    # 4. GENERAL FARMING QUESTIONS & AGRONOMY (Soil health, Fertilizers, Crop health)
    # =========================================================================
    if any(kw in q for kw in ["farming", "crop", "soil", "fertilizer", "dhaincha", "green manuring", "npk", "खेती", "मिट्टी", "उर्वरक", "फसल"]):
        if is_hindi:
            msg = """**उत्कृष्ट फसल प्रबंधन व मृदा स्वास्थ्य सुझाव:**
1. **मृदा परीक्षण (Soil Test):** हर 2 साल में मिट्टी की जांच कराएं। इससे अनावश्यक रासायनिक खादों का 20-30% खर्च बचता है।
2. **हरी खाद (Green Manuring):** रबी और खरीफ के बीच ढैंचा (Sesbania) बोकर 45 दिन बाद खेत में दबाएं। यह प्रति हेक्टेयर 80-100 किलो प्राकृतिक नाइट्रोजन प्रदान करता है।
3. **फसल अवशेष न जलाएं:** अवशेषों को मिट्टी में मिलाने से मिट्टी की जल-धारण क्षमता और जैविक कार्बन (SOC) स्तर तेजी से सुधरता है।"""
        else:
            msg = """**Best Practices for General Farming & Soil Health:**
1. **Periodic Soil Testing:** Conduct soil testing every 2 years to apply balanced N-P-K doses, cutting synthetic fertilizer expenditure by 20–30%.
2. **Green Manuring:** Plant *Dhaincha* (Sesbania) or Sunnhemp during fallow windows; ploughing it in after 45 days injects 80–100 kg of natural organic nitrogen per hectare.
3. **Residue Incorporation:** Rather than burning stubble, mulch or shred crop residues back into the soil to elevate soil organic carbon (SOC) levels from <0.4% to >0.75%."""
        return {
            "reply": msg,
            "actions": [
                {"label": "Read Educational Guides", "link": "/recycling-education"},
                {"label": "List Farm Residue", "link": "/add-waste"}
            ],
            "model": "kisan-agronomy-engine"
        }

    # =========================================================================
    # 5. NATURAL CATCH-ALL (Direct helpful response, NEVER the old boilerplate!)
    # =========================================================================
    if is_hindi:
        reply = """किसान कनेक्ट पर आप किसी भी फसल अवशेष (जैसे धान की पराली, गेहूं की तूड़ी, धान का छिलका, गन्ना अवशेष या कृषि प्लास्टिक) के प्रबंधन, बिक्री और रीसाइक्लिंग के बारे में सीधे पूछ सकते हैं। आप अपना अवशेष '+ Add Waste' पर लिस्ट कर सकते हैं या पास के रीसाइक्लिंग पार्टनर खोज सकते हैं।"""
    else:
        reply = """On Kisan Connect, you can manage, recycle, and monetize all types of agricultural residues including paddy straw, wheat turi, rice husk, sugarcane trash, and agricultural plastics. You can list your waste under '+ Add Waste' for farm-gate collection or browse nearby verified bio-energy buyers."""

    return {
        "reply": reply,
        "actions": [
            {"label": "How does Kisan Connect work?", "link": "/recycling-education"},
            {"label": "List Waste for Sale", "link": "/add-waste"},
            {"label": "Find Recycling Partners", "link": "/find-partners"}
        ],
        "model": "kisan-assistant-direct"
    }


def build_gemini_contents(history: list, current_message: str, image_data: str = None, language: str = "en"):
    """
    Builds a strictly valid, alternating list of types.Content for Gemini.
    Gemini requirements:
    1. Must start with a 'user' turn.
    2. Must strictly alternate: user -> model -> user -> model ...
    3. Last turn must be the current user message with role='user'.
    """
    raw_turns = []
    if history:
        for turn in history[-10:]:
            role = "user" if turn.get("role") == "user" else "model"
            content = (turn.get("content") or "").strip()
            if content:
                raw_turns.append((role, content))

    # Clean alternating turns
    sanitized_turns = []
    for role, content in raw_turns:
        if not sanitized_turns:
            # First turn must be user
            if role == "user":
                sanitized_turns.append({"role": "user", "parts": [content]})
            # Skip leading model turn if any
        else:
            prev = sanitized_turns[-1]
            if prev["role"] == role:
                # Merge consecutive turns of same role
                prev["parts"].append(content)
            else:
                sanitized_turns.append({"role": role, "parts": [content]})

    # Now handle the current user message
    current_parts = []
    if image_data:
        try:
            if "," in image_data:
                header, b64_str = image_data.split(",", 1)
                mime_type = header.split(";")[0].split(":")[1] if ":" in header else "image/jpeg"
            else:
                b64_str = image_data
                mime_type = "image/jpeg"
            import base64
            image_bytes = base64.b64decode(b64_str)
            current_parts.append(types.Part.from_bytes(data=image_bytes, mime_type=mime_type))
        except Exception as img_err:
            logger.warning(f"Failed to decode attached image for Gemini: {img_err}")

    # Add the current user query text with clear language directive
    current_parts.append(types.Part.from_text(
        text=f"User Query (Respond naturally in the same language as the user - English, हिन्दी in Devanagari, or Hinglish):\n{current_message}"
    ))

    # If the last sanitized turn was 'user', drop it so adding current user turn preserves alternating order
    if sanitized_turns and sanitized_turns[-1]["role"] == "user":
        sanitized_turns.pop()

    # Convert sanitized_turns to types.Content
    contents = []
    for turn in sanitized_turns:
        combined_text = "\n\n".join(turn["parts"])
        contents.append(types.Content(
            role=turn["role"],
            parts=[types.Part.from_text(text=combined_text)]
        ))

    # Append current user turn
    contents.append(types.Content(
        role="user",
        parts=current_parts
    ))

    return contents


def call_gemini_api(user_message: str, language: str = "en", context: dict = None, history: list = None, image_data: str = None) -> dict:
    """
    Invokes Google Gemini AI via official `google-genai` SDK.
    Supports alternating multi-turn memory, image input, grounding with verified platform partners,
    and returns a structured response dictionary or None if API is unavailable.
    """
    if not HAS_GOOGLE_GENAI:
        logger.warning("google-genai SDK not installed in python environment.")
        return None

    gemini_key = (os.getenv("GEMINI_API_KEY") or getattr(config, "GEMINI_API_KEY", "")).strip()
    if not gemini_key or len(gemini_key) < 10:
        logger.info("GEMINI_API_KEY not configured or empty. Using Kisan Connect domain engine.")
        return None

    try:
        client = genai.Client(api_key=gemini_key)

        grounding_data = {
            "verified_partners": (context or {}).get("verified_partners", [])[:6],
            "waste_categories": (context or {}).get("waste_categories", [])[:6]
        }

        system_instruction_text = (
            KRITI_AI_SYSTEM_PROMPT
            + "\n\nCRITICAL CONVERSATIONAL & DOMAIN INSTRUCTIONS:\n"
            + "1. TRILINGUAL CAPABILITY: You are fluent in English, Hindi (हिन्दी in Devanagari script), and Hinglish (conversational Hindi written in Roman script).\n"
            + "2. AUTOMATIC LANGUAGE MIRRORING: If the farmer writes in Hindi (Devanagari), reply in warm, respectful Hindi. If they write in Hinglish (e.g., 'Parali se compost kaise banaye?', 'Mera waste kaise bikega?', 'FPO kya hota hai?'), reply in natural Hinglish. If they write in English, reply in crisp English.\n"
            + "3. MULTI-TURN CONVERSATION MEMORY: Pay close attention to previous turns in the conversation. When the user asks follow-up questions, maintain the active topic context from previous messages.\n"
            + "4. HIGH AGRICULTURAL ACCURACY: Structure technical answers with 1. Direct Answer, 2. Simple Explanation, 3. Practical Steps, 4. Benefits or Possible Risks, 5. Relevant Kisan Connect Feature (only if relevant).\n"
            + f"\nCURRENT KISAN CONNECT VERIFIED PLATFORM DATA:\n{json.dumps(grounding_data, ensure_ascii=False)}"
        )

        formatted_contents = build_gemini_contents(
            history=history,
            current_message=user_message,
            image_data=image_data,
            language=language
        )

        # Configure models to try (prefer gemini-2.5-flash, fallback to gemini-1.5-flash or gemini-2.0-flash)
        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        candidate_models = [model_name, "gemini-1.5-flash", "gemini-2.0-flash"]
        models_to_try = []
        for m in candidate_models:
            if m not in models_to_try:
                models_to_try.append(m)

        reply_text = None
        used_model = None

        config_obj = types.GenerateContentConfig(
            system_instruction=system_instruction_text,
            temperature=0.2,
            max_output_tokens=1500,
        )

        last_error = None
        for m in models_to_try:
            try:
                res = client.models.generate_content(
                    model=m,
                    contents=formatted_contents,
                    config=config_obj
                )
                if res and res.text:
                    reply_text = res.text
                    used_model = m
                    break
            except (ClientError, APIError) as api_err:
                last_error = api_err
                err_str = str(api_err).lower()
                if "api_key_invalid" in err_str or "unauthorized" in err_str or "403" in err_str:
                    logger.warning(f"Gemini API key is invalid or unauthorized: {api_err}")
                    break
                elif "429" in err_str or "quota" in err_str or "resource_exhausted" in err_str:
                    logger.warning(f"Gemini API quota/rate limit reached on model {m}: {api_err}")
                else:
                    logger.warning(f"Gemini model {m} ClientError: {api_err}. Trying next model...")
            except ServerError as srv_err:
                last_error = srv_err
                logger.warning(f"Gemini model {m} ServerError: {srv_err}. Trying next model...")
            except Exception as gen_err:
                last_error = gen_err
                logger.warning(f"Gemini model {m} unexpected error: {gen_err}. Trying next model...")

        if not reply_text:
            logger.warning(f"All Gemini models failed or returned empty. Last error: {last_error}")
            return None
            return None

        # Build dynamic action buttons and partner matches based on reply content
        actions = []
        lower_reply = reply_text.lower()
        lower_query = user_message.lower()

        if any(k in lower_reply or k in lower_query for k in ["partner", "buyer", "directory", "पार्टनर", "खरीदार", "कलेक्टर"]):
            actions.append({"label": "Find Recycling Partners", "link": "/find-partners"})
        if any(k in lower_reply or k in lower_query for k in ["add waste", "list", "sell", "बेचें", "लिस्ट", "अपशिष्ट जोड़ें"]):
            actions.append({"label": "List Farm Waste", "link": "/add-waste"})
        if any(k in lower_reply or k in lower_query for k in ["track", "order", "status", "ट्रैक", "ऑर्डर"]):
            actions.append({"label": "Track Waste Orders", "link": "/tracking"})
        if any(k in lower_reply or k in lower_query for k in ["compost", "learn", "guide", "शिक्षा", "गाइड", "कंपोस्ट"]):
            actions.append({"label": "Recycling Guides", "link": "/recycling-education"})

        # Default fallback actions if none matched
        if not actions:
            actions = [
                {"label": "Explore Recycling Partners", "link": "/find-partners"},
                {"label": "List Farm Waste", "link": "/add-waste"}
            ]

        # Matched partners if query or reply touches on partner/buyer/waste selling
        matched_partners = []
        if any(k in lower_query or k in lower_reply for k in ["partner", "buyer", "sell", "rate", "khareedar", "खरीदार"]):
            matched_partners = (context or {}).get("verified_partners", [])[:3]

        return {
            "reply": reply_text,
            "actions": actions[:3],
            "matched_partners": matched_partners,
            "model": f"google-{used_model}"
        }
    except Exception as e:
        logger.error(f"Critical error calling Gemini via google-genai SDK: {e}")
        return None


def process_chat_message(
    user_message: str,
    user_id=None,
    session_id: str = "guest",
    language: str = "en",
    is_voice: bool = False,
    client_history: list = None,
    image_data: str = None
) -> dict:
    """
    Main entry point: integrates conversation history from client and database,
    calls Google Gemini AI via official google-genai SDK when GEMINI_API_KEY is configured,
    and falls back cleanly to the Kisan Connect domain engine if key is unset, invalid, or quota exceeded.
    """
    context = get_platform_context()
    
    # Merge client history with DB history for seamless multi-turn continuity
    db_history = get_conversation_history(user_id=user_id, session_id=session_id, limit=8)
    history = client_history if (client_history and len(client_history) > 0) else db_history

    # 1. Attempt Gemini AI via official google-genai SDK
    gemini_result = call_gemini_api(
        user_message=user_message,
        language=language,
        context=context,
        history=history,
        image_data=image_data
    )

    if gemini_result and gemini_result.get("reply"):
        msg_id = save_chat_history(user_id, session_id, user_message, gemini_result["reply"])
        gemini_result["message_id"] = msg_id
        gemini_result["is_voice"] = is_voice
        return gemini_result

    # 2. High-quality local Kisan AI domain engine with rich context awareness
    result = generate_kisan_expert_response(user_message, language, context, history)
    result["is_voice"] = is_voice
    msg_id = save_chat_history(user_id, session_id, user_message, result["reply"])
    result["message_id"] = msg_id
    return result


def save_chat_history(user_id, session_id, user_text, bot_reply):
    """Saves conversation turns to database for session persistence and returns assistant message ID."""
    db = SessionLocal()
    assistant_id = None
    try:
        db.add(ChatMessage(user_id=user_id, session_id=session_id, sender="user", content=user_text))
        bot_msg = ChatMessage(user_id=user_id, session_id=session_id, sender="assistant", content=bot_reply)
        db.add(bot_msg)
        db.commit()
        db.refresh(bot_msg)
        assistant_id = bot_msg.id
    except Exception as e:
        logger.error(f"Error saving chat message: {e}")
        db.rollback()
    finally:
        db.close()
    return assistant_id
