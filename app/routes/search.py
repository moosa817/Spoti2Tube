from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
import re
from app.utils.searchtools import SpotifyAPI
from app.utils.GetYtLinks import search_for_short_videos
from pydantic import BaseModel
from config import Settings, get_settings

search_app = APIRouter()


class SearchItem(BaseModel):
    search: str
    type: str
    no: int


class YtSearchItem(BaseModel):
    search: list


@search_app.post("/search")
async def search(item: SearchItem, settings: Annotated[Settings,
                                                       Depends(get_settings)]):

    spotifyapi = SpotifyAPI(settings.client_id, settings.client_secret,
                            item.no)

    spotify_link_pattern = r'^(?:https?:\/\/)?(?:open\.|play\.|embed\.)?spotify\.com\/(track|album|artist|playlist)\/[a-zA-Z0-9]+(?:\?[a-zA-Z0-9_=&-]+)?$'

    if re.match(spotify_link_pattern, item.search) and item.type == 'link':
        return spotifyapi.get_with_link(link=item.search)
    else:
        if item.type == 'playlist':
            return spotifyapi.get_playlist(item.search)
        elif item.type == 'album':
            return spotifyapi.get_album(item.search)
        elif item.type == 'track':
            return spotifyapi.get_tracks(item.search)
        else:
            raise HTTPException(403, "Error unspported type")


@search_app.post("/search_yt")
async def SearchYT(item: YtSearchItem):
    if len(item.search) >= 100:
        return HTTPException(403, "tOO MANY ITEMS")

    # vid, title, thumbnail, by = yt_search(song)
    yt_info = search_for_short_videos(item.search)
    return yt_info
