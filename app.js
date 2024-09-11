let tg = window.Telegram.WebApp;

tg.expand();

try {
    let username = tg.initDataUnsafe.user.first_name // имя пользователя
    let message = `Привет, ${username}!`
    document.getElementById("username").innerHTML = message;
} catch (err) {
    console.log('Error username')
}


// tg.MainButton.textColor = "#FFFFFF";
// tg.MainButton.color = "FF00FF";

let btn = document.getElementById("btn");

let user = {
    "userid": 2,
    "langcode": "ru",
    "chatid": 3
}

let url = 'https://185.104.114.18:8081/login'

btn.addEventListener("click", async function(){
    console.log('Hi');
    let responce = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });

    let result = await responce.json();
    console.log(result)
        

    let coins = 0
    document.getElementById("coins").innerHTML = coins;


});