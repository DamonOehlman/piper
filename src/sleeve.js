var counter = 0,
    reLeadingUnderscore = /^_/;

function sleeve(ns) {
    var _sleeve;
    
    // generate a namespace if one was not defined
    ns = ns || ('sleeve' + (counter++));
    
    _sleeve = function(name) {
        return eve.apply(eve, [ns + '.' + name].concat(Array.prototype.slice.call(arguments, 1)));
    };
    
    // make the simple emit function, which maps to sleeve
    _sleeve.emit = _sleeve;
    
    // check
    _sleeve.check = function() {
        var checkSleeve = sleeve(), // create a new sleeve to handle result checking
            results = _sleeve.apply(_sleeve, Array.prototype.slice.call(arguments)) || [];
            
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
    
    // map nt
    _sleeve.nt = function() {
        return eve.nt().slice(ns.length + 1);
    };
    
    // map a reference to eve to this sleeve
    _sleeve.eve = eve;
    _sleeve.ns = function() { return ns; };
    
    return _sleeve;
} // Sleeve