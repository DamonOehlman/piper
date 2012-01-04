var counter = 0,
    reLeadingUnderscore = /^_/,
    eve = require('./lib/eve');

function sleeve(ns) {
    var _sleeve;
    
    // generate a namespace if one was not defined
    ns = ns || ('sleeve' + (counter++));
    
    // create the sleeve function uber function
    _sleeve = function(name) {
        // emit the event and capture the results
        var results = eve.apply(eve, [ns + '.' + name].concat(Array.prototype.slice.call(arguments, 1)));
        
        // iterate through the results
        
    };
    
    // make the simple emit function
    _sleeve.emit = function(name) {
        return eve.apply(eve, [ns + '.' + name].concat(Array.prototype.slice.call(arguments, 1)));
    };

    // map other eve functions to sleeve
    // and allow us to map original functions to "private" implementations
    ['_on', '_once', 'unbind', 'listeners'].forEach(function(fnName) {
        // map eve functions to sleeve
        _sleeve[fnName] = function(name) {
            var targetFn = eve[fnName.replace(reLeadingUnderscore, '')];
            
            return targetFn.apply(eve, [ns + '.' + name].concat(Array.prototype.slice.call(arguments, 1)));
        };
    });

    // create chainable versions of on and once
    ['on', 'once'].forEach(function(fnName) {
        _sleeve[fnName] = function() {
            _sleeve['_' + fnName].apply(_sleeve, Array.prototype.slice.call(arguments));
            return _sleeve;
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