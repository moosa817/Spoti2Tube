import io
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from app.utils.YTDownload import download_song
from fastapi import APIRouter, Request

download_app = APIRouter()


class DownloadSingleItem(BaseModel):
    url: str


@download_app.post("/download")
async def download(request: Request, item: DownloadSingleItem):
    audio_data = download_song(item.url)
    return Response(content=audio_data, media_type="application/octet-stream")
