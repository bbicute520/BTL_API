from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Watchlist, Product, PriceHistory
from app.schemas import WatchlistCreate, WatchlistDetail, WatchlistRead

router = APIRouter()


@router.get("", response_model=list[WatchlistRead])
def list_watchlist(db: Session = Depends(get_db)):
    return db.query(Watchlist).all()


@router.get("/details", response_model=list[WatchlistDetail])
def list_watchlist_details(db: Session = Depends(get_db)):
    min_price_subq = (
        db.query(
            PriceHistory.product_id,
            func.min(PriceHistory.price).label("lowest_price"),
        )
        .group_by(PriceHistory.product_id)
        .subquery()
    )

    rows = (
        db.query(Watchlist, Product, min_price_subq.c.lowest_price)
        .join(Product, Watchlist.product_id == Product.id)
        .outerjoin(min_price_subq, Product.id == min_price_subq.c.product_id)
        .all()
    )

    details: list[WatchlistDetail] = []
    for watchlist, product, lowest_price in rows:
        details.append(
            WatchlistDetail(
                id=watchlist.id,
                email=watchlist.email,
                product_id=watchlist.product_id,
                alert_type="fixed",
                target_price=watchlist.target_price,
                base_price=None,
                drop_percentage=None,
                cooldown_hours=24,
                is_notified=watchlist.is_notified,
                last_notified_at=None,
                product_name=product.name,
                product_image=product.image_url,
                current_price=product.current_price,
                lowest_price=lowest_price,
                product_url=product.url,
                tiki_id=product.tiki_id,
            )
        )

    return details


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
