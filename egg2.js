let eggCount = 0;
let multiplier = 1;
let autoTapActive = false;
let autoTapInterval;
let playerName = prompt("Введите ваше имя", "Игрок");

document.getElementById('openShopButton').addEventListener('click', function() {
    document.getElementById('shopModal').style.display = "block";
});

document.getElementById('closeShop').addEventListener('click', function() {
    document.getElementById('shopModal').style.display = "none";
});

document.getElementById('saveProgressButton').addEventListener('click', function() {
    saveProgress();
});

window.onload = function() {
    loadProgress();
    loadLeaderboard();
};

function tapEgg() {
    eggCount += multiplier;
    updateEggCount();
}

document.getElementById('toggleAutoTap').addEventListener('click', function() {
    if (autoTapActive) {
        clearInterval(autoTapInterval);
        autoTapActive = false;
        document.getElementById('toggleAutoTap').innerText = "Включить авто таппер";
    } else {
        autoTapInterval = setInterval(() => {
            eggCount += multiplier;
            updateEggCount();
        }, 1000);
        autoTapActive = true;
        document.getElementById('toggleAutoTap').innerText = "Выключить авто таппер";
    }
});

function updateEggCount() {
    document.getElementById('eggCount').innerText = eggCount;
}

function buySkin(skin, price) {
    if (eggCount >= price) {
        eggCount -= price;
        updateEggCount();
        document.getElementById('eggImage').src = skin;
    } else {
        alert("Недостаточно яиц для покупки!");
    }
}

function saveProgress() {
    localStorage.setItem('eggCount', eggCount);
    localStorage.setItem('playerName', playerName);
    alert("Прогресс сохранен!");
    saveToLeaderboard();
}

function loadProgress() {
    let savedEggCount = localStorage.getItem('eggCount');
    let savedPlayerName = localStorage.getItem('playerName');
    
    if (savedEggCount !== null) {
        eggCount = parseInt(savedEggCount);
    }
    if (savedPlayerName !== null) {
        playerName = savedPlayerName;
    }
    updateEggCount();
}

function saveToLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name: playerName, eggs: eggCount });

    // Сортировка по количеству яиц (по убыванию)
    leaderboard.sort((a, b) => b.eggs - a.eggs);

    // Оставляем только топ 5
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    loadLeaderboard();
}

function loadLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardTable = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
    leaderboardTable.innerHTML = "";  // Очищаем таблицу

    leaderboard.forEach((player, index) => {
        let row = leaderboardTable.insertRow();
        row.insertCell(0).innerText = index + 1;
        row.insertCell(1).innerText = player.name;
        row.insertCell(2).innerText = player.eggs;
    });
}