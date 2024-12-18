from fastapi import HTTPException, Request
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="app/templates/")


# 404
async def not_found(request: Request, exc: HTTPException):
    context = {"request": request}
    return templates.TemplateResponse(
        "error/404.html", context=context, status_code=404
    )


# 401
async def unauthorized(request: Request, exc: HTTPException):
    context = {"request": request}
    return templates.TemplateResponse(
        "error/401.html", context=context, status_code=401
    )


# 403
async def forbidden(request: Request, exc: HTTPException):
    context = {"request": request}
    return templates.TemplateResponse(
        "error/403.html", context=context, status_code=403
    )


# 500
async def server_error(request: Request, exc: HTTPException):
    context = {"request": request}
    return templates.TemplateResponse(
        "error/500.html", context=context, status_code=500
    )
