import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.cache_handler import MemoryCacheHandler


class SpotifyAPI:

    def __init__(self, client_id, client_secret, no) -> None:
        meme_cache = MemoryCacheHandler()
        auth_manager = SpotifyClientCredentials(
            client_id=client_id, client_secret=client_secret, cache_handler=meme_cache
        )
        self.sp = spotipy.Spotify(auth_manager=auth_manager)
        self.no = no

    def get_tracks(self, track: str):
        results = self.sp.search(q=track, type="track", limit=self.no)

        items = results["tracks"]["items"]
        results = [
            {
                "name": item["name"],
                "by": item["artists"][0]["name"],
                "url": item["external_urls"]["spotify"],
                "img": item["album"]["images"][1]["url"],
                "type": "Track",
                "length": 1,
            }
            for item in items
        ]

        return results

    def get_album(self, album: str):
        results = self.sp.search(q=album, type="album", limit=self.no)

        items = results["albums"]["items"]

        results = [
            {
                "name": item["name"],
                "by": item["artists"][0]["name"],
                "url": item["external_urls"]["spotify"],
                "img": item["images"][1]["url"],
                "type": "Album",
                "length": item["total_tracks"],
            }
            for item in items
        ]

        return results

    def get_playlist(self, playlist):
        results = self.sp.search(q=playlist, type="playlist", limit=self.no)

        items = results["playlists"]["items"]
        results = [
            {
                "name": item["name"],
                "by": item["owner"]["display_name"],
                "url": item["external_urls"]["spotify"],
                "img": item["images"][0]["url"],
                "type": "Playlist",
                "length": item["tracks"]["total"],
            }
            for item in items
        ]

        return results

    def get_with_link(self, link):
        if "track" in link:
            item = self.sp.track(link)

            results = {
                "name": item["name"],
                "by": item["artists"][0]["name"],
                "url": item["external_urls"]["spotify"],
                "img": item["album"]["images"][1]["url"],
                "type": "Track",
                "length": 1,
            }
            return results

        elif "playlist" in link:
            results = self.sp.playlist(link)
            results1 = results["tracks"]["items"]
            results = [
                {
                    "name": item["track"]["name"],
                    "by": item["track"]["artists"][0]["name"],
                    "url": item["track"]["external_urls"]["spotify"],
                    "img": item["track"]["album"]["images"][1]["url"],
                    "type": "Track",
                    "length": 1,
                }
                for item in results1
            ]
            return results

        elif "album" in link:
            results = self.sp.album(link)
            results1 = results
            results = results["tracks"]["items"]

            results = [
                {
                    "name": item["name"],
                    "by": item["artists"][0]["name"],
                    "url": item["external_urls"]["spotify"],
                    "img": results1["images"][1]["url"],
                    "type": "Track",
                    "length": 1,
                }
                for item in results
            ]
            return results

        else:
            return None
