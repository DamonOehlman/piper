(function(glob) {
    //= github://DmitryBaranovskiy/eve/eve.js
    
    // create a shim for debug, simply ignores the messages at this stage.
    function debug() {};
    
    //= piper
    //= bridge
    
    piper.bridge = function(transports) {
        return new Bridge(eve, transports);
    };
    
    piper.eve = eve;
    
    (typeof module != "undefined" && module.exports) ? (module.exports = piper) :
        (typeof define != "undefined" ? (define('piper', [], function() { return piper; })) : (glob.piper = piper));
})(this);