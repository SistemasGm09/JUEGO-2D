const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Jugador
let player = { x: 50, y: 50, size: 20, vida: 3, nivel: 1, poderes: ["fire", "ice"] };

// Enemigos
let enemies = [{ x: 200, y: 200, size: 20 }];

// Dibujar jugador
function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Dibujar enemigos
function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.size, e.size));
}

// Mover jugador
function movePlayer(direction) {
  if (direction === "up") player.y -= 10;
  if (direction === "down") player.y += 10;
  if (direction === "left") player.x -= 10;
  if (direction === "right") player.x += 10;
  checkCollisions();
  drawGame();
}

// Usar poderes
function usePower(type) {
  if (!player.poderes.includes(type)) return;
  ctx.fillStyle = type === "fire" ? "orange" : "cyan";
  ctx.beginPath();
  ctx.arc(player.x + 10, player.y + 10, 40, 0, Math.PI * 2);
  ctx.fill();

  // Eliminar enemigos cercanos
  enemies = enemies.filter(e => {
    let dx = e.x - player.x;
    let dy = e.y - player.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    return dist > 40;
  });

  if (enemies.length === 0) nextLevel();
}

// Colisiones
function checkCollisions() {
  enemies.forEach(e => {
    if (
      player.x < e.x + e.size &&
      player.x + player.size > e.x &&
      player.y < e.y + e.size &&
      player.y + player.size > e.y
    ) {
      player.vida--;
      alert("¡Perdiste una vida! Vidas: " + player.vida);
      if (player.vida <= 0) {
        alert("¡Game Over!");
        resetGame();
      }
    }
  });
}

// Siguiente nivel
function nextLevel() {
  player.nivel++;
  alert("Nivel " + player.nivel);
  enemies = [];
  for (let i = 0; i < player.nivel; i++) {
    enemies.push({ x: Math.random() * 350, y: Math.random() * 350, size: 20 });
  }
  drawGame();
}

// Reiniciar juego
function resetGame() {
  player.x = 50;
  player.y = 50;
  player.vida = 3;
  player.nivel = 1;
  enemies = [{ x: 200, y: 200, size: 20 }];
  drawGame();
}

// Dibujar todo
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
}

// Controles con teclado (PC)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer("up");
  if (e.key === "ArrowDown") movePlayer("down");
  if (e.key === "ArrowLeft") movePlayer("left");
  if (e.key === "ArrowRight") movePlayer("right");
  if (e.key === "f") usePower("fire");
  if (e.key === "i") usePower("ice");
});

drawGame();
