from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import re

app = FastAPI()

# Configurar CORS para permitir solicitudes desde el frontend
FRONTEND_URL = "http://localhost:3000"  # Cambia esto si tienes un dominio en producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

OLLAMA_API_URL = "http://localhost:11434/api/generate"

@app.post("/chat")
async def chat(request: dict):
    user_message = request.get("message")
    if not user_message:
        raise HTTPException(status_code=400, detail="No message provided")

    response = requests.post(
        OLLAMA_API_URL,
        json={
            "model": "carol2",
            "prompt": f"Responde en español: {user_message}",
            "stream": False
        }
    )

    if not response.ok:
        raise HTTPException(status_code=500, detail=f"Error communicating with Ollama: {response.text}")

    data = response.json()
    bot_response = data.get("response", "No response from AI")

    bot_response = re.sub(r'<think>.*?</think>', '', bot_response, flags=re.DOTALL).strip()

    return {"response": bot_response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
