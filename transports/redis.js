var redis = require('redis');

module.exports = function(opts) {
  var host = (opts || {}).host || 'localhost';
  var port = (opts || {}).port || 6379;
  var channel = (opts || {}).channel || 'eve-piper';

  // create the redis connection
  var client = redis.createClient(port, host, opts);

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
