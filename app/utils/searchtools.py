import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.cache_handler import MemoryCacheHandler


class SpotifyAPI:
    def __init__(self, client_id, client_secret) -> None:
        meme_cache = MemoryCacheHandler()
        auth_manager = SpotifyClientCredentials(
            client_id=client_id, client_secret=client_secret, cache_handler=meme_cache)
        self.sp = spotipy.Spotify(auth_manager=auth_manager)

    def get_tracks(self, track: str):
        results = self.sp.search(q=track, type='track')

        items = results['tracks']['items']
        results = [
            {'name': item['name'], 'url': item['external_urls']
                ['spotify'], 'img': item['album']['images'][1]['url']}
            for item in items]

        return results

    def get_album(self, album: str):
        results = self.sp.search(q=album, type='album')

        items = results['tracks']['items']
        results = [
            {'name': item['name'], 'url': item['external_urls']
                ['spotify'], 'img': item['album']['images'][1]['url']}
            for item in items]

        return results

    def get_playlist(self, playlist):
        results = self.sp.search(q=playlist, type='playlist')

        items = results['tracks']['items']
        results = [
            {'name': item['name'], 'url': item['external_urls']
                ['spotify'], 'img': item['album']['images'][1]['url']}
            for item in items]

        return results

    def get_with_link(self, link):
        if "track" in link:
            item = self.sp.track(link)

            results = {'name': item['name'], 'url': item['external_urls']
                       ['spotify'], 'img': item['album']['images'][1]['url']}
            return results

        elif "playlist" in link:
            results = self.sp.playlist(link)

            results = results["tracks"]["items"]
            results = [
                {'name': item['track']['name'], 'url': item['track']['external_urls']
                 ['spotify'], 'img': item['track']['album']['images'][1]['url']}
                for item in results]
            return results

        elif "album" in link:
            results = self.sp.album(link)
            results1 = results
            results = results["tracks"]["items"]

            results = [
                {'name': item['name'], 'url': item['external_urls']
                 ['spotify'], 'img': results1['images'][1]['url']}
                for item in results]
            return results

        else:
            return None
