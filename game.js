const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 200, y: 200, size: 20, vida: 100, nivel: 1, poder: 3 };
let enemigos = [];
let teclas = {};

// 🎮 Controles de teclado
document.addEventListener("keydown", (e) => {
  teclas[e.key] = true;
  if (e.key === " ") usarPoder();
});
document.addEventListener("keyup", (e) => {
  teclas[e.key] = false;
});

// 📱 Controles táctiles
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("touchstart", () => {
    let key = btn.getAttribute("data-key");
    teclas[key] = true;
    if (key === "Space") usarPoder();
  });
  btn.addEventListener("touchend", () => {
    let key = btn.getAttribute("data-key");
    teclas[key] = false;
  });
});

function moverJugador() {
  if (teclas["ArrowUp"] && player.y > 0) player.y -= 5;
  if (teclas["ArrowDown"] && player.y < canvas.height - player.size) player.y += 5;
  if (teclas["ArrowLeft"] && player.x > 0) player.x -= 5;
  if (teclas["ArrowRight"] && player.x < canvas.width - player.size) player.x += 5;
}

function usarPoder() {
  if (player.poder > 0) {
    enemigos = []; // elimina todos los enemigos en pantalla
    player.poder--;
  }
}

function crearEnemigo() {
  if (Math.random() < 0.05 * player.nivel) {
    let x = Math.random() * (canvas.width - 20);
    let y = Math.random() * (canvas.height - 20);
    enemigos.push({ x, y, size: 20 });
  }
}

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Jugador
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Enemigos
  ctx.fillStyle = "red";
  enemigos.forEach(e => {
    ctx.fillRect(e.x, e.y, e.size, e.size);

    // Colisión
    if (
      player.x < e.x + e.size &&
      player.x + player.size > e.x &&
      player.y < e.y + e.size &&
      player.y + player.size > e.y
    ) {
      player.vida -= 1;
    }
  });

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Vida: ${player.vida}`, 10, 20);
  ctx.fillText(`Nivel: ${player.nivel}`, 10, 40);
  ctx.fillText(`Poderes: ${player.poder}`, 10, 60);

  if (player.vida <= 0) {
    ctx.fillStyle = "yellow";
    ctx.font = "30px Arial";
    ctx.fillText("¡GAME OVER!", 120, 200);
    return false;
  }
  return true;
}

function loop() {
  moverJugador();
  crearEnemigo();
  if (dibujar()) requestAnimationFrame(loop);
}
loop();

