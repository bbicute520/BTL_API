from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product, PriceHistory
from app.schemas import ActivityRead, PriceHistoryRead, ProductCreate, ProductRead
from app.services.crawler import fetch_tiki_product

router = APIRouter()


@router.get("", response_model=list[ProductRead])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@router.get("/activity", response_model=list[ActivityRead])
def get_recent_activity(limit: int = 12, db: Session = Depends(get_db)):
    rows = (
        db.query(PriceHistory, Product)
        .join(Product, PriceHistory.product_id == Product.id)
        .order_by(PriceHistory.recorded_at.desc())
        .limit(limit)
        .all()
    )

    activities: list[ActivityRead] = []
    for history, product in rows:
        prev = (
            db.query(PriceHistory.price)
            .filter(
                PriceHistory.product_id == history.product_id,
                PriceHistory.recorded_at < history.recorded_at,
            )
            .order_by(PriceHistory.recorded_at.desc())
            .first()
        )
        previous_price = prev[0] if prev else None

        change_amount = None
        change_percent = None
        if previous_price is not None:
            change_amount = history.price - previous_price
            if previous_price != 0:
                change_percent = round((change_amount / previous_price) * 100, 2)

        if change_amount is None:
            activity_type = "price_update"
        elif change_amount < 0:
            activity_type = "price_drop"
        elif change_amount > 0:
            activity_type = "price_increase"
        else:
            activity_type = "price_unchanged"

        activities.append(
            ActivityRead(
                product_id=product.id,
                product_name=product.name,
                product_url=product.url,
                current_price=history.price,
                previous_price=previous_price,
                change_amount=change_amount,
                change_percent=change_percent,
                recorded_at=history.recorded_at,
                activity_type=activity_type,
            )
        )

    return activities


@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductRead)
async def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    if payload.tiki_id:
        existing = db.query(Product).filter(Product.tiki_id == payload.tiki_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Product with this tiki_id already exists")
            
        data = await fetch_tiki_product(payload.tiki_id)
        new_prod = Product(
            name=data["name"],
            tiki_id=payload.tiki_id,
            url=data["url"],
            image_url=data["image_url"],
            current_price=data["current_price"],
            last_checked=datetime.utcnow()
        )
        db.add(new_prod)
        db.commit()
        db.refresh(new_prod)
        
        history = PriceHistory(product_id=new_prod.id, price=new_prod.current_price)
        db.add(history)
        db.commit()
        
        return new_prod
    else:
        # Fallback manual creation
        new_prod = Product(
            name=payload.name,
            tiki_id=payload.tiki_id,
            url=payload.url,
            image_url=payload.image_url,
            current_price=payload.current_price,
            last_checked=datetime.utcnow() if payload.current_price else None
        )
        db.add(new_prod)
        db.commit()
        db.refresh(new_prod)
        
        if payload.current_price:
            history = PriceHistory(product_id=new_prod.id, price=payload.current_price)
            db.add(history)
            db.commit()
            
        return new_prod


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Deleted successfully"}




@router.get("/{product_id}/chart")
def get_chart_data(product_id: int, db: Session = Depends(get_db)):
    """Trả về dữ liệu giá đã được tổng hợp để vẽ biểu đồ (1 điểm dữ liệu/ngày)"""
    from sqlalchemy import func, cast, Date
    
    # Lấy giá muộn nhất (cuối cùng) của từng ngày
    history = (
        db.query(
            cast(PriceHistory.recorded_at, Date).label("date"),
            func.avg(PriceHistory.price).label("avg_price")
        )
        .filter(PriceHistory.product_id == product_id)
        .group_by(cast(PriceHistory.recorded_at, Date))
        .order_by("date")
        .all()
    )
    
    return [{"date": str(h.date), "price": round(h.avg_price, 0)} for h in history]
