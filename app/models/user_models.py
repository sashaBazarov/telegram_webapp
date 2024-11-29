from pydantic import BaseModel


class CreateUser(BaseModel):
    telegram_id: int


class DeleteUser(BaseModel):
    telegram_id: int