import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Nếu không có DATABASE_URL, có thể để mặc định là rỗng hoặc báo lỗi thay vì dùng SQLite
if not DATABASE_URL:
    # Mặc định dùng Supabase nếu bạn đã có thông số, hoặc giữ SQLite nếu muốn phát triển local
    DATABASE_URL = "sqlite:///./app.db"

# Fix lỗi SQLAlchemy 1.4+ không nhận diện 'postgres://' (phải là 'postgresql://')
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {}
# PostgreSQL trên Supabase không cần check_same_thread như SQLite
if DATABASE_URL and DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Tự động tạo các bảng nếu chưa có
import app.models
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
