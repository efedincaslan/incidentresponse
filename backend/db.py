import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)

# Neon URLs are already in the right format for SQLAlchemy.
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
