from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models import Chat, Message
from services.ollama_ai import get_ai_response
from database import get_db
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: int
    message: str
    chat_id: int | None = None

@router.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    user_message = request.message
    user_id = request.user_id
    chat_id = request.chat_id

    if not user_message:
        raise HTTPException(status_code=400, detail="No message provided")
    
    if not chat_id:
        new_chat = Chat(user_id=user_id, title=f"Chat {user_id}")
        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)
        chat_id = new_chat.id
    else:
        chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user_id).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

    user_msg = Message(
        chat_id=chat_id,
        sender="user",
        content=user_message
    )
    db.add(user_msg)
    db.commit()

    try:
        bot_response = get_ai_response(user_message)
        bot_msg = Message(
            chat_id=chat_id,
            sender="ai",
            content=bot_response
        )
        db.add(bot_msg)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting AI response: {str(e)}")

    return {"chat_id": chat_id, "response": bot_response}

@router.get("/chats/{user_id}")
async def get_user_chats(user_id: int, db: Session = Depends(get_db)):
    chats = db.query(Chat).filter(Chat.user_id == user_id).all()
    return [{"id": chat.id, "title": chat.title} for chat in chats]

@router.get("/chat/{chat_id}/messages")
async def get_chat_messages(chat_id: int, user_id: int, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    messages = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at).all()
    return [{"sender": msg.sender, "text": msg.content} for msg in messages]

@router.delete("/chat/{chat_id}")
async def delete_chat(chat_id: int, user_id: int, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    db.delete(chat)
    db.commit()
    return {"message": "Chat deleted"}