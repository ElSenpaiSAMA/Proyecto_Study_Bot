# services/ollama_ai.py
import requests
import re

OLLAMA_API_URL = "http://localhost:11434/api/generate"

def get_ai_response(user_message: str) -> str:
    response = requests.post(
        OLLAMA_API_URL,
        json={
            "model": "carol2",
            "prompt": f"Responde en español: {user_message}",
            "stream": False
        }
    )

    if not response.ok:
        raise Exception(f"Error communicating with Ollama: {response.text}")

    data = response.json()
    bot_response = data.get("response", "No response from AI")
    return re.sub(r'<think>.*?</think>', '', bot_response, flags=re.DOTALL).strip()
