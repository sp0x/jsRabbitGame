const AssetsManager = function() {
    this.tile_set_image = undefined;
};

AssetsManager.prototype = {

    constructor: Game.AssetsManager,

    /* Requests a file and hands the callback function the contents of that file
    parsed by JSON.parse. */
    requestJSON:function(url, callback) {
        fetch(url)
            .then(r=> r.json())
            .then(r=>{
                callback(r)
            })
            .catch()
    },

    /* Creates a new Image and sets its src attribute to the specified url. When
    the image loads, the callback function is called. */
    requestImage:function(url, callback) {

        let image = new Image();

        image.addEventListener("load", function(event) {

            callback(image);

        }, { once:true });

        image.src = url;

    },

};
