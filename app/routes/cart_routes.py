from instances import router
from app.models import CartItem, CartOwner, RemoveItem
from app.database import add_to_cart, find_user_by_id, find_cart_items_by_user, remove_from_cart, find_product_by_id, update_cart_item_quantity
from typing import List
from fastapi import HTTPException


@router.post("/cart/")
async def add_items_to_cart(owner: CartOwner, data: List[CartItem]):

    if not find_user_by_id(owner.id):
        raise HTTPException(404, "User not found")

    for product in data:
        add_to_cart(owner.id, product.id, product.quantity)

    return {"message": "Products added to cart"}


@router.get("/cart/{user_id}")
async def get_users_cart(user_id: str):

    if not find_user_by_id(user_id):
        raise HTTPException(404, "User not found")

    return [item.to_dict for item in find_cart_items_by_user(user_id)]


@router.delete("/cart/{user_id}")
async def delete_item(data: RemoveItem):

    if not find_user_by_id(data.id):
        raise HTTPException(404, "User not found")
    if not find_product_by_id(data.product_id):
        raise HTTPException(404, "Product not found")

    remove_from_cart(data.id, data.product_id)


@router.put("/cart/{user_id}")
async def update_items(owner: CartOwner, items: List[CartItem]):

    if not find_user_by_id(owner.id):
        raise HTTPException(404, "User not found")
    
    for item in items:
        update_cart_item_quantity(owner.id, item.id, item.quantity)