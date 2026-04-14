const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');

let bird;

startBtn.addEventListener('click', function() {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    
    bird = new YellowBird();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") bird.forward(); 
    if (event.key === "ArrowLeft") bird.backward();
});