from youtube_search import YoutubeSearch
import json


def yt_search(search):
    print(search)
    results = YoutubeSearch(search, max_results=1).to_json()

    results = json.loads(results)
    vid = results["videos"][0]
    vid_id = vid["id"]
    url = f"https://www.youtube.com/watch?v={vid_id}"

    thumbnail = thumbnail = f"https://img.youtube.com/vi/{vid_id}/maxresdefault.jpg"
    channel = vid["channel"]
    title = vid["title"]

    duration = vid["duration"]
    minutes, _ = duration.split(":")
    if int(minutes) >= 8:
        return None

    return {
        "link": url,
        "title": title,
        "thumbnail": thumbnail,
        "by": channel,
        "type": "Youtube Video",
    }


def search_for_short_videos(names):
    results = map(yt_search, names)

    results = [] if not results else [i for i in results if i is not None]

    return results


# search youtube url ?
