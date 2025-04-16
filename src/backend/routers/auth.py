# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
import bcrypt

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        raise HTTPException(status_code=400, detail="Todos os campos são obrigatórios")
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="A senha deve ter no mínimo 8 caracteres")

    existing_user = db.query(User).filter_by(email=email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já registrado")

    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    new_user = User(name=name, email=email, password_hash=password_hash)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Usuário criado com sucesso"}

@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email e senha obrigatórios")

    user = db.query(User).filter_by(email=email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Email e/ou senha incorretos")

    if not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
        raise HTTPException(status_code=400, detail="Email e/ou senha incorretos")

    return {
        "message": "Login feito com sucesso",
        "userId": user.id,
        "email": user.email
    }
