const gameArea = document.getElementById("game-area");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const startBtn = document.getElementById("start-btn");
const rankingList = document.getElementById("ranking-list");

let score = 0;
let lives = 3;
let isGameOver = false;
let spawnTimeout;

let topScores = [];

function startGame() {
  score = 0;
  lives = 3;
  isGameOver = false;
  updateHUD();
  gameArea.innerHTML = "";
  startBtn.disabled = true;

  spawnNextTarget();
}

function spawnNextTarget() {
  if (isGameOver) return;

  createTarget();

  let currentSpeed = Math.max(500, 2000 - score * 5);

  spawnTimeout = setTimeout(spawnNextTarget, currentSpeed);
}

function createTarget() {
  const target = document.createElement("div");
  target.classList.add("target");

  const targetSize = 50;
  target.style.width = `${targetSize}px`;
  target.style.height = `${targetSize}px`;

  const maxX = gameArea.clientWidth - targetSize;
  const maxY = gameArea.clientHeight - targetSize;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  target.style.left = `${randomX}px`;
  target.style.top = `${randomY}px`;

  let currentLifespan = Math.max(500, 2000 - score * 5);

  const missTimeout = setTimeout(() => {
    if (!isGameOver) {
      target.remove();
      loseLife();
    }
  }, currentLifespan);

  target.addEventListener("mousedown", () => {
    if (isGameOver) return;
    clearTimeout(missTimeout);
    target.remove();
    score += 10;
    updateHUD();
  });

  gameArea.appendChild(target);
}

function loseLife() {
  lives--;
  updateHUD();

  if (lives <= 0 && !isGameOver) {
    gameOver();
  }
}

function updateHUD() {
  scoreElement.innerText = score;
  livesElement.innerText = lives;
}

function gameOver() {
  isGameOver = true;
  clearTimeout(spawnTimeout);
  gameArea.innerHTML = "";
  startBtn.disabled = false;

  atualizarRanking();

  setTimeout(() => {
    alert(`Fim de jogo! Sua precisão rendeu uma pontuação de: ${score}`);
  }, 100);
}

function atualizarRanking() {
  topScores.push(score);

  topScores.sort((a, b) => b - a);

  topScores = topScores.slice(0, 5);

  rankingList.innerHTML = "";
  topScores.forEach((pontuacao, index) => {
    const li = document.createElement("li");
    li.innerText = `${index + 1}º Lugar: ${pontuacao} pontos`;
    rankingList.appendChild(li);
  });
}

startBtn.addEventListener("click", startGame);
