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
};

Bridge.prototype.pub = function(events) {
    var bridge = this;
    
    (events || ['*']).forEach(function(pattern) {
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
    
    return this;
};

Bridge.prototype.unsub = function() {
    this.transports.forEach(function(transport) {
        transport.unsub();
    });
    
    return this;
};


module.exports = function(eve) {
    return function(transports) {
        return new Bridge(eve, transports);
    };
};