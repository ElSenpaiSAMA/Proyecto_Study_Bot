# routers/chat.py
from fastapi import APIRouter, HTTPException
from services.ollama_ai import get_ai_response

router = APIRouter()

@router.post("/chat")
async def chat(request: dict):
    user_message = request.get("message")
    if not user_message:
        raise HTTPException(status_code=400, detail="No message provided")
    
    bot_response = get_ai_response(user_message)
    return {"response": bot_response}
