from pytube import Search, YouTube
from concurrent.futures import ThreadPoolExecutor


def search_for_short_video(name):
    try:
        search_results = Search(name)
        search_results = search_results.results
        first_video = search_results[0]
        if int(first_video.length) <= 600:
            title = first_video.title
            thumbnail_url = first_video.thumbnail_url
            channel_name = first_video.author
            video_url = first_video.watch_url

        return {
            "link": video_url,
            "title": title,
            "thumbnail": thumbnail_url,
            "by": channel_name,
            "type": "Youtube Video"
        }
    except:
        pass
    return None


def search_for_short_videos(names):
    with ThreadPoolExecutor() as executor:
        results = list(executor.map(search_for_short_video, names))

    if results is None:
        return []

    results = [i for i in results if i is not None]

    return results
