const gameBoxNode = document.getElementById('game-box');
let gameRunning = false;

function gameLoop() {
  if (!gameRunning) return;
  updateEnemies(bird, handleCollision);
  requestAnimationFrame(gameLoop);
}

function handleCollision() {
  SoundEngine.playCollision();

  bird.hit();
  if (bird.isDead()) {
    gameRunning = false;
    stopEnemySpawner();
    clearAllEnemies();
    SoundEngine.stopEngineLoop();
    MusicPlayer.stop();

    setTimeout(() => {
      gameScreen.style.display = 'none';
      document.getElementById('game-over-screen').style.display = 'flex';
    }, 800);
  }
}