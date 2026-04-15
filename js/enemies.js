const enemies = [];
let spawnInterval = null;
let enemySpeed = 3;

const ENEMY_TYPES = [
  {
    name: "ferrari",
    src: "./img/sprites/ferrari.png",
    width: 140,
    height: 80,
    speedMultiplier: 1.2,
    points: 30,
  },
  {
    name: "truck",
    src: "./img/sprites/truck.png",
    width: 180,
    height: 200,
    speedMultiplier: 0.6,
    points: 50,
  },
  {
    name: "bike",
    src: "./img/sprites/kawasaki.png",
    width: 80,
    height: 100,
    speedMultiplier: 1.5,
    points: 40,
  },
  {
    name: "car",
    src: "./img/sprites/bronco.png",
    width: 130,
    height: 110,
    speedMultiplier: 1.0,
    points: 10,
  },
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
    this.points = type.points;


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
    const type = pickRandomType();
    enemies.push(new Enemy(type));
  }, 1500);
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
      if (typeof onCollision === "function") onCollision(enemy.points);
      continue;
    }

    if (enemy.isOffScreen()) {
      enemy.remove();
      enemies.splice(i, 1);
    }
  }
}

function increaseEnemySpeed(amount = 0.5) {
  enemySpeed = Math.min(enemySpeed + amount, 12);
}