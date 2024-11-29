from fastapi.responses import FileResponse
from fastapi import HTTPException
from app.instances import router
import os

UPLOAD_DIR = "src/images/"

@router.get("/api/images/")
async def get_image(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(404, "File not found")
