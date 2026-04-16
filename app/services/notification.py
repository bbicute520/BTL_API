import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def send_price_alert(email: str, product_name: str, price: float) -> None:
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("SMTP Credentials not configured. Missing email alert.")
        return

    msg = EmailMessage()
    msg.set_content(f"Sản phẩm '{product_name}' mà bạn đang theo dõi đã giảm giá xuống còn {price}đ. Chớp cơ hội ngay!")

    msg['Subject'] = f"Cảnh báo giá giảm: {product_name}"
    msg['From'] = SMTP_EMAIL
    msg['To'] = email

    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
        print(f"Báo cảnh giá cho email {email} thành công.")
    except Exception as e:
        print(f"Lỗi gửi email: {e}")
