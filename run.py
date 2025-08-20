from fastapi import FastAPI
from app import MyApp
from dotenv import load_dotenv
import uvicorn

load_dotenv()
app = FastAPI()


myapp = MyApp(app)
myapp.load_endpoints()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
