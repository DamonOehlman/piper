(function(glob) {
    // ┌──────────────────────────────────────────────────────────────────────────────────────┐ \\
    // │ Eve 0.3.3 - JavaScript Events Library                                                │ \\
    // ├──────────────────────────────────────────────────────────────────────────────────────┤ \\
    // │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)          │ \\
    // │ Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license. │ \\
    // └──────────────────────────────────────────────────────────────────────────────────────┘ \\
    
    (function (glob) {
        var version = "0.3.3",
            has = "hasOwnProperty",
            separator = /[\.\/]/,
            wildcard = "*",
            fun = function () {},
            numsort = function (a, b) {
                return a - b;
            },
            current_event,
            stop,
            events = {n: {}},
        /*\
         * eve
         [ method ]
         **
         * Fires event with given `name`, given scope and other parameters.
         **
         > Arguments
         **
         - name (string) name of the event, dot (`.`) or slash (`/`) separated
         - scope (object) context for the event handlers
         - varargs (...) the rest of arguments will be sent to event handlers
         **
         = (object) array of returned values from the listeners
        \*/
            eve = function (name, scope) {
                var e = events,
                    oldstop = stop,
                    args = Array.prototype.slice.call(arguments, 2),
                    listeners = eve.listeners(name),
                    z = 0,
                    f = false,
                    l,
                    indexed = [],
                    queue = {},
                    out = [],
                    errors = [];
                current_event = name;
                stop = 0;
                for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
                    indexed.push(listeners[i].zIndex);
                    if (listeners[i].zIndex < 0) {
                        queue[listeners[i].zIndex] = listeners[i];
                    }
                }
                indexed.sort(numsort);
                while (indexed[z] < 0) {
                    l = queue[indexed[z++]];
                    out.push(l.apply(scope, args));
                    if (stop) {
                        stop = oldstop;
                        return out;
                    }
                }
                for (i = 0; i < ii; i++) {
                    l = listeners[i];
                    if ("zIndex" in l) {
                        if (l.zIndex == indexed[z]) {
                            out.push(l.apply(scope, args));
                            if (stop) {
                                stop = oldstop;
                                return out;
                            }
                            do {
                                z++;
                                l = queue[indexed[z]];
                                l && out.push(l.apply(scope, args));
                                if (stop) {
                                    stop = oldstop;
                                    return out;
                                }
                            } while (l)
                        } else {
                            queue[l.zIndex] = l;
                        }
                    } else {
                        out.push(l.apply(scope, args));
                        if (stop) {
                            stop = oldstop;
                            return out;
                        }
                    }
                }
                stop = oldstop;
                return out.length ? out : null;
            };
        /*\
         * eve.listeners
         [ method ]
         **
         * Internal method which gives you array of all event handlers that will be triggered by the given `name`.
         **
         > Arguments
         **
         - name (string) name of the event, dot (`.`) or slash (`/`) separated
         **
         = (array) array of event handlers
        \*/
        eve.listeners = function (name) {
            var names = name.split(separator),
                e = events,
                item,
                items,
                k,
                i,
                ii,
                j,
                jj,
                nes,
                es = [e],
                out = [];
            for (i = 0, ii = names.length; i < ii; i++) {
                nes = [];
                for (j = 0, jj = es.length; j < jj; j++) {
                    e = es[j].n;
                    items = [e[names[i]], e[wildcard]];
                    k = 2;
                    while (k--) {
                        item = items[k];
                        if (item) {
                            nes.push(item);
                            out = out.concat(item.f || []);
                        }
                    }
                }
                es = nes;
            }
            return out;
        };
        
        /*\
         * eve.on
         [ method ]
         **
         * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
         | eve.on("*.under.*", f);
         | eve("mouse.under.floor"); // triggers f
         * Use @eve to trigger the listener.
         **
         > Arguments
         **
         - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
         - f (function) event handler function
         **
         = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment. 
         > Example:
         | eve.on("mouse", eat)(2);
         | eve.on("mouse", scream);
         | eve.on("mouse", catch)(1);
         * This will ensure that `catch` function will be called before `eat`.
         * If you want to put your handler before non-indexed handlers, specify a negative value.
         * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
        \*/
        eve.on = function (name, f) {
            var names = name.split(separator),
                e = events;
            for (var i = 0, ii = names.length; i < ii; i++) {
                e = e.n;
                !e[names[i]] && (e[names[i]] = {n: {}});
                e = e[names[i]];
            }
            e.f = e.f || [];
            for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                return fun;
            }
            e.f.push(f);
            return function (zIndex) {
                if (+zIndex == +zIndex) {
                    f.zIndex = +zIndex;
                }
            };
        };
        /*\
         * eve.stop
         [ method ]
         **
         * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
        \*/
        eve.stop = function () {
            stop = 1;
        };
        /*\
         * eve.nt
         [ method ]
         **
         * Could be used inside event handler to figure out actual name of the event.
         **
         > Arguments
         **
         - subname (string) #optional subname of the event
         **
         = (string) name of the event, if `subname` is not specified
         * or
         = (boolean) `true`, if current event’s name contains `subname`
        \*/
        eve.nt = function (subname) {
            if (subname) {
                return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(current_event);
            }
            return current_event;
        };
        /*\
         * eve.unbind
         [ method ]
         **
         * Removes given function from the list of event listeners assigned to given name.
         **
         > Arguments
         **
         - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
         - f (function) event handler function
        \*/
        eve.unbind = function (name, f) {
            var names = name.split(separator),
                e,
                key,
                splice,
                i, ii, j, jj,
                cur = [events];
            for (i = 0, ii = names.length; i < ii; i++) {
                for (j = 0; j < cur.length; j += splice.length - 2) {
                    splice = [j, 1];
                    e = cur[j].n;
                    if (names[i] != wildcard) {
                        if (e[names[i]]) {
                            splice.push(e[names[i]]);
                        }
                    } else {
                        for (key in e) if (e[has](key)) {
                            splice.push(e[key]);
                        }
                    }
                    cur.splice.apply(cur, splice);
                }
            }
            for (i = 0, ii = cur.length; i < ii; i++) {
                e = cur[i];
                while (e.n) {
                    if (f) {
                        if (e.f) {
                            for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                                e.f.splice(j, 1);
                                break;
                            }
                            !e.f.length && delete e.f;
                        }
                        for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                            var funcs = e.n[key].f;
                            for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                                funcs.splice(j, 1);
                                break;
                            }
                            !funcs.length && delete e.n[key].f;
                        }
                    } else {
                        delete e.f;
                        for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                            delete e.n[key].f;
                        }
                    }
                    e = e.n;
                }
            }
        };
        /*\
         * eve.once
         [ method ]
         **
         * Binds given event handler with a given name to only run once then unbind itself.
         | eve.once("login", f);
         | eve("login"); // triggers f
         | eve("login"); // no listeners
         * Use @eve to trigger the listener.
         **
         > Arguments
         **
         - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
         - f (function) event handler function
         **
         = (function) same return function as @eve.on
        \*/
        eve.once = function (name, f) {
            var f2 = function () {
                var res = f.apply(this, arguments);
                eve.unbind(name, f2);
    
                return res;
            };
            return eve.on(name, f2);
        };
        /*\
         * eve.version
         [ property (string) ]
         **
         * Current version of the library.
        \*/
        eve.version = version;
        eve.toString = function () {
            return "You are running Eve " + version;
        };
        (typeof module != "undefined" && module.exports) ? (module.exports = eve) :
            (typeof define != "undefined" ? (define('eve', [], function() { return eve; })) : (glob.eve = eve));
    })(this);
    

    
    // create a shim for debug, simply ignores the messages at this stage.
    function debug() {};
    
    var counter = 0,
        reLeadingUnderscore = /^_/,
        reEveDelimiter = /[\/\.]/;
    
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
    } // Sleeve

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

    
    piper.bridge = function(transports) {
        return new Bridge(eve, transports);
    };
    
    piper.eve = eve;
    
    (typeof module != "undefined" && module.exports) ? (module.exports = piper) :
        (typeof define != "undefined" ? (define('piper', [], function() { return piper; })) : (glob.piper = piper));
})(this);
