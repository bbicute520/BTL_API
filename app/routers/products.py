from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product, PriceHistory
from app.schemas import PriceHistoryRead, ProductCreate, ProductRead
from app.services.crawler import fetch_tiki_product

router = APIRouter()


@router.get("", response_model=list[ProductRead])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


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


@router.get("/{product_id}/price-history", response_model=list[PriceHistoryRead])
def get_price_history(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product.price_history
