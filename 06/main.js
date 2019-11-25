// Frank Poth 04/06/2018

/* Changes:

  1. The update function now check on every frame for game.world.door. If a door
     is selected, the game engine stops and the door's level is loaded.
  2. When the game is first initialized at the bottom of this file, game.world is
     loaded using it's default values defined in its constructor.
  3. The AssetsManager class has been changed to load both images and json.

*/

window.addEventListener("load", function (event) {

    "use strict";

    //// CONSTANTS ////

    /* Each zone has a url that looks like: zoneXX.json, where XX is the current zone
    identifier. When loading zones, I use the game.world's zone identifier with these
    two constants to construct a url that points to the appropriate zone file. */
    /* I updated this after I made the video. I decided to move the zone files into
    the 06 folder because I won't be using these levels again in future parts. */
    const ZONES_PREFIX = "06/zone";
    const ZONE_SUFFIX = ".json";
    const fps = 30;
    const CONTROLS = {
        'left': 37,
        'up': 38,
        'right': 39
    };

    /////////////////
    //// CLASSES ////
    /////////////////


    ///////////////////
    //// FUNCTIONS ////
    ///////////////////
    const render = function () {
        let ts = game.world.tile_set;
        display.drawMap(assets_manager.tile_set_image,
            ts.columns, game.world.graphical_map, game.world.columns, ts.tile_size);
        let frame = undefined;

        for(let i=0; i<game.world.carrots.length; i++){
            let c = game.world.carrots[i];
            frame = ts.frames[c.frame_value];
            //console.log("Carrot f: ", frame.x, frame.y, frame.offset_y, frame.offset_x, frame.width, frame.height);
            display.drawObject(assets_manager.tile_set_image,
                frame.x, frame.y,
                c.x + Math.floor(c.width * 0.5 - frame.width * 0.5) + frame.offset_x,
                c.y + frame.offset_y, frame.width, frame.height);
        }

        frame = ts.frames[player1.frame_value];
        //console.log("Player loc: ", player1.x, player1.y);
        display.drawObject(assets_manager.tile_set_image,
            frame.x, frame.y,
            player1.x + Math.floor(player1.width * 0.5 - frame.width * 0.5) + frame.offset_x,
            player1.y + frame.offset_y, frame.width, frame.height);


        display.render();
    };
    let carrotElem = document.querySelector("#carrotCounter");

    const update = function () {
        game.update();
        carrotElem.innerHTML = "Carrots: " + player1.carrot_count;
        /* This if statement checks to see if a door has been selected by the player.
        If the player collides with a door, he selects it. The engine is then stopped
        and the assets_manager loads the door's level. */
        if (game.world.door) {
            engine.stop();
            /* Here I'm requesting the JSON file to use to populate the game.world object. */
            let zoneurl = ZONES_PREFIX + game.world.door.destination_zone + ZONE_SUFFIX;
            assets_manager.requestJSON(zoneurl, (zone) => {
                game.world.setup(zone);
                engine.start();
            });
        }
    };

    /////////////////
    //// OBJECTS ////
    /////////////////

    const assets_manager = new AssetsManager();
    const game = new Game();
    const player1 = new Player(32, 76,{
        controller: new Controller(CONTROLS)
    });
    game.addPlayer(player1);
    const engine = new Engine(1000 / fps, render, update);
    const display = new Display(document.querySelector("canvas"), {
        world: game.getWorld()
    });

    ////////////////////
    //// INITIALIZE ////
    ////////////////////
    const zoneurl = ZONES_PREFIX + game.world.zone_id + ZONE_SUFFIX;
    assets_manager.requestJSON(zoneurl, (zone) => {
        game.world.setup(zone);
        assets_manager.requestImage(zone.image, (image) => {
            assets_manager.tile_set_image = image;
            resize();
            engine.start();
        });

    });

    //On key up
    var keyDownUp = function (event) {
        player1.controller.keyDownUp(event.type, event.keyCode);
    };
    //On window resize
    var resize = function (event) {
        display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
        display.render();
    };
    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup", keyDownUp);
    window.addEventListener("resize", resize);
});
