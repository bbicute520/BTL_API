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


class ActivityRead(BaseModel):
    product_id: int
    product_name: str
    product_url: str | None = None
    current_price: float
    previous_price: float | None = None
    change_amount: float | None = None
    change_percent: float | None = None
    recorded_at: datetime
    activity_type: str


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


class WatchlistDetail(BaseModel):
    id: int
    email: str
    product_id: int
    alert_type: str
    target_price: float | None
    base_price: float | None
    drop_percentage: float | None
    cooldown_hours: int
    is_notified: bool
    last_notified_at: datetime | None
    product_name: str
    product_image: str | None
    current_price: float | None
    lowest_price: float | None
    product_url: str | None
    tiki_id: str | None

    model_config = ConfigDict(from_attributes=True)
