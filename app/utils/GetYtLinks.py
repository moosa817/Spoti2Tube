import yt_dlp
import io


def download(url):
    with yt_dlp.YoutubeDL() as ydl:
        info = ydl.extract_info(url, download=False)

    title = info["title"]
    ydl_opts = {
        'extract-audio': True,
        'format': "bestaudio/best",
        'audio-format': 'mp3',
        'outtmpl': '%(title)s.mp3',  # i don't want to store it here
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download(url)

        # mp3_file = io.BytesIO()  #store it something like this

    # return mp3_files


download("YT-URL")
