from typing import Optional
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from app.utils.liked_tracks import GetLikedTracks, GetToken


templates = Jinja2Templates(directory="app/templates")
liked_app = APIRouter()


@liked_app.get("/liked")
async def home(request: Request):
    session = request.session
    context = {"request": request}

    if session.get("access_token") and session.get("refresh_token"):
        liked_tracks = GetLikedTracks(session.get(
            "access_token"), session.get("refresh_token"), request)

        tracks = liked_tracks.savedTracks()
        context = {"request": request, "login": True, "tracks": tracks}

        return templates.TemplateResponse("liked.html", context=context)

    return templates.TemplateResponse("liked.html", context=context)


@liked_app.get("/callback")
async def callback(request: Request, code: str):
    if code:
        GetToken(code, request)  # gets access token and sets sessions
        return RedirectResponse("/liked")
    else:
        return {"error": "No Code Provided"}
