export default class Baddie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ball');
        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.setBounce(1, 1)
            .setMaxVelocity(500, 500)
            .setSize(8, 16)
            .setOffset(4, 0)
            .setCollideWorldBounds(true);
    }
}
