# 📦 Price Tracker API — Hệ thống Theo dõi Giá Sản phẩm Tiki

Hệ thống REST API được xây dựng bằng **FastAPI** và **Python**, cho phép người dùng tự động theo dõi biến động giá của các sản phẩm trên sàn thương mại điện tử Tiki và nhận thông báo qua Email khi giá chạm ngưỡng mong muốn.

---

## ✨ Tính năng chính

- 🕷️ **Crawl dữ liệu tự động**: Tự động lấy tên, giá và URL sản phẩm từ Tiki thông qua ID.
- 📈 **Lịch sử giá**: Ghi lại mọi biến động giá theo thời gian để người dùng dễ dàng theo dõi.
- 👁️ **Danh sách theo dõi (Watchlist)**: Người dùng có thể đặt ngưỡng giá mục tiêu cho từng sản phẩm.
- 📧 **Thông báo Email**: Tự động gửi email cảnh báo ngay lập tức khi giá sản phẩm giảm xuống bằng hoặc thấp hơn ngưỡng đã đặt.
- 🕒 **Bộ lập lịch (Scheduler)**: Hệ thống tự động quét giá toàn bộ sản phẩm mỗi 6 giờ một lần.

---

## 🛠️ Công nghệ sử dụng

- **Backend**: FastAPI (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **Crawler**: Httpx (Asynchronous HTTP client)
- **Scheduler**: APScheduler
- **Notification**: SMTP (Gmail)
- **Environment**: Python-dotenv & Pydantic

---

## 🚀 Hướng dẫn cài đặt

### 1. Cài đặt môi trường
Đảm bảo bạn đã cài đặt Python 3.9+.

```bash
# Tạo môi trường ảo
python -m venv venv

# Kích hoạt môi trường ảo
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Cài đặt các thư viện cần thiết
pip install -r requirements.txt
```

### 2. Cấu hình biến môi trường
Tạo tệp `.env` dựa trên tệp `.env.example` và điền các thông tin cần thiết:

```env
# Database
DATABASE_URL="sqlite:///./app.db"

# SMTP (Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password" # Sử dụng App Password của Google
SMTP_FROM="Price Tracker <your-email@gmail.com>"
```

### 3. Khởi chạy ứng dụng
```bash
uvicorn app.main:app --reload
```
Sau khi chạy, hãy truy cập:
- **Tài liệu API (Swagger UI)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 📁 Cấu trúc thư mục

```
BTL_API/
├── app/
│   ├── main.py              # Điểm khởi tạo ứng dụng & Lifespan
│   ├── database.py          # Cấu hình kết nối Database
│   ├── models.py            # Định nghĩa bảng dữ liệu (SQLAlchemy)
│   ├── schemas.py           # Định nghĩa kiểu dữ liệu API (Pydantic)
│   ├── routers/             # Các API Endpoint (Products, Watchlist, Crawler)
│   └── services/            # Logic nghiệp vụ (Crawler, Notification, Scheduler)
├── .env                     # Biến môi trường (Secret)
├── .gitignore               # Các file không đưa lên Git
├── requirements.txt         # Danh sách thư viện
└── README.md                # Tài liệu dự án
```

---

## 📝 Giấy phép
Dự án được phát triển cho mục đích học tập (Bài tập lớn môn Lập trình API).
