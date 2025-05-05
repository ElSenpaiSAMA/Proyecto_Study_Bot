# routers/google_calendar.py
from fastapi import APIRouter, HTTPException, Request  # Adicionei Request aqui
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from pydantic import BaseModel  # Para o CodeRequest
from datetime import datetime, timezone
import os
import pathlib
from typing import Optional  # Para tipos opcionais
import traceback
from requests.exceptions import HTTPError  # lá no topo do arquivo

router = APIRouter()

# Configurações OAuth (mantenha as suas existentes)
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
BASE_DIR = pathlib.Path(__file__).parent.resolve()
GOOGLE_CLIENT_ID = "886174252578-en3septhgaed7n3c0t1bp68cbgjq9uan.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
REDIRECT_URI = "http://localhost:3000/planificador"
SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

# Modelo Pydantic para o POST
class CodeRequest(BaseModel):
    code: str
    scope: Optional[str] = None  # Adicionei como opcional
    authuser: Optional[int] = None
    prompt: Optional[str] = None

# Função auxiliar para criar o flow
def get_flow():
    return Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )

@router.get("/calendar/login")
async def login():
    try:
        flow = get_flow()
        auth_url, _ = flow.authorization_url(
            prompt="consent",
            access_type="offline",
            include_granted_scopes="true"
        )
        return RedirectResponse(auth_url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/calendar/exchange-code")
async def exchange_code(data: CodeRequest):
    try:
        print("Código recebido:", data.code) 
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            },
            scopes=SCOPES,
            redirect_uri=REDIRECT_URI,
        )
        flow.fetch_token(code=data.code)
        credentials = flow.credentials

        service = build("calendar", "v3", credentials=credentials)
        events_result = service.events().list(
            calendarId="primary",
            timeMin=datetime.now(timezone.utc).isoformat(),
            maxResults=50,
            singleEvents=True,
            orderBy="startTime"
        ).execute()

        events = events_result.get("items", [])

        formatted_events = []
        for event in events:
            start_data = event.get("start", {})
            end_data = event.get("end", {})
            is_all_day = "date" in start_data
            start = start_data.get("dateTime", start_data.get("date"))
            end = end_data.get("dateTime", end_data.get("date", start))

            formatted_events.append({
                "summary": event.get("summary", "Sem título"),
                "start": start,
                "end": end,
                "allDay": is_all_day,
                "description": event.get("description", ""),
                "location": event.get("location", "")
            })

        return formatted_events

    except HTTPError as e:
        # Mostra a resposta que o Google retorna
        print("Erro do Google:", e.response.text)
        raise HTTPException(status_code=400, detail="Erro do Google: " + e.response.text)

    except Exception as e:
        print("Erro completo:", traceback.format_exc())
        raise HTTPException(status_code=400, detail=f"Erro ao trocar o code: {str(e)}")
    