var piper = require('../../'),
    eve = piper.eve,
    io = require('socket.io'),
    client = require('socket.io-client'),
    expect = require('chai').expect,
    publisher, subscriber, bridge;

describe('publishing', function() {
    it('can create the publisher', function(done) {
        publisher = piper.createTransport('socket.io', 4000);
        
        // wait for a second for the server to start
        setTimeout(done, 1000);
    });
    
    it('can create the bridge on the publisher', function() {
        bridge = piper.bridge(publisher).pub();
        
        expect(bridge.transports).to.include(publisher);
    });
    
    it('can send a message over the bridge', function(done) {
        var socket = client.connect('http://localhost:4000');

        socket.on('connecting', function(type) {
            console.log('attempting connection via: ' + type);
        });

        socket.on('connect', function() {
            socket.on('message', function(msg) {
                console.log(msg);
                done();
            });
            
            eve('hit.arm');
        });
    });
    
    it('can cancel publishing', function() {
        bridge.unpub();
    });
});