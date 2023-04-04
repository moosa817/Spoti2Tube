from fastapi import FastAPI, HTTPException,Request
from app import MyApp



app = FastAPI()

myapp = MyApp(app)
myapp.load_endpoints()