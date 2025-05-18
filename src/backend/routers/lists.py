from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import Session
from database import get_db
from models import List as ListModel, Board

router = APIRouter(prefix="/boards/{board_id}/lists", tags=["lists"])

# Schemas
class ListCreate(BaseModel):
    title: str
    position: float

class ListUpdate(BaseModel):
    title: str
    position: float

class ListResponse(BaseModel):
    id: int
    board_id: int
    title: str
    position: float
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Endpoints
@router.post("/{user_id}", response_model=ListResponse, status_code=status.HTTP_201_CREATED)
def create_list(board_id: int, user_id: int, list_data: ListCreate, db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id, Board.user_id == user_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Tablero no encontrado")
    new_list = ListModel(board_id=board_id, title=list_data.title, position=list_data.position)
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list

@router.get("/{user_id}", response_model=List[ListResponse])
def get_lists_by_board(board_id: int, user_id: int, db: Session = Depends(get_db)):
    board = db.query(Board).filter(Board.id == board_id, Board.user_id == user_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Tablero no encontrado")
    return db.query(ListModel).filter(ListModel.board_id == board_id).all()

@router.put("/{list_id}/{user_id}", response_model=ListResponse)
def update_list(board_id: int, list_id: int, user_id: int, list_data: ListUpdate, db: Session = Depends(get_db)):
    list_item = db.query(ListModel).join(Board).filter(
        ListModel.id == list_id, Board.user_id == user_id
    ).first()
    if not list_item:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    list_item.title = list_data.title
    list_item.position = list_data.position
    db.commit()
    db.refresh(list_item)
    return list_item

@router.delete("/{list_id}/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_list(board_id: int, list_id: int, user_id: int, db: Session = Depends(get_db)):
    list_item = db.query(ListModel).join(Board).filter(
        ListModel.id == list_id, Board.user_id == user_id
    ).first()
    if not list_item:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    db.delete(list_item)
    db.commit()
    return {"message": "Lista eliminada"}
