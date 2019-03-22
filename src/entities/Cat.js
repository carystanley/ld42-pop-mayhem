export default class Cat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'cat');
        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.setMaxVelocity(500, 500)
            .setSize(24, 16)
            .setOffset(0, 0)
            .setCollideWorldBounds(true);

        this.anims.play('cat-idle', true);
    }
}
