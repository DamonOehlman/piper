var piper = require('piper'),
    testpipe = piper('test');

// publish events via redis
piper.bridge(piper.createTransport('redis')).pub();

// fire an event
testpipe('hit', 'car');