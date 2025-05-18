from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from models import User
import bcrypt

router = APIRouter()

@router.post("/register")
async def register(data: dict, db: Session = Depends(get_db)):
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
async def login(data: dict, db: Session = Depends(get_db)):
    try:
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email y contraseña son obligatorios")

        # Verifique se a sessão do banco de dados está funcionando
        test_query = db.execute(text("SELECT 1"))
        if not test_query:
            raise HTTPException(status_code=500, detail="Error en la conexión con la base de datos")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=400, detail="Email y/o contraseña incorrectos")

        if not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
            raise HTTPException(status_code=400, detail="Email y/o contraseña incorrectos")

        return {
            "message": "Login con exito",
            "userId": user.id,
            "email": user.email
        }
    except Exception as e:
        print("Error interno en el login:", e)
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")