class GameOver extends Phaser.Scene {
    constructor (config) {
        super({ key: 'gameover' });
    }

    create () {
        this.add.bitmapText(95, 40, 'baseFont', 'GAME OVER');

        this.add.bitmapText(45, 80, 'baseFont', 'BUTTER LUCK NEXT TIME');

        var pressStart = this.add.bitmapText(35, 165, 'baseFont', 'PRESS SPACE TO CONTINUE');

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

export default GameOver;
