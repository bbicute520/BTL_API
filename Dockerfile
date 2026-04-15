# Sử dụng image Python chính thức bản slim để giảm kích thước
FROM python:3.11-slim


# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các thư viện hệ thống cần thiết cho psycopg2 (nếu không dùng -binary) 
# và các công cụ cơ bản
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Sao chép và cài đặt các dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose port (mặc định FastAPI chạy 8000)
EXPOSE 8000

# Lệnh khởi chạy ứng dụng (sử dụng uvicorn)
# Chạy trên 0.0.0.0 để có thể truy cập từ bên ngoài container
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
