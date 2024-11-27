from .models import *


def add_user(telegram_id):
    session.add(User(telegram_id))
    session.commit()


def find_user_by_id(user_id: int):

    return session.query(User).filter(User.id == user_id).first()


def find_user_by_telegram_id(telegram_id: str):

    return session.query(User).filter(User.telegram_id == telegram_id).first()


def remove_user_by_id(user_id):

    session.query(User).filter(User.id == user_id).delete()
    session.commit()


def find_all_products():

    return session.query(Product).all()


def find_users_products(user_id):

    return session.query(Product).filter(Product.owner == user_id).all()


def add_product(name: str, description: str, price: float, image: str, owner: int):

    session.add(Product(owner, name, description, price, image))
    session.commit()


def find_product_by_id(product_id: int):

    return session.query(Product).filter(Product.id == product_id).first()


def update_product(product_id: int, name: str, description: str, price: float, image: str):
    
    session.query(Product).filter(Product.id == product_id).update({
        Product.name: name,
        Product.description: description,
        Product.price: price,
        Product.image: image
    })
    session.commit()


def remove_product(product_id):

    session.query(Product).filter(Product.id == product_id).delete()
    session.commit()


def find_cart_items_by_user(user_id: int):

    return session.query(CartItem).filter(CartItem.user_id == user_id).all()


def find_cart_item(user_id: int, product_id: int):

    return session.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).first()


def add_to_cart(user_id: int, product_id: int, quantity: int = 1):

    cart_item = find_cart_item(session, user_id, product_id)
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            user_id=user_id, product_id=product_id, quantity=quantity)
        session.add(cart_item)
    session.commit()


def remove_from_cart(user_id: int, product_id: int):

    cart_item = find_cart_item(session, user_id, product_id)
    if cart_item:
        session.delete(cart_item)
        session.commit()


def update_cart_item_quantity(user_id: int, product_id: int, quantity: int):

    cart_item = find_cart_item(session, user_id, product_id)
    if cart_item:
        cart_item.quantity = quantity
        session.commit()


def clear_user_cart(user_id: int):

    session.query(CartItem).filter(CartItem.user_id == user_id).delete()
    session.commit()
