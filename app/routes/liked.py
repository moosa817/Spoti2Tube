from typing import Optional
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from app.utils.liked_tracks import GetLikedTracks, GetToken
from pymongo import MongoClient
import config
from app.utils.otherTools import validate_email, send_email

client = MongoClient(config.mongo_str)
db = client.get_database('spotifree')
records = db.use_liked


class EmailItem(BaseModel):
    email: str


templates = Jinja2Templates(directory="app/templates")
liked_app = APIRouter()


@liked_app.get("/liked")
async def Liked(request: Request):

    session = request.session
    context = {"request": request}

    if not session.get("email"):
        context = {"request": request,
                   "status": "not_verified", "login": False}
    elif session.get("status") == "pending":
        context = {"request": request, "status": "pending", "login": False}
    elif session.get("status") == "verified" and not session.get("access_token"):
        context = {"request": request, "status": "verified", "login": False}

    if session.get("access_token") and session.get("refresh_token") and session.get("status") == "verified":
        liked_tracks = GetLikedTracks(session.get(
            "access_token"), session.get("refresh_token"), request)

        tracks = liked_tracks.savedTracks()
        userinfo = liked_tracks.getinfo()
        context = {"request": request, "login": True,
                   "status": "verified", "tracks": tracks, "userinfo": userinfo}

    context["callback"] = config.callback_url
    return templates.TemplateResponse("liked.html", context=context)


@liked_app.post("/verify")
async def verify(request: Request, item: EmailItem):
    email = item.email
    if not validate_email(email):
        return {"success": False}

    result = records.find_one({"email": email})
    request.session["email"] = email

    if result:
        if result.get("status") == "pending":
            request.session["status"] = "pending"
        elif result.get("status") == "verified":
            request.session["status"] = "verified"
    else:
        records.insert_one({"email": email, "status": "pending"})
        request.session["status"] = "pending"
        send_email(config.email_sender, "Spotifree",
                   f"Add this Email to spotify liked feature {email}")

    return {"email": email, "status": request.session.get("status"), "success": True}


@liked_app.get("/callback")
async def callback(request: Request, code: str):
    if code:
        GetToken(code, request)  # gets access token and sets sessions
        return RedirectResponse("/liked")
    else:
        return {"error": "No Code Provided"}
