var ws = require('ws'),
    WebSocket = ws,
    WebSocketServer = ws.Server;

module.exports = function(target, opts) {
    var server, client,
        sockets = [],
        messageHandler;
    
    // if we have been passed a numeric value, then we are probably talking port so listen
    if (typeof target == 'number') {
        // initialise opts
        opts = opts || {};
        opts.port = target;
        
        // create the server
        server = new WebSocketServer(opts);
        
        server.on('connection', function(socket) {
            // on connection, add the socket to the list of sockets
            sockets.push(socket);

            // on disconnect 
            socket.on('close', function() {
                var index = sockets.indexOf(socket);
                if (index >= 0) {
                    sockets.splice(index, 1);
                }
            });

            // if a message handler has been assigned, then 
            if (messageHandler) {
                socket.on('message', messageHandler);
            }
        });
    }
    // otherwise, it's probably a target url
    else {
        sockets = [new WebSocket(target, opts)];
    }

    return {
        send: function(msg) {
            sockets.forEach(function(socket) {
                socket.send(msg);
            });
        },
        
        sub: function(handler) {
            messageHandler = handler;
            
            // bind the message handler to existing sockets
            sockets.forEach(function(socket) {
                socket.on('message', messageHandler);
            });
        },
        
        unsub: function() {
            // remove the message listeners
            sockets.forEach(function(socket) {
                socket.removeListener('message', messageHandler);
            });
            
            // reset the message handler to undefined
            messageHandler = undefined;
        }
    };
};