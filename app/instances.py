from fastapi import Depends, FastAPI, APIRouter

app = FastAPI(
    title="Telegram Market API",
    description="Test work",
    version="0.1"
)

router = APIRouter()

app.include_router(router)
