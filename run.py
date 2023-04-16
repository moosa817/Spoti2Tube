from fastapi import FastAPI
from app import MyApp

app = FastAPI()


myapp = MyApp(app)
myapp.load_endpoints()
