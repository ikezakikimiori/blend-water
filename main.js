let target = 0;
let current = 0;
const MAX_VAL = 15;
const POTION_COLORS = ['#ef5350', '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#26c6da'];

/**
 * ゲームの初期化・リセット処理
 */
function initGame() {
    current = 0;
    
    const mainLiq = document.getElementById('main-liquid');
    const mainBeaker = document.querySelector('.beaker.large');
    
    // メインビーカーの状態を完全に初期化（洗浄）
    if (mainLiq) {
        mainLiq.style.height = "0%";
        mainLiq.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; // 透明に戻す
        mainLiq.style.filter = "none"; // 失敗時の濁り(filter)を解除
    }
    
    // 成功時の黄金の輝きと失敗時の揺れアニメーションを解除
    if (mainBeaker) {
        mainBeaker.classList.remove('win-glow');
        mainBeaker.style.animation = "none"; 
    }
    
    updateSumDisplay("#fff");
    
    const msg = document.getElementById('message');
    msg.innerText = "目標の分量になるようにビーカーも液体を入れて";
    msg.style.color = "#ffffff";
    
    const shelf = document.getElementById('shelf');
    shelf.innerHTML = "";
    const nums = [];
    
    for (let i = 0; i < 9; i++) {
        const n = Math.floor(Math.random() * 15) + 1;
        const color = POTION_COLORS[Math.floor(Math.random() * POTION_COLORS.length)];
        nums.push(n);

        const container = document.createElement('div');
        container.className = 'beaker-container';
        const h = (n / MAX_VAL) * 100;

        container.innerHTML = `
            <div class="beaker small">
                <div class="reflection"></div>
                <div class="marks small-marks"></div>
                <div class="liquid" style="background: ${color}; height: 0%;"></div>
            </div>
            <div class="number-label">${n}</div>
        `;
        
        shelf.appendChild(container);

        setTimeout(() => {
            const liq = container.querySelector('.liquid');
            if(liq) liq.style.height = h + '%';
        }, i * 60);
        
        container.onclick = function() {
            if (!this.classList.contains('used')) {
                addNumber(n, color, this);
            }
        };
    }

    const shuffled = [...nums].sort(() => 0.5 - Math.random());
    target = shuffled.slice(0, 3 + Math.floor(Math.random() * 2)).reduce((a, b) => a + b, 0);
    document.getElementById('target-value').innerText = target;
}

/**
 * ビーカーをクリックした時の処理
 */
function addNumber(n, color, element) {
    current += n;
    element.classList.add('used');
    element.querySelector('.liquid').style.height = '0%';
    
    const mainLiq = document.getElementById('main-liquid');
    const fillPercent = Math.min((current / target) * 100, 100);
    
    if (mainLiq) {
        mainLiq.style.height = fillPercent + "%";
        mainLiq.style.backgroundColor = color;
    }
    
    updateSumDisplay("#fff");
    checkStatus();
}

/**
 * 成功・失敗の判定処理
 */
function checkStatus() {
    const msg = document.getElementById('message');
    const container = document.getElementById('game-container');
    const mainBeaker = document.querySelector('.beaker.large');
    const mainLiq = document.getElementById('main-liquid');
    const gold = "#ffeb3b";

    if (current === target) {
        msg.innerText = "【成功】見事な調合じゃ！";
        msg.style.color = gold;
        updateSumDisplay(gold);

        container.classList.add('success-flash');
        setTimeout(() => container.classList.remove('success-flash'), 500);

        if (mainBeaker) mainBeaker.classList.add('win-glow');
        createParticles();
        freezeGame();

    } else if (current > target) {
        msg.innerText = "【失敗】分量を誤ったようじゃな";
        msg.style.color = "#ff5252";
        updateSumDisplay("#ff5252");
        
        if (mainLiq) {
            mainLiq.style.height = "105%";
            mainLiq.style.backgroundColor = "#4b0082"; // 失敗の色
            mainLiq.style.filter = "contrast(1.5) brightness(0.5)"; // 濁り
        }

        if (mainBeaker) {
            mainBeaker.style.animation = "shake 0.1s infinite";
        }
        
        freezeGame();
    }
}

/**
 * 紙吹雪（キラキラ）を生成
 */
function createParticles() {
    const colors = ['#ffeb3b', '#ffffff', '#ff9800', '#f44336', '#e91e63'];
    for (let i = 0; i < 80; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 3;
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        document.body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 4 + Math.random() * 8;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;

        const move = () => {
            posX += vx;
            posY += vy + 0.4;
            opacity -= 0.015;
            
            p.style.left = posX + 'px';
            p.style.top = posY + 'px';
            p.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(move);
            } else {
                p.remove();
            }
        };
        requestAnimationFrame(move);
    }
}

/**
 * 合計数字の表示更新
 */
function updateSumDisplay(color) {
    const sumDisplay = document.getElementById('current-sum');
    if (sumDisplay) {
        sumDisplay.innerText = current;
        sumDisplay.style.color = color;
    }
}

/**
 * ゲーム終了時の操作禁止処理
 */
function freezeGame() {
    document.querySelectorAll('.beaker-container').forEach(c => c.classList.add('used'));
}

window.onload = initGame;