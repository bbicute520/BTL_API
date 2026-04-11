from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Watchlist, Product
from app.schemas import WatchlistCreate, WatchlistRead

router = APIRouter()


@router.get("", response_model=list[WatchlistRead])
def list_watchlist(db: Session = Depends(get_db)):
    return db.query(Watchlist).all()


@router.post("", response_model=WatchlistRead)
def create_watchlist(payload: WatchlistCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    wl = Watchlist(
        email=payload.email,
        product_id=payload.product_id,
        target_price=payload.target_price,
        is_notified=False
    )
    db.add(wl)
    db.commit()
    db.refresh(wl)
    return wl


@router.delete("/{watchlist_id}")
def delete_watchlist(watchlist_id: int, db: Session = Depends(get_db)):
    wl = db.query(Watchlist).filter(Watchlist.id == watchlist_id).first()
    if not wl:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    db.delete(wl)
    db.commit()
    return {"message": "Deleted successfully"}


@router.patch("/{watchlist_id}", response_model=WatchlistRead)
def update_watchlist(watchlist_id: int, payload: WatchlistCreate, db: Session = Depends(get_db)):
    wl = db.query(Watchlist).filter(Watchlist.id == watchlist_id).first()
    if not wl:
        raise HTTPException(status_code=404, detail="Watchlist not found")
        
    wl.email = payload.email
    wl.product_id = payload.product_id
    wl.target_price = payload.target_price
    wl.is_notified = False # reset notification status if target changes
    db.commit()
    db.refresh(wl)
    return wl
