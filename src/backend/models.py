# models.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey,Boolean,Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    study_schedules = relationship("StudySchedule", back_populates="user")
    boards = relationship("Board", back_populates="user")
    chats = relationship("Chat", back_populates="user")

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    
    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat", cascade="all, delete")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, autoincrement=True)
    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"))
    sender = Column(Enum('user', 'ai'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    chat = relationship("Chat", back_populates="messages")

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
    
    user = relationship("User", back_populates="study_schedules")

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    color = Column(String(7), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="boards")
    lists = relationship("List", back_populates="board", cascade="all, delete")

class List(Base):
    __tablename__ = "lists"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    position = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    board = relationship("Board", back_populates="lists")
    tasks = relationship("Task", back_populates="list", cascade="all, delete")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    list_id = Column(Integer, ForeignKey("lists.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    description = Column(Text)
    position = Column(Float, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    list = relationship("List", back_populates="tasks")