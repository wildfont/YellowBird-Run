const enemies = [];
let spawnInterval = null;
let enemySpeed = 3;

const ENEMY_TYPES = [
  { name: "ferrari", src: "./img/sprites/ferrari.png", width: 190, height: 100, speedMultiplier: 1.1 },
  { name: "truck", src: "./img/sprites/truck.png", width: 240, height: 266, speedMultiplier: 0.8 },
  { name: "bike", src: "./img/sprites/kawasaki.png", width: 100, height: 133, speedMultiplier: 1.3 },
  { name: "car", src: "./img/sprites/bronco.png", width: 175, height: 150, speedMultiplier: 1.0 },
];

class Enemy {
  constructor(type) {
    this.type = type;
    this.node = document.createElement("img");
    this.node.src = type.src;

    this.width = type.width;
    this.height = type.height;
    this.x = Math.random() * (gameBoxNode.offsetWidth - this.width);
    this.y = 300;
    this.speed = (enemySpeed + Math.random() * 1.5) * type.speedMultiplier;

    this.node.style.position = "absolute";
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;

    gameBoxNode.appendChild(this.node);
  }

  update() {
    this.y += this.speed;
    this.node.style.top = `${this.y}px`;
  }

  isOffScreen() {
    return this.y > gameBoxNode.offsetHeight + this.height;
  }

  remove() {
    this.node.remove();
  }

  collidesWithBird(bird) {
    const bx = bird.x;
    const by = bird.baseY;
    const bw = bird.width;
    const bh = bird.height;
    const margin = 20;

    return (
      this.x + this.width - margin > bx + margin &&
      this.x + margin < bx + bw - margin &&
      this.y + this.height - margin > by + margin &&
      this.y + margin < by + bh - margin
    );
  }
}

function pickRandomType() {
  const weights = [15, 10, 20, 55];
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return ENEMY_TYPES[i];
  }
  return ENEMY_TYPES[3];
}

function startEnemySpawner() {
  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    enemies.push(new Enemy(pickRandomType()));
  }, 900);
}

function stopEnemySpawner() {
  clearInterval(spawnInterval);
  spawnInterval = null;
}

function clearAllEnemies() {
  enemies.forEach((e) => e.remove());
  enemies.length = 0;
}

function updateEnemies(bird, onCollision) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();

    if (bird && enemy.collidesWithBird(bird)) {
      enemy.remove();
      enemies.splice(i, 1);
      if (typeof onCollision === "function") onCollision();
      continue;
    }

    if (enemy.isOffScreen()) {
      enemy.remove();
      enemies.splice(i, 1);
    }
  }
}