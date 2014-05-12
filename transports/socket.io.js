module.exports = function(target) {
    var mode, sockets = [], 
        messageHandler;
    
    // if we have been passed a numeric value, then we are probably talking port so listen
    if (typeof target == 'number') {
        try {
            var manager = require('socket.io').listen(target);
            
            // listen for socket connections
            manager.sockets.on('connection', function(socket) {
                // on connection, add the socket to the list of sockets
                sockets.push(socket);

                // on disconnect 
                socket.on('disconnect', function() {
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
        catch (e) {
            throw new Error('No socket.io module available, cannot listen for websocket connections');
        }
    }
    // otherwise, it's probably a target url
    else {
        try {
            sockets = [require('socket.io-client').connect(target, {
                transports: ['websockets']
            })];
        }
        catch (e) {
            throw new Error('No socket.io-client module, cannot make socket.io client connections');
        }
    }

    return {
        send: function(msg) {
            console.log('sending: ' + msg);
            
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