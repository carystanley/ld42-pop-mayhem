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
            progress.fillRect(0, (window.innerHeight / 2) - 30, window.innerWidth * value, 60);
        });

        this.load.on('complete', function () {
            progress.destroy();
        });

        // Load assets
        this.load.image('tiles', 'tiles.png');
        this.load.spritesheet('player', 'player.png', { frameWidth: 24, frameHeight: 24 });
        this.load.tilemapTiledJSON('level1', 'level1.json');
        this.load.image('165', '165.png');

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
        // this.scene.start('title');
        this.scene.start('play');
    }
}

export default Preloader;
