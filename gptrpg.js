let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events;

let engine;
let player;
let sword;
let enemies = [];
let explosions = [];
let keys = {};
let healthBar, xpBar, levelDisplay;

const playerSize = 30;
const swordSize = 50; // Increased sword size
const enemySize = 20;
const swordHitboxMultiplier = 1.5;

let xp = 0;
let level = 1;
let health = 100;
let swordOrbitRadius = 50;
let isSwinging = false;
let swingAngle = 0;

function setup() {
    let canvasContainer = document.getElementById('canvas-container');
    let canvas = createCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvas.parent('canvas-container');
    
    engine = Engine.create();
    engine.world.gravity.y = 0;
    
    player = Bodies.rectangle(width / 2, height / 2, playerSize, playerSize, { 
        render: { fillStyle: 'cyan' } // Changed player color
    });
    World.add(engine.world, player);

    sword = Bodies.rectangle(player.position.x + swordOrbitRadius, player.position.y, swordSize * swordHitboxMultiplier, 5, {
        render: { fillStyle: 'white' },
        isSensor: true
    });
    World.add(engine.world, sword);
    
    healthBar = select('#player-health-bar');
    xpBar = select('#player-xp-bar');
    levelDisplay = select('#level-display');
    
    setInterval(spawnEnemies, 1000); // Doubled the enemy spawn rate
    
    Engine.run(engine);
    Events.on(engine, 'collisionStart', handleCollision);
    
    if (isMobile()) {
        select('#mobile-controls').removeClass('hidden');
        setupMobileControls();
    } else {
        window.addEventListener('mousedown', () => {
            isSwinging = true;
        });
    }
}

function draw() {
    background(30);
    
    movePlayer();
    updateSword();
    moveEnemies();
    drawEntities();
    drawExplosions();
    updateBars();
}

function movePlayer() {
    let velocity = { x: 0, y: 0 };
    if (keys['w']) velocity.y -= 5;
    if (keys['s']) velocity.y += 5;
    if (keys['a']) velocity.x -= 5;
    if (keys['d']) velocity.x += 5;
    Body.setVelocity(player, velocity);
}

function updateSword() {
    if (isSwinging) {
        swingAngle += 0.2; // Faster rotation
        let swordX = player.position.x + cos(swingAngle) * swordOrbitRadius;
        let swordY = player.position.y + sin(swingAngle) * swordOrbitRadius;
        Body.setPosition(sword, { x: swordX, y: swordY });

        if (swingAngle >= TWO_PI) { // Stops swinging after one rotation
            swingAngle = 0;
            isSwinging = false;
        }
    } else {
        Body.setPosition(sword, { x: player.position.x + swordOrbitRadius, y: player.position.y });
    }
}

function moveEnemies() {
    enemies.forEach(enemy => {
        let dx = player.position.x - enemy.position.x;
        let dy = player.position.y - enemy.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        Body.setVelocity(enemy, { x: (dx / distance) * 2, y: (dy / distance) * 2 });
    });
}

function drawEntities() {
    fill(255);
    drawBody(player);
    drawBody(sword);
    enemies.forEach(enemy => {
        drawBody(enemy);
        drawEnemyHealthBar(enemy);
    });
}

function drawBody(body) {
    let vertices = body.vertices;
    beginShape();
    for (let i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

function drawEnemyHealthBar(enemy) {
    let healthPercent = enemy.health / 10;
    let barWidth = enemySize * healthPercent;
    fill(255, 0, 0);
    rect(enemy.position.x - enemySize / 2, enemy.position.y - enemySize - 10, barWidth, 5);
}

function spawnEnemies() {
    let size = 20;
    let x = Math.random() < 0.5 ? 0 : canvas.width - size;
    let y = Math.random() * (canvas.height - size);
    let enemy = Bodies.rectangle(x, y, size, size, {
        render: { fillStyle: 'red' }
    });
    enemy.health = 10;
    enemies.push(enemy);
    World.add(engine.world, enemy);
}

function handleCollision(event) {
    let pairs = event.pairs;
    pairs.forEach(pair => {
        let { bodyA, bodyB } = pair;
        if ((bodyA === sword || bodyB === sword) && (bodyA !== player && bodyB !== player)) {
            let enemy = bodyA === sword ? bodyB : bodyA;
            applyDamageToEnemy(enemy, 5);
        }
    });
}

function applyDamageToEnemy(enemy, damage) {
    enemy.health -= damage;
    if (enemy.health <= 0) {
        createExplosion(enemy.position);
        World.remove(engine.world, enemy);
        enemies = enemies.filter(e => e !== enemy);
        xp += 10;
    }
}

function createExplosion(position) {
    explosions.push({
        x: position.x,
        y: position.y,
        radius: 0,
        maxRadius: 100,
        damageRadius: 200,
        alpha: 255
    });
}

function drawExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        let explosion = explosions[i];
        fill(255, 150, 0, explosion.alpha);
        noStroke();
        ellipse(explosion.x, explosion.y, explosion.radius * 2);

        explosion.radius += 2;
        explosion.alpha -= 5;

        if (explosion.radius > explosion.maxRadius) {
            handleExplosionDamage(explosion);
            explosions.splice(i, 1);
        }
    }
}

function handleExplosionDamage(explosion) {
    enemies.forEach(enemy => {
        let dx = enemy.position.x - explosion.x;
        let dy = enemy.position.y - explosion.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < explosion.damageRadius) {
            applyDamageToEnemy(enemy, 5);
        }
    });
}

function updateBars() {
    healthBar.style('width', `${health * 2}px`);
    xpBar.style('width', `${(xp / (level * 100)) * 200}px`);
    levelDisplay.html(`Level: ${level}`);
    
    if (xp >= level * 100) {
        xp = 0;
        level++;
        swordOrbitRadius += 10;
        Body.scale(sword, 1.2, 1);
    }
}

function keyPressed() {
    keys[key] = true;
}

function keyReleased() {
    keys[key] = false;
}

function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function setupMobileControls() {
    let joystick = select('#joystick');
    let joystickHandle = select('#joystick-handle');
    let swingButton = select('#swing-button');

    let handleSize = 40;
    let joystickSize = 100;
    let joystickCenter = { x: joystickSize / 2, y: joystickSize / 2 };
    let joystickRadius = joystickSize / 2 - handleSize / 2;
    
    let isDragging = false;
    let startX, startY;

    joystickHandle.mousePressed(() => {
        isDragging = true;
        startX = mouseX;
        startY = mouseY;
    });

    joystickHandle.mouseReleased(() => {
        isDragging = false;
        joystickHandle.position(joystickCenter.x - handleSize / 2, joystickCenter.y - handleSize / 2);
        keys = {};
    });

    joystick.mouseMoved(() => {
        if (isDragging) {
            let dx = mouseX - startX;
            let dy = mouseY - startY;
            let distance = dist(0, 0, dx, dy);

            if (distance > joystickRadius) {
                let angle = atan2(dy, dx);
                dx = cos(angle) * joystickRadius;
                dy = sin(angle) * joystickRadius;
            }

            joystickHandle.position(joystickCenter.x + dx - handleSize / 2, joystickCenter.y + dy - handleSize / 2);

            keys = {
                'w': dy < -10,
                's': dy > 10,
                'a': dx < -10,
                'd': dx > 10
            };
        }
    });

    swingButton.mousePressed(() => {
        isSwinging = true;
    });

    swingButton.mouseReleased(() => {
        isSwinging = false;
    });
}

setup();
