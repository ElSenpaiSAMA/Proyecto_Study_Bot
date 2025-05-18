from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db
from models import Board

router = APIRouter(prefix="/boards", tags=["boards"])

# Schemas
class BoardCreate(BaseModel):
    title: str
    color: str

class BoardUpdate(BaseModel):
    title: str
    color: str

class BoardResponse(BaseModel):
    id: int
    user_id: int
    title: str
    color: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Endpoints
@router.post("/{user_id}", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
def create_board(user_id: int, board: BoardCreate, db: Session = Depends(get_db)):
    db_board = Board(user_id=user_id, title=board.title, color=board.color)
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

@router.get("/{user_id}", response_model=List[BoardResponse])
def get_boards_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Board).filter(Board.user_id == user_id).all()

@router.put("/{board_id}/{user_id}", response_model=BoardResponse)
def update_board(board_id: int, user_id: int, board_data: BoardUpdate, db: Session = Depends(get_db)):
    db_board = db.query(Board).filter(Board.id == board_id, Board.user_id == user_id).first()
    if not db_board:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    db_board.title = board_data.title
    db_board.color = board_data.color
    db.commit()
    db.refresh(db_board)
    return db_board

@router.delete("/{board_id}/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_board(board_id: int, user_id: int, db: Session = Depends(get_db)):
    db_board = db.query(Board).filter(Board.id == board_id, Board.user_id == user_id).first()
    if not db_board:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    db.delete(db_board)
    db.commit()
    return {"message": "Tablero eliminado"}
