import Player from '../entities/Player.js';
// import Baddie from '../entities/Baddie.js';

class Play extends Phaser.Scene {
    constructor (config) {
        super({ key: 'play' });
    }

    create () {
        const map = this.make.tilemap({ key: 'level1' });
        const tileset = map.addTilesetImage('tiles', 'tiles');

        map.createDynamicLayer('background', tileset, 0, 0);
        const worldLayer = map.createDynamicLayer('world', tileset, 0, 0);
        worldLayer.setCollisionByProperty({ collides: true });
        this.physics.world.gravity.y = 350;
        this.worldLayer = worldLayer;

        const startPoint = map.findObject('objects', obj => obj.name === 'start');
        this.player = new Player(this, startPoint.x, startPoint.y);
        this.physics.add.collider(this.player, worldLayer);


        const popcornPoint = map.findObject('objects', obj => obj.name === 'popcorn');
        this.popcornQueue = [{
            x: Math.floor(popcornPoint.x/8),
            y: Math.floor(popcornPoint.y/8)
        }];

        this.goals = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        map.filterObjects('objects', function(obj) {
            return (obj.type === 'goal');
        }).forEach(function(goal) {
            const zone = this.goals.create(goal.x, goal.y, goal.width, goal.height);
            zone.body.allowGravity = false;
        }, this);
        this.physics.add.overlap(this.player, this.goals, this.onGoal, null, this);

        /*
        this.baddies = this.physics.add.group();
        this.baddies.add(new Baddie(this, 56, 45));
        this.physics.add.collider(this.baddies, worldLayer);
        this.physics.add.collider(this.player, this.baddies, this.playerHitBaddie, null, this);
        */

        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setDeadzone(40, 20);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.popSounds = [
            this.sound.add('pop1'),
            this.sound.add('pop2')
        ];

        this.playerIsSquashed = false;
    }

    update () {
        /*
        if (Math.random() < .08) {
            this.popSounds[0].play();
        } else if (Math.random() < .08) {
            this.popSounds[1].play();
        }
        */

        this.player.update();
        if (this.isPlayerSquashed()) {
            this.doPlayerSquashed();
        }

        let location = null;
        let tile;
        do {
            location = this.popcornQueue.shift();
            if (location) {
                tile = this.worldLayer.getTileAt(location.x, location.y);
            }
        } while (location && tile && tile.collides);

        if (location) {
            const { x, y } = location;
            this.popcornLocation(x, y);
            this.queuePush(x, y + 1);
            this.queuePush(x - 1, y);
            this.queuePush(x + 1, y);
            this.queuePush(x, y - 1);
        }
    }

    isPlayerSquashed () {
        const body = this.player.body;
        const t = body.top;
        const l = body.left;
        const r = body.right;
        const b = body.bottom;
        return (
            this.doesWorldXYCollide(l, t) &&
            this.doesWorldXYCollide(l, b) &&
            this.doesWorldXYCollide(r, t) &&
            this.doesWorldXYCollide(r, b)
        );
    }

    doesWorldXYCollide (x, y) {
        const tile = this.worldLayer.getTileAtWorldXY(x, y);
        return tile && tile.collides;
    }

    queuePush (x, y) {
        const tile = this.worldLayer.getTileAt(x, y);
        if (!tile || !tile.collides) {
            this.popcornQueue.push({x, y});
        }
    }

    popcornLocation (x, y) {
        const tile = this.worldLayer.putTileAt(5, x, y);
        tile.setCollision(true);
    }

    doPlayerSquashed () {
        if (!this.playerIsSquashed) {
            this.playerIsSquashed = true;
            this.cameras.main.shake(500);
            this.time.delayedCall(250, function() {
                this.cameras.main.fade(250);
            }, [], this);

            // restart game
            this.time.delayedCall(500, function() {
                this.scene.start('gameover');
                // this.scene.restart();
            }, [], this);
        }
    }

    playerHitBaddie() {
        if (!(this.player.hurtCount > 0)) {
            this.gameOver();
        }
    }

    onGoal() {
        this.scene.pause();
    }
}

export default Play;
