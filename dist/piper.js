
// req: eve

var counter = 0,
    reLeadingUnderscore = /^_/,
    reEveDelimiter = /[\/\.]/;

function piper(ns) {
    var _pipe;
    
    // generate a namespace if one was not defined
    ns = ns || ('evtpipe' + (counter++));
    
    _pipe = function(name) {
        return eve.apply(eve, [ns + '.' + name, null].concat(Array.prototype.slice.call(arguments, 1)));
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
                
            // iterate through the results and update the passed status
            results.forEach(function(result) {
                if (typeof result != 'undefined' && typeof result != 'function') {
                    passed = passed && result;
                }
            });
            
            // if we haven't passed, fail
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
        _pipe[fnName] = function(name, handler) {
            // handle the event
            eve[fnName].call(eve, ns + '.' + name, function() {
                // grab the event name
                var evtName = eve.nt(),
                    args = Array.prototype.slice.call(arguments),
                    nameParts, targetObject;
                    
                // if this handler is not for this specific object id
                if (evtName !== ns + '.' + name) {
                    nameParts = evtName.split(reEveDelimiter);
                    targetObject = nameParts[nameParts.length - 1];
                    
                    // if this is an object specific event, then map it to the object
                    if (nameParts.length > 1 && targetObject[0] === '#') {
                        // remove the leading #
                        targetObject = targetObject.slice(1);

                        // if we are in a browser and have a getElementById method, let's take a look for it
                        if (typeof document != 'undefined' && typeof document.getElementById == 'function') {
                            // find the element, but default back to the id if not found
                            targetObject = document.getElementById(targetObject) || targetObject;
                        }

                        // prepend the object to the args
                        args.unshift(targetObject);
                    }
                }
                
                // call the handler
                return handler.apply(this, args);
            });
            
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
}

// patch in eve
piper.eve = eve;

var reSeparator = /[\s\,\|]/;

function Bridge(eveInstance, transports) {
    // save a reference to eve
    this.eve = eveInstance;
    
    // create the bindings array
    this.bindings = {};
    
    // if transports is defined, but not an array, then wrap in one
    if (typeof transports != 'undefined' && !Array.isArray(transports)) {
        transports = [transports];
    }
    
    // add the initial transports
    this.transports = transports || [];
}

Bridge.prototype.addTransport = function(transport) {
    this.transports.push(transport);

    // if we are currently publishing and the new transport has a pub method
    if (Object.keys(this.bindings).length > 0 && typeof transport.pub == 'function') {
        // call it
        transport.pub();
    }
};

Bridge.prototype.pub = function() {
    var bridge = this,
        events = Array.prototype.slice.call(arguments);
        
    // if no events were specified, publish all
    if (events.length === 0) {
        events.push('*');
    }
    
    events.forEach(function(pattern) {
        if (! bridge.bindings[pattern]) {
            bridge.eve.on(pattern, bridge.bindings[pattern] = function() {
                var args, msg;
                
                // if the last argument is the bridge, then return as we have generated it
                // from a subscription
                if (arguments[arguments.length - 1] === bridge) return;
                
                // serialize the args
                args = [bridge.eve.nt()].concat(Array.prototype.slice.call(arguments));
                msg = JSON.stringify(args);

                // iterate through the transports and send the message
                bridge.transports.forEach(function(transport) {
                    transport.send(msg);
                });
            });
        }
    });
    
    // iterate through the transports and call any that have a pub function
    this.transports.forEach(function(transport) {
        if (typeof transport.pub == 'function') {
            transport.pub();
        }
    });
    
    return this;
};

Bridge.prototype.sub = function() {
    var bridge = this,
        args;
        
    function forwardMessage(msg) {
        if (msg) {
            try {
                // deconstruct message and insert a fake eve scope param
                args = JSON.parse(msg);
            }
            catch (e) {
                // not a JSON parseable message, let's trying splitting the string on valid separators
                args = msg.split(reSeparator);
                
                // TODO: should probably parse int things that look ok etc
            }
            
            if (args && args.length > 0) {
                // insert the fake scope parameter
                args.splice(1, 0, null);

                // add a reference to the bridge as the last argument
                // this way we can make sure we don't create an echo chamber
                args.push(bridge);
                
                // fire the event
                bridge.eve.apply(bridge.eve, args);
            }
        }
    }
    
    // list for events on each of the transports
    this.transports.forEach(function(transport) {
        // TODO: wire up subscriptions
        transport.sub(forwardMessage);
    });
    
    return this;
};

Bridge.prototype.unpub = function() {
    // iterate through the binding and remove them
    for (var key in this.bindings) {
        this.eve.unbind(key, this.bindings[key]);
    }
    
    // reset the bindings
    this.bindings = {};
    
    // if the transports have an unpub function, then call it
    this.transports.forEach(function(transport) {
        if (typeof transport.unpub == 'function') {
            transport.unpub();
        }
    });
    
    return this;
};

Bridge.prototype.unsub = function() {
    this.transports.forEach(function(transport) {
        transport.unsub();
    });
    
    return this;
};

piper.bridge = function(transports) {
    return new Bridge(eve, transports);
};