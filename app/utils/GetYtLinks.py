import requests
import re


def yt_search(search):
    try:
        search = search.replace(" ", "+")

        html = requests.get(
            "https://www.youtube.com/results?search_query="+search)

        video_ids = re.findall(r"watch\?v=(\S{11})", html.text)

        vid = video_ids[0]

        e = requests.get("https://www.youtube.com/watch?v="+vid)
        titles = re.findall(r"<title>(.*?)</title>", e.text)

        title = titles[0]
        vid = "https://www.youtube.com/watch?v="+vid

        # extract thumbnail URL from the HTML
        thumbnails = re.findall(
            r'"thumbnail":{"thumbnails":\[{"url":"(.*?)","width":', e.text)
        thumbnail = thumbnails[0]

        channel_names = re.findall(
            r'"ownerChannelName":"(.*?)",', e.text)
        channel_name = channel_names[0]
        title = title.replace(" - YouTube", "")
        return vid, title, thumbnail, channel_name

    except IndexError:
        pass
