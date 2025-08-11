class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/player.png');
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/ufo.png');
    this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullets/bullet5.png');
  }

  create() {
    // Fondo
    this.add.image(400, 300, 'background');

    // Jugador
    this.player = this.physics.add.sprite(400, 550, 'player').setCollideWorldBounds(true);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Balas
    this.bullets = this.physics.add.group();

    // Enemigos
    this.enemies = this.physics.add.group();

    // Variables del juego
    this.lives = 3;
    this.level = 1;
    this.score = 0;

    // Texto
    this.scoreText = this.add.text(10, 10, 'Puntaje: 0', { fontSize: '20px', fill: '#fff' });
    this.livesText = this.add.text(10, 40, 'Vidas: 3', { fontSize: '20px', fill: '#fff' });
    this.levelText = this.add.text(10, 70, 'Nivel: 1', { fontSize: '20px', fill: '#fff' });

    // Generar enemigos
    this.enemyTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.spawnEnemy()
    });

    // Colisiones
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);
  }

  spawnEnemy() {
    let x = Phaser.Math.Between(50, 750);
    let enemy = this.enemies.create(x, 0, 'enemy');
    enemy.setVelocityY(50 + this.level * 20); // más rápido con nivel
  }

  hitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    this.score += 10;
    this.scoreText.setText('Puntaje: ' + this.score);

    // Subir de nivel cada 100 puntos
    if (this.score % 100 === 0) {
      this.level++;
      this.levelText.setText('Nivel: ' + this.level);
      this.enemyTimer.delay = Math.max(300, 1000 - this.level * 100);
    }
  }

  playerHit(player, enemy) {
    enemy.destroy();
    this.lives--;
    this.livesText.setText('Vidas: ' + this.lives);

    if (this.lives <= 0) {
      this.scene.restart(); // reiniciar juego
      this.lives = 3;
      this.level = 1;
      this.score = 0;
    }
  }

  update() {
    // Movimiento jugador
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    // Disparo
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      let bullet = this.bullets.create(this.player.x, this.player.y - 20, 'bullet');
      bullet.setVelocityY(-300);
    }
  }
}

// Configuración del juego
new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  physics: { default: 'arcade' },
  scene: MainScene
});
