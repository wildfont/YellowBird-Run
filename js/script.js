const gameBoxNode = document.getElementById('game-box');
const damageOverlay = document.getElementById('damage-overlay');
const scoreDisplay = document.getElementById('score-display');
let gameRunning = false;
let score = 0;
let scoreInterval = null;

function startScore() {
  score = 0;
  scoreDisplay.textContent = score;
  scoreInterval = setInterval(() => {
    score++;
    scoreDisplay.textContent = score;
  }, 100);
}

function stopScore() {
  clearInterval(scoreInterval);
  scoreInterval = null;
}

function flashDamage() {
  damageOverlay.classList.remove('flash');
  void damageOverlay.offsetWidth;
  damageOverlay.classList.add('flash');
}

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
    stopScore();
    stopEnemySpawner();
    clearAllEnemies();
    SoundEngine.stopEngineLoop();
    MusicPlayer.stop();

    setTimeout(() => {
      gameScreen.style.display = 'none';
      document.getElementById('game-over-screen').style.display = 'flex';
    }, 800);
  } else {
    flashDamage();
  }
}