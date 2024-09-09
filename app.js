let tg = window.Telegram.WebApp;

tg.expand();

let username = tg.initDataUnsafe.user.first_name // имя пользователя
document.getElementById("username").innerHTML = username;

// tg.MainButton.textColor = "#FFFFFF";
// tg.MainButton.color = "FF00FF";

let btn = document.getElementById("btn");

console.log('Hii');

btn.addEventListener("click", function(){
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
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log(json));

    let coins = 0
    document.getElementById("coins").innerHTML = coins;


});