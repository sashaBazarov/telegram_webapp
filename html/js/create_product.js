// Получаем элементы
const openModal = document.getElementById("open-modal");
const closeModal = document.getElementById("close-modal");
const modal = document.getElementById("modal");

// Открыть модальное окно
openModal.addEventListener("click", () => {
    modal.style.display = "flex"; // Показываем модальное окно
});

// Закрыть модальное окно
closeModal.addEventListener("click", () => {
    modal.style.display = "none"; // Скрываем модальное окно
});

// Закрытие при клике на фон
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none"; // Скрываем, если клик был вне контента
    }
});

document.getElementById("product-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    // Получаем значения из формы
    const productName = document.getElementById("product-name").value;
    const productPrice = parseFloat(document.getElementById("product-price").value);
    const productDescription = document.getElementById("product-description").value;
    const productImageFile = document.getElementById("product-image").files[0];

    // Преобразуем файл изображения в base64
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); // Убираем "data:image/*;base64,"
            reader.onerror = (error) => reject(error);
        });

    try {
        // Преобразуем изображение в base64
        const productImageBase64 = await toBase64(productImageFile);
        let tg = window.Telegram.WebApp;
        var user = await get_user(tg.initDataUnsafe.user.id);
        // Формируем данные для запроса
        const requestData = {
            owner: {
                id: user.id, 
            },
            products_data: [
                {
                    name: productName,
                    description: productDescription,
                    price: productPrice,
                    image: productImageBase64,
                },
            ],
        };

        // Отправляем POST-запрос
        const response = await fetch("https://untitled-devs.ru/api/products/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        // Обрабатываем ответ
        if (response.ok) {
            const result = await response.json();
            alert("Товар успешно создан: " + result.message);
            // Очистка формы или закрытие модального окна
            this.reset();
            document.getElementById("modal").style.display = "none";
        } else {
            const error = await response.json();
            alert("Ошибка создания товара: " + error.message);
        }
    } catch (error) {
        console.error("Произошла ошибка:", error);
        alert("Не удалось создать товар. Попробуйте ещё раз.");
    }
});