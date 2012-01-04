var counter = 0,
    reLeadingUnderscore = /^_/,
    eve = require('./lib/eve');

function sleeve(ns) {
    var _sleeve;
    
    // generate a namespace if one was not defined
    ns = ns || ('sleeve' + (counter++));
    
    _sleeve = function(name) {
        return eve.apply(eve, [ns + '.' + name].concat(Array.prototype.slice.call(arguments, 1)));
    };
    
    // make the simple emit function
    _sleeve.check = function() {
        var checkSleeve = sleeve(), // create a new sleeve to handle result checking
            results = _sleeve.apply(_sleeve, Array.prototype.slice.call(arguments)) || [];
            
        // iterate through the results
        setTimeout(function() {
            var queuedChecks = results.filter(function(result) {
                    return typeof result == 'function';
                }),
                passed = true;
                
            console.log(results);
                
            // iterate through the results and update the passed status
            results.forEach(function(result) {
                if (typeof result != 'undefined' && typeof result != 'function') {
                    passed = passed && result;
                }
            });
            
            // if we haven't passed, fail
            console.log(passed);
            if (! passed) {
                checkSleeve('fail');
            }
            // otherwise, if we have no queued checks, then wait
            else if (queuedChecks.length === 0) {
                checkSleeve('pass');
            }
            // otherwise, run the queued checks
            else {
                
            }
        }, 0);
        
        // retu
        return checkSleeve;
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