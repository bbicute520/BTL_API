from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session
import asyncio

from app.database import get_db
from app.models import Product, PriceHistory, Watchlist
from app.services.crawler import fetch_tiki_product
from app.services.scheduler import crawl_all_job
from app.services.notification import send_price_alert

router = APIRouter()


class TestEmailRequest(BaseModel):
    email: str


@router.post("/test-telegram")
async def test_telegram():
    """Endpoint để test nhanh kết nối với Telegram Bot"""
    from app.services.notification import send_telegram_message
    send_telegram_message("🔔 <b>Kết nối thành công!</b>\nHệ thống Price Tracker đã sẵn sàng gửi thông báo cho bạn.")
    return {"message": "Test message sent to Telegram. Check your bot!"}


@router.post("/test-email")
def test_email(payload: TestEmailRequest):
    send_price_alert(payload.email, "Test Product", 123456)
    return {"message": "Test email sent. Check your inbox!"}


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)) -> dict:
    total_products = db.query(func.count(Product.id)).scalar() or 0
    active_watchlist = db.query(func.count(Watchlist.id)).scalar() or 0
    total_notified = (
        db.query(func.count(Watchlist.id))
        .filter(Watchlist.is_notified.is_(True))
        .scalar()
        or 0
    )
    total_crawls = db.query(func.count(PriceHistory.id)).scalar() or 0

    min_price_subq = (
        db.query(
            PriceHistory.product_id,
            func.min(PriceHistory.price).label("min_price"),
        )
        .group_by(PriceHistory.product_id)
        .subquery()
    )
    price_drops = (
        db.query(func.count(Product.id))
        .join(min_price_subq, Product.id == min_price_subq.c.product_id)
        .filter(
            Product.current_price.isnot(None),
            Product.current_price <= min_price_subq.c.min_price,
        )
        .scalar()
        or 0
    )

    return {
        "total_products": total_products,
        "price_drops": price_drops,
        "active_watchlist": active_watchlist,
        "total_notified": total_notified,
        "total_crawls": total_crawls,
    }


@router.post("/all")
def crawl_all(background_tasks: BackgroundTasks) -> dict:
    background_tasks.add_task(crawl_all_job)
    return {"message": "Crawler job started in background"}


@router.post("/{product_id}")
async def crawl_product(product_id: int, db: Session = Depends(get_db)) -> dict:

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product or not product.tiki_id:
        raise HTTPException(status_code=404, detail="Product not found or missing tiki_id")
        
    data = await fetch_tiki_product(product.tiki_id)
    new_price = data["current_price"]
    
    product.current_price = new_price
    
    history = PriceHistory(product_id=product.id, price=new_price)
    db.add(history)
    
    watchlists = db.query(Watchlist).filter(Watchlist.product_id == product.id, Watchlist.is_notified == False).all()
    for wl in watchlists:
        if new_price and new_price <= wl.target_price:
            send_price_alert(wl.email, product.name, new_price)
            wl.is_notified = True
            
    db.commit()
    return {"message": "Crawled successfully", "current_price": new_price}


