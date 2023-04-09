from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse


templates = Jinja2Templates(directory="app/templates")

index_app = APIRouter()


@index_app.get("/")
async def home(request: Request):
    context = {"request": request}
    return templates.TemplateResponse("home.html", context=context)


@index_app.get("/clear")
async def clear_session(request: Request):
    request.session.clear()
    return RedirectResponse("/liked")
