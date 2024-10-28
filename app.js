let tg = window.Telegram.WebApp;

tg.expand();

console.log(tg.initData);

const mainurl = 'https://farmingmachine.webtm.ru';
const endpointLogin = '/api/login';
const endpointInfo = '/api/info';
const endpointFarming = '/api/farming';
const endpointClaim = '/api/claim';

try {
    let username = tg.initDataUnsafe.user.first_name; // имя пользователя
    let message = `Привет, ${username}!`;
    document.getElementById('username').innerHTML = message;
} catch (err) {
    console.log('Error username');
}

const btn = document.getElementById('btn');
const coins_obj = document.getElementById('coins'); // Balance
const coins_counter_obj = document.getElementById('coins_counter'); // Counter
const coin_img_obj = document.getElementById('coin'); // Монета картинка
const daily_reward_btn = document.getElementById('dailyRewardButton');
const reward_modal = document.getElementById('rewardModal'); // контейнер модального окна
const close_modal = document.querySelector('.close');
// Кнопки для каждого дня
const day_btn = [
    document.getElementById('day1'),
    document.getElementById('day2'),
    document.getElementById('day3'),
    document.getElementById('day4'),
    document.getElementById('day5'),
    document.getElementById('day6'),
    document.getElementById('day7'),
];

btn.style.display = 'none'; // скрываем кнопку, ждем логин

// TODO переделать запрос
let login = {
    queryId: 'test',
    userId: tg.initDataUnsafe.user.id,
    userName: tg.initDataUnsafe.user.username,
    firstName: tg.initDataUnsafe.user.first_name,
    lastName: tg.initDataUnsafe.user.last_name,
    langCode: tg.initDataUnsafe.user.language_code,
    authDate: Math.round(Date.now() / 1000),
    hash: 'test',
};

let token = '';

// переменные для фарма
let duration = 0;
let maxcap = 0;
let rate = 0;
let multiplier = 0;

let coin_count_interval = 0; // для setInterval
let coin_count_timeout = 0; // для setTimeout
let timer_10_percent_interval = 0; // setInterval
let timer_10_percent_timerout = 0; // setTimeout

// переменные ежедневной награды
let day_entry = 0;
let daily_reward = 0;

// Открытие модального окна
daily_reward_btn.addEventListener('click', () => {
    reward_modal.style.display = 'flex';
    day_btn[0].disabled = false; // временно активировать первую кнопку
});

// Закрытие модального окна
close_modal.addEventListener('click', () => {
    reward_modal.style.display = 'none';
});

// Закрытие модального окна по клику вне контента
window.addEventListener('click', (event) => {
    if (event.target === reward_modal) {
        reward_modal.style.display = 'none';
    }
});

// инициализация страницы
try {
    (async function () {
        // отправляем запрос login
        let responce = await fetch(endpointLogin, {
            //mainurl + endpointLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(login),
        });

        let result_login = await responce.json();
        token = result_login.token;
        console.log(result_login.token.length);
        console.log(result_login.token);
        console.log(result_login.message.includes('Logged'), 'includes func');
        if (
            result_login.token.length > 0 &&
            result_login.message.includes('Logged')
        ) {
            console.log('Return btn собрать');
            btn.textContent = 'Собрать';
            btn.style.display = 'inline'; // возвращаем кнопку
        } else if (
            result_login.token.length > 0 &&
            result_login.message.includes('created')
        ) {
            console.log('Return btn фармить');
            btn.textContent = 'Фармить';
            btn.style.display = 'inline'; // возвращаем кнопку
        } else if (result_login.token.length == 0) {
            console.log('Error with login');
        }

        // отправляем запрос info
        let responce_info = await fetch(mainurl + endpointInfo, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Good info');
        let result_info = await responce_info.json();

        console.log(result_info.account.balanceInfo.coins, 'balance');
        coins_obj.textContent =
            result_info.account.balanceInfo.coins.toFixed(2); // вытягиваем баланс для отображения
        console.log(Object.keys(result_info.account.farmingInfo).length);

        // если >5 значит это не новый пользователь и нужна проверка на фарм или сбор награды
        //if (Object.keys(result_info.account.farmingInfo).length > 5) {
        maxcap = result_info.account.farmingInfo.maxCap;
        rate = result_info.account.farmingInfo.rate;
        console.log(`maxcap ${maxcap}, rate ${rate}`);
        duration = result_info.account.farmingInfo.durationSec;
        let mining = result_info.account.farmingInfo.mining;
        let reward = result_info.account.farmingInfo.reward;
        multiplier = result_info.account.farmingInfo.multiplier;
        console.log(`mining ${mining}, multiplier ${multiplier}`);
        // для ежедневной награды
        day_entry = result_info.account.dailyRewardInfo.daysEntry;
        daily_reward = result_info.account.dailyRewardInfo.reward;

        if (mining) {
            btn.textContent = 'Собрать';
            console.log('start farming func');
            farming(duration, rate, maxcap, multiplier);
        } else if (mining == false && maxcap == reward) {
            btn.textContent = 'Собрать';
            console.log('reward is full');
            coins_counter_obj.textContent = reward;
        }
        //};
        // переменные для вывода текущего фарма, если он есть
        // ДОДЕЛАТЬ отображение фарма
        // Доделать правильное отображение баланса
    })();
} catch (err) {
    console.log(err, 'Error login');
}

// функция фармить
function farming(duration, rate, maxcap, multiplier) {
    let coins_now = 0; // обнуляем кол-во монет
    coins_now = maxcap - duration * rate;
    // let full_time_farm = (duration / rate + coins_now) * rate; // может быть понадобится
    console.log('farming started by function');
    coins_counter_obj.style.visibility = 'visible';
    console.log(
        `duration ${duration}, rate ${rate}, maxcap ${maxcap}, multiplier ${multiplier}`
    );

    // считаем монеты и выводим в поле
    coin_count_interval = setInterval(() => {
        console.log('setInterval run');
        coins_now += rate * multiplier;
        coins_counter_obj.textContent = coins_now.toFixed(2);
        coin_img_obj.style.visibility = 'visible'; // Показываем монету
        //coin_img_obj.style.display = 'inline';
    }, 1000);
    // coin_count_interval_massive.push(coin_count_interval); // добавляем функцию в массив
    console.log(`setInterval ${coin_count_interval}`);

    // если не нафармлено 10% от maxcap, кнопка "Собрать" неактивна и запускаем обратный отсчет
    let reverse_counter = (maxcap * 0.1) / rate;
    if (coins_now < 0.1 * maxcap) {
        btn.disabled = true;
        timer_10_percent_interval = setInterval(() => {
            reverse_counter--;
            btn.textContent = 'Собрать через: ' + Math.round(reverse_counter);
        }, 1000);
        timer_10_percent_timerout = setTimeout(() => {
            clearInterval(timer_10_percent_interval);
            btn.textContent = 'Собрать';
            btn.disabled = false;
        }, ((maxcap * 0.1) / rate) * 1000);
    }

    // останавливаем функцию счета через время duration
    coin_count_timeout = setTimeout(() => {
        // for (let item in coin_count_interval_massive) {
        //     console.log('stop setInterval', item);
        //     clearInterval(item);
        // };
        console.log('stop setInterval', coin_count_interval);
        clearInterval(coin_count_interval);
        coin_img_obj.style.visibility = 'hidden'; // Прячем монету
    }, duration * 1000);
}

// функция фармить для кнопки "Фармить"
async function start_farming() {
    try {
        let responce = await fetch(mainurl + endpointFarming, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        let result_farming = await responce.json();

        console.log('function farming clicked');
        console.log(result_farming.farmingInfo);

        duration = result_farming.farmingInfo.durationSec;
        multiplier = result_farming.farmingInfo.multiplier;
        // вызываем функцию фарминга
        farming(duration, (rate = rate), (maxcap = maxcap), multiplier);
        btn.textContent = 'Собрать';
    } catch (err) {
        console.log(err);
    }
}

// функция собрать награду
async function claim_reward() {
    try {
        let responce = await fetch(mainurl + endpointClaim, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        let result_claim = await responce.json();
        duration = result_claim.farmingInfo.durationSec;
        rate = result_claim.farmingInfo.rate;
        console.log(coin_count_interval, 'Interval');
        console.log(coin_count_timeout, 'Timeout');
        // for (let item in coin_count_interval_massive) {
        //     console.log('stop setInterval by claim', item);
        //     clearInterval(item);
        // };
        clearInterval(coin_count_interval); // останавливаем setInterval по сбору
        clearTimeout(coin_count_timeout); // останавливаем setTimeout
        farming(duration, rate, (maxcap = maxcap), multiplier);
        return result_claim.balanceInfo.coins;
    } catch (err) {
        console.log(err);
    }
}

// добавляем на кнопку фармить onclick события "фармить" и "собрать"
btn.onclick = async function () {
    if (btn.textContent == 'Фармить') {
        console.log('start farming');
        await start_farming();
    } else if (btn.textContent == 'Собрать') {
        console.log('claim');
        let coins = await claim_reward();
        coins_obj.textContent = coins.toFixed(2); // обновляем баланс
    }
};

// ежедневная награда

// btn.addEventListener("click", async function(){
//     try {
//         let responce = await fetch(url+endpointLogin, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(user)
//         });

//         let result = await responce.json();
//         console.log('Good login');
//         document.getElementById("out").innerHTML = result;
//     } catch (err) {
//         console.log('Error username')
//         document.getElementById("out").innerHTML = "Error";
//     }

//     let coins = 0
//     document.getElementById("coins").innerHTML = coins;
// });
