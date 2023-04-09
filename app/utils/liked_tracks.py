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

    def print_tokens(self):
        print(f"ACcess TOKEN : {self.access_token}")
        return self.access_token


class GetLikedTracks:
    def __init__(self, access_token, refresh_token, request) -> None:
        sp = spotipy.Spotify(auth=access_token)

        try:
            self.results = sp.current_user_saved_tracks()
        except:
            auth_manager = sp.auth_manager
            new_token_info = auth_manager.refresh_access_token(refresh_token)
            request.session['access_token'] = new_token_info

    def savedTracks(self):
        results = self.results

        finalresults = []
        for item in results['items']:
            track = item['track']
            track_name = track['name'] + ' ' + track['artists'][0]['name']

            results = {'name': track_name, 'url': track['external_urls']
                       ['spotify'], 'img': track['album']['images'][1]['url']}
            finalresults.append(results)

        return finalresults
