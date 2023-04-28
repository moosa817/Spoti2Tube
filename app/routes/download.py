import json
from typing import Annotated
from fastapi import Depends
from fastapi.responses import Response
from pydantic import BaseModel
from app.utils.YTDownload import download_song
from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
import base64
import time
from config import Settings, get_settings

download_app = APIRouter()


class DownloadSingleItem(BaseModel):
    url: str


class DownloadAll(BaseModel):
    urls: list


@download_app.post("/download")
async def download(request: Request, item: DownloadSingleItem):
    audio_data = download_song(item.url)
    return Response(content=audio_data, media_type="application/octet-stream")


@download_app.get("/download_all")
async def download_all(
    urls_id: str,
    settings: Annotated[Settings,
                        Depends(get_settings)]) -> EventSourceResponse:
    urls_id = urls_id.split(',')
    urls_count = len(urls_id)
    ini = time.time()

    def events():
        for url_id in urls_id:

            if (time.time() - ini > settings.timeout):
                yield json.dumps({"timeout": True, "url_id": url_id})
                break
            else:
                audio_binary = download_song(
                    f"https://www.youtube.com/watch?v={url_id}")
                audio_data = base64.b64encode(audio_binary).decode("utf-8")

                data = {
                    'audio_data': audio_data,
                    'timeout': False,
                    'url_id': url_id
                }

                yield json.dumps(data)
        yield "done"

    return EventSourceResponse(events())
