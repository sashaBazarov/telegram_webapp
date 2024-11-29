from fastapi import Depends, FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Telegram Market API",
    description="Test work",
    version="0.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Либо укажите конкретный домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

app.include_router(router)
