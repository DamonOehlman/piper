var piper = require('../../'),
    eve = piper.eve,
    redis = require('redis'),
    expect = require('chai').expect,
    redisTransport = piper.createTransport('redis', 'test'),
    testClient = redis.createClient(),
    bridge;

describe('publishing', function() {
    it('can create the bridge', function() {
        bridge = piper.bridge(redisTransport).pub();
    });
    
    it('can send a message over the bridge', function(done) {
        testClient.on('message', function(channel, msg) {
            if (channel == 'test') {
                msg = JSON.parse(msg);

                testClient.unsubscribe();
                done();
            }
        });
        
        testClient.subscribe('test');
        eve('hit.arm');
    });
    
    it('can cancel publishing', function() {
        bridge.unpub();
    });
    
    it('can subscribe to changes in redis', function() {
        bridge.sub();
    });
    
    it('can receive messages from redis', function(done) {
        eve.on('hit.arm', done);
        
        testClient.publish('test', '{ "name": "hit.arm" }');
    });
});