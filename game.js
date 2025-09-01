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

    // Botones táctiles
    this.load.image('btnLeft', 'https://labs.phaser.io/assets/ui/left.png');
    this.load.image('btnRight', 'https://labs.phaser.io/assets/ui/right.png');
    this.load.image('btnShoot', 'https://labs.phaser.io/assets/ui/blue_button02.png');
  }

  create() {
    // Fondo
    this.background = this.add.tileSprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2,
      this.sys.game.config.width, this.sys.game.config.height, 'background');

    // Jugador
    this.player = this.physics.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 80, 'player').setCollideWorldBounds(true);
    this.player.setScale(1.5);

    // Controles teclado
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Grupos
    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();

    // Variables
    this.lives = 3;
    this.level = 1;
    this.score = 0;
    this.power = 'normal';

    // Texto
    this.scoreText = this.add.text(10, 10, 'Puntaje: 0', { fontSize: '20px', fill: '#fff' });
    this.livesText = this.add.text(10, 40, 'Vidas: 3', { fontSize: '20px', fill: '#fff' });
    this.levelText = this.add.text(10, 70, 'Nivel: 1', { fontSize: '20px', fill: '#fff' });
    this.powerText = this.add.text(10, 100, 'Poder: Normal', { fontSize: '20px', fill: '#fff' });

    // Enemigos
    this.enemyTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.spawnEnemy()
    });

    // Colisiones
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);

    // 🔹 Botones táctiles
    this.createTouchControls();
  }

  createTouchControls() {
    const screenHeight = this.sys.game.config.height;

    this.btnLeft = this.add.image(80, screenHeight - 80, 'btnLeft').setInteractive().setAlpha(0.6).setScrollFactor(0).setScale(1.5);
    this.btnRight = this.add.image(180, screenHeight - 80, 'btnRight').setInteractive().setAlpha(0.6).setScrollFactor(0).setScale(1.5);
    this.btnShoot = this.add.image(this.sys.game.config.width - 80, screenHeight - 80, 'btnShoot').setInteractive().setAlpha(0.6).setScrollFactor(0).setScale(1.5);

    // Estados de botones
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isShooting = false;

    // Eventos
    this.btnLeft.on('pointerdown', () => this.isMovingLeft = true);
    this.btnLeft.on('pointerup', () => this.isMovingLeft = false);

    this.btnRight.on('pointerdown', () => this.isMovingRight = true);
    this.btnRight.on('pointerup', () => this.isMovingRight = false);

    this.btnShoot.on('pointerdown', () => {
      this.isShooting = true;
      this.shootBullet();
    });
    this.btnShoot.on('pointerup', () => this.isShooting = false);
  }

  spawnEnemy() {
    let x = Phaser.Math.Between(50, this.sys.game.config.width - 50);
    let enemy = this.enemies.create(x, 0, 'enemy');
    enemy.setVelocityY(50 + this.level * 20);
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

    if (this.score % 100 === 0) {
      this.level++;
      this.levelText.setText('Nivel: ' + this.level);
      this.enemyTimer.delay = Math.max(300, 1000 - this.level * 100);

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
      this.scene.restart();
      this.lives = 3;
      this.level = 1;
      this.score = 0;
      this.power = 'normal';
    }
  }

  update() {
    this.background.tilePositionY -= 2;

    // Teclado
    if (this.cursors.left.isDown || this.isMovingLeft) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown || this.isMovingRight) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    // Disparo con teclado
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.shootBullet();
    }

    // Disparo táctil continuo
    if (this.isShooting) {
      this.shootBullet();
      this.isShooting = false; // para que no dispare infinitamente
    }
  }
}

// Configuración
new Phaser.Game({
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  physics: { default: 'arcade' },
  scene: MainScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
});



