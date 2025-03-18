import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
else:
    print("Warning: DATABASE_URL not set. Using in-memory storage.")
    engine = None
    SessionLocal = None
    Base = None

def get_db():
    if SessionLocal:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()