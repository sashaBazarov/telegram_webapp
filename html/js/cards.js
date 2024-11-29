class Product {
  constructor(id, owner, name, description, price, image) {
      this.id = id;
      this.owner = owner;
      this.name = name;
      this.description = description;
      this.price = price;
      this.image = image;
  }

  displayCard() {
      return `
          <div class="product-card">
              <img src="https://untitled-devs.ru/api/images/?filename=${this.image}" alt="${this.name}" />
              <h3>${this.name}</h3>
              <p>${this.description}</p>
              
              <button onclick="addToCart(${this.id})"><strong>Цена: €${this.price.toFixed(2)}</strong></button>
          </div>
      `;
  }
}

var old_data = "";

async function fetchProducts() {
    try {
        const response = await fetch("https://untitled-devs.ru/api/products_all");

        console.log(response)
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        
        const productsData = await response.json();

        const products = productsData.map(
            data => new Product(data.id, data.owner, data.name, data.description, data.price, data.image)
        );

        updateProducts(products);
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
    }
}

var productsContainer = document.getElementById("cads-container");


function updateProducts(products) {

    var new_data = "";

    products.forEach(product => {
        new_data += product.displayCard();
    });

    if (old_data != new_data) {
      productsContainer.innerHTML = new_data;
      old_data = new_data;
    }else{
      console.log("data not updted");
    }
}

setInterval(fetchProducts, 5000);

fetchProducts();


async function addToCart(product_id, quantity = 1) {

    let tg = window.Telegram.WebApp;
    var user = await get_user(tg.initDataUnsafe.user.id);

    const url = 'https://untitled-devs.ru/api/cart/';
    const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        owner: {
            id: user.id
        },
        data: [
            {
                id: product_id,
                quantity: quantity
            }
        ]
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Product added to cart successfully:', data);
        return data;
    } catch (error) {
        console.error('Error while adding product to cart:', error);
        throw error;
    }
}