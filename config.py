import os
import random
import string

client_id = os.getenv("SPOTIPY_CLIENT_ID")
client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
callback_url = os.getenv("CALLBACK_URL")

secret_key = os.getenv("SECRET_KEY", ''.join(random.choice(
    string.ascii_letters + string.digits) for _ in range(24)))
