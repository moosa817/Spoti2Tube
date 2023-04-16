from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
import config

templates = Jinja2Templates(directory="app/templates")

index_app = APIRouter()


@index_app.get("/")
async def home(request: Request):
    print(config.client_id, config.client_secret)
    context = {"request": request}
    return templates.TemplateResponse("home.html", context=context)


@index_app.get("/clear")
async def clear_session(request: Request, logout=False):
    if logout == False or logout == 'False':
        del request.session["access_token"]
        del request.session["refresh_token"]
        request.session["status"] = "verified"
        return RedirectResponse("/liked")
    else:
        request.session.clear()
        return RedirectResponse("/liked")
