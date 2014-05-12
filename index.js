/* jshint node: true */
'use strict';

var eve = require('eve');
var Bridge = require('./bridge');

var counter = 0;
var reLeadingUnderscore = /^_/;
var reEveDelimiter = /[\/\.]/;

/**
  # piper

  Piper is small module that provides automatic namespacing helpers when
  working with [eve](https://github.com/adobe-webplatform/eve).

  ## Example Usage

  <<< examples/simple-chained.js

  ## Example Usage: Bridge via Redis

  In addition to namespacing helpers, piper also provides some transport
  helpers for directing messages via a network transport (such as
  redis pubsub):

  <<< examples/transports/redis.js

  This example would display something similar to the following if you were
  using the `MONITOR` command in the redis-cli:

  ```
  1399858559.348511 [0 127.0.0.1:39324] "publish" "redis-test-channel" "[\"test.hit\",\"car\"]"
  ```
**/
var piper = module.exports = function(ns) {
  var _pipe;

  // generate a namespace if one was not defined
  ns = ns || ('evtpipe' + (counter++));

  _pipe = function(name) {
    return eve.apply(eve, [ns + '.' + name, null].concat(Array.prototype.slice.call(arguments, 1)));
  };

  // make the simple emit function, which maps to sleeve
  _pipe.emit = _pipe;

  // bind eve into the pipe also
  _pipe.eve = eve;

  // check
  _pipe.check = function() {
    var checkPipe = piper(), // create a new sleeve to handle result checking
        results = _pipe.apply(_pipe, Array.prototype.slice.call(arguments)) || [];

    // iterate through the results
    setTimeout(function() {
      var queuedChecks = results.filter(function(result) {
        return (typeof result == 'function') && (result.length > 0);
      }),
          fnChecks = results.filter(function(result) {
            return (typeof result == 'function') && (result.length === 0);
          }),
          passed = true;

      // iterate through the results and update the passed status
      results.forEach(function(result) {
        if (typeof result != 'undefined' && typeof result != 'function') {
          passed = passed && result;
        }
      });

      // execute the function tests
      fnChecks.forEach(function(check) {
        var result = check();
        if (typeof result != 'undefined' && typeof result != 'function') {
          passed = passed && result;
        }
      });

      // if we haven't passed, fail
      if (! passed) {
        checkPipe('fail');
      }
      // otherwise, if we have no queued checks, then pass
      else if (queuedChecks.length === 0) {
        checkPipe('pass');
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
                checkPipe('fail');
              }

              // decrement the checks remaining
              remainingChecks--;

              // if the remaining checks are at 0, then trigger pass if not failed
              if (remainingChecks <= 0 && (! failed)) {
                checkPipe('pass');
              }
            });
          });
        }
    }, 0);

    // retu
    return checkPipe;
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

piper.bridge = function(transports) {
  return new Bridge(eve, transports);
};
