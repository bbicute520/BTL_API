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
                    old_price = prod.current_price
                    
                    # 1. Tối ưu: Chỉ lưu lịch sử nếu giá thực sự thay đổi
                    if old_price is None or new_price != old_price:
                        history = PriceHistory(product_id=prod.id, price=new_price)
                        db.add(history)
                        print(f"DEBUG: Price changed from {old_price} to {new_price}. Recording history.")
                    
                    # 2. Cảnh báo giảm giá sốc (Ví dụ: Giảm hơn 5%)
                    if old_price and new_price < old_price:
                        drop_percent = ((old_price - new_price) / old_price) * 100
                        if drop_percent >= 5:
                            print(f"ALERT: Huge price drop detected for {prod.name}: -{drop_percent:.1f}%")
                            from app.services.notification import send_telegram_message
                            send_telegram_message(f"🔥 <b>GIẢM GIÁ SỐC: -{drop_percent:.1f}%</b>\n📦 {prod.name}\n💰 Giá mới: {new_price:,.0f}đ\n📉 Giá cũ: {old_price:,.0f}đ\n🔗 <a href='{prod.url}'>Xem ngay trên Tiki</a>")

                    # Cập nhật thông tin sản phẩm chính
                    prod.current_price = new_price
                    prod.image_url = data.get("image_url")
                    prod.last_checked = datetime.utcnow()
                    
                    # Kiểm tra watchlist thông thường
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
    scheduler.add_job(crawl_all_job, 'interval', hours=1)
    scheduler.start()
