const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
let bird;

startBtn.addEventListener("click", function () {
  startScreen.style.display = "none";
  gameScreen.style.display = "flex";
  bird = new YellowBird();
  startEnemySpawner();
  gameRunning = true;
  gameLoop();

  SoundEngine.playStartup(() => {
    SoundEngine.startEngineLoop();
  });

  MusicPlayer.play(0);
});

document.getElementById("newRunButton").addEventListener("click", () => {
  location.reload();
});

document.addEventListener("keydown", (event) => {
  if (!bird) return;
  if (event.key === "ArrowRight") {
    event.preventDefault();
    bird.forward();
    SoundEngine.playRev();
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    bird.backward();
    SoundEngine.playRev();
  }
});