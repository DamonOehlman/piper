var sleeve = (function() {
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

    
    var exports = sleeve;
    exports.bridge = function(instance, transport) {
        return new Bridge(instance, transport);
    };
    
    return exports;
})();
