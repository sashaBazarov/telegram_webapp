async function get_user(telegram_id){

    const response = await fetch(`https://untitled-devs.ru/api/users/?telegram_id=${telegram_id}`);
    var data = await response.json();
    console.log(data);

    if(response.status != 200){
        return null;
    }

    return data;

}

async function post_user(telegram_id) {
    try {
        const response = await fetch('https://untitled-devs.ru/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ telegram_id: telegram_id })
        });

        if (!response.ok) {
            console.error("Ошибка ответа сервера:", response.status);
            return null;
        }

        const data = await response.json();
        console.log("Ответ сервера:", data);
        return data;
    } catch (error) {
        console.error("Ошибка при выполнении POST-запроса:", error);
        return null;
    }
}


async function check_user(){
    let tg = window.Telegram.WebApp;
    var user = await get_user(tg.initDataUnsafe.user.id);
    
    if(!user){
        post_user(tg.initDataUnsafe.user.id)
    }
    }
check_user();