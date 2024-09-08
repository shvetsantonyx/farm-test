let tg = window.Telegram.WebApp;

tg.expand();

let username = tg.initDataUnsafe.user.first_name // имя пользователя
document.getElementById("username").innerHTML = username;

// tg.MainButton.textColor = "#FFFFFF";
// tg.MainButton.color = "FF00FF";

let btn = document.getElementById("click");

btn.addEventListener("push", function(){
    tg.MainButton.setText("Собрано");
    tg.MainButton.show();
    tg.sendData("sendTestMessage");
});