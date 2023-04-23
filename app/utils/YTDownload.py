# downloads single youtube song as a mp3 file and return bytes object
import yt_dlp
import os


def download_song(url):

    filename = 'audio'
    if os.path.exists(filename + '.mp3'):
        i = 1
        while os.path.exists(f'audio{i}.mp3'):
            i += 1
        filename = f'audio{i}'
    # Set up the yt-dlp options
    options = {
        'format':
        'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegVideoConvertor',
            'preferedformat': 'mp3',
        }],
        'outtmpl':
        f'{filename}.%(ext)s',
    }
    file_path = f"{filename}.mp3"
    # Download the video and convert it to MP3 using yt-dlp
    with yt_dlp.YoutubeDL(options) as ydl:
        ydl.download([url])

    with open(file_path, 'rb') as f:
        audio_data = f.read()

    print(len(audio_data))
    os.remove(file_path)
    if len(audio_data) < 8_000_000:  #8mb
        return audio_data
    else:
        return None
