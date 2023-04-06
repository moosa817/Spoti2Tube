from app.endpoints import index, errors,liked
from fastapi.staticfiles import StaticFiles


class MyApp:
    def __init__(self, app) -> None:
        self.app = app
        
       
    def load_endpoints(self):
        self.app.mount(
            "/static", StaticFiles(directory="app/static"), name="static")  # load static files
        
        # load errors 
        exception_handlers = {404: errors.not_found,
                              401:errors.unauthorized,
                              403:errors.forbidden,
                              500:errors.server_error}
        self.app.exception_handlers=exception_handlers


        #load endpoints
        self.app.include_router(index.index_app)
        self.app.include_router(liked.liked_app)

