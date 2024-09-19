let tg = window.Telegram.WebApp;

tg.expand();

let mainurl = 'https://farmingmachine.webtm.ru';
let endpointLogin = '/api/login';
let endpointInfo = '/api/info';
let endpointFarming = '/api/farming';
let endpointClaim = '/api/claim';

try {
    let username = tg.initDataUnsafe.user.first_name // имя пользователя
    let message = `Привет, ${username}!`
    document.getElementById("username").innerHTML = message;
    // document.getElementById("username").textContent = message;
} catch (err) {
    console.log('Error username')
}


let btn = document.getElementById("btn");
let coins_obj = document.getElementById("coins");
let coins_counter_obj = document.getElementById("coins_counter");

// btn.setAttribute('disabled', '') // кнопка неактивна

// btn.style.display = 'none' // кнопка скрыта

// btn.style.display = 'none' // кнопка скрыта


// TODO переделать запрос 
let login = {
    'queryId': 'test',
    'userId': tg.initDataUnsafe.user.id,
    'userName': tg.initDataUnsafe.user.username,
    'firstName': tg.initDataUnsafe.user.first_name,
    'lastName': tg.initDataUnsafe.user.last_name,
    'langCode': tg.initDataUnsafe.user.language_code,
    'authDate': Date.now(),
    'hash': 'test'
};
console.log(login);


// отправляется запрос login на сервер
try {
    let responce = fetch(mainurl + endpointLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    });
    
    let result = responce.json();
    console.log(result);
    if (length(result.token) > 0) {
        btn.style.display = 'inline' // возвращаем кнопку
    }
} 
catch (err) {
    console.log('Error username')};

// отправляется запрос info на сервер
try {
    let responce = fetch(mainurl + endpointInfo, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${result.token}`
        }
    });

    let result = responce.json();
    let parsed_result = JSON.parse(result)
    coins_obj.textContent = parsed_result.balanceInfo.coins; // вытягиваем баланс для отображения
}
catch (err) {}

//переменные для фарма
let duration = parsed_result.farmingInfo.durationSec;
let maxcap = parsed_result.farmingInfo.maxCap;
let multiplier = parsed_result.farmingInfo.multiplier;



let resp_user_created = {
    "message": "Account has been created",
    "status": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50Ijp7InVzZXJJZCI6MiwibGFuZ0NvZGUiOiJydSJ9fQ.VZwwvOmjat2RZV7NLCcwlyyTy3UQs_fN8VJpRaJGchI"
};

let resp_user_logged = '{ \
    "message": "Logged In", \
    "status": true, \
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50Ijp7InVzZXJJZCI6MiwibGFuZ0NvZGUiOiJydSJ9fQ.VZwwvOmjat2RZV7NLCcwlyyTy3UQs_fN8VJpRaJGchI" \
}';

const parsed = JSON.parse(resp_user_logged);
console.log(parsed.message)




// JS фармилка
var coins = 0;
var coins_counter = 0;

function farming(coins_limit) {
    if (coins_counter < coins_limit) {
        coins_counter += 1;
        coins_counter_obj.innerHTML = `Текущий счет: ${coins_counter}`;
    }
}

var farm_interval_id = 0;
function start(){
    btn.innerHTML = "Фармить";
    coins_obj.innerHTML = `Ваш баланс: ${coins}`;
    
};
function farm(){
    btn.innerHTML = "Собрать"
    try {
        let responce = fetch(mainurl + endpointFarming)
    }
    catch (err) {}
    // farm_interval_id = setInterval(farming, 1000, 10);
    console.log(coins_counter)
};
function claim_reward() {
    console.log("Coins counter", coins_counter)
    coins += coins_counter;
    coins_obj.innerHTML = `Ваш баланс: ${coins}`;
    coins_counter = 0;
    clearInterval(farm_interval_id);
    farm_interval_id = setInterval(farming, 1000, 10);
}

var action = 1;
click_counter = 0;
document.querySelector('#btn').onclick = function() {
    if (btn.textContent == 'Старт') {
        start();
        console.log("first click")
        click_counter += 1;
    }
    else if (btn.textContent == 'Фармить') {
        farm();
        click_counter += 1;
        console.log("second click", action, click_counter, farm_interval_id)
        action = 1;
    }
    else if (btn.textContent == 'Собрать' && farm_interval_id > 0) {
        claim_reward();
        click_counter += 1;
        console.log("next click", click_counter);
    }
};

// конец фармилки



let url = 'https://185.104.114.18:8443/login'

// btn.addEventListener("click", async function(){
//     console.log('Hi');
//     try {
//         let responce = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(user)
//         });
// btn.addEventListener("click", async function(){
//     console.log('Hi');
//     try {
//         let responce = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(user)
//         });

//         let result = await responce.json();
//         console.log(result);
//         document.getElementById("out").innerHTML = result;
//     } catch (err) {
//         console.log('Error username')
//         document.getElementById("out").innerHTML = "Error";
//     }
//         let result = await responce.json();
//         console.log(result);
//         document.getElementById("out").innerHTML = result;
//     } catch (err) {
//         console.log('Error username')
//         document.getElementById("out").innerHTML = "Error";
//     }
    

    

//     let coins = 0
//     document.getElementById("coins").innerHTML = coins;
//     let coins = 0
//     document.getElementById("coins").innerHTML = coins;

// });
// });
