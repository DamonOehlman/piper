var redis = require('redis');

module.exports = function(channel, host, port, opts) {
    // create the redis connection
    var client = redis.createClient(host, port, opts);
    
    // ensure the channel has been specified
    channel = channel || 'eve-piper';

    return {
        send: function(msg) {
            client.publish(channel, msg);
        },
        
        sub: function(handler) {
            if (handler) {
                client.subscribe(channel);
                client.on('message', function(msgChannel, message) {
                    if (msgChannel === channel) {
                        handler(message);
                    }
                });
            }
        },
        
        unsub: function() {
            client.unsubscribe(channel);
        }
    };
};