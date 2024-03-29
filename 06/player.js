//Game.Player.prototype.constructor = Game.Player;
let MAX_JUMPS = 2;
let JUMP_VELOCITIES = {
    0: 13,
    1: 10
};

function Player(x, y, ops) {

    MovingObject.call(this, x, y, 7, 12);
    Animator.call(this, Player.prototype.frame_sets["idle-left"], 10);
    this.controller = ops.controller;
    this.jumping = true;
    this.njumps = 0;
    this.direction_x = -1;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.carrot_count = 0;

};
Player.prototype = {

    frame_sets: {

        "idle-left": [0],
        "idle-right": [6],
        "jump-left": [1],
        "move-left": [2, 3, 4, 5],
        "jump-right": [7],
        "move-right": [8, 9, 10, 11]

    },
    update: function(){
        let controller = this.controller;
        if (controller.left.active) this.moveLeft();
        if (controller.right.active) this.moveRight();
        if (controller.up.active) {
            this.jump();
            controller.up.active = false;
        }
    },

    jump: function () {
        /* Made it so you can only jump if you aren't falling faster than 10px per frame. */
        if (this.velocity_y < 10 && this.njumps < MAX_JUMPS) {
            this.jumping = true;
            this.velocity_y -= JUMP_VELOCITIES[this.njumps];
            this.njumps += 1;
        }
    },
    hitBottom: function () {
        this.jumping = false;
        this.njumps = 0;
    },
    hitTop() {

    },
    hitLeft: function () {

    },
    hitRight: function () {
        //This can act as a bouncer

    },

    moveLeft: function () {
        this.direction_x = -1;
        this.velocity_x -= 0.55;
    },

    moveRight: function (frame_set) {
        this.direction_x = 1;
        this.velocity_x += 0.55;
    },

    updateAnimation: function () {
        let fs_left = this.frame_sets["move-left"];
        let fs_right = this.frame_sets["move-right"];
        if (this.velocity_y < 0) {

            if (this.direction_x < 0) this.setFrameSet(this.frame_sets["jump-left"], "pause");
            else this.setFrameSet(this.frame_sets["jump-right"], "pause");

        } else if (this.direction_x < 0) { //Going left

            if (this.velocity_x < -0.1) this.setFrameSet(fs_left, "loop", 5);
            else this.setFrameSet(this.frame_sets["idle-left"], "pause");

        } else if (this.direction_x > 0) { //Going right

            if (this.velocity_x > 0.1) this.setFrameSet(fs_right, "loop", 5);
            else this.setFrameSet(this.frame_sets["idle-right"], "pause");

        }

        this.animate();

    },

    updatePosition: function (gravity, friction) {

        this.x_old = this.x;
        this.y_old = this.y;

        this.velocity_y += gravity;
        this.velocity_x *= friction;

        /* Made it so that velocity cannot exceed velocity_max */
        if (Math.abs(this.velocity_x) > this.velocity_max)
            this.velocity_x = this.velocity_max * Math.sign(this.velocity_x);

        if (Math.abs(this.velocity_y) > this.velocity_max)
            this.velocity_y = this.velocity_max * Math.sign(this.velocity_y);

        this.x += this.velocity_x;
        this.y += this.velocity_y;

    }

};
Object.assign(Player.prototype, MovingObject.prototype);
Object.assign(Player.prototype, Animator.prototype);
