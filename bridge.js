/* jshint node: true */
'use strict';

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

module.exports = Bridge;

Bridge.prototype.addTransport = function(transport) {
  this.transports.push(transport);

  // if we are currently publishing and the new transport has a pub method
  if (Object.keys(this.bindings).length > 0 && typeof transport.pub == 'function') {
    // call it
    transport.pub();
  }
};

Bridge.prototype.pub = function() {
  var bridge = this;
  var events = [].slice.call(arguments);

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
  var bridge = this;
  var args;

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
