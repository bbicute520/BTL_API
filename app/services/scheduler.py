import asyncio
import time
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal
from app.models import Product, PriceHistory, Watchlist
from app.services.crawler import fetch_tiki_product
from app.services.notification import send_price_alert

def crawl_all_job():
    db = SessionLocal()
    from app.database import DATABASE_URL
    print(f"DEBUG: Starting crawl job using database: {DATABASE_URL[:20]}...")
    
    try:
        products = db.query(Product).filter(Product.tiki_id != None).all()
        print(f"DEBUG: Found {len(products)} products to crawl.")
        
        for prod in products:
            print(f"DEBUG: Crawling product {prod.name} (ID: {prod.tiki_id})")
            try:
                # Sử dụng loop một cách an toàn hơn
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                data = loop.run_until_complete(fetch_tiki_product(prod.tiki_id))
                loop.close()
                
                new_price = data["current_price"]
                print(f"DEBUG: Fetched price for {prod.tiki_id}: {new_price}")
                
                if new_price is not None:
                    # Luôn cập nhật giá hiện tại và thời gian kiểm tra
                    prod.current_price = new_price
                    prod.last_checked = datetime.utcnow()
                    
                    # Ghi nhận lịch sử (Có thể thêm logic if new_price != prod.current_price ở đây nếu muốn)
                    history = PriceHistory(product_id=prod.id, price=new_price)
                    db.add(history)
                    
                    # Kiểm tra watchlist
                    watchlists = db.query(Watchlist).filter(Watchlist.product_id == prod.id, Watchlist.is_notified == False).all()
                    for wl in watchlists:
                        if new_price <= wl.target_price:
                            send_price_alert(wl.email, prod.name, new_price)
                            wl.is_notified = True
                    
                    db.commit()
                    print(f"DEBUG: Successfully updated product {prod.tiki_id}")
                else:
                    print(f"WARNING: Could not get price for product {prod.tiki_id}")
                    
            except Exception as e:
                print(f"ERROR: Failed to crawl product {prod.tiki_id}: {str(e)}")
                db.rollback()
            
            time.sleep(2) # Tăng thời gian nghỉ để tránh bị Tiki chặn
    finally:
        db.close()
        print("DEBUG: Finished crawl job.")

def start_scheduler() -> None:
    scheduler = BackgroundScheduler()
    scheduler.add_job(crawl_all_job, 'interval', hours=6)
    scheduler.start()
