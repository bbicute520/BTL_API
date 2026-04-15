import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app, get_api_key
from app.database import Base, get_db
import os

# Sử dụng một database SQLite tạm thời cho việc testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override dependency get_db
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override dependency get_api_key (bỏ qua check key khi test hoặc dùng key cố định)
def override_get_api_key():
    return "test_key"

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_api_key] = override_get_api_key

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_list_products_empty():
    response = client.get("/products", headers={"X-API-KEY": "test_key"})
    assert response.status_code == 200
    assert response.json() == []

def test_create_watchlist_invalid_product():
    payload = {
        "email": "test@example.com",
        "product_id": 999,
        "target_price": 100000
    }
    response = client.post("/watchlist", json=payload, headers={"X-API-KEY": "test_key"})
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"
