const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game;
let player;
let cursors;
let platforms;
let coins;
let score = 0;
let scoreText;

function startGame() {
    if (!game) {
        game = new Phaser.Game(config);
    }
}

function preload() {
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('coin', 'https://labs.phaser.io/assets/sprites/gold_1.png');
}

function create() {
    // WORLD SIZE (important for scrolling)
    this.physics.world.setBounds(0, 0, 2000, 600);

    platforms = this.physics.add.staticGroup();

    // Ground
    for (let i = 0; i < 2000; i += 400) {
        platforms.create(i, 580, 'ground').setScale(2).refreshBody();
    }

    // Floating platforms
    platforms.create(600, 400, 'ground');
    platforms.create(900, 300, 'ground');
    platforms.create(1300, 350, 'ground');
    platforms.create(1600, 250, 'ground');

    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    // Coins
    coins = this.physics.add.group({
        key: 'coin',
        repeat: 10,
        setXY: { x: 200, y: 0, stepX: 150 }
    });

    coins.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    this.physics.add.collider(coins, platforms);
    this.physics.add.overlap(player, coins, collectCoin, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
    scoreText.setScrollFactor(0);

    // CAMERA FOLLOW PLAYER (side scrolling)
    this.cameras.main.setBounds(0, 0, 2000, 600);
    this.cameras.main.startFollow(player);
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }
}
