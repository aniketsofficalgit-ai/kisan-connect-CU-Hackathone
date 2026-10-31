from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, AIConversation
from app.schemas import AIChatRequest, AIChatResponse
from app.services.ai_service import get_ai_guidance
from app.auth import get_current_user_optional

router = APIRouter(prefix="/api/ai", tags=["Multilingual AI Voice Assistant"])

@router.post("/ask", response_model=AIChatResponse)
async def ask_assistant(
    req: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query_text = req.query.strip()
    lang = req.language or "en"
    guidance = await get_ai_guidance(query=query_text, language=lang)

    # Persist in AI conversation history
    user_id = current_user.id if current_user else None
    conv_log = AIConversation(
        user_id=user_id,
        session_id=req.session_id or "default",
        user_query=query_text,
        assistant_response=guidance["response"],
        language=lang,
        topic=guidance.get("topic")
    )
    db.add(conv_log)
    db.commit()

    return AIChatResponse(
        response=guidance["response"],
        language=lang,
        audio_base64=None,
        disclaimer=guidance["disclaimer"],
        topic=guidance.get("topic"),
        related_actions=guidance.get("related_actions")
    )

@router.get("/history")
def get_ai_history(
    session_id: Optional[str] = "default",
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(AIConversation)
    if current_user:
        query = query.filter(AIConversation.user_id == current_user.id)
    else:
        query = query.filter(AIConversation.session_id == session_id)

    logs = query.order_by(AIConversation.created_at.asc()).limit(30).all()
    return [
        {
            "id": log.id,
            "query": log.user_query,
            "response": log.assistant_response,
            "language": log.language,
            "topic": log.topic,
            "created_at": log.created_at.isoformat()
        }
        for log in logs
    ]
