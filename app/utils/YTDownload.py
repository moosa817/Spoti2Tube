from pytube import YouTube
from io import BytesIO


def download_song(url):
    yt = YouTube(url)
    video = yt.streams.filter(only_audio=True).first()

    if video.filesize_mb > 8:
        return None
    else:
        audio_data = BytesIO()
        video.stream_to_buffer(audio_data)
        return audio_data.getvalue()
