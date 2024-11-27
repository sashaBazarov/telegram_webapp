from pydantic import BaseModel


class OwnerData(BaseModel):
    id: int


class CreateProduct(BaseModel):
    name: str
    description: str
    price: float
    image: str


class FilterProduct(BaseModel):
    owner: int
    id: int


class UpdateProduct(BaseModel):
    name: str
    description: str
    price: float
    image: str
