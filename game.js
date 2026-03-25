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
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    coins = this.physics.add.group({
        key: 'coin',
        repeat: 5,
        setXY: { x: 12, y: 0, stepX: 120 }
    });

    coins.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    this.physics.add.collider(coins, platforms);
    this.physics.add.overlap(player, coins, collectCoin, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#000' });
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
