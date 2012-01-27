var sleeve = (function() {
    //= github://DmitryBaranovskiy/eve/eve.js
    
    //= sleeve
    //= bridge
    
    var exports = sleeve;
    exports.bridge = function(instance, transport) {
        return new Bridge(instance, transport);
    };
    
    return exports;
})();