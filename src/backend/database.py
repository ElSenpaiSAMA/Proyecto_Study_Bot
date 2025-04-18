<<<<<<< HEAD
# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:root@localhost/study_manager"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
=======
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
>>>>>>> f7af789180835ec38fde8888e07990727b727f0f
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
