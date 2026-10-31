from flask import Blueprint, request, jsonify, g
from app.auth.service import decode_access_token
from app.database.connection import SessionLocal
from app.database.models import ChatMessage, User
from app.ai_assistant.chatbot_service import process_chat_message

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    session_id = data.get("session_id", "guest")
    language = data.get("language", "en") # 'en' or 'hi'
    is_voice = bool(data.get("is_voice", False))
    client_history = data.get("history", [])
    image = data.get("image", None)

    if not message and not image:
        return jsonify({"error": "Message or image is required"}), 400
    if not message and image:
        message = "कृपया इस फोटो से खेत के अपशिष्ट की पहचान करें और रीसाइक्लिंग उपाय बताएं।" if language == "hi" else "Please identify this agricultural waste photo and suggest valorization options."

    # Optional auth header check
    user_id = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        payload = decode_access_token(auth_header.split(" ")[1])
        if payload:
            user_id = payload.get("user_id")

    response = process_chat_message(
        user_message=message,
        user_id=user_id,
        session_id=session_id,
        language=language,
        is_voice=is_voice,
        client_history=client_history,
        image_data=image
    )
    response["assistant_name"] = "KRITI AI"
    response["tagline"] = "Your Smart Agricultural Assistant"
    return jsonify(response), 200


@ai_bp.route("/history", methods=["GET"])
def get_history():
    session_id = request.args.get("session_id", "guest")
    user_id = None

    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        payload = decode_access_token(auth_header.split(" ")[1])
        if payload:
            user_id = payload.get("user_id")

    db = SessionLocal()
    try:
        query = db.query(ChatMessage)
        if user_id:
            query = query.filter((ChatMessage.user_id == user_id) | (ChatMessage.session_id == session_id))
        else:
            query = query.filter_by(session_id=session_id)

        messages = query.order_by(ChatMessage.created_at.asc()).limit(40).all()
        return jsonify({
            "assistant": "KRITI AI",
            "messages": [m.to_dict() for m in messages]
        }), 200
    finally:
        db.close()


@ai_bp.route("/suggested-prompts", methods=["GET"])
def get_suggested_prompts():
    return jsonify({
        "prompts_en": [
            "How can I recycle crop residue?",
            "How do I make organic compost?",
            "Where can I sell agricultural waste?",
            "How does Kisan Connect work?",
            "What can I do with paddy straw?",
            "What government schemes are available for farmers?"
        ],
        "prompts_hi": [
            "फसल अवशेष (पराली) की रीसाइक्लिंग कैसे करें?",
            "जैविक खाद (कंपोस्ट) कैसे बनाएं?",
            "कृषि अपशिष्ट कहां बेच सकते हैं?",
            "किसान कनेक्ट प्लेटफॉर्म कैसे काम करता है?",
            "धान की पराली का क्या उपयोग हो सकता है?",
            "किसानों के लिए कौन-सी सरकारी योजनाएं हैं?"
        ]
    }), 200


@ai_bp.route("/rate", methods=["POST"])
def rate():
    data = request.get_json() or {}
    message_id = data.get("message_id")
    rating = data.get("rating")
    feedback = data.get("feedback", "")

    if message_id is None or rating is None:
        return jsonify({"error": "message_id and rating are required"}), 400

    try:
        rating_int = int(rating)
        if rating_int < 1 or rating_int > 5:
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid rating format"}), 400

    db = SessionLocal()
    try:
        # If client passes numeric message_id, update database
        if isinstance(message_id, int) or (isinstance(message_id, str) and message_id.isdigit()):
            msg = db.query(ChatMessage).filter_by(id=int(message_id)).first()
            if msg:
                msg.rating = rating_int
                if feedback:
                    msg.feedback = str(feedback)[:255]
                db.commit()
                return jsonify({
                    "success": True,
                    "message": "Thanks for your feedback!",
                    "message_id": int(message_id),
                    "rating": rating_int
                }), 200

        # Guest or client-generated message_id handled gracefully
        return jsonify({
            "success": True,
            "message": "Thanks for your feedback!",
            "message_id": message_id,
            "rating": rating_int
        }), 200
    finally:
        db.close()


@ai_bp.route("/clear", methods=["POST"])
def clear_history():
    session_id = request.args.get("session_id", "guest")
    db = SessionLocal()
    try:
        db.query(ChatMessage).filter_by(session_id=session_id).delete()
        db.commit()
        return jsonify({"message": "Chat history cleared", "assistant": "KRITI AI"}), 200
    finally:
        db.close()


@ai_bp.route("/status", methods=["GET"])
def get_ai_status():
    import os
    from config import config
    key = (os.getenv("GEMINI_API_KEY") or getattr(config, "GEMINI_API_KEY", "")).strip()
    is_configured = bool(key and len(key) >= 10)
    return jsonify({
        "gemini_active": is_configured,
        "model": getattr(config, "GEMINI_MODEL", "gemini-2.5-flash"),
        "assistant_name": "KRITI AI",
        "tagline": "Your Smart Agricultural Assistant",
        "message": "Real-time Google Gemini AI is active" if is_configured else "Running in built-in mode. Add GEMINI_API_KEY to enable real-time generative AI."
    }), 200


@ai_bp.route("/set-key", methods=["POST"])
def set_gemini_key():
    import os
    import re
    from pathlib import Path
    from config import config

    data = request.get_json() or {}
    key = data.get("api_key", "").strip()

    if not key or len(key) < 15:
        return jsonify({"error": "Invalid API key format. Key should be at least 15 characters."}), 400

    # Update in-memory environment
    os.environ["GEMINI_API_KEY"] = key
    config.GEMINI_API_KEY = key

    # Update backend/.env file
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    try:
        if env_path.exists():
            content = env_path.read_text(encoding="utf-8")
            if "GEMINI_API_KEY=" in content:
                content = re.sub(r'GEMINI_API_KEY=.*', f'GEMINI_API_KEY="{key}"', content)
            else:
                content += f'\nGEMINI_API_KEY="{key}"\n'
            env_path.write_text(content, encoding="utf-8")
    except Exception as e:
        pass

    return jsonify({
        "success": True,
        "message": "Gemini API Key successfully updated! Real-time AI generation is now active.",
        "model": getattr(config, "GEMINI_MODEL", "gemini-2.5-flash")
    }), 200
