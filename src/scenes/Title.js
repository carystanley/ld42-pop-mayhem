class Title extends Phaser.Scene {
    constructor (config) {
        super({ key: 'title' });
    }

    create () {
        var pressStart = this.add.bitmapText(30, 150, 'baseFont', 'PRESS SPACE');

        this.tweens.add({
            targets: pressStart,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            loop: 100000,
            ease: function (t) {
                return (t > 0.5) ? 1 : 0;
            }
        });

        this.input.keyboard.on('keydown_SPACE', function (event) {
            this.scene.start('play');
        }, this);
    }
}

export default Title;
