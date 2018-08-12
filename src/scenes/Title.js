class Title extends Phaser.Scene {
    constructor (config) {
        super({ key: 'title' });
    }

    create () {
        this.add.image(128, 110, 'title-background');
        var title = this.add.image(128, 60, 'title');

        this.tweens.add({
            targets: title,
            y: 110,
            duration: 3000,
            ease: 'Power2'
        });

        var pressStart = this.add.bitmapText(85, 165, 'baseFontBlack', 'PRESS SPACE');

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
            this.scene.start('play', {lives: 3, level: 1});
        }, this);

        this.scene.start('play', {lives: 3, level: 1});
    }
}

export default Title;
