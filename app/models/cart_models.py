from pydantic import BaseModel
from typing import Dict


class CartItem(BaseModel):
    id: int
    quantity: str


class CartOwner(BaseModel):
    id: int


class RemoveItem(BaseModel):
    id: int
    product_id: int

