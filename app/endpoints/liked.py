from fastapi import APIRouter,Request
from fastapi.templating import Jinja2Templates


templates = Jinja2Templates(directory="app/templates")

liked_app = APIRouter()


@liked_app.get("/liked")
def home(request: Request):
    context = {"request": request}
    return templates.TemplateResponse("liked.html", context=context)
