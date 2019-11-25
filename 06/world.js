World = function (friction = 0.85, gravity = 2) {

    this.collider = new Collider();

    this.friction = friction;
    this.gravity = gravity;

    this.columns = 12;
    this.rows = 9;

    this.tile_set = new Game.TileSet(8, 16);
    //this.player    = new Player(32, 76);
    this.players = []

    this.zone_id = "00";// The current zone.

    this.doors = [];// The array of doors in the level.
    this.door = undefined; // If the player enters a door, the game will set this property to that door and the level will be loaded.

    this.height = this.tile_set.tile_size * this.rows;
    this.width = this.tile_set.tile_size * this.columns;

};
World.prototype = {

    constructor: World,
    addPlayer: function (p) {
        this.players.push(p)
    },
    collideObject: function (object) {

        /* I got rid of the world boundary collision. Now it's up to the tiles to keep
        the player from falling out of the world. */

        var bottom, left, right, top, value;

        top = Math.floor(object.getTop() / this.tile_set.tile_size);
        left = Math.floor(object.getLeft() / this.tile_set.tile_size);
        value = this.collision_map[top * this.columns + left];
        this.collider.collide(value, object, left * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

        top = Math.floor(object.getTop() / this.tile_set.tile_size);
        right = Math.floor(object.getRight() / this.tile_set.tile_size);
        value = this.collision_map[top * this.columns + right];
        this.collider.collide(value, object, right * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

        bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
        left = Math.floor(object.getLeft() / this.tile_set.tile_size);
        value = this.collision_map[bottom * this.columns + left];
        this.collider.collide(value, object, left * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

        bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
        right = Math.floor(object.getRight() / this.tile_set.tile_size);
        value = this.collision_map[bottom * this.columns + right];
        this.collider.collide(value, object, right * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

    },

    /* The setup function takes a zone object generated from a zoneXX.json file. It
    sets all the world values to values of zone. If the player just passed through a
    door, it uses the this.door variable to change the player's location to wherever
    that door's destination goes. */
    setup: function (zone) {

        /* Get the new tile maps, the new zone, and reset the doors array. */
        this.graphical_map = zone.graphical_map;
        this.collision_map = zone.collision_map;
        this.columns = zone.columns;
        this.rows = zone.rows;
        this.doors = [];
        this.carrots = [];
        this.zone_id = zone.id;
        let zc = zone.carrots || [];
        for (let i = 0; i<zc.length; i++){
            let c = zone.carrots[i];
            let ts = this.tile_set;
            this.carrots[i] = new Carrot(c[0] * ts.tile_size + 5, c[1] * ts.tile_size - 2)
        }

        /* Generate new doors. */
        for (let index = zone.doors.length - 1; index > -1; --index) {

            let door = zone.doors[index];
            this.doors[index] = new Game.Door(door);

        }

        /* If the player entered into a door, this.door will reference that door. Here
        it will be used to set the player's location to the door's destination. */
        if (this.door) {

            /* if a destination is equal to -1, that means it won't be used. Since each zone
            spans from 0 to its width and height, any negative number would be invalid. If
            a door's destination is -1, the player will keep his current position for that axis. */
            for (let i = 0; i < this.players.length; i++) {
                let player = this.players[i];
                if (this.door.destination_x != -1) {

                    player.setCenterX(this.door.destination_x);
                    player.setOldCenterX(this.door.destination_x);// It's important to reset the old position as well.

                }

                if (this.door.destination_y != -1) {

                    player.setCenterY(this.door.destination_y);
                    player.setOldCenterY(this.door.destination_y);

                }
            }
            this.door = undefined;// Make sure to reset this.door so we don't trigger a zone load.

        }

    },

    update: function () {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            player.update();
            player.updatePosition(this.gravity, this.friction);
            this.collideObject(player);

            //Do the actual carrot collision
            for(let ci=0; ci<this.carrots.length; ci++){
                let c = this.carrots[ci];
                c.updatePosition();
                c.animate();
                if(c.collideObject(player)){
                    this.carrots.splice(ci, 1);
                    player.carrot_count++;
                }
            }

            /* Here we loop through all the doors in the current zone and check to see
            if the player is colliding with any. If he does collide with one, we set the
            world's door variable equal to that door, so we know to use it to load the next zone. */
            for (let index = this.doors.length - 1; index > -1; --index) {
                let door = this.doors[index];
                if (door.collideObjectCenter(player)) {
                    this.door = door;
                }
            }
            player.updateAnimation();
        }

    }

};
