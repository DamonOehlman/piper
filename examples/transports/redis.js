var piper = require('../../');
var testpipe = piper('test');

// publish events via redis
var bridge = piper.bridge(require('../../transports/redis')({
  host: 'localhost',
  channel: 'redis-test-channel'
}));

// start the bridge publishing
bridge.pub();

// fire an event
testpipe('hit', 'car');
