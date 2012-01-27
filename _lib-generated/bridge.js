function Bridge(eve, opts) {
    // save a reference to eve
    this.eve = eve;
    
    // create the bindings array
    this.bindings = {};

    // initialise default options
    opts = opts || {};

    // create the redis connection
    this.client = redis.createClient(
        opts.host,
        opts.port,
        opts
    );
    
    // create the redis connection
    this.channel = opts.channel || 'eve-redis';
}

Bridge.prototype.cancel = function() {
    // iterate through the binding and remove them
    for (var key in this.bindings) {
        this.eve.unbind(key, this.bindings[key]);
    }
    
    // reset the bindings
    this.bindings = {};
    
    return this;
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
                try {
                    bridge.client.publish(bridge.channel, JSON.stringify(msg));
                }
                catch (e) {
                    bridge.emit('error', new Error('Unable to route "' + evtName + '" event, could not serialize JSON'));
                }
            });
        }
    });
    
    return this;
};

Bridge.prototype.sub = function() {
    return this;
};


module.exports = function(eve, opts) {
    return new Bridge(eve, opts);
};