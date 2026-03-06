let target = 0;
let current = 0;
const MAX_VAL = 15;
const POTION_COLORS = ['#ef5350', '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#26c6da'];

function initGame() {
    current = 0;
    const mainLiq = document.getElementById('main-liquid');
    const mainBeaker = document.querySelector('.beaker.large');
    
    if (mainLiq) {
        mainLiq.style.height = "0%";
        mainLiq.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        mainLiq.style.filter = "none";
    }
    if (mainBeaker) {
        mainBeaker.classList.remove('win-glow');
        mainBeaker.style.animation = "none"; 
    }
    
    updateSumDisplay("#fff");
    document.getElementById('message').innerText = "目標の分量になるようにビーカーも液体を入れて";
    document.getElementById('message').style.color = "#f0e68c";
    
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

        // 数字(number-label)をbeakerの内側に入れました
        container.innerHTML = `
            <div class="beaker small">
                <div class="reflection"></div>
                <div class="marks small-marks"></div>
                <div class="liquid" style="background: ${color}; height: 0%;"></div>
                <div class="number-label">${n}</div>
            </div>
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
            mainLiq.style.backgroundColor = "#4b0082";
            mainLiq.style.filter = "contrast(1.5) brightness(0.5)";
        }
        if (mainBeaker) mainBeaker.style.animation = "shake 0.1s infinite";
        freezeGame();
    }
}

function createParticles() {
    const colors = ['#ffeb3b', '#ffffff', '#ff9800'];
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        p.style.left = x + 'px'; p.style.top = y + 'px';
        document.body.appendChild(p);
        const angle = Math.random() * Math.PI * 2;
        const vel = 3 + Math.random() * 5;
        let px = x, py = y, op = 1;
        const move = () => {
            px += Math.cos(angle) * vel; py += Math.sin(angle) * vel + 0.5; op -= 0.02;
            p.style.left = px + 'px'; p.style.top = py + 'px'; p.style.opacity = op;
            if (op > 0) requestAnimationFrame(move); else p.remove();
        };
        requestAnimationFrame(move);
    }
}

function updateSumDisplay(color) {
    const sd = document.getElementById('current-sum');
    if (sd) { sd.innerText = current; sd.style.color = color; }
}

function freezeGame() {
    document.querySelectorAll('.beaker-container').forEach(c => c.classList.add('used'));
}

window.onload = initGame;