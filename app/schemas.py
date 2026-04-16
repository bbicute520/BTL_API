from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str | None = None
    tiki_id: str | None = None
    url: str | None = None
    image_url: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: int
    current_price: float | None = None
    last_checked: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class PriceHistoryRead(BaseModel):
    id: int
    product_id: int
    price: float
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WatchlistBase(BaseModel):
    email: str
    product_id: int
    target_price: float


class WatchlistCreate(WatchlistBase):
    pass


class WatchlistRead(WatchlistBase):
    id: int
    is_notified: bool

    model_config = ConfigDict(from_attributes=True)
