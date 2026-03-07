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
    const msg = document.getElementById('message');
    const shelf = document.getElementById('shelf');
    
    // メインビーカーの状態リセット
    if (mainLiq) {
        mainLiq.style.height = "0%";
        mainLiq.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        mainLiq.style.filter = "none";
    }
    
    // 成功時のクラスを削除
    if (mainBeaker) {
        mainBeaker.classList.remove('win-glow');
    }
    
    updateSumDisplay("#fff");
    
    // メッセージの初期化
    msg.innerText = "目標の分量になるようにビーカーの液体を入れて";
    msg.style.color = "#f0e68c";
    
    // 棚の初期化
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

        // 少し遅れて液体が満たされる演出
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

    // 目標値の決定（必ず合計で作れる数値にする）
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
    
    const mainLiq = document.getElementById('main-liquid');
    // 目標値に対する割合で高さを決定（100%を超えないように制御）
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
    const mainBeaker = document.querySelector('.beaker.large');
    const mainLiq = document.getElementById('main-liquid');
    const gold = "#ffeb3b";

    if (current === target) {
        msg.innerText = "【成功】見事な調合じゃ！";
        msg.style.color = gold;
        updateSumDisplay(gold);

        // CSS側の .win-glow クラスで光らせる
        if (mainBeaker) mainBeaker.classList.add('win-glow');
        
        createParticles();
        freezeGame();

    } else if (current > target) {
        msg.innerText = "【失敗】分量を誤ったようじゃな";
        msg.style.color = "#ff5252";
        updateSumDisplay("#ff5252");
        
        if (mainLiq) {
            mainLiq.style.height = "100%";
            mainLiq.style.backgroundColor = "#4b0082"; // 失敗の色（濁った紫）
            mainLiq.style.filter = "contrast(1.2) brightness(0.7)"; 
        }
        freezeGame();
    }
}

/**
 * 成功時の紙吹雪演出
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
 * 中央の合計数字の表示更新
 */
function updateSumDisplay(color) {
    const sumDisplay = document.getElementById('current-sum');
    if (sumDisplay) {
        sumDisplay.innerText = current;
        sumDisplay.style.color = color;
    }
}

/**
 * ゲーム終了時にクリックを無効化
 */
function freezeGame() {
    document.querySelectorAll('.beaker-container').forEach(c => c.classList.add('used'));
}

window.onload = initGame;