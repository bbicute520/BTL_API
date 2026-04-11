from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import asyncio

from app.database import get_db
from app.models import Product, PriceHistory, Watchlist
from app.services.crawler import fetch_tiki_product
from app.services.scheduler import crawl_all_job
from app.services.notification import send_price_alert

router = APIRouter()


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
            success = send_price_alert(wl.email, product.name, new_price)
            if success:
                wl.is_notified = True
            
    db.commit()
    return {"message": "Crawled successfully", "current_price": new_price}
