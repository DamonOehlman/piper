var eve = require('./eve');

var counter = 0,
    reLeadingUnderscore = /^_/;

function piper(ns) {
    var _pipe;
    
    // generate a namespace if one was not defined
    ns = ns || ('evtpipe' + (counter++));
    
    _pipe = function(name) {
        return eve.apply(eve, [ns + '.' + name].concat(Array.prototype.slice.call(arguments, 1)));
    };
    
    // make the simple emit function, which maps to sleeve
    _pipe.emit = _pipe;
    
    // check
    _pipe.check = function() {
        var checkSleeve = piper(), // create a new sleeve to handle result checking
            results = _pipe.apply(_pipe, Array.prototype.slice.call(arguments)) || [];
            
        // iterate through the results
        setTimeout(function() {
            var queuedChecks = results.filter(function(result) {
                    return typeof result == 'function';
                }),
                passed = true;
                
            // console.log(results);
                
            // iterate through the results and update the passed status
            results.forEach(function(result) {
                if (typeof result != 'undefined' && typeof result != 'function') {
                    passed = passed && result;
                }
            });
            
            // if we haven't passed, fail
            // console.log(passed);
            if (! passed) {
                checkSleeve('fail');
            }
            // otherwise, if we have no queued checks, then pass
            else if (queuedChecks.length === 0) {
                checkSleeve('pass');
            }
            // otherwise, run the queued checks
            else {
                var remainingChecks = queuedChecks.length,
                    failed = false;
                
                // iterate through each of the queued checks, passing the callback in
                queuedChecks.forEach(function(check) {
                    check(function(err) {
                        if (err && (!failed)) {
                            failed = true;
                            checkSleeve('fail');
                        }
                        
                        // decrement the checks remaining
                        remainingChecks--;
                        
                        // if the remaining checks are at 0, then trigger pass if not failed
                        if (remainingChecks <= 0 && (! failed)) {
                            checkSleeve('pass');
                        }
                    });
                });
            }
        }, 0);
        
        // retu
        return checkSleeve;
    };

    // map other eve functions to sleeve
    // and allow us to map original functions to "private" implementations
    ['_on', '_once', 'unbind', 'listeners'].forEach(function(fnName) {
        // map eve functions to sleeve
        _pipe[fnName] = function(name) {
            var targetFn = eve[fnName.replace(reLeadingUnderscore, '')];
            
            return targetFn.apply(eve, [ns + '.' + name].concat(Array.prototype.slice.call(arguments, 1)));
        };
    });

    // create chainable versions of on and once
    ['on', 'once'].forEach(function(fnName) {
        _pipe[fnName] = function() {
            _pipe['_' + fnName].apply(_pipe, Array.prototype.slice.call(arguments));
            return _pipe;
        };
    });
    
    // map nt
    _pipe.nt = function() {
        return eve.nt().slice(ns.length + 1);
    };
    
    // map a reference to eve to this sleeve
    _pipe.ns = function() { return ns; };
    
    return _pipe;
} // Sleeve


exports = module.exports = function(ns) {
    return piper(ns);
};

exports.bridge = require('./bridge');
exports.eve = eve;