
World = function(friction = 0.85, gravity = 2) {

    this.collider  = new Collider();

    this.friction  = friction;
    this.gravity   = gravity;

    this.columns   = 12;
    this.rows      = 9;

    this.tile_set  = new Game.TileSet(8, 16);
    this.player    = new Player(32, 76);

    this.zone_id   = "00";// The current zone.

    this.doors     = [];// The array of doors in the level.
    this.door      = undefined; // If the player enters a door, the game will set this property to that door and the level will be loaded.

    this.height    = this.tile_set.tile_size * this.rows;
    this.width     = this.tile_set.tile_size * this.columns;

};
World.prototype = {

    constructor: World,

    collideObject:function(object) {

        /* I got rid of the world boundary collision. Now it's up to the tiles to keep
        the player from falling out of the world. */

        var bottom, left, right, top, value;

        top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
        left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
        value  = this.collision_map[top * this.columns + left];
        this.collider.collide(value, object, left * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

        top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
        right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
        value  = this.collision_map[top * this.columns + right];
        this.collider.collide(value, object, right * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

        bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
        left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
        value  = this.collision_map[bottom * this.columns + left];
        this.collider.collide(value, object, left * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

        bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
        right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
        value  = this.collision_map[bottom * this.columns + right];
        this.collider.collide(value, object, right * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

    },

    /* The setup function takes a zone object generated from a zoneXX.json file. It
    sets all the world values to values of zone. If the player just passed through a
    door, it uses the this.door variable to change the player's location to wherever
    that door's destination goes. */
    setup:function(zone) {

        /* Get the new tile maps, the new zone, and reset the doors array. */
        this.graphical_map      = zone.graphical_map;
        this.collision_map      = zone.collision_map;
        this.columns            = zone.columns;
        this.rows               = zone.rows;
        this.doors              = new Array();
        this.zone_id            = zone.id;

        /* Generate new doors. */
        for (let index = zone.doors.length - 1; index > -1; -- index) {

            let door = zone.doors[index];
            this.doors[index] = new Game.Door(door);

        }

        /* If the player entered into a door, this.door will reference that door. Here
        it will be used to set the player's location to the door's destination. */
        if (this.door) {

            /* if a destination is equal to -1, that means it won't be used. Since each zone
            spans from 0 to its width and height, any negative number would be invalid. If
            a door's destination is -1, the player will keep his current position for that axis. */
            if (this.door.destination_x != -1) {

                this.player.setCenterX   (this.door.destination_x);
                this.player.setOldCenterX(this.door.destination_x);// It's important to reset the old position as well.

            }

            if (this.door.destination_y != -1) {

                this.player.setCenterY   (this.door.destination_y);
                this.player.setOldCenterY(this.door.destination_y);

            }

            this.door = undefined;// Make sure to reset this.door so we don't trigger a zone load.

        }

    },

    update:function() {

        this.player.updatePosition(this.gravity, this.friction);

        this.collideObject(this.player);

        /* Here we loop through all the doors in the current zone and check to see
        if the player is colliding with any. If he does collide with one, we set the
        world's door variable equal to that door, so we know to use it to load the next zone. */
        for(let index = this.doors.length - 1; index > -1; -- index) {

            let door = this.doors[index];

            if (door.collideObject(this.player)) {

                this.door = door;

            };

        }

        this.player.updateAnimation();

    }

};