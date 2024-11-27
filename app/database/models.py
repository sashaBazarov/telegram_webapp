from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine('sqlite:///data/marketplace.db')  # Замените на ваш URL базы данных
Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    """Модель пользователя."""
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    telegram_id = Column(String, nullable=False, unique=True)

    cart_items = relationship('CartItem', back_populates='user', cascade='all, delete-orphan')

    def __init__(self, telegram_id):
        self.telegram_id = telegram_id

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
    
    def to_dict(self):
        return{
            "id": self.id,
            "telegram_id": self.telegram_id,
            "cart_items": [item.to_dict() for item in self.cart_items]
        }


class Product(Base):
    """Модель товара."""
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, autoincrement=True)
    owner = Column(Integer, ForeignKey('users.id'), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    image = Column(String)

    cart_items = relationship('CartItem', back_populates='product', cascade='all, delete-orphan')

    def __init__(self, owner: int, name: str, description: str, price: float, image: str):
        self.owner = owner
        self.name = name
        self.description = description
        self.price = price
        self.image = image

    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', price={self.price})>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "owner": self.owner,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image": self.image
        }


class CartItem(Base):
    """Модель элемента корзины."""
    __tablename__ = 'cart_items'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    added_at = Column(DateTime, default=func.now())

    # Связи
    user = relationship('User', back_populates='cart_items')
    product = relationship('Product', back_populates='cart_items')

    def __repr__(self):
        return f"<CartItem(id={self.id}, user_id={self.user_id}, product_id={self.product_id}, quantity={self.quantity})>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "added_at": self.added_at.isoformat() 
        }
