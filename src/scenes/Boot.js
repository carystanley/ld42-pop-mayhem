class Boot extends Phaser.Scene {
    constructor () {
        super({ key: 'boot' });
    }

    create () {
        // more setup stuff here
        // ...

        this.scene.start('preloader');
    }
}

export default Boot;
