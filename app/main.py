from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.routers import crawler, products, watchlist
from app.services.scheduler import start_scheduler
from app.database import engine
from app.models import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing Database Tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Starting background scheduler...")
    start_scheduler()
    yield
    print("Shutting down...")

def create_app() -> FastAPI:
    app = FastAPI(title="Price Tracker API", lifespan=lifespan)

    app.include_router(products.router, prefix="/products", tags=["products"])
    app.include_router(watchlist.router, prefix="/watchlist", tags=["watchlist"])
    app.include_router(crawler.router, prefix="/crawl", tags=["crawler"])

    return app


app = create_app()
