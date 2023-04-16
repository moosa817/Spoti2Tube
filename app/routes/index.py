from functools import lru_cache
from typing import Annotated
from fastapi import APIRouter, Depends, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from config import get_settings, Settings

templates = Jinja2Templates(directory="app/templates")

index_app = APIRouter()


@index_app.get("/")
async def home(request: Request, settings: Annotated[Settings, Depends(get_settings)]):
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
