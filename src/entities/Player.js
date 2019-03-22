export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.setDrag(100, 0)
            .setMaxVelocity(150, 500)
            .setSize(12, 17)
            .setOffset(6, 7)
            .setCollideWorldBounds(true);

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.hurtCount = 0;
        this.jumpTimer = 0;
    }

    update(time, delta) {
        const { cursors } = this;
        const onGround = this.body.blocked.down;
        const acceleration = onGround ? 300 : 100;

        if (this.hurtCount > 0) {
            this.visible = Math.floor(this.hurtCount / 3) % 2 === 0;
            this.hurtCount--;
        } else {
            this.visible = true;
        }

        if (cursors.left.isDown) {
            this.setAccelerationX(-acceleration);
            this.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.setAccelerationX(acceleration);
            this.setFlipX(false);
        } else {
            this.setAccelerationX(0);
        }

        if ((onGround || (this.jumpTimer > 0)) && (cursors.up.isDown)) {
            if (onGround) {
                this.jumpTimer = 170;
            }
            this.setVelocityY(-120);
        }

        if (this.jumpTimer > 0) {
            this.jumpTimer -= delta;
        }

        if (onGround) {
            if (this.body.velocity.x !== 0) {
                this.anims.play('player-run', true);
            } else {
                this.anims.play('player-idle', true);
            }
        } else {
            this.anims.play('player-jump', true);
        }
    }
}
