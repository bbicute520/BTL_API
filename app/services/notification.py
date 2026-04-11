import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

def send_price_alert(email: str, product_name: str, price: float) -> bool:
    load_dotenv()
    
    # Đọc cấu hình từ .env khớp với file của bạn
    SMTP_SERVER = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
    SMTP_USER = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)

    if not SMTP_USER or not SMTP_PASSWORD:
        print("SMTP Credentials not configured (SMTP_USER or SMTP_PASSWORD is empty).")
        return False

    msg = EmailMessage()
    msg.set_content(f"Sản phẩm '{product_name}' mà bạn đang theo dõi đã giảm giá xuống còn {price}đ. Chớp cơ hội ngay!")

    msg['Subject'] = f"Cảnh báo giá giảm: {product_name}"
    msg['From'] = SMTP_FROM
    msg['To'] = email

    try:
        # Nếu dùng port 465 thì dùng SMTP_SSL, nếu 587 thì dùng SMTP + starttls
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
                
        print(f"Báo cảnh giá cho email {email} thành công.")
        return True
    except Exception as e:
        print(f"Lỗi gửi email: {e}")
        return False
