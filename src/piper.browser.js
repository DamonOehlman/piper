(function(glob) {
    //= github://DmitryBaranovskiy/eve/eve.js
    
    //= piper
    //= bridge
    
    piper.bridge = function(instance, transport) {
        return new Bridge(instance, transport);
    };
    
    piper.eve = eve;
    
    (typeof module != "undefined" && module.exports) ? (module.exports = piper) :
        (typeof define != "undefined" ? (define('piper', [], function() { return piper; })) : (glob.piper = piper));
})(this);