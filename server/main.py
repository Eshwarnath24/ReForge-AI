from fastapi import FastAPI

from middleware.cors_middleware import setup_cors
from routers.item_router import router as item_router
from routers.auth_router import router as auth_router
from db.database import init_db

app = FastAPI()

setup_cors(app)
init_db()

app.include_router(item_router)
app.include_router(auth_router)


@app.get("/")
def health_check():
    return {"status": "ReForge AI backend running"}