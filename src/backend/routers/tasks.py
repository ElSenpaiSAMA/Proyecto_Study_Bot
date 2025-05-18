from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db
from models import Task, List as ListModel, Board

router = APIRouter(prefix="/lists/{list_id}/tasks", tags=["tasks"])

# Schemas
class TaskCreate(BaseModel):
    content: str
    description: str = ""
    position: float

class TaskUpdate(BaseModel):
    content: str
    description: str = ""
    position: float

class TaskResponse(BaseModel):
    id: int
    list_id: int
    content: str
    description: str
    position: float
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Endpoints
@router.post("/{user_id}", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(list_id: int, user_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    list_item = db.query(ListModel).join(Board).filter(
        ListModel.id == list_id, Board.user_id == user_id
    ).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="Lista no encontrada")
    new_task = Task(
        list_id=list_id,
        content=task.content,
        description=task.description,
        position=task.position
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/{user_id}", response_model=List[TaskResponse])
def get_tasks_by_list(list_id: int, user_id: int, db: Session = Depends(get_db)):
    list_item = db.query(ListModel).join(Board).filter(
        ListModel.id == list_id, Board.user_id == user_id
    ).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="Lista no encontrada")
    return db.query(Task).filter(Task.list_id == list_id).all()

@router.put("/{task_id}/{user_id}", response_model=TaskResponse)
def update_task(task_id: int, list_id: int, user_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).join(ListModel).join(Board).filter(
        Task.id == task_id, ListModel.id == list_id, Board.user_id == user_id
    ).first()
    if not task:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    task.content = task_data.content
    task.description = task_data.description
    task.position = task_data.position
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, list_id: int, user_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).join(ListModel).join(Board).filter(
        Task.id == task_id, ListModel.id == list_id, Board.user_id == user_id
    ).first()
    if not task:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    db.delete(task)
    db.commit()
    return {"message": "Tarea eliminada"}
