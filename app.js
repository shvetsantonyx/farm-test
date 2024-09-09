let tg = window.Telegram.WebApp;

tg.expand();

let username = tg.initDataUnsafe.user.first_name // имя пользователя
let message = `Привет, ${username}!`
document.getElementById("username").innerHTML = message;

// tg.MainButton.textColor = "#FFFFFF";
// tg.MainButton.color = "FF00FF";

let btn = document.getElementById("btn");

let user = {
    "userid": 2,
    "langcode": "ru",
    "chatid": 3
}

let url = 'http://185.104.114.18:8081/login'

btn.addEventListener("click", async function(){
    // tg.MainButton.setText("Собрано");
    // tg.MainButton.show();
    // tg.sendData("sendTestMessage");
//     if (tg.MainButton.isVisible){ //если кнопка показана 
// 		tg.MainButton.hide() //скрываем кнопку 
// 	}
//   else{ //иначе
//   	tg.MainButton.show() //показываем 
//   }
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