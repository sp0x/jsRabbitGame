// Frank Poth 03/09/2018

/* The keyDownUp handler was moved to the main file. */

const Controller = function(config) {

  this.left  = new Controller.ButtonInput();
  this.right = new Controller.ButtonInput();
  this.up    = new Controller.ButtonInput();

  this.keyDownUp = function(type, key_code) {

    var down = (type == "keydown") ? true : false;

    switch(key_code) {

      case config['left']: this.left.setInput(down);  break;
      case config['up']: this.up.setInput(down);    break;
      case config['right']: this.right.setInput(down);

    }

  };

};

Controller.prototype = {

  constructor : Controller

};

Controller.ButtonInput = function() {

  this.active = this.down = false;

};

Controller.ButtonInput.prototype = {

  constructor : Controller.ButtonInput,

  setInput : function(down) {

    if (this.down != down) this.active = down;
    this.down = down;

  }

};
