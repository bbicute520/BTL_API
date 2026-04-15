import logging
import sys
from logging.handlers import RotatingFileHandler

# Cấu hình format log
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

def setup_logger(name: str):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Handler cho Console
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(LOG_FORMAT))
    logger.addHandler(console_handler)

    # Handler cho File (tự động xoay file nếu > 5MB)
    file_handler = RotatingFileHandler("app.log", maxBytes=5*1024*1024, backupCount=2, encoding="utf-8")
    file_handler.setFormatter(logging.Formatter(LOG_FORMAT))
    logger.addHandler(file_handler)

    return logger

# Logger mặc định cho dự án
logger = setup_logger("price_tracker")
