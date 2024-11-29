class Product {
    constructor(id, owner, name, description, price, image, quantity) {
        this.id = id;
        this.owner = owner; // ID владельца
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.quantity = quantity; // начальное количество
    }


   
    displayCard() {
        return `
            <div class="product-card">
                <img src="https://untitled-devs.ru/api/images/?filename=${this.image}" alt="${this.name}" />
                <h3>${this.name}</h3>
                <p>${this.description}</p>
                
                <div class="quantity-control">
                    <button onclick="decrementQuantity(${this.id})">-</button>
                    <span id="quantity-${this.id}">${this.quantity}</span>
                    <button onclick="incrementQuantity(${this.id})">+</button>
                </div>
                <br>
                <button>
                    <strong>Цена: €${(this.price * this.quantity).toFixed(2)}</strong>
                </button>
  
                <button onclick="deleteProduct('${this.id}')">Удалить</button>
            </div>
        `;
    }
}



async function incrementQuantity(product_id) {

    let tg = window.Telegram.WebApp;
    var user = await get_user(tg.initDataUnsafe.user.id);

    const ownerId = user.id; 
    const currentQuantity = getCurrentQuantity(product_id);
    const updatedQuantity = currentQuantity + 1;

    const data = {
        owner: { id: ownerId },
        items: [
            {
                id: product_id,
                quantity: updatedQuantity
            }
        ]
    };

    try {
        const response = await fetch('https://untitled-devs.ru/api/cart/', {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById(`quantity-${product_id}`).innerText = updatedQuantity; // Обновите количество в DOM
        } else {
            console.error('Ошибка обновления количества:', await response.json());
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
}

// Уменьшение количества продукта
async function decrementQuantity(product_id) {
    
    let tg = window.Telegram.WebApp;
    var user = await get_user(tg.initDataUnsafe.user.id);

    const ownerId = user.id; 
    const currentQuantity = getCurrentQuantity(product_id); // Получите текущее количество из DOM или другого источника

    if (currentQuantity <= 1) {
        console.warn('Невозможно уменьшить количество ниже 1');
        return;
    }

    const updatedQuantity = currentQuantity - 1;

    const data = {
        owner: { id: ownerId },
        items: [
            {
                id: product_id,
                quantity: updatedQuantity
            }
        ]
    };

    try {
        const response = await fetch('https://untitled-devs.ru/api/cart/', {
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById(`quantity-${product_id}`).innerText = updatedQuantity; 
        } else {
            console.error('Ошибка обновления количества:', await response.json());
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
}

function getCurrentQuantity(product_id) {
    const quantityElement = document.getElementById(`quantity-${product_id}`);
    return parseInt(quantityElement.innerText, 10);
}



// let tg = window.Telegram.WebApp;
// var user = await get_user(tg.initDataUnsafe.user.id);


async function deleteProduct(productId) {

    let tg = window.Telegram.WebApp;
    var user = await get_user(tg.initDataUnsafe.user.id);

    const url = 'http://untitled-devs.ru/api/cart/';
    const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        id: user.id,
        product_id: productId
    });

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Product deleted successfully:', data);
        return data;
    } catch (error) {
        console.error('Error while deleting product:', error);
        throw error;
    }
}


var old_data = "";

async function fetchProducts() {
    try {

        let tg = window.Telegram.WebApp;
        var user = await get_user(tg.initDataUnsafe.user.id);

        const cartResponse = await fetch(`https://untitled-devs.ru/api/cart/?user_id=${user.id}`);

        if (!cartResponse.ok) throw new Error(`Ошибка: ${cartResponse.status}`);

        const cartData = await cartResponse.json();

        const products = await Promise.all(
            cartData.map(async (cartItem) => {
                const productResponse = await fetch(`https://untitled-devs.ru/api/products/?product_id=${cartItem.product_id}`);
                

                if (!productResponse.ok) {
                    console.log(cartItem.product_id);
                    await deleteProduct(cartItem.product_id);
                }


                const productData = await productResponse.json();
                
                console.log(cartItem.quantity)
                return new Product(
                    productData.id,
                    productData.owner,
                    productData.name,
                    productData.description,
                    productData.price,
                    productData.image,
                    cartItem.quantity
                );
            })
        );

        updateProducts(products);
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
    }
}

var productsContainer = document.getElementById("cads-container");


var old_price = 0.0
function updateProducts(products) {
    
    new_data = "";
    var price = 0.0;
    products.forEach(product => {
        new_data += product.displayCard();
        price += product.price * product.quantity;
    });
    
    if (price != old_price){
        old_price = price;
        document.getElementById("BuyAll").innerHTML = `€${price}`
    }

    if (old_data != new_data) {
        productsContainer.innerHTML = new_data;
        old_data = new_data;
    } else {
        console.log("data not updted");
    }
}


setInterval(fetchProducts, 5000);

fetchProducts();


