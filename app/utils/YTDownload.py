from yt_dlp import YoutubeDL
from contextlib import redirect_stdout
from pathlib import Path
import io


def download_song(url):
    youtube_id = url.split("=")[-1]
    ctx = {"format": "bestaudio/best", "outtmpl": "-", "logtostderr": True}

    buffer = io.BytesIO()
    with redirect_stdout(buffer), YoutubeDL(ctx) as foo:
        foo.download([youtube_id])

    # write out the buffer for demonstration purposes
    return buffer.getvalue()
