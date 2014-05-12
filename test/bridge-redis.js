var piper = require('../');
var eve = piper.eve;
var redis = require('redis');
var expect = require('chai').expect;
var testClient = redis.createClient();
var transport;
var bridge;

describe('publishing', function() {
  it('can create the transport', function() {
    transport = require('../transports/redis')({ channel: 'test' });
  });

  it('can create the bridge', function() {
    bridge = piper.bridge(transport).pub();
  });

  it('can send a message over the bridge', function(done) {
    testClient.on('message', function(channel, msg) {
      if (channel == 'test') {
        msg = JSON.parse(msg);
        expect(msg).to.include('hit.arm');

        testClient.unsubscribe('test');
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

  it('can create a new test client', function() {
    testClient.quit();
    testClient = redis.createClient();
  });

  it('can receive messages from redis', function(done) {
    eve.on('hit.arm', function() {
      done();
    });

    testClient.publish('test', 'hit.arm');
  });
});
