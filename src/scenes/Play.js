import Player from '../entities/Player.js';
import Ball from '../entities/Ball.js';

const POPCORN_START = 16;
const POPCORN_END = POPCORN_START + 15;

function neighborsToInt(t, r, b, l) {
    return (t ? 1 : 0) +
        (r ? 2 : 0) +
        (b ? 4 : 0) +
        (l ? 8 : 0);
}

class Play extends Phaser.Scene {
    constructor (config) {
        super({ key: 'play' });
    }

    create (config) {
        this.level = config.level;
        this.lives = config.lives;
        console.log(config);

        const map = this.make.tilemap({ key: 'level' + this.level });
        const tileset = map.addTilesetImage('tiles', 'tiles');

        map.createStaticLayer('background', tileset, 0, 0);
        map.createStaticLayer('furniture', tileset, 0, 0);
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

        this.baddies = this.physics.add.group();
        map.filterObjects('objects', function(obj) {
            return (obj.type === 'ball');
        }).forEach(function(loc) {
            this.baddies.add(new Ball(this, loc.x, loc.y));
        }, this);
        this.physics.add.collider(this.baddies, worldLayer);
        this.physics.add.overlap(this.player, this.baddies, this.playerHitBaddie, null, this);

        for (var i = 0; i < this.lives; i++) {
            let life = this.add.image(16 + (i * 16), 16, 'life');
            life.setScrollFactor(0);
        }

        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setDeadzone(40, 20);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.popSounds = [
            this.sound.add('pop1'),
            this.sound.add('pop2')
        ];

        this.physics.pause();
        this.time.delayedCall(1000, function() {
            this.physics.resume();
        }, [], this);

        this.playerIsSquashed = false;
        this.popRate = 1.30;
        this.popCounter = 0;
    }

    update () {
        if (this.physics.world.isPaused) {
            return;
        }

        // this.randomPopSound();
        this.baddies.getChildren().forEach((baddie) => {
            if (this.isEntitySquashed(baddie)) {
                baddie.destroy();
            }
        });
        this.player.update();
        if (this.isEntitySquashed(this.player)) {
            this.doPlayerSquashed();
        }
        this.popCounter += this.popRate;
        while (this.popCounter > 1) {
            this.popCounter--;
            this.popSomeCorn();
        }
    }

    popSomeCorn() {
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

    randomPopSound() {
        if (Math.random() < .08) {
            this.popSounds[0].play();
        } else if (Math.random() < .08) {
            this.popSounds[1].play();
        }
    }

    isEntitySquashed (entity) {
        const body = entity.body;
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

    updatePopcornTile(x, y) {
        const tileId = neighborsToInt(
            this.isPopcorn(x, y-1),
            this.isPopcorn(x+1, y),
            this.isPopcorn(x, y+1),
            this.isPopcorn(x-1, y)
        ) + POPCORN_START;
        const tile = this.worldLayer.putTileAt(tileId, x, y);
        tile.setCollision(true);
    }

    isPopcorn(x, y) {
        const tile = this.worldLayer.getTileAt(x, y);
        if (tile) {
            const id = tile.index;
            return (id >= POPCORN_START) && (id <= POPCORN_END);
        }
        return false;
    }

    popcornLocation (x, y) {
        this.updatePopcornTile(x, y);
        if (this.isPopcorn(x, y-1)) {
            this.updatePopcornTile(x, y-1);
        }
        if (this.isPopcorn(x+1, y)) {
            this.updatePopcornTile(x+1, y);
        }
        if (this.isPopcorn(x, y+1)) {
            this.updatePopcornTile(x, y+1);
        }
        if (this.isPopcorn(x-1, y)) {
            this.updatePopcornTile(x-1, y);
        }
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
                if (this.lives > 1) {
                    this.scene.restart({
                        level: this.level,
                        lives: this.lives-1
                    });
                } else {
                    this.scene.start('gameover');
                }
            }, [], this);
        }
    }

    playerHitBaddie() {
        if (!(this.player.hurtCount > 0)) {
            this.player.hurtCount = 60;
            this.player.setVelocityX(0);
        }
    }

    onGoal() {
        this.physics.pause();
        this.time.delayedCall(500, function() {
            if (this.level < 2) {
                this.scene.restart({
                    level: this.level+1,
                    lives: this.lives
                });
            } else {
                this.scene.start('gameover');
            }
        }, [], this);
    }
}

export default Play;
