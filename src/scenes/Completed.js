class Completed extends Phaser.Scene {
    constructor (config) {
        super({ key: 'completed' });
    }

    create () {
        this.add.bitmapText(85, 40, 'baseFont', 'COMPLETED!!');

        this.add.bitmapText(25, 80, 'baseFont', 'IT DOESN\'T GET ANY BUTTER');

        var pressStart = this.add.bitmapText(40, 165, 'baseFont', 'PRESS SPACE TO REPLAY');

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
            this.scene.start('title');
        }, this);
    }
}

export default Completed;
