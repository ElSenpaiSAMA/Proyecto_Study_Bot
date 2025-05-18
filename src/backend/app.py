from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, chat, google_calendar, study_schedules, examen_generator, tasks, boards, lists
import requests
import re

app = FastAPI()

FRONTEND_URL = "http://localhost:3000" 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(auth.router)
app.include_router(google_calendar.router)
app.include_router(study_schedules.router)
app.include_router(examen_generator.router)
app.include_router(tasks.router)
app.include_router(boards.router)
app.include_router(lists.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
