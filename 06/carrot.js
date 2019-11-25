function Carrot(x, y){
    Game.Object.call(this, x,y, 7, 14);
    Animator.call(this, Carrot.prototype.frame_sets["twirl"], 15);
    this.frame_index = Math.floor(Math.random() * 2);

    //base is the point around which the carrot revolves
    //pos is used to track the vector facing away from the base point
    // giving it a floating effect
    this.base_x = x;
    this.base_y = y;
    //This moves them move around
    this.position_x = Math.random() * Math.PI * 2;
    this.position_y = this.position_x * 2;

}

Carrot.prototype = {
    frame_sets: {
        "twirl": [12, 13]
    },
    updatePosition: function(){
        this.position_x += 0.1;
        this.position_y += 0.2;

        this.x = this.base_x + Math.cos(this.position_x) * 2;
        this.y = this.base_y + Math.sin(this.position_y);

    }
};
Object.assign(Carrot.prototype, Animator.prototype);
Object.assign(Carrot.prototype, Game.Object.prototype);
