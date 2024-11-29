from app.instances import router
from app.models import CreateProduct, FilterProduct, UpdateProduct, OwnerData
from app.database import add_product, find_product_by_id, remove_product, find_all_products, update_product, find_users_products, find_user_by_id
from app.images import save_image
from fastapi import HTTPException
from typing import List
import base64
import os


@router.post("/api/products/")
async def create_product(owner: OwnerData, products_data: List[CreateProduct]):
    for data in products_data:

        image = save_image(base64.b64decode(data.image))

        product = add_product(
            name=data.name,
            description=data.description,
            price=data.price,
            image=image,
            owner=owner.id
        )

    return {"message": f" {len(products_data)} products sucsessfully created"}


@router.get("/api/products/")
async def get_product(product_id: str):
    product = find_product_by_id(product_id)

    if not product:
        raise HTTPException(404, "Product not found")

    return product.to_dict()


@router.get("/api/products_all")
async def get_all_products():
    products = find_all_products()

    return [product.to_dict() for product in products]


@router.get("/api/products/user/")
async def get_users_products(user_id: int):

    if not find_user_by_id(user_id):
        raise HTTPException(404, "User not found")

    return [product.to_dict() for product in find_users_products(user_id)]


@router.delete("/api/products/")
async def delete_product(product_id: int):
    if not find_product_by_id(product_id):
        raise HTTPException(404, "Product not found")

    remove_product(product_id)

    return {"message": "Product removed sucsessfully"}


@router.put("/api/products/")
async def edit_product(filter: FilterProduct, data: UpdateProduct):
    product = find_product_by_id(filter.id)

    if not product or product.owner != filter.owner:
        raise HTTPException(404, "Product not found")
    
    image = save_image(base64.b64decode(data.image))

    update_product(filter.id, data.name, data.description,
                   data.price, image)

    return {"message": "Product updated sucsessfully"}
