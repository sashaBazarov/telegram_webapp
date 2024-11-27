from fastapi import HTTPException
from app.instances import router
from app.database import *
from app.models import CreateUser


@router.post("/users/")
async def create_user(userdata: CreateUser):
    add_user(userdata.telegram_id)
    return {"message": "User created sucsessfully"}


@router.get("/users/{user_id}")
async def get_user_by_id(telegram_id):
    user = find_user_by_telegram_id(telegram_id)

    if not user:
        raise HTTPException(404, "User not found")
    
    return find_user_by_telegram_id(telegram_id).to_dict()


@router.delete("/users/{user_id}")
async def delete_user(userdata: CreateUser):
    user = find_user_by_telegram_id(userdata.telegram_id)
    if not user:
        raise HTTPException(404, "User not found")
    remove_user_by_id(user.id)

    return {"message": "User removed sucsessfully"}
