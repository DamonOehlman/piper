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
                // serialize the args
                var evtName = bridge.eve.nt(),
                    msg = {
                        name: evtName,
                        args: arguments.length > 0 ? Array.prototype.slice.call(arguments) : undefined
                    };

                // send the message
                // serialize the message as json
                msg = JSON.stringify(msg);
                
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
    var bridge = this;
    
    // list for events on each of the transports
    this.transports.forEach(function(transport) {
        // TODO: wire up subscriptions
        transport.sub(function(json) {
            try {
                // deconstruct message
                var msg = JSON.parse(json);

                // fire the event
                bridge.eve.apply(bridge.eve, [msg.name, null].concat(msg.args ? msg.args : []));
            }
            catch (e) {
                // dodgy message, ignoring...
            }
        });
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