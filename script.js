const bat = document.getElementById("bat");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const bestScoreDisplay = document.getElementById("bestScore");
const gameOverDisplay = document.getElementById("gameOver");
const finalScoreDisplay = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const startCountdown = document.getElementById("startCountdown");
const playBtn = document.getElementById("playBtn");
const startScreen = document.getElementById("startScreen");

let score = 0;
let timeLeft = 30;
let batSpeed = 1500;
let batInterval = null;
let timer = null;
let gameActive = false;
let lastSpeedUpdate = null; // track last threshold

// Best score stored in localStorage
let bestScore = localStorage.getItem("bestScore") ? parseInt(localStorage.getItem("bestScore")) : 0;
bestScoreDisplay.textContent = "Best Score: " + bestScore;

// Move bat to random position
function moveBat() {
  const areaWidth = window.innerWidth - bat.clientWidth;
  const areaHeight = window.innerHeight - bat.clientHeight;

  const randomX = Math.floor(Math.random() * areaWidth);
  const randomY = Math.floor(Math.random() * areaHeight);

  bat.style.left = randomX + "px";
  bat.style.top = randomY + "px";
}

// Catch bat
bat.addEventListener("click", (e) => {
  if (!gameActive) return;

  score++;
  scoreDisplay.textContent = "Score: " + score;

  // Bat catch effect
  bat.classList.add("bat-caught");
  bat.addEventListener("animationend", () => {
    bat.classList.remove("bat-caught");
  }, { once: true });

  // Cursor circle effect
  const circle = document.createElement("div");
  circle.classList.add("cursor-circle");
  circle.style.left = e.clientX + "px";
  circle.style.top = e.clientY + "px";
  document.body.appendChild(circle);
  circle.addEventListener("animationend", () => circle.remove());

  moveBat();
});

// Countdown timer
function startTimer() {
  gameActive = true;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = "Time: " + timeLeft + "s";

    // ✅ Increase difficulty only once per threshold
    if ((timeLeft === 20 || timeLeft === 10) && batSpeed > 500 && lastSpeedUpdate !== timeLeft) {
      batSpeed -= 300;
      clearInterval(batInterval);
      batInterval = setInterval(moveBat, batSpeed);
      lastSpeedUpdate = timeLeft;
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      clearInterval(batInterval);
      endGame();
    }
  }, 1000);
}

// End game
function endGame() {
  gameActive = false;
  bat.style.opacity = 0; // hide bat
  gameOverDisplay.style.display = "block";
  finalScoreDisplay.textContent = score;

  // Update best score if beaten
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    bestScoreDisplay.textContent = "Best Score: " + bestScore;
  }
}

// Restart game
restartBtn.addEventListener("click", () => {
  resetGame();
  startCountdownAnimation(startGame);
});

// Reset values
function resetGame() {
  score = 0;
  timeLeft = 30;
  batSpeed = 1500;
  scoreDisplay.textContent = "Score: 0";
  timerDisplay.textContent = "Time: 30s";
  bat.style.opacity = 0; // keep hidden until countdown ends
  gameOverDisplay.style.display = "none";
  clearInterval(timer);
  clearInterval(batInterval);
  gameActive = false;
  lastSpeedUpdate = null;
}

// Start countdown before game begins
function startCountdownAnimation(callback) {
  let count = 3;
  startCountdown.style.display = "block";
  startCountdown.textContent = count;

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      startCountdown.textContent = count;
      startCountdown.style.animation = "popUp 1s ease";
    } else {
      clearInterval(countdownInterval);
      startCountdown.style.display = "none";
      bat.style.opacity = 1; // ✅ show bat when game starts
      callback();
    }
  }, 1000);
}

// Start game
function startGame() {
  moveBat();
  batInterval = setInterval(moveBat, batSpeed);
  startTimer();
}

// Play button starts the game
playBtn.addEventListener("click", () => {
  startScreen.style.display = "none"; // hide intro
  startCountdownAnimation(startGame);
});