from pydantic import BaseSettings
import os
import random
import string
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "Spotifree"
    author: str = "Moosa (github.com/moosa817)"

    client_id: str = os.getenv("CLIENT_ID")
    client_secret: str = os.getenv("CLIENT_SECRET")
    callback_url: str = os.getenv("CALLBACK_URL")

    mongo_str: str = os.getenv("MONGO_STR")

    email_sender: str = os.getenv("EMAIL_SENDER")
    mail_passwd: str = os.getenv("SMTP_PWD")
    mail_email_reciever: str = os.getenv("EMAIL_RECIEVER")
    mail_server: str = os.getenv("MAIL_SERVER")
    mail_port: int = 587
    mail_user: str = os.getenv("MAIL_USER")

    secret_key: str = os.getenv("SECRET_KEY", ''.join(random.choice(
        string.ascii_letters + string.digits) for _ in range(24)))

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
