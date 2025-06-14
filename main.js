const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");
const totalClicksEl = document.getElementById("totalClicks");
const hitsEl = document.getElementById("hits");
const accuracyEl = document.getElementById("accuracy");
const targetSizeInput = document.getElementById("targetSize");
const moveIntervalInput = document.getElementById("moveInterval");
const previewDot = document.getElementById("previewDot");
const startBtn = document.getElementById("startBtn");
const colorInput = document.getElementById("targetColor");
const colorBtn = document.getElementById("colorIconBtn");

const missesEl = document.getElementById("misses");

let totalClicks = 0;
let hits = 0;
let misses = 0;
let autoMoveInterval = null;

function moveTarget() {
  const areaRect = gameArea.getBoundingClientRect();
  const size = parseInt(targetSizeInput.value);
  const x = Math.random() * (areaRect.width - size);
  const y = Math.random() * (areaRect.height - size);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.style.width = `${size}px`;
  target.style.height = `${size}px`;
}

function calculateDistance(clickX, clickY, centerX, centerY) {
  return Math.sqrt(
    Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
  );
}

function updateStats() {
  totalClicksEl.textContent = totalClicks;
  hitsEl.textContent = hits;
  missesEl.textContent = misses;
  accuracyEl.textContent =
    totalClicks === 0 ? "0.00" : ((hits / totalClicks) * 100).toFixed(2);
}

target.addEventListener("click", (e) => {
  e.stopPropagation();
  totalClicks++;

  const targetRect = target.getBoundingClientRect();
  const radius = targetRect.width / 2;
  const centerX = targetRect.left + radius;
  const centerY = targetRect.top + radius;

  const clickX = e.clientX;
  const clickY = e.clientY;

  const distance = calculateDistance(clickX, clickY, centerX, centerY);

  if (distance <= radius) {
    hits++;
  } else {
    misses++;
  }

  updateStats();
  moveTarget();
});

gameArea.addEventListener("click", () => {
  // Clique fora do alvo = erro
  totalClicks++;
  misses++;
  updateStats();
});

targetSizeInput.addEventListener("input", () => {
  let size = parseInt(targetSizeInput.value);

  if (size < 5) size = 5;
  if (size > 75) size = 75;

  targetSizeInput.value = size;

  previewDot.style.width = `${size}px`;
  previewDot.style.height = `${size}px`;
});

startBtn.addEventListener("click", () => {
  totalClicks = 0;
  hits = 0;
  misses = 0;
  totalClicksEl.textContent =
    hitsEl.textContent =
    accuracyEl.textContent =
    missesEl.textContent =
      "0";

  // Parar timer antigo se existir
  if (autoMoveInterval) clearInterval(autoMoveInterval);

  const interval = parseFloat(moveIntervalInput.value);
  if (interval > 0) {
    autoMoveInterval = setInterval(moveTarget, interval * 1000);
  }

  moveTarget();
});

colorInput.addEventListener("input", (e) => {
  const color = e.target.value;
  // Atualiza a cor da bolinha e do preview
  target.style.backgroundColor = color;
  previewDot.style.backgroundColor = color;
});

colorInput.addEventListener("input", (e) => {
  const color = e.target.value;

  // Atualiza visualmente
  target.style.backgroundColor = color;
  previewDot.style.backgroundColor = color;
  colorBtn.style.backgroundColor = color;

  // Animação leve no botão
  colorBtn.classList.add(
    "ring",
    "ring-offset-2",
    "ring-white",
    "animate-ping-short"
  );

  // Remove a animação após ela terminar
  setTimeout(() => {
    colorBtn.classList.remove(
      "ring",
      "ring-offset-2",
      "ring-white",
      "animate-ping-short"
    );
  }, 300);
});
