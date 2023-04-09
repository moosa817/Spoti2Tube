from fastapi import FastAPI
from app import MyApp
import dotenv
import os

if os.path.exists('.env'):
    dotenv.load_dotenv()
    print("loaded env from .env")

app = FastAPI()


myapp = MyApp(app)
myapp.load_endpoints()
