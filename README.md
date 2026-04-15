# 📦 Price Tracker API — Hệ thống Theo dõi Giá Thông minh

Hệ thống REST API chuyên nghiệp được xây dựng bằng **FastAPI** và **Python**, cho phép theo dõi tự động biến động giá sản phẩm trên **Tiki** và gửi cảnh báo qua Email. Đã tối ưu hóa để chạy trên **PostgreSQL (Supabase)** và sẵn sàng đóng gói với **Docker**.

---

## ✨ Tính năng cao cấp (Premium Features)

- 🚀 **Asynchronous Architecture**: Toàn bộ hệ thống chạy bất đồng bộ (FastAPI + AsyncIOScheduler + Httpx).
- 🛡️ **API Security**: Bảo vệ các điểm cuối bằng `X-API-KEY`.
- 🕷️ **Smart Crawler**: Cơ chế tự động thử lại (Retry) và Exponential Backoff khi bị Tiki chặn.
- 🕒 **Robotic Scheduler**: Tự động quét giá định kỳ và so sánh với ngưỡng mục tiêu của người dùng.
- 📧 **Instant Alerts**: Thông báo ngay lập tức qua Gmail khi giá giảm chạm ngưỡng.
- 🐳 **Dockerized**: Triển khai thần tốc chỉ với Docker Compose.
- 🪵 **Centralized Logging**: Ghi nhật ký chi tiết lỗi và lịch sử crawl vào `app.log`.

---

## 🛠️ Yêu cầu hệ thống
- Python 3.10+
- Tài khoản Supabase (Hoặc PostgreSQL bất kỳ)
- Gmail App Password (để gửi email)
- Docker & Docker Compose (Tùy chọn)

---

## 🚀 Hướng dẫn khởi chạy nhanh

### Cách 1: Sử dụng Docker (Khuyên dùng)
1. Điền thông tin vào file `.env`.
2. Chạy lệnh:
   ```bash
   docker-compose up -d
   ```
3. Truy cập Swagger UI tại: `http://localhost:8000/docs`

### Cách 2: Chạy thủ công (Manual)
1. Cài đặt thư viện:
   ```bash
   pip install -r requirements.txt
   ```
2. Khởi chạy:
   ```bash
   uvicorn app.main:app --reload
   ```

---

## 🔐 Cấu hình Bảo mật
Để gọi bất kỳ API nào, bạn cần đính kèm Header sau:
- **Header Key**: `X-API-KEY`
- **Header Value**: (Lấy giá trị từ biến `API_KEY` trong file `.env`)

---

## 📁 Cấu trúc thư mục chuyên nghiệp
```text
BTL_API/
├── app/
│   ├── main.py              # Tâm điểm khởi tạo & Middleware
│   ├── models.py            # Cấu trúc bảng (SQLAlchemy)
│   ├── schemas.py           # Ràng buộc dữ liệu (Pydantic v2)
│   ├── routers/             # Quản lý Product, Watchlist, Crawler
│   └── services/            # Logic Crawler, Scheduler, Mail, Logger
├── tests/                   # Kiểm thử tự động (Pytest)
├── Dockerfile               # Đóng gói ứng dụng
├── docker-compose.yml       # Điều phối triển khai
├── .env                     # Cấu hình bí mật
└── README.md                # Tài liệu dự án
```

---

## 🧪 Chạy Kiểm thử (Testing)
Để đảm bảo API hoạt động đúng, chạy lệnh:
```bash
pytest
```

---
**Phát triển bởi:** [Tên của bạn] - *Bài tập lớn môn Lập trình API*
