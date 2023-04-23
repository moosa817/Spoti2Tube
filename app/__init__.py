from app.routes import index, errors, liked, search, download
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from config import get_settings


class MyApp:

    def __init__(self, app) -> None:
        self.app = app

    def load_endpoints(self):
        self.app.mount("/static",
                       StaticFiles(directory="app/static"),
                       name="static")  # load static files

        # load errors
        exception_handlers = {
            404: errors.not_found,
            401: errors.unauthorized,
            403: errors.forbidden,
            500: errors.server_error
        }
        self.app.exception_handlers = exception_handlers

        # add session middleware
        self.app.add_middleware(SessionMiddleware,
                                secret_key=get_settings().secret_key,
                                max_age=30 * 24 * 60 * 60)

        # load endpoints
        self.app.include_router(index.index_app)
        self.app.include_router(liked.liked_app)
        self.app.include_router(search.search_app)
        self.app.include_router(download.download_app)
