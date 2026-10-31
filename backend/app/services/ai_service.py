import re
from typing import Dict, Any, Optional, List
import httpx
from app.config import settings

# Expert Agricultural Knowledge Base for English, Hindi, and Punjabi
KNOWLEDGE_BASE = {
    "en": {
        "irrigation": (
            "Water management depends on your crop growth stage and soil type. "
            "For wheat, critical irrigation stages are Crown Root Initiation (20-25 days after sowing), "
            "tillering, flowering, and grain filling. Always check soil moisture 4-6 inches below the surface before watering. "
            "Avoid standing water to prevent root rot."
        ),
        "machinery": (
            "You can discover and book nearby machinery in the Kisan Connect Machinery section! "
            "We have verified listings for Tractors (Mahindra, John Deere, Sonalika), Combine Harvesters, "
            "Laser Levelers, and Seed Drills with or without operators. Check rental rates per hour or per day."
        ),
        "workers": (
            "To hire agricultural workers, visit the 'Find Workers' section. You can filter by work type "
            "(Harvesting, Sowing, Tilling, Spraying), view expected daily wages, experience, and group sizes, "
            "and send direct booking requests to local laborers."
        ),
        "weather": (
            "You can monitor live weather and 7-day agricultural forecasts on our Weather page. "
            "Our system advises whether wind and humidity are suitable for pesticide spraying or if rain "
            "is expected so you can adjust your irrigation schedules safely."
        ),
        "crop_listing": (
            "To list your produce for sale, open 'Crop Marketplace' and click 'Sell Your Crop'. "
            "Provide crop variety, quantity (in quintals or kg), asking price, harvest date, and quality grade. "
            "Verified buyers will contact you directly with purchase offers."
        ),
        "pest_disease": (
            "For pest and fungal control, early detection is essential. Use yellow sticky traps for sucking pests like whiteflies "
            "and aphids. For fungal leaf spot or rust, ensure proper field aeration and avoid excess nitrogen. "
            "Always follow label safety directions. For severe infestations, consult your nearest Krishi Vigyan Kendra (KVK) "
            "or local agricultural officer for certified diagnosis."
        ),
        "fertilizer": (
            "A balanced NPK (Nitrogen, Phosphorus, Potassium) ratio based on a recent Soil Health Card is recommended. "
            "Incorporate well-rotted farmyard manure (FYM) to improve soil organic carbon. "
            "Apply nitrogen in split doses rather than all at once to minimize leaching."
        ),
        "general": (
            "Welcome to Kisan Connect! I am your agricultural companion. You can ask me about crop watering, "
            "finding workers, renting tractors, listing your harvest for sale, or understanding current weather forecasts. "
            "How can I assist your farm today?"
        )
    },
    "hi": {
        "irrigation": (
            "फसल की सिंचाई फसल की अवस्था और मिट्टी की नमी पर निर्भर करती है। "
            "गेहूं में सीआरआई (CRI) अवस्था (बुवाई के 20-25 दिन बाद), कल्ले फूटने और दाना भरते समय सिंचाई अत्यंत महत्वपूर्ण है। "
            "पानी लगाने से पहले 4-6 इंच गहराई पर मिट्टी की नमी अवश्य जांचें। जलभराव से बचें।"
        ),
        "machinery": (
            "आप किसान कनेक्ट के 'मशीनरी' अनुभाग में नजदीकी कृषि यंत्र किराए पर ले सकते हैं! "
            "यहाँ ट्रैक्टर, कंबाइन हार्वेस्टर, लेजर लैंड लेवलर, और सीड ड्रिल उचित दरों पर उपलब्ध हैं। "
            "आप प्रति घंटा या प्रतिदिन के हिसाब से सीधे बुकिंग अनुरोध भेज सकते हैं।"
        ),
        "workers": (
            "कृषि मजदूर खोजने के लिए 'मजदूर खोजें' (Find Workers) पेज पर जाएं। "
            "आप कटाई, बुवाई, निराई-गुड़ाई या छिड़काव के लिए कुशल मजदूरों की सूची देख सकते हैं, "
            "उनकी दैनिक मजदूरी जांच सकते हैं और सीधे काम का प्रस्ताव भेज सकते हैं।"
        ),
        "weather": (
            "हमारे 'मौसम' पेज पर अपने क्षेत्र का सटीक तापमान, बारिश की संभावना और 7 दिनों का पूर्वानुमान देखें। "
            "हमारा सिस्टम यह भी सलाह देता है कि मौसम कीटनाशक छिड़काव और सिंचाई के अनुकूल है या नहीं।"
        ),
        "crop_listing": (
            "अपनी फसल बेचने के लिए 'फसल बाजार' में 'फसल बेचें' बटन पर क्लिक करें। "
            "फसल का नाम, किस्म, मात्रा (क्विंटल में), अपेक्षित मूल्य और कटाई की तारीख दर्ज करें। "
            "सत्यापित खरीदार आपसे सीधे संपर्क करेंगे।"
        ),
        "pest_disease": (
            "कीट और रोग नियंत्रण के लिए शुरुआत में ही रोकथाम करें। रस चूसक कीटों के लिए पीले चिपचिपे ट्रैप लगाएं। "
            "फफूंद जनित रोगों के लिए खेत में उचित वायु संचार रखें और आवश्यकता से अधिक यूरिया न डालें। "
            "गंभीर प्रकोप की स्थिति में उचित उपचार के लिए अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से संपर्क करें।"
        ),
        "fertilizer": (
            "मृदा स्वास्थ्य कार्ड (Soil Health Card) की रिपोर्ट के अनुसार ही एनपीके (NPK) खाद का संतुलित प्रयोग करें। "
            "भूमि की उर्वरा शक्ति बनाए रखने के लिए सड़ी हुई गोबर की खाद (FYM) जरूर मिलाएं। "
            "नाइट्रोजन (यूरिया) को एक साथ डालने के बजाय 2-3 बार में दें।"
        ),
        "general": (
            "किसान कनेक्ट में आपका स्वागत है! मैं आपका डिजिटल कृषि सहायक हूँ। "
            "आप मुझसे सिंचाई, मजदूर खोजने, ट्रैक्टर किराए पर लेने, फसल बेचने या मौसम की जानकारी के बारे में पूछ सकते हैं। "
            "आज मैं आपकी खेती में क्या सहायता कर सकता हूँ?"
        )
    },
    "pa": {
        "irrigation": (
            "ਫਸਲ ਨੂੰ ਪਾਣੀ ਲਗਾਉਣ ਦਾ ਸਮਾਂ ਫਸਲ ਦੀ ਸਥਿਤੀ ਅਤੇ ਮਿੱਟੀ ਦੀ ਨਮੀ 'ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ। "
            "ਕਣਕ ਲਈ ਪਹਿਲਾ ਪਾਣੀ (ਕੋਰ ਪਾਣੀ) ਬਿਜਾਈ ਤੋਂ 20-25 ਦਿਨ ਬਾਅਦ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੁੰਦਾ ਹੈ। "
            "ਵਾਧੂ ਪਾਣੀ ਖੇਤ ਵਿੱਚ ਖੜ੍ਹਾ ਨਾ ਹੋਣ ਦਿਓ ਤਾਂ ਜੋ ਜੜ੍ਹਾਂ ਨਾ ਗਲਣ।"
        ),
        "machinery": (
            "ਤੁਸੀਂ ਕਿਸਾਨ ਕਨੈਕਟ ਦੇ 'ਮਸ਼ੀਨਰੀ' ਸੈਕਸ਼ਨ ਵਿੱਚ ਨੇੜਲੇ ਟਰੈਕਟਰ, ਕੰਬਾਈਨ ਹਾਰਵੈਸਟਰ, ਲੇਜ਼ਰ ਲੈਵਲਰ ਅਤੇ ਸੀਡ ਡਰਿੱਲ "
            "ਕਿਰਾਏ 'ਤੇ ਲੈ ਸਕਦੇ ਹੋ। ਘੰਟੇ ਜਾਂ ਦਿਨ ਦੇ ਹਿਸਾਬ ਨਾਲ ਬੁਕਿੰਗ ਕਰੋ।"
        ),
        "workers": (
            "ਵਾਢੀ, ਬਿਜਾਈ ਜਾਂ ਸਪਰੇਅ ਲਈ ਮਜ਼ਦੂਰ ਲੱਭਣ ਲਈ 'ਮਜ਼ਦੂਰ ਲੱਭੋ' (Find Workers) ਪੇਜ ਵੇਖੋ। "
            "ਤੁਸੀਂ ਦਿਹਾੜੀ ਅਤੇ ਕੰਮ ਦੇ ਤਜਰਬੇ ਅਨੁਸਾਰ ਸਿੱਧਾ ਕੰਮ ਦੀ ਬੇਨਤੀ ਭੇਜ ਸਕਦੇ ਹੋ।"
        ),
        "weather": (
            "ਸਾਡੇ 'ਮੌਸਮ' ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਆਪਣੇ ਜ਼ਿਲ੍ਹੇ ਦਾ ਮੌਸਮ, ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਅਤੇ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਵੇਖੋ। "
            "ਇਹ ਤੁਹਾਨੂੰ ਦੱਸੇਗਾ ਕਿ ਸਪਰੇਅ ਜਾਂ ਸਿੰਚਾਈ ਲਈ ਅੱਜ ਦਾ ਦਿਨ ਢੁਕਵਾਂ ਹੈ ਜਾਂ ਨਹੀਂ।"
        ),
        "crop_listing": (
            "ਆਪਣੀ ਫਸਲ ਵੇਚਣ ਲਈ 'ਫਸਲ ਮਾਰਕੀਟ' ਵਿੱਚ ਆਪਣੀ ਫਸਲ, ਕਿਸਮ, ਮਾਤਰਾ (ਕੁਇੰਟਲ) ਅਤੇ ਰੇਟ ਦਰਜ ਕਰੋ। "
            "ਖਰੀਦਦਾਰ ਸਿੱਧਾ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਨਗੇ।"
        ),
        "pest_disease": (
            "ਕੀੜਿਆਂ ਅਤੇ ਬਿਮਾਰੀਆਂ ਦੀ ਰੋਕਥਾਮ ਲਈ ਸਮੇਂ ਸਿਰ ਧਿਆਨ ਦੇਣਾ ਜ਼ਰੂਰੀ ਹੈ। "
            "ਗੰਭੀਰ ਬਿਮਾਰੀ ਜਾਂ ਕੀੜੇ ਦੇ ਹਮਲੇ ਦੀ ਸੂਰਤ ਵਿੱਚ ਪੰਜਾਬ ਐਗਰੀਕਲਚਰਲ ਯੂਨੀਵਰਸਿਟੀ (PAU) ਜਾਂ ਨੇੜਲੇ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ (KVK) ਦੇ ਮਾਹਿਰਾਂ ਦੀ ਸਲਾਹ ਜ਼ਰੂਰ ਲਵੋ।"
        ),
        "fertilizer": (
            "ਮਿੱਟੀ ਪਰਖ ਰਿਪੋਰਟ ਦੇ ਅਨੁਸਾਰ ਹੀ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਰੂੜੀ ਦੀ ਖਾਦ ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਲਈ ਬਹੁਤ ਫਾਇਦੇਮੰਦ ਹੈ। "
            "ਯੂਰੀਆ ਨੂੰ ਵੰਡ ਕੇ ਪਾਓ।"
        ),
        "general": (
            "ਕਿਸਾਨ ਕਨੈਕਟ 'ਤੇ ਜੀ ਆਇਆਂ ਨੂੰ! ਮੈਂ ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। "
            "ਤੁਸੀਂ ਮੇਰੇ ਕੋਲੋਂ ਫਸਲਾਂ, ਮਸ਼ੀਨਰੀ ਕਿਰਾਏ 'ਤੇ ਲੈਣ, ਮਜ਼ਦੂਰ ਲੱਭਣ ਜਾਂ ਮੌਸਮ ਬਾਰੇ ਜਾਣਕਾਰੀ ਲੈ ਸਕਦੇ ਹੋ। "
            "ਦੱਸੋ ਜੀ, ਅੱਜ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?"
        )
    }
}

DISCLAIMER_MAP = {
    "en": "General guidance based on standard agronomic practices. For field-specific chemical dosages or severe disease outbreaks, please consult your local Agricultural Extension Officer or Krishi Vigyan Kendra (KVK).",
    "hi": "सामान्य कृषि पद्धतियों पर आधारित सलाह। कीटनाशक की सटीक मात्रा या गंभीर रोग प्रकोप के लिए कृपया अपने स्थानीय कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से परामर्श लें।",
    "pa": "ਆਮ ਖੇਤੀਬਾੜੀ ਸਲਾਹ। ਕੀਟਨਾਸ਼ਕਾਂ ਦੀ ਸਹੀ ਮਾਤਰਾ ਜਾਂ ਗੰਭੀਰ ਸਮੱਸਿਆ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਨਜ਼ਦੀਕੀ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ (KVK) ਜਾਂ ਖੇਤੀਬਾੜੀ ਅਧਿਕਾਰੀ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।"
}

def detect_topic(query: str) -> str:
    q = query.lower()
    if any(w in q for w in ["water", "irrigate", "irrigation", "पानी", "सिंचाई", "ਪਾਣੀ"]):
        return "irrigation"
    if any(w in q for w in ["tractor", "machinery", "machine", "harvester", "seeder", "उपकरण", "ट्रैक्टर", "ਮਸ਼ੀਨਰੀ", "ਟਰੈਕਟਰ"]):
        return "machinery"
    if any(w in q for w in ["worker", "labor", "labour", "hire", "manpower", "मजदूर", "श्रमिक", "ਮਜ਼ਦੂਰ", "ਕਾਮੇ"]):
        return "workers"
    if any(w in q for w in ["weather", "rain", "temperature", "forecast", "wind", "मौसम", "बारिश", "ਤਾਪਮਾਨ", "ਮੀਂਹ"]):
        return "weather"
    if any(w in q for w in ["sell", "buyer", "market", "mandi", "crop price", "rate", "फसल बेच", "मंडी", "ਖਰੀਦਦਾਰ", "ਵੇਚ"]):
        return "crop_listing"
    if any(w in q for w in ["pest", "disease", "insect", "fungus", "spray", "कीड़ा", "रोग", "कीटनाशक", "ਸਪਰੇਅ", "ਕੀੜੇ", "ਬਿਮਾਰੀ"]):
        return "pest_disease"
    if any(w in q for w in ["fertilizer", "urea", "dap", "npk", "manure", "खाद", "यूरिया", "ਖਾਦ"]):
        return "fertilizer"
    return "general"

async def get_ai_guidance(query: str, language: str = "en") -> Dict[str, Any]:
    lang = language.lower()
    if lang not in ["en", "hi", "pa"]:
        lang = "en"

    topic = detect_topic(query)
    lang_kb = KNOWLEDGE_BASE.get(lang, KNOWLEDGE_BASE["en"])
    base_response = lang_kb.get(topic, lang_kb["general"])

    # If external OpenAI API Key is configured, attempt intelligent augmentation
    if settings.OPENAI_API_KEY:
        try:
            system_prompt = (
                f"You are Kisan Connect AI, a farmer-friendly agricultural assistant. "
                f"Respond in {lang.upper()} language. Keep explanations concise, practical, and empathetic. "
                f"Advise consulting local Krishi Vigyan Kendra (KVK) for critical chemical prescriptions."
            )
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": query}
                        ],
                        "max_tokens": 400,
                        "temperature": 0.4
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    openai_text = data["choices"][0]["message"]["content"]
                    return {
                        "response": openai_text,
                        "language": lang,
                        "topic": topic,
                        "disclaimer": DISCLAIMER_MAP.get(lang, DISCLAIMER_MAP["en"]),
                        "related_actions": get_related_actions(topic, lang)
                    }
        except Exception:
            # Silently fallback to built-in knowledge base
            pass

    return {
        "response": base_response,
        "language": lang,
        "topic": topic,
        "disclaimer": DISCLAIMER_MAP.get(lang, DISCLAIMER_MAP["en"]),
        "related_actions": get_related_actions(topic, lang)
    }

def get_related_actions(topic: str, lang: str) -> List[Dict[str, str]]:
    actions = []
    if topic == "workers":
        actions.append({"label": "Browse Workers", "url": "/workers"})
    elif topic == "machinery":
        actions.append({"label": "Rent Machinery", "url": "/machinery"})
    elif topic == "crop_listing":
        actions.append({"label": "Sell Crops", "url": "/crops/create"})
        actions.append({"label": "View Market", "url": "/crops"})
    elif topic == "weather":
        actions.append({"label": "View Weather Advisory", "url": "/weather"})
    else:
        actions.append({"label": "Open Dashboard", "url": "/dashboard"})
    return actions
