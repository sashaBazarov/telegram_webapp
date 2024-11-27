from pydantic import BaseModel


class CreateUser(BaseModel):
    telegram_id: str


class DeleteUser(BaseModel):
    telegram_id: str