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
            <div class="product-card" data-id="${this.id}">
                <img src="https://untitled-devs.ru/api/images/?filename=${this.image}" alt="${this.name}" />
                <h3>${this.name}</h3>
                <p>${this.description}</p>
                <p><strong>Цена: €${this.price.toFixed(2)}</strong></p>
                <div class="product-card-actions">
                    <button class="edit-button" onclick="openEditModal('${this.id}', '${this.name}', '${this.price}', '${this.description}')">Изменить</button>
                     <button class="delete-button" onclick="deleteProduct('${this.id}')">Удалить</button>
                </div>
            </div>
        `;
    }
}


async function deleteProduct(productId) {
    try {
        const response = await fetch(`https://untitled-devs.ru/api/products/?product_id=${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка при удалении продукта с ID ${productId}: ${response.statusText}`);
        }

        console.log(`Продукт с ID ${productId} успешно удален`);
        await fetchProducts();
        return true;
    } catch (error) {
        console.error('Ошибка при удалении продукта:', error);
        return false;
    }
}



async function fetchProducts() {
    try {

        let tg = window.Telegram.WebApp;
        var user = await get_user(tg.initDataUnsafe.user.id);

        console.log(user);

        const response = await fetch(`https://untitled-devs.ru/api/products/user/?user_id=${user.id}`);

        console.log(response)
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

        const productsData = await response.json();

        // Создаём экземпляры класса Product
        const products = productsData.map(
            data => new Product(data.id, data.owner, data.name, data.description, data.price, data.image)
        );

        // Обновляем HTML
        updateProducts(products);
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
    }
}

var productsContainer = document.getElementById("cads-container");

var old_data = "";
function updateProducts(products) {

    new_data = "";

    products.forEach(product => {
        new_data += product.displayCard();
    });

    if (old_data != new_data) {
        productsContainer.innerHTML = new_data;
        old_data = new_data;
    } else {
        console.log("data not updted");
    }
}


// Запускаем опрос сервера каждые 5 секунд
setInterval(fetchProducts, 5000);

// Первая загрузка данных
fetchProducts();


document.getElementById('edit-product-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const productId = document.getElementById('edit-product-id').value;
    const name = document.getElementById('edit-product-name').value;
    const price = parseFloat(document.getElementById('edit-product-price').value);
    const description = document.getElementById('edit-product-description').value;
    const imageFile = document.getElementById('edit-product-image').files[0]; // Если загружается изображение

    try {
        let base64Image = '';

        let tg = window.Telegram.WebApp;
        var user = await get_user(tg.initDataUnsafe.user.id);

        if (imageFile) {
            base64Image = await toBase64(imageFile);
        }

        const payload = {
            filter: {
                id: productId,
                owner: user.id
            },
            data: {
                name,
                price,
                description,
                image: base64Image 
            }
        };

        // Отправляем запрос на сервер
        const response = await fetch(`https://untitled-devs.ru/api/products/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Изменения сохранены!");
            document.getElementById('edit-modal').style.display = 'none';
        } else {
            throw new Error(`Ошибка: ${response.status}`);
        }
    } catch (error) {
        alert("Не удалось сохранить изменения: " + error.message);
    }
});


// Функция для преобразования файла в строку Base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Убираем префикс "data:image/*;base64,"
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}


function openEditModal(id, name, price, description) {
    // Заполняем форму текущими данными товара
    document.getElementById('edit-product-id').value = id;
    document.getElementById('edit-product-name').value = name;
    document.getElementById('edit-product-price').value = price;
    document.getElementById('edit-product-description').value = description;

    // Открываем модальное окно
    document.getElementById('edit-modal').style.display = 'flex';
}


document.getElementById('close-edit-modal').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';


});

// Пример вызова с данными товара
const sampleProduct = {
    id: 1,
    name: "Пример товара",
    price: 100,
    description: "Описание товара"
};
