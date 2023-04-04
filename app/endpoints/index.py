from fastapi import APIRouter,Request
from fastapi.templating import Jinja2Templates


templates = Jinja2Templates(directory="app/templates")

index_app = APIRouter()


@index_app.get("/")
def home(request: Request):
    context = {"request": request}
    return templates.TemplateResponse("home.html", context=context)
