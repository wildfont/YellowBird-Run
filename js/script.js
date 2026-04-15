const gameBoxNode = document.getElementById('game-box');
let gameRunning = false;

function gameLoop() {
  if (!gameRunning) return;
  updateEnemies(bird, handleCollision);
  requestAnimationFrame(gameLoop);
}

function handleCollision() {
  bird.hit();
  if (bird.isDead()) {
    gameRunning = false;
    stopEnemySpawner();
    clearAllEnemies();
    setTimeout(() => {
      gameScreen.style.display = 'none';
      document.getElementById('game-over-screen').style.display = 'flex';
    }, 800);
  }
}