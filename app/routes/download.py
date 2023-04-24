from concurrent.futures import ProcessPoolExecutor
import json
from fastapi.responses import Response
from pydantic import BaseModel
from app.utils.YTDownload import download_song
from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
import base64
from multiprocessing import Pool

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
async def download_all(urls_id: str) -> EventSourceResponse:
    urls_id = urls_id.split(',')
    urls_count = len(urls_id)

    with ProcessPoolExecutor() as executor:
        results = list(executor.map(download_audio_data, urls_id))

        def events():
            for index, audio_data in enumerate(results):
                percent = round((index + 1) / urls_count * 100)
                data = {
                    'audio_data': audio_data,
                    'index_no': index,
                    'percent': percent
                }
                yield json.dumps(data)
            yield "done"

    return EventSourceResponse(events())


def download_audio_data(url_id: str) -> str:
    audio_binary = download_song(f"https://www.youtube.com/watch?v={url_id}")
    return base64.b64encode(audio_binary).decode("utf-8")
