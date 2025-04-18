<<<<<<< HEAD
<<<<<<< HEAD
from sqlalchemy import Column, Integer, String
=======
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
>>>>>>> f7af789180835ec38fde8888e07990727b727f0f
=======
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
>>>>>>> origin/Gustavo
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

<<<<<<< HEAD
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
<<<<<<< HEAD
=======
class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, autoincrement=True)
    messages = relationship("Message", back_populates="chat", cascade="all, delete")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, autoincrement=True)
    sender = Column(String, nullable=False)
    text = Column(String, nullable=False)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    chat = relationship("Chat", back_populates="messages")
>>>>>>> f7af789180835ec38fde8888e07990727b727f0f
=======

    study_schedules = relationship("StudySchedule", back_populates="user")

class StudySchedule(Base):
    __tablename__ = "study_schedules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    title = Column(String(255))
    description = Column(Text)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    reminder = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relación con user
    user = relationship("User", back_populates="study_schedules")
>>>>>>> origin/Gustavo
