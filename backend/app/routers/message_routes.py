import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database import get_db
from app.models import User, Conversation, Message, Notification
from app.schemas import MessageCreate, MessageOut, ConversationOut, ConversationCreate
from app.auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["Messages & Chat"])

@router.get("/conversations", response_model=List[ConversationOut])
def get_user_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    convs = db.query(Conversation).filter(
        or_(
            Conversation.participant1_id == current_user.id,
            Conversation.participant2_id == current_user.id
        )
    ).order_by(Conversation.last_message_at.desc()).all()

    results = []
    for c in convs:
        # compute unread count
        unread = db.query(Message).filter(
            Message.conversation_id == c.id,
            Message.sender_id != current_user.id,
            Message.is_read == False
        ).count()

        last_msg = db.query(Message).filter(
            Message.conversation_id == c.id
        ).order_by(Message.created_at.desc()).first()

        results.append(ConversationOut(
            id=c.id,
            participant1_id=c.participant1_id,
            participant2_id=c.participant2_id,
            subject=c.subject,
            context_type=c.context_type,
            context_id=c.context_id,
            last_message_at=c.last_message_at,
            created_at=c.created_at,
            participant1=c.participant1,
            participant2=c.participant2,
            unread_count=unread,
            last_message=last_msg
        ))

    return results

@router.post("/conversations", response_model=ConversationOut)
def start_or_get_conversation(
    data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id == data.recipient_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot message yourself.")

    recipient = db.query(User).filter(User.id == data.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipient user not found.")

    # Check if conversation already exists between these two
    existing = db.query(Conversation).filter(
        or_(
            and_(Conversation.participant1_id == current_user.id, Conversation.participant2_id == data.recipient_id),
            and_(Conversation.participant1_id == data.recipient_id, Conversation.participant2_id == current_user.id)
        )
    ).first()

    if not existing:
        existing = Conversation(
            participant1_id=current_user.id,
            participant2_id=data.recipient_id,
            subject=data.subject,
            context_type=data.context_type,
            context_id=data.context_id,
            last_message_at=datetime.datetime.utcnow()
        )
        db.add(existing)
        db.commit()
        db.refresh(existing)

    # If initial message provided
    if data.initial_message and data.initial_message.strip():
        msg = Message(
            conversation_id=existing.id,
            sender_id=current_user.id,
            content=data.initial_message.strip(),
            is_read=False
        )
        existing.last_message_at = datetime.datetime.utcnow()
        db.add(msg)
        db.commit()

    return ConversationOut(
        id=existing.id,
        participant1_id=existing.participant1_id,
        participant2_id=existing.participant2_id,
        subject=existing.subject,
        context_type=existing.context_type,
        context_id=existing.context_id,
        last_message_at=existing.last_message_at,
        created_at=existing.created_at,
        participant1=existing.participant1,
        participant2=existing.participant2,
        unread_count=0
    )

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageOut])
def get_conversation_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    if current_user.id not in [conv.participant1_id, conv.participant2_id] and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    # Mark incoming unread messages as read
    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).update({"is_read": True})
    db.commit()

    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).all()

    return messages

@router.post("/conversations/{conversation_id}/messages", response_model=MessageOut)
def send_message(
    conversation_id: int,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    if current_user.id not in [conv.participant1_id, conv.participant2_id] and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    if not data.content.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message content cannot be empty.")

    now = datetime.datetime.utcnow()
    new_msg = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        content=data.content.strip(),
        is_read=False,
        created_at=now
    )
    conv.last_message_at = now
    db.add(new_msg)

    # Notify recipient
    recipient_id = conv.participant2_id if conv.participant1_id == current_user.id else conv.participant1_id
    notif = Notification(
        user_id=recipient_id,
        title=f"New Message from {current_user.full_name}",
        message=data.content[:100] + ("..." if len(data.content) > 100 else ""),
        notification_type="message",
        reference_id=conv.id,
        reference_type="conversation"
    )
    db.add(notif)
    db.commit()
    db.refresh(new_msg)
    return new_msg

@router.get("/unread-count")
def get_unread_messages_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = db.query(Message).join(Conversation).filter(
        or_(
            Conversation.participant1_id == current_user.id,
            Conversation.participant2_id == current_user.id
        ),
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).count()
    return {"unread_count": count}
