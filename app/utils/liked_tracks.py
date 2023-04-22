import spotipy
from spotipy.oauth2 import SpotifyOAuth
import dotenv

dotenv.load_dotenv()


class GetToken:

    def __init__(self, code, request, client_id, client_secret, redirect_uri):
        scope = "user-library-read"
        sp_oauth = SpotifyOAuth(client_id=client_id,
                                client_secret=client_secret,
                                redirect_uri=redirect_uri,
                                scope=scope)
        token_info = sp_oauth.get_access_token(code)

        self.access_token = token_info['access_token']
        self.refresh_token = token_info['refresh_token']

        request.session["access_token"] = self.access_token
        request.session["refresh_token"] = self.refresh_token
        self.request = request


class GetLikedTracks:

    def __init__(self, access_token: str, refresh_token: str, request,
                 limit: int) -> None:
        sp = spotipy.Spotify(auth=access_token)
        self.limit = limit
        try:
            self.sp = sp

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
        results = self.sp.current_user_saved_tracks(limit=1)
        info = {
            "name": user_info["display_name"],
            "link": user_info["external_urls"]["spotify"],
            "img": user_info["images"][0]["url"],
            "max_tracks": results['total']
        }

        return info

    def savedTracks(self):
        finalresults = []

        n = 0
        num_tracks = self.limit

        results = self.sp.current_user_saved_tracks(limit=min(50, num_tracks))
        tracks = results['items']
        num_retrieved = len(tracks)

        while num_retrieved < num_tracks and results['next']:
            results = self.sp.next(results)
            tracks.extend(results['items'])
            num_retrieved += len(results['items'])

        for track in tracks:
            mytrack = track['track']

            track_name = mytrack['name']

            track_name = track_name.replace('"', '')
            track_name = track_name.replace("'", '')

            by = mytrack['artists'][0]['name']
            image_url = mytrack['album']['images'][0]['url'] if track['track'][
                'album']['images'] else None

            results = {
                'name': track_name,
                'by': by,
                'url': mytrack['external_urls']['spotify'],
                'img': image_url,
                'type': 'Track'
            }
            finalresults.append(results)

        return finalresults
