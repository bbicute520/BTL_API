# 📦 Kế Hoạch Bài Tập Lớn — Price Tracker API

> **Môn học:** Lập trình API  
> **Công nghệ chính:** FastAPI, Python  
> **Mục tiêu:** Xây dựng hệ thống thu thập, theo dõi và thông báo giá tốt nhất cho các mặt hàng trên sàn thương mại điện tử

---

## 1. Tổng Quan Dự Án

### Mô tả
Hệ thống cho phép người dùng theo dõi giá của các sản phẩm trên sàn TMĐT (Tiki, Shopee...). Khi giá giảm xuống dưới ngưỡng mong muốn, hệ thống sẽ tự động gửi thông báo cho người dùng.

### Tính năng chính
- Thu thập (crawl) dữ liệu giá sản phẩm từ sàn TMĐT
- Lưu trữ lịch sử giá theo thời gian
- Cho phép người dùng đặt ngưỡng giá và nhận thông báo
- Hiển thị biểu đồ lịch sử giá trên giao diện web

---

## 2. Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────┐
│              Crawler Module                 │
│  (httpx / BeautifulSoup / Tiki public API)  │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│               PostgreSQL / SQLite            │
│     products | price_history | watchlist    │
│              alerts | users                 │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│             FastAPI Backend                 │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │  REST API   │  │  APScheduler (cron)  │  │
│  │  /products  │  │  Tự crawl mỗi X giờ  │  │
│  │  /watchlist │  └──────────────────────┘  │
│  │  /alerts    │  ┌──────────────────────┐  │
│  └─────────────┘  │  Email Notification  │  │
│                   │  (SMTP / SendGrid)   │  │
│                   └──────────────────────┘  │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│              Frontend (Web)                 │
│       HTML + Chart.js  hoặc  React          │
└─────────────────────────────────────────────┘
```

---

## 3. Database Schema

### Bảng `users`
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | INTEGER PK | ID người dùng |
| email | VARCHAR | Email nhận thông báo |
| password_hash | VARCHAR | Mật khẩu (bcrypt) |
| created_at | DATETIME | Ngày tạo |

### Bảng `products`
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | INTEGER PK | ID sản phẩm |
| name | VARCHAR | Tên sản phẩm |
| url | VARCHAR | Link sản phẩm trên sàn |
| platform | VARCHAR | Tên sàn (tiki, shopee...) |
| image_url | VARCHAR | Ảnh sản phẩm |
| current_price | FLOAT | Giá hiện tại |
| last_checked | DATETIME | Lần crawl cuối |

### Bảng `price_history`
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | INTEGER PK | |
| product_id | INTEGER FK | Liên kết sản phẩm |
| price | FLOAT | Giá tại thời điểm |
| recorded_at | DATETIME | Thời điểm ghi nhận |

### Bảng `watchlist`
| Cột | Kiểu | Mô tả |
|---|---|---|
| id | INTEGER PK | |
| user_id | INTEGER FK | |
| product_id | INTEGER FK | |
| target_price | FLOAT | Ngưỡng giá mong muốn |
| is_notified | BOOLEAN | Đã thông báo chưa |

---

## 4. Danh Sách API Endpoints

### 🔐 Auth
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản |
| POST | `/auth/login` | Đăng nhập, trả về JWT token |

### 📦 Products
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/products` | Lấy danh sách sản phẩm (có filter, phân trang) |
| GET | `/products/{id}` | Chi tiết 1 sản phẩm |
| POST | `/products` | Thêm sản phẩm mới bằng URL |
| DELETE | `/products/{id}` | Xóa sản phẩm |
| GET | `/products/{id}/price-history` | Lịch sử giá của sản phẩm |

### 👁️ Watchlist
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/watchlist` | Xem danh sách theo dõi của user |
| POST | `/watchlist` | Thêm sản phẩm vào watchlist |
| DELETE | `/watchlist/{id}` | Xóa khỏi watchlist |
| PATCH | `/watchlist/{id}` | Cập nhật ngưỡng giá |

### 🔔 Alerts
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/alerts` | Xem lịch sử thông báo |
| POST | `/alerts/test` | Gửi thông báo test |

### 🕷️ Crawler
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/crawl/{product_id}` | Crawl thủ công 1 sản phẩm |
| POST | `/crawl/all` | Crawl toàn bộ sản phẩm (admin) |
| GET | `/crawl/status` | Xem trạng thái scheduler |

---

## 5. Tech Stack

| Thành phần | Công nghệ | Lý do chọn |
|---|---|---|
| Backend Framework | **FastAPI** | Async, tự sinh Swagger docs |
| ORM | **SQLAlchemy + Alembic** | Quản lý DB và migration |
| Database | **SQLite** (dev) / PostgreSQL (prod) | Đơn giản khi dev |
| Crawler | **httpx + BeautifulSoup4** | Async HTTP, nhẹ |
| Scheduler | **APScheduler** | Tích hợp dễ với FastAPI |
| Authentication | **JWT (python-jose)** | Stateless, chuẩn |
| Notification | **smtplib / SendGrid** | Gửi email thông báo |
| Frontend | **HTML + Chart.js** | Đơn giản, đủ để demo |
| Validation | **Pydantic v2** | Tích hợp sẵn FastAPI |

---

## 6. Cấu Trúc Thư Mục

```
price-tracker/
├── app/
│   ├── main.py               # Khởi tạo FastAPI app
│   ├── database.py           # Kết nối DB
│   ├── models/               # SQLAlchemy models
│   │   ├── user.py
│   │   ├── product.py
│   │   └── watchlist.py
│   ├── schemas/              # Pydantic schemas
│   │   ├── product.py
│   │   └── watchlist.py
│   ├── routers/              # Các router endpoint
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── watchlist.py
│   │   └── crawler.py
│   ├── services/
│   │   ├── crawler.py        # Logic crawl dữ liệu
│   │   ├── scheduler.py      # APScheduler setup
│   │   └── notification.py   # Gửi email
│   └── core/
│       ├── config.py         # Cấu hình (env vars)
│       └── security.py       # JWT helpers
├── frontend/
│   ├── index.html
│   └── chart.js
├── tests/
│   ├── test_products.py
│   └── test_crawler.py
├── requirements.txt
├── .env
└── README.md
```

---

## 7. Kế Hoạch Thực Hiện

### Tuần 1 — Setup & Core API
- [ ] Khởi tạo project FastAPI
- [ ] Thiết kế và tạo database schema
- [ ] Viết API CRUD cho Products
- [ ] Viết API Auth (register/login + JWT)

### Tuần 2 — Crawler & Scheduler
- [ ] Viết crawler cho Tiki (dùng API công khai của Tiki)
- [ ] Lưu lịch sử giá vào DB
- [ ] Tích hợp APScheduler tự động crawl mỗi 6 giờ
- [ ] Endpoint trigger crawl thủ công

### Tuần 3 — Watchlist & Notification
- [ ] API Watchlist (thêm/xóa/cập nhật ngưỡng giá)
- [ ] Logic kiểm tra ngưỡng giá sau mỗi lần crawl
- [ ] Gửi email thông báo khi giá xuống ngưỡng
- [ ] Viết tests cơ bản

### Tuần 4 — Frontend & Hoàn thiện
- [ ] Trang web hiển thị danh sách sản phẩm
- [ ] Biểu đồ lịch sử giá (Chart.js)
- [ ] Form thêm sản phẩm theo URL
- [ ] Viết báo cáo và tài liệu API (Swagger đã tự sinh)
- [ ] Demo và nộp bài

---

## 8. Lưu Ý Kỹ Thuật

### Về Crawler
- **Nên dùng Tiki** vì có API công khai dễ dùng hơn Shopee/Lazada
- Tiki product API: `https://tiki.vn/api/v2/products/{product_id}`
- Tránh crawl quá nhanh, thêm `asyncio.sleep()` giữa các request
- Dùng `User-Agent` header để tránh bị chặn

### Về Authentication
- Dùng JWT Bearer token cho tất cả endpoint cần xác thực
- Token expire sau 24 giờ
- Lưu password bằng `bcrypt`

### Về Notification
- Có thể dùng Gmail SMTP miễn phí cho môi trường dev
- Cần bật "App Password" trên Gmail nếu dùng 2FA

---

## 9. Tiêu Chí Đánh Giá (Dự Kiến)

| Tiêu chí | Trọng số |
|---|---|
| Thiết kế API đúng chuẩn REST | 25% |
| Chức năng hoạt động đầy đủ | 30% |
| Chất lượng code (cấu trúc, clean code) | 20% |
| Tài liệu API (Swagger / README) | 15% |
| Demo và thuyết trình | 10% |

---

## 10. Tài Nguyên Tham Khảo

- [FastAPI Official Docs](https://fastapi.tiangolo.com/)
- [Tiki Developer API](https://open.tiki.vn/)
- [APScheduler Docs](https://apscheduler.readthedocs.io/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [Chart.js Docs](https://www.chartjs.org/)