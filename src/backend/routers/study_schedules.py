from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from models import StudySchedule  
from database import get_db

router = APIRouter()

class StudyScheduleCreate(BaseModel):
    user_id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    reminder: Optional[bool] = False

class StudyScheduleResponse(StudyScheduleCreate):
    id: int
    created_at: datetime

@router.post("/study-schedules/", response_model=StudyScheduleResponse)
def create_schedule(schedule: StudyScheduleCreate, db: Session = Depends(get_db)):
    db_schedule = StudySchedule(**schedule.dict())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.get("/study-schedules/{user_id}", response_model=list[StudyScheduleResponse])
def get_schedules(user_id: int, db: Session = Depends(get_db)):
    return db.query(StudySchedule).filter(StudySchedule.user_id == user_id).all()