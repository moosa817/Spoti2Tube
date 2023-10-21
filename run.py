from fastapi import FastAPI
from app import MyApp
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()


myapp = MyApp(app)
myapp.load_endpoints()
