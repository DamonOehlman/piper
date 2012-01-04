var counter = 0,
    eve = require('./lib/eve');

function sleeve(ns) {
    var _sleeve;
    
    // generate a namespace if one was not defined
    ns = ns || ('sleeve' + (counter++));
    
    // create the sleeve function
    _sleeve = function(name) {
        eve.apply(eve, [ns + '.' + name].concat(Array.prototype.slice.call(arguments, 1)));
    };

    // map other eve functions to sleeve
    ['on', 'once', 'unbind', 'listeners'].forEach(function(fnName) {
        // map eve functions to sleeve
        _sleeve[fnName] = function(name) {
            eve[fnName].apply(eve, [ns + '.' + name].concat(Array.prototype.slice.call(arguments, 1)));
        };
    });
    
    // map a reference to eve to this sleeve
    _sleeve.eve = eve;
    _sleeve.ns = function() { return ns; };
    
    return _sleeve;
} // Sleeve

module.exports = function(ns) {
    return sleeve(ns);
};