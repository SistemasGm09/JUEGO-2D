class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/player.png');
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/ufo.png');
    this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullets/bullet5.png');
    this.load.image('laser', 'https://labs.phaser.io/assets/sprites/bullets/bullet11.png');
  }

  create() {
    // Fondo
    this.background = this.add.tileSprite(400, 300, 800, 600, 'background');

    // Jugador
    this.player = this.physics.add.sprite(400, 550, 'player').setCollideWorldBounds(true);
    this.player.setScale(1.5); // nave más grande

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
    this.power = 'normal'; // poderes: normal, triple, laser

    // Texto
    this.scoreText = this.add.text(10, 10, 'Puntaje: 0', { fontSize: '20px', fill: '#fff' });
    this.livesText = this.add.text(10, 40, 'Vidas: 3', { fontSize: '20px', fill: '#fff' });
    this.levelText = this.add.text(10, 70, 'Nivel: 1', { fontSize: '20px', fill: '#fff' });
    this.powerText = this.add.text(10, 100, 'Poder: Normal', { fontSize: '20px', fill: '#fff' });

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

  shootBullet() {
    if (this.power === 'normal') {
      let bullet = this.bullets.create(this.player.x, this.player.y - 20, 'bullet');
      bullet.setVelocityY(-300);
    } else if (this.power === 'triple') {
      let bullet1 = this.bullets.create(this.player.x, this.player.y - 20, 'bullet');
      let bullet2 = this.bullets.create(this.player.x - 15, this.player.y - 20, 'bullet');
      let bullet3 = this.bullets.create(this.player.x + 15, this.player.y - 20, 'bullet');
      bullet1.setVelocityY(-300);
      bullet2.setVelocity(-100, -300);
      bullet3.setVelocity(100, -300);
    } else if (this.power === 'laser') {
      let laser = this.bullets.create(this.player.x, this.player.y - 20, 'laser');
      laser.setVelocityY(-500);
      laser.setScale(1.5);
    }
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

      // Cambiar poder en ciertos niveles
      if (this.level === 2) {
        this.power = 'triple';
        this.powerText.setText('Poder: Triple');
      } else if (this.level === 4) {
        this.power = 'laser';
        this.powerText.setText('Poder: Láser');
      }
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
      this.power = 'normal';
    }
  }

  update() {
    // Fondo en movimiento
    this.background.tilePositionY -= 2;

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
      this.shootBullet();
    }
  }
}

// Configuración del juego
new Phaser.Game({
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  physics: { default: 'arcade' },
  scene: MainScene
});


