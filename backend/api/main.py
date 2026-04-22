from fastapi import FastAPI

from backend.api.routes.classify import router

app = FastAPI()
app.include_router(router)
