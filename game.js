const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const barbarian = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: 'red',
    bullets: [],
    health: 100,
    maxHealth: 100,
    damage: 5,
    speed: 3,
    dx: 0,
    dy: 0
};

const stars = [];
const enemies = [];
const damageTexts = [];
let keys = {};
let exp = 0;
let level = 1;
let expToNextLevel = 100;
let enemySpawnRate = 2000;
let spawnInterval;

function drawBarbarian() {
    ctx.beginPath();
    ctx.arc(barbarian.x, barbarian.y, barbarian.radius, 0, Math.PI * 2);
    ctx.fillStyle = barbarian.color;
    ctx.fill();
    ctx.closePath();
}

function drawHealthBar() {
    ctx.fillStyle = 'black';
    ctx.fillRect(10, 10, 200, 20);
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, (barbarian.health / barbarian.maxHealth) * 200, 20);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(10, 10, 200, 20);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`${barbarian.health.toFixed(0)}/${barbarian.maxHealth.toFixed(0)}`, 80, 25);
}

function drawExpBar() {
    ctx.fillStyle = 'black';
    ctx.fillRect(canvas.width - 210, 10, 200, 20);
    ctx.fillStyle = 'blue';
    ctx.fillRect(canvas.width - 210, 10, (exp / expToNextLevel) * 200, 20);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(canvas.width - 210, 10, 200, 20);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`Level: ${level}`, canvas.width - 190, 25);
    ctx.fillText(`${exp.toFixed(0)}/${expToNextLevel.toFixed(0)}`, canvas.width - 110, 25);
}

function drawEnemyHealthBar(enemy) {
    const barWidth = enemy.radius * 2;
    const barHeight = 5;
    const barX = enemy.x - enemy.radius;
    const barY = enemy.y - enemy.radius - 10;

    ctx.fillStyle = 'black';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = 'green';
    ctx.fillRect(barX, barY, barWidth * (enemy.health / enemy.maxHealth), barHeight);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

function drawStars() {
    stars.forEach(star => {
        // Create a radial gradient for the shiny silver effect
        const gradient = ctx.createRadialGradient(star.x, star.y, 2, star.x, star.y, 10);
        gradient.addColorStop(0, 'silver');
        gradient.addColorStop(0.5, '#C0C0C0');
        gradient.addColorStop(1, '#A9A9A9');

        ctx.save(); // Save the current state
        ctx.translate(star.x, star.y); // Move to the star's position
        ctx.rotate(Math.atan2(star.y - barbarian.y, star.x - barbarian.x)); // Rotate to align with the direction

        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 20, 0, 0, Math.PI * 2); // Draw a skinny ellipsoid
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();

        ctx.restore(); // Restore the previous state
    });
}

function drawBullets() {
    barbarian.bullets.forEach(bullet => {
        // Create a radial gradient for the shiny gold effect
        const gradient = ctx.createRadialGradient(bullet.x, bullet.y, 2, bullet.x, bullet.y, 10);
        gradient.addColorStop(0, 'gold');
        gradient.addColorStop(0.5, '#FFD700');
        gradient.addColorStop(1, '#B8860B');

        ctx.beginPath();
        ctx.ellipse(bullet.x, bullet.y, 15, 2, Math.atan2(bullet.dy, bullet.dx), 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();
        drawEnemyHealthBar(enemy);
    });
}

function drawDamageTexts() {
    damageTexts.forEach((text, index) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${text.opacity})`;  // Use white color with fading opacity
        ctx.font = '12px Arial';
        ctx.fillText(text.amount, text.x, text.y);
        text.y -= 1;
        text.opacity -= 0.02;
        if (text.opacity <= 0) {
            damageTexts.splice(index, 1);
        }
    });
}

function updateStars() {
    stars.forEach((star, index) => {
        star.angle += 0.1;
        star.x = barbarian.x + Math.cos(star.angle) * star.distance;
        star.y = barbarian.y + Math.sin(star.angle) * star.distance;

        // Increment the distance gradually
        star.distance += 0.5;

        // Increment the rotation count when a full rotation is completed
        if (star.angle >= Math.PI * 2) {
            star.angle -= Math.PI * 2;
            star.rotationCount++;
        }

        // Remove the star after 3 rotations
        if (star.rotationCount >= 3) {
            stars.splice(index, 1);
        }
    });
}

function updateBullets() {
    barbarian.bullets.forEach(bullet => {
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
    });
    barbarian.bullets = barbarian.bullets.filter(bullet => bullet.x > 0 && bullet.x < canvas.width && bullet.y > 0 && bullet.y < canvas.height);
}

function updateEnemies() {
    enemies.forEach((enemy, enemyIndex) => {
        const angle = Math.atan2(barbarian.y - enemy.y, barbarian.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;

        // Check collision with barbarian
        if (Math.hypot(barbarian.x - enemy.x, barbarian.y - enemy.y) < barbarian.radius + enemy.radius) {
            enemies.splice(enemyIndex, 1);
            barbarian.health -= 10;  // Reduce health by 10 when hit by an enemy
            if (barbarian.health <= 0) {
                barbarian.health = 0;
                alert("Game Over!");
                window.location.reload();
            }
        }

        // Check collision with bullets
        barbarian.bullets.forEach((bullet, bulletIndex) => {
            if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < enemy.radius) {
                const damage = bullet.enemyBullet ? barbarian.damage * 0.2 : barbarian.damage;
                enemy.health -= damage;
                barbarian.bullets.splice(bulletIndex, 1);
                showDamageText(damage, enemy.x, enemy.y);
                if (enemy.health <= 0) {
                    shootEnemyBullets(enemy);
                    exp += 20;
                    checkLevelUp();
                    enemies.splice(enemyIndex, 1);
                }
            }
        });

        // Check collision with stars
        stars.forEach((star, starIndex) => {
            if (Math.hypot(star.x - enemy.x, star.y - enemy.y) < 10 + enemy.radius) { // Adjust collision radius as needed
                enemy.health -= 20;
                showDamageText(20, enemy.x, enemy.y);
                stars.splice(starIndex, 1); // Remove the star on collision
                if (enemy.health <= 0) {
                    shootEnemyBullets(enemy);
                    exp += 20;
                    checkLevelUp();
                    enemies.splice(enemyIndex, 1);
                }
            }
        });
    });
}

function showDamageText(amount, x, y) {
    damageTexts.push({ amount: amount.toFixed(0), x: x, y: y, opacity: 1 });
}

function shootEnemyBullets(enemy) {
    for (let i = 0; i < 6; i++) {
        const angle = i * (Math.PI / 3);
        barbarian.bullets.push({
            x: enemy.x,
            y: enemy.y,
            dx: Math.cos(angle) * 5,
            dy: Math.sin(angle) * 5,
            enemyBullet: true
        });
    }
}

function checkLevelUp() {
    if (exp >= expToNextLevel) {
        exp = 0;
        level++;
        expToNextLevel *= 1.5;
        enemySpawnRate *= 0.8;
        barbarian.maxHealth *= 1.2;
        barbarian.damage *= 1.1;
        barbarian.health = barbarian.maxHealth;

        clearInterval(spawnInterval);
        spawnInterval = setInterval(spawnEnemies, enemySpawnRate);
    }
}

function spawnEnemies() {
    const enemy = {
        x: Math.random() < 0.5 ? 0 : canvas.width,
        y: Math.random() * canvas.height,
        radius: 15,
        speed: 1 + Math.random(),
        health: 100 * Math.pow(1.2, level - 1),
        maxHealth: 100 * Math.pow(1.2, level - 1)
    };
    enemies.push(enemy);
}

function spinAttack() {
    for (let i = 0; i < 6; i++) {
        const angle = i * (Math.PI / 3);
        barbarian.bullets.push({
            x: barbarian.x,
            y: barbarian.y,
            dx: Math.cos(angle) * 5,
            dy: Math.sin(angle) * 5,
            enemyBullet: false
        });
    }

    stars.push({
        x: barbarian.x,
        y: barbarian.y,
        radius: 10,
        color: 'yellow',
        angle: 0,
        distance: 100, // Starting distance of the star
        rotationCount: 0 // Initialize rotation count
    });
}

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space') {
        spinAttack();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function moveBarbarian() {
    if (keys['KeyW']) barbarian.dy = -barbarian.speed;
    else if (keys['KeyS']) barbarian.dy = barbarian.speed;
    else barbarian.dy = 0;

    if (keys['KeyA']) barbarian.dx = -barbarian.speed;
    else if (keys['KeyD']) barbarian.dx = barbarian.speed;
    else barbarian.dx = 0;

    barbarian.x += barbarian.dx;
    barbarian.y += barbarian.dy;

    // Prevent the barbarian from moving out of canvas bounds
    if (barbarian.x < barbarian.radius) barbarian.x = barbarian.radius;
    if (barbarian.x > canvas.width - barbarian.radius) barbarian.x = canvas.width - barbarian.radius;
    if (barbarian.y < barbarian.radius) barbarian.y = barbarian.radius;
    if (barbarian.y > canvas.height - barbarian.radius) barbarian.y = canvas.height - barbarian.radius;
}

function handleOrientation(event) {
    const gamma = event.gamma; // Left to right tilt
    const beta = event.beta; // Front to back tilt

    barbarian.dx = gamma / 45 * barbarian.speed;
    barbarian.dy = beta / 45 * barbarian.speed;
}

function handleTouchStart() {
    spinAttack();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBarbarian();
    drawHealthBar();
    drawExpBar();
    drawStars();
    drawBullets();
    drawEnemies();
    drawDamageTexts();
    updateStars();
    updateBullets();
    updateEnemies();
    moveBarbarian();
    requestAnimationFrame(animate);
}

window.addEventListener('deviceorientation', handleOrientation);
window.addEventListener('touchstart', handleTouchStart);

spawnInterval = setInterval(spawnEnemies, enemySpawnRate);
animate();
