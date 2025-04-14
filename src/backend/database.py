from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

<<<<<<< HEAD
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # SQLite local database
=======
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  
>>>>>>> fec83c1c2c03013d5db03457093750f5a40a3c58

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
