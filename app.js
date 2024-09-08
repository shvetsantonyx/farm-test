let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "FF00FF";

let btn = document.getElementById("click");

btn.addEventListener("click", function(){
    tg.MainButton.setText("Собрано");
    tg.MainButton.show();
    tg.sendData("sendTestMessage");
});