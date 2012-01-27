var zmq = require('zmq');

module.exports = function(target) {
    var sock;
    
    function closeSocket() {
        if (sock) {
            sock.close();
            sock = null;
        }
    }
    
    return {
        pub: function() {
            closeSocket();
            
            // create a push socket
            sock = zmq.socket('push');
            
            // bind to the target
            sock.bindSync(target);
        },
        
        send: function(msg) {
            if (sock) {
                sock.send(msg);
            }
        },
        
        unpub: function() {
            closeSocket();
        },
        
        sub: function(handler) {
            closeSocket();
            
            // create a push socket
            sock = zmq.socket('pull');
            
            // bind to the target
            sock.connect(target);
            
            // route messages to the handler
            sock.on('message', function(buffer) {
                handler(buffer.toString());
            });
        },
        
        unsub: function() {
            closeSocket();
        }
    };
};