// Frank Poth 04/06/2018

/* Changes since part 5:

  1. Simplified Class constructors by removing multiple prefixes: For example:
     Game.World.Object.Player is now Game.Player.
  2. Added Game.World.prototype.setup to setup world from json level data.
  3. Added the Game.MovingObject class to separate Objects from MovingObjects.
     Game.Player now inherits from MovingObject instead of Object.
  4. Changed Game.World.map to Game.World.graphical_map.
  5. Made the Game.Collider.collideObject routing function do all y first collision checks.
     This simply means that I check collision on top and bottom before left and right.
  6. Removed world boundary collision from World.collideObject so the player can
     move off screen enough to hit a door.
  7. Added the Game.Door class.
  8. Added functions to get the center position of Game.Object and Game.MovingObject.
  9. Organized classes by alphabeticalish order.
  10. Put a limit on player velocity because there was a problem with "tunneling"
      through tiles due to jump movement speed.
  11. Changed the player's hitbox size and his frame offsets for animation.

*/

const Game = function() {
  this.world    = new World();
  this.update   = function() {
    this.world.update();
  };

};
Game.prototype = { constructor : Game };


Game.Frame = function(x, y, width, height, offset_x, offset_y) {

  this.x        = x;
  this.y        = y;
  this.width    = width;
  this.height   = height;
  this.offset_x = offset_x;
  this.offset_y = offset_y;

};
Game.Frame.prototype = { constructor: Game.Frame };

Game.Object = function(x, y, width, height) {

 this.height = height;
 this.width  = width;
 this.x      = x;
 this.y      = y;

};
/* I added getCenterX, getCenterY, setCenterX, and setCenterY */
Game.Object.prototype = {

  constructor:Game.Object,

  getBottom : function()  { return this.y + this.height;       },
  getCenterX: function()  { return this.x + this.width  * 0.5; },
  getCenterY: function()  { return this.y + this.height * 0.5; },
  getLeft   : function()  { return this.x;                     },
  getRight  : function()  { return this.x + this.width;        },
  getTop    : function()  { return this.y;                     },
  setBottom : function(y) { this.y = y - this.height;          },
  setCenterX: function(x) { this.x = x - this.width  * 0.5;    },
  setCenterY: function(y) { this.y = y - this.height * 0.5;    },
  setLeft   : function(x) { this.x = x;                        },
  setRight  : function(x) { this.x = x - this.width;           },
  setTop    : function(y) { this.y = y;                        }

};


Game.Door = function(door) {

 Game.Object.call(this, door.x, door.y, door.width, door.height);

 this.destination_x    = door.destination_x;
 this.destination_y    = door.destination_y;
 this.destination_zone = door.destination_zone;

};
Game.Door.prototype = {

 /* Tests for collision between this door object and a MovingObject. */
 collideObject(object) {

   let center_x = object.getCenterX();
   let center_y = object.getCenterY();

   if (center_x < this.getLeft() || center_x > this.getRight() ||
       center_y < this.getTop()  || center_y > this.getBottom()) return false;

   return true;

 }

};
Object.assign(Game.Door.prototype, Game.Object.prototype);
Game.Door.prototype.constructor = Game.Door;




Game.TileSet = function(columns, tile_size) {

  this.columns    = columns;
  this.tile_size  = tile_size;

  let f = Game.Frame;

  this.frames = [new f(115,  96, 13, 16, 0, -4), // idle-left
                 new f( 50,  96, 13, 16, 0, -4), // jump-left
                 new f(102,  96, 13, 16, 0, -4), new f(89, 96, 13, 16, 0, -4), new f(76, 96, 13, 16, 0, -4), new f(63, 96, 13, 16, 0, -4), // walk-left
                 new f(  0, 112, 13, 16, 0, -4), // idle-right
                 new f( 65, 112, 13, 16, 0, -4), // jump-right
                 new f( 13, 112, 13, 16, 0, -4), new f(26, 112, 13, 16, 0, -4), new f(39, 112, 13, 16, 0, -4), new f(52, 112, 13, 16, 0, -4) // walk-right
                ];

};
Game.TileSet.prototype = { constructor: Game.TileSet };
