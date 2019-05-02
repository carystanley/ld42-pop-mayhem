class Preloader extends Phaser.Scene {
    constructor () {
        super({ key: 'preloader' });
    }

    preload () {
        this.load.setPath('assets');

        let progress = this.add.graphics();

        this.load.on('progress', function (value) {
            progress.clear();
            progress.fillStyle(0xdff9fb, 1);
            progress.fillRect(0, (220 / 2) - 30, 256 * value, 60);
        });

        this.load.on('complete', function () {
            progress.destroy();
        });

        // Load assets
        this.load.image('title', 'title.png');
        this.load.image('title-background', 'title-background.png');
        this.load.image('life', 'life.png');
        this.load.image('tiles', 'tiles-extruded.png');
        this.load.image('ball', 'ball.png');
        this.load.spritesheet('player', 'player.png', { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet('cat', 'cat.png', { frameWidth: 24, frameHeight: 16 });
        this.load.tilemapTiledJSON('level1', 'level1.json');
        this.load.tilemapTiledJSON('level2', 'level2.json');
        this.load.tilemapTiledJSON('level3', 'level3.json');
        this.load.tilemapTiledJSON('level4', 'level4.json');
        this.load.tilemapTiledJSON('level5', 'level5.json');
        this.load.image('165', '165.png');
        this.load.image('165-black', '165-black.png');

        this.load.audio('pop1', ['pop1.mp3', 'pop1.ogg']);
        this.load.audio('pop2', ['pop2.mp3', 'pop2.ogg']);
    }

    create () {
        var config = {
            image: '165',
            width: 8,
            height: 7,
            chars: ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`',
            charsPerRow: 40,
            spacing: { x: 0, y: 1 }
        };

        this.cache.bitmapFont.add('baseFont', Phaser.GameObjects.RetroFont.Parse(this, config));
        config = Object.assign({}, config, {image: '165-black'});
        this.cache.bitmapFont.add('baseFontBlack', Phaser.GameObjects.RetroFont.Parse(this, config));

        // Define Animations
        this.setupAnimations([
            { key: 'player-idle', image: 'player', start: 0, end: 0, frameRate: 10, repeat: -1 },
            { key: 'player-jump', image: 'player', start: 1, end: 1, frameRate: 10, repeat: -1 },
            { key: 'player-skid', image: 'player', start: 2, end: 2, frameRate: 10, repeat: -1 },
            { key: 'player-run', image: 'player', start: 3, end: 8, frameRate: 10, repeat: -1 },
            { key: 'cat-idle', image: 'cat', start: 0, end: 1, frameRate: 1, repeat: -1 }
        ]);

        this.scene.start('title');
    }

    setupAnimations(animations) {
        animations.forEach(({ key, image, start, end, frameRate, repeat }) => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers(image, { start, end }),
                frameRate,
                repeat
            });
        })
    }
}

export default Preloader;
