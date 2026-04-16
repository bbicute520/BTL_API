# Price Tracker API + Frontend

He thong theo doi bien dong gia san pham Tiki, gom backend FastAPI va frontend Vite/React. Du an tap trung vao crawler, watchlist, thong ke va bieu do gia theo san pham.

## Tong quan nhanh
- Dashboard thong ke + bieu do gia theo san pham
- Watchlist va canh bao gia qua Email/Telegram
- Crawler tu dong (GitHub Actions)
- API docs san sang (Swagger/Redoc)

## Cong nghe
- Backend: FastAPI, SQLAlchemy
- Frontend: Vite, React, Tailwind CSS
- DB: SQLite (local) hoac PostgreSQL
- CI/CD: GitHub Actions

## Kien truc (rut gon)
1. Frontend goi API -> Backend FastAPI
2. Backend luu san pham + lich su gia
3. Crawler cap nhat gia dinh ky
4. Watchlist kich hoat thong bao

## Cai dat nhanh

### Backend
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs:
- Swagger: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Bien moi truong

### Backend
- DATABASE_URL
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
- TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

### Frontend
Trong frontend/.env:
```
VITE_API_BASE_URL="http://localhost:8000"
```

## GitHub Actions
- Python CI: chay test khi push/PR
- Crawler Job: chay moi gio (cron)

## Testing
```bash
pytest tests/test_api.py
```

## Trien khai (goi y)
- Backend: Render
- Frontend: Vercel

