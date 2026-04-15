# 📦 Price Tracker API — Hệ thống Theo dõi Giá Thông minh

Hệ thống REST API chuyên nghiệp được xây dựng bằng **FastAPI** và **Python**, cho phép theo dõi tự động biến động giá sản phẩm trên **Tiki** và gửi cảnh báo qua Email. Đã tối ưu hóa để chạy trên **PostgreSQL (Supabase)** và sẵn sàng đóng gói với **Docker**.

---

## ✨ Tính năng cao cấp (Premium Features)

- 🚀 **Asynchronous Architecture**: Toàn bộ hệ thống chạy bất đồng bộ (FastAPI + AsyncIOScheduler + Httpx).
- 🛡️ **API Security**: Bảo vệ các điểm cuối bằng `X-API-KEY`.
- 🕷️ **Smart Crawler**: Cơ chế tự động thử lại (Retry) và Exponential Backoff khi bị Tiki chặn.
- 🕒 **Robotic Scheduler**: Tự động quét giá định kỳ và so sánh với ngưỡng mục tiêu của người dùng.
- 📧 **Instant Alerts**: Thông báo ngay lập tức qua **Gmail** và **Telegram** khi giá giảm chạm ngưỡng.
- 🐳 **Dockerized**: Triển khai thần tốc chỉ với Docker Compose.
- 🧪 **CI/CD Ready**: Tích hợp GitHub Actions để tự động Test và chạy Crawler định kỳ.
- 🪵 **Centralized Logging**: Ghi nhật ký chi tiết vào console và hệ thống.

---

## 🛠️ Yêu cầu hệ thống
- Python 3.11+
- Tài khoản Supabase (Hoặc PostgreSQL bất kỳ)
- Gmail App Password (để gửi email)
- Telegram Bot Token & Chat ID (để nhận tin nhắn)
- Docker & Docker Compose (Tùy chọn)

---

## 🚀 Hướng dẫn khởi chạy nhanh

### Bước 1: Cấu hình môi trường
Copy `.env.example` thành `.env` và điền các thông tin:
- `DATABASE_URL`: Link kết nối Supabase của bạn.
- `SMTP_...`: Cấu hình gửi mail.
- `TELEGRAM_...`: Cấu hình bot Telegram.

### Bước 2: Triển khai

#### Cách 1: Sử dụng Docker (Khuyên dùng)
```bash
docker-compose up -d
```
Truy cập Swagger UI tại: `http://localhost:8000/docs`

#### Cách 2: Chạy trực tiếp (Local)
1. Cài đặt thư viện: `pip install -r requirements.txt`
2. Khởi chạy: `uvicorn app.main:app --reload`

---

## 🕷️ GitHub Actions (Tự động hóa)
Dự án đã cấu hình sẵn 2 workflow:
1. **Python CI**: Chạy test tự động mỗi khi push code.
2. **Crawler Job**: Tự động kích hoạt quét giá trên GitHub mỗi 6 giờ.

---

## 🧪 Chạy Kiểm thử (Testing)
```bash
python tests/test_api.py
```

---
**Phát triển bởi:** [Tên của bạn] - *Bài tập lớn môn Lập trình API*

