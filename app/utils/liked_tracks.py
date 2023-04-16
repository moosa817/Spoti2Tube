import spotipy
from spotipy.oauth2 import SpotifyOAuth
import dotenv

dotenv.load_dotenv()


class GetToken:
    def __init__(self, code, request):
        scope = "user-library-read"
        sp_oauth = SpotifyOAuth(scope=scope)
        token_info = sp_oauth.get_access_token(code)

        self.access_token = token_info['access_token']
        self.refresh_token = token_info['refresh_token']

        request.session["access_token"] = self.access_token
        request.session["refresh_token"] = self.refresh_token
        self.request = request


class GetLikedTracks:
    def __init__(self, access_token, refresh_token, request) -> None:
        sp = spotipy.Spotify(auth=access_token)

        self.sp = sp
        try:
            self.results = sp.current_user_saved_tracks()
        except:
            try:
                auth_manager = sp.auth_manager
                new_token_info = auth_manager.refresh_access_token(
                    refresh_token)
                request.session['access_token'] = new_token_info
            except:
                request.session = None

    def getinfo(self):
        user_info = self.sp.me()
        info = {"name": user_info["display_name"], "link": user_info["external_urls"]["spotify"],"img":user_info["images"][0]["url"]}

        return info

    def savedTracks(self):
        results = self.results

        finalresults = []
        for item in results['items']:
            track = item['track']
            track_name = track['name']

            track_name = track_name.replace('"', '')
            track_name = track_name.replace("'", '')

            by = track['artists'][0]['name']

            results = {'name': track_name, 'by': by, 'url': track['external_urls']
                       ['spotify'], 'img': track['album']['images'][1]['url'], 'type': 'Track'}
            finalresults.append(results)

        return finalresults
