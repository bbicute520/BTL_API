# 📦 Kế Hoạch Bài Tập Lớn — Price Tracker API

> **Môn học:** Lập trình API  
> **Công nghệ chính:** FastAPI, Python  
> **Thời gian:** 1 tuần  
> **Mục tiêu:** Xây dựng REST API theo dõi và thông báo giá sản phẩm trên sàn TMĐT

---

## 1. Phạm Vi Dự Án (Scope)

### ✅ Làm
- CRUD sản phẩm (thêm bằng URL hoặc thủ công)
- Crawl giá từ Tiki và lưu lịch sử
- Watchlist: đặt ngưỡng giá theo dõi
- Thông báo qua email khi giá đạt ngưỡng
- Tự động crawl định kỳ (scheduler)

### ❌ Bỏ qua
- Frontend / giao diện web
- Authentication / JWT (dùng API key đơn giản hoặc bỏ luôn)
- Phân quyền admin/user
- Tích hợp nhiều sàn (chỉ tập trung Tiki)

---

## 2. Database Schema

### Bảng `products`
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | INTEGER PK | |
| name | VARCHAR | Tên sản phẩm |
| tiki_id | VARCHAR | ID sản phẩm trên Tiki |
| url | VARCHAR | Link sản phẩm |
| current_price | FLOAT | Giá hiện tại |
| last_checked | DATETIME | Lần crawl cuối |

### Bảng `price_history`
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | INTEGER PK | |
| product_id | INTEGER FK | |
| price | FLOAT | Giá tại thời điểm |
| recorded_at | DATETIME | Thời điểm ghi nhận |

### Bảng `watchlist`
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | INTEGER PK | |
| email | VARCHAR | Email nhận thông báo |
| product_id | INTEGER FK | |
| target_price | FLOAT | Ngưỡng giá |
| is_notified | BOOLEAN | Đã thông báo chưa |

---

## 3. Danh Sách API Endpoints

### 📦 Products
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/products` | Danh sách sản phẩm |
| GET | `/products/{id}` | Chi tiết sản phẩm |
| POST | `/products` | Thêm sản phẩm (nhập tiki_id) |
| DELETE | `/products/{id}` | Xóa sản phẩm |
| GET | `/products/{id}/price-history` | Lịch sử giá |

### 👁️ Watchlist
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/watchlist` | Danh sách đang theo dõi |
| POST | `/watchlist` | Thêm theo dõi + đặt ngưỡng giá |
| DELETE | `/watchlist/{id}` | Xóa theo dõi |
| PATCH | `/watchlist/{id}` | Cập nhật ngưỡng giá |

### 🕷️ Crawler
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/crawl/{product_id}` | Crawl thủ công 1 sản phẩm |
| POST | `/crawl/all` | Crawl toàn bộ & kiểm tra ngưỡng |

---

## 4. Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | FastAPI |
| Database | SQLite + SQLAlchemy |
| Crawler | httpx + BeautifulSoup4 |
| Scheduler | APScheduler |
| Notification | Gmail SMTP (smtplib) |
| Validation | Pydantic v2 |

---

## 5. Cấu Trúc Thư Mục

```
price-tracker/
├── app/
│   ├── main.py              # Khởi tạo app, gắn router
│   ├── database.py          # Kết nối SQLite
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── routers/
│   │   ├── products.py
│   │   ├── watchlist.py
│   │   └── crawler.py
│   └── services/
│       ├── crawler.py       # Logic gọi Tiki API
│       ├── scheduler.py     # APScheduler
│       └── notification.py  # Gửi email
├── .env                     # SMTP credentials
└── requirements.txt
```

---

## 6. Kế Hoạch 1 Tuần

| Ngày | Công việc |
|---|---|
| **Ngày 1** | Setup project, tạo DB schema, viết models + schemas |
| **Ngày 2** | Viết CRUD API cho Products |
| **Ngày 3** | Viết crawler Tiki, endpoint crawl thủ công |
| **Ngày 4** | Viết API Watchlist + logic kiểm tra ngưỡng giá |
| **Ngày 5** | Tích hợp gửi email thông báo + APScheduler |
| **Ngày 6** | Test toàn bộ, fix bug, bổ sung validation/error handling |
| **Ngày 7** | Viết README, dọn code, chuẩn bị demo |

---

## 7. Lưu Ý Kỹ Thuật

**Crawler Tiki:**
- Dùng API công khai: `https://tiki.vn/api/v2/products/{tiki_id}`
- Thêm header `User-Agent` để tránh bị block
- Thêm `await asyncio.sleep(1)` giữa các request

**Scheduler:**
- Crawl tự động mỗi 6 giờ bằng APScheduler
- Sau mỗi lần crawl, kiểm tra watchlist và gửi email nếu đạt ngưỡng

**Email:**
- Dùng Gmail SMTP + App Password (bật trong cài đặt Google)
- Lưu credentials trong file `.env`, không commit lên Git

---

## 8. Tài Nguyên

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Tiki API](https://api.tiki.vn/v2/products/{id})
- [APScheduler](https://apscheduler.readthedocs.io/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)