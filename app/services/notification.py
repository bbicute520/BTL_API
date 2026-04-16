import httpx
import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

# Email Config
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SMTP_EMAIL = os.getenv("SMTP_EMAIL", os.getenv("SMTP_USER", ""))
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

# Telegram Config
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip('"')
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "").strip('"')


def send_price_alert(email: str, product_name: str, price: float) -> None:
    """Gửi thông báo qua cả Email và Telegram nếu có cấu hình"""
    message = f"Sản phẩm '{product_name}' mà bạn đang theo dõi đã giảm giá xuống còn {price:,}đ. Chớp cơ hội ngay!"
    
    # 1. Gửi Email
    send_email(email, f"Cảnh báo giá giảm: {product_name}", message)
    
    # 2. Gửi Telegram (nếu có cấu hình)
    if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
        send_telegram_message(message)

def send_email(to_email: str, subject: str, body: str) -> None:
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("SMTP Credentials not configured. Skipping email.")
        return

    msg = EmailMessage()
    msg.set_content(body)
    msg['Subject'] = subject
    msg['From'] = SMTP_EMAIL
    msg['To'] = to_email

    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"Email sent to {to_email} successfully.")
    except Exception as e:
        print(f"Error sending email: {e}")

def send_telegram_message(message: str) -> None:
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram configuration missing.")
        return

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    
    try:
        # Sử dụng httpx để gửi request (sync)
        with httpx.Client() as client:
            response = client.post(url, json=payload)
            if response.status_code == 200:
                print("Telegram message sent successfully.")
            else:
                print(f"Failed to send Telegram message: {response.text}")
    except Exception as e:
        print(f"Error sending Telegram message: {e}")

