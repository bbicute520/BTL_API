import sys
import os

# Thêm thư mục gốc vào PYTHONPATH để có thể import module 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# Sử dụng database PostgreSQL từ environment variable (Supabase)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

if not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # Chỉ định dùng schema 'test_env' cho PostgreSQL
    connect_args = {"options": "-c search_path=test_env"}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)

# Tự động tạo schema 'test_env' nếu dùng PostgreSQL
if not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("CREATE SCHEMA IF NOT EXISTS test_env"))
        conn.commit()

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override dependency get_db
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    # Tạo các bảng trong schema test_env
    Base.metadata.create_all(bind=engine)
    yield
    # Xóa sạch dữ liệu sau mỗi lần test (nếu muốn giữ data thì comment dòng dưới)
    Base.metadata.drop_all(bind=engine)

def test_list_products_empty():

    response = client.get("/products")
    assert response.status_code == 200
    assert response.json() == []

def test_create_watchlist_invalid_product():
    payload = {
        "email": "test@example.com",
        "product_id": 999,
        "target_price": 100000
    }
    response = client.post("/watchlist", json=payload)
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"



if __name__ == "__main__":
    import pytest
    sys.exit(pytest.main([__file__]))

