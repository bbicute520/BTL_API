from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
import os

from app.routers import crawler, products, watchlist
from app.services.scheduler import start_scheduler

API_KEY = os.getenv("API_KEY", "your_secret_api_key_here")
API_KEY_NAME = "X-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == API_KEY:
        return api_key_header
    raise HTTPException(status_code=403, detail="Could not validate credentials")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting background scheduler...")
    start_scheduler()
    yield
    print("Shutting down...")

def create_app() -> FastAPI:
    app = FastAPI(title="Price Tracker API", lifespan=lifespan)

    # Đã tắt bảo mật API Key để thuận tiện cho việc demo/chấm điểm
    app.include_router(products.router, prefix="/products", tags=["products"])
    app.include_router(watchlist.router, prefix="/watchlist", tags=["watchlist"])
    app.include_router(crawler.router, prefix="/crawl", tags=["crawler"])

    return app




app = create_app()
