import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import Title from './scenes/Title.js';
import Play from './scenes/Play.js';
import GameOver from './scenes/GameOver.js';
import Completed from './scenes/Completed.js';

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    width: 256,
    height: 224,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true
        }
    },
    scene: [
        Boot,
        Preloader,
        Title,
        Play,
        GameOver,
        Completed
    ],
    antialias: false,
    pixelArt: true,
    fps: 60,
    callbacks: {
        postBoot: function () {
            updateScale();
        }
    }
};

var game = new Phaser.Game(config);

function updateScale() {
    const gameWidth = game.config.width;
    const gameHeight = game.config.height;
    const scaleW = window.innerWidth / gameWidth;
    const scaleH = window.innerHeight / gameHeight;
    const scale = Math.floor(Math.min(scaleW, scaleH));
    if (game.canvas) {
        game.canvas.style.width = scale * gameWidth + 'px';
        game.canvas.style.height = scale * gameHeight + 'px';
    }
}

window.addEventListener('resize', function () {
    updateScale();
}, false);
