const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    color: 'white',
    speed: 5,
    health: 100,
    xp: 0,
    level: 1,
    swordSize: 30,
    hitboxSize: 0.8 * 30 // 80% of player size
};

let sword = {
    angle: 0,
    orbitRadius: 50,
    isSwinging: false,
    speed: 0.1
};

let enemies = [];
let keys = {};

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawSword() {
    if (sword.isSwinging) {
        let swordX = player.x + player.size / 2 + Math.cos(sword.angle) * sword.orbitRadius;
        let swordY = player.y + player.size / 2 + Math.sin(sword.angle) * sword.orbitRadius;
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = player.swordSize / 10; // Adjust thickness based on sword size
        ctx.beginPath();
        ctx.moveTo(player.x + player.size / 2, player.y + player.size / 2);
        ctx.lineTo(swordX, swordY);
        ctx.stroke();

        sword.angle += sword.speed;
        
        if (sword.angle >= 2 * Math.PI) {
            sword.angle = 0;
            sword.isSwinging = false;
        }

        checkSwordCollision(swordX, swordY);
    }
}

function checkSwordCollision(swordX, swordY) {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        let hitboxSize = enemy.size * 1.2; // Increase enemy hitbox by 20%
        let dx = swordX - (enemy.x + enemy.size / 2);
        let dy = swordY - (enemy.y + enemy.size / 2);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < hitboxSize / 2) {
            player.xp += 10;
            enemies.splice(i, 1);
        }
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    });
}

function movePlayer() {
    if (keys['w'] && player.y > 0) player.y -= player.speed;
    if (keys['s'] && player.y + player.size < canvas.height) player.y += player.speed;
    if (keys['a'] && player.x > 0) player.x -= player.speed;
    if (keys['d'] && player.x + player.size < canvas.width) player.x += player.speed;
}

function spawnEnemies() {
    if (Math.random() < 0.02) {
        let size = 20;
        let x = Math.random() < 0.5 ? 0 : canvas.width - size;
        let y = Math.random() * (canvas.height - size);
        enemies.push({ x, y, size, speed: 2 });
    }
}

function moveEnemies() {
    enemies.forEach(enemy => {
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        enemy.x += (dx / distance) * enemy.speed;
        enemy.y += (dy / distance) * enemy.speed;
    });
}

function handleCombat() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        let dx = (player.x + player.size / 2) - (enemy.x + enemy.size / 2);
        let dy = (player.y + player.size / 2) - (enemy.y + enemy.size / 2);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.hitboxSize / 2 + enemy.size / 2) {
            player.health -= 10;
            enemies.splice(i, 1);
        }
    }
}

function levelUp() {
    if (player.xp >= player.level * 100) {
        player.xp = 0;
        player.level++;
        sword.orbitRadius += 10;
        player.swordSize += 10; // Increase sword size with level
    }
}

function updateHealthBar() {
    let healthBar = document.getElementById('health-bar');
    healthBar.style.width = `${player.health * 2}px`;
}

function updateXpBar() {
    let xpBar = document.getElementById('xp-bar');
    xpBar.style.width = `${(player.xp / (player.level * 100)) * 200}px`;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveEnemies();
    handleCombat();
    levelUp();

    drawPlayer();
    drawSword();
    drawEnemies();

    updateHealthBar();
    updateXpBar();

    spawnEnemies();

    if (player.health > 0) {
        requestAnimationFrame(gameLoop);
    } else {
        alert('Game Over');
    }
}

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

window.addEventListener('mousedown', () => {
    if (!sword.isSwinging) {
        sword.isSwinging = true;
    }
});

gameLoop();
