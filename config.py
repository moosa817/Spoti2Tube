import os
import random
import string

client_id = os.getenv("SPOTIPY_CLIENT_ID")
client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
callback_url = os.getenv("CALLBACK_URL")

mongo_str = os.getenv("MONGO_STR")

email_sender = os.getenv("EMAIL_SENDER")
mail_passwd = os.getenv("SMTP_PWD")
mail_email_reciever = os.getenv("EMAIL_RECIEVER")
mail_server = os.getenv("MAIL_SERVER")
mail_port = 587
mail_user = os.getenv("MAIL_USER")

secret_key = os.getenv("SECRET_KEY", ''.join(random.choice(
    string.ascii_letters + string.digits) for _ in range(24)))
