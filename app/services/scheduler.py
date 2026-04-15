import asyncio
import time
from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal
from app.models import Product, PriceHistory, Watchlist
from app.services.crawler import fetch_tiki_product
from app.services.notification import send_price_alert

def crawl_all_job():
    db = SessionLocal()
    try:
        products = db.query(Product).filter(Product.tiki_id != None).all()
        for prod in products:
            try:
                # Start loop or use current
                try:
                    loop = asyncio.get_event_loop()
                except RuntimeError:
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                data = loop.run_until_complete(fetch_tiki_product(prod.tiki_id))
                
                new_price = data["current_price"]
                
                prod.current_price = new_price
                
                history = PriceHistory(product_id=prod.id, price=new_price)
                db.add(history)
                
                watchlists = db.query(Watchlist).filter(Watchlist.product_id == prod.id, Watchlist.is_notified == False).all()
                for wl in watchlists:
                    if new_price and new_price <= wl.target_price:
                        send_price_alert(wl.email, prod.name, new_price)
                        wl.is_notified = True
                
                db.commit()
            except Exception as e:
                print(f"Error crawling product {prod.tiki_id}: {e}")
            
            time.sleep(1)
    finally:
        db.close()

def start_scheduler() -> None:
    scheduler = BackgroundScheduler()
    scheduler.add_job(crawl_all_job, 'interval', hours=6)
    scheduler.start()
