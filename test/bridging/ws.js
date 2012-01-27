var piper = require('../../'),
    eve = piper.eve,
    ws = require('ws'),
    WebSocket = ws,
    WebSocketServer = ws.Server,
    expect = require('chai').expect,
    publisher, subscriber, bridge;

describe('publishing', function() {
    it('can create the publisher', function(done) {
        publisher = piper.createTransport('ws', 4000);
        
        // wait for a second for the server to start
        process.nextTick(done);
    });
    
    it('can create the bridge on the publisher', function() {
        bridge = piper.bridge(publisher).pub();
        
        expect(bridge.transports).to.include(publisher);
    });
    
    it('can send a message over the bridge', function(done) {
        var socket = new WebSocket('ws://localhost:4000');

        socket.on('open', function() {
            socket.on('message', function(msg) {
                expect(msg).to.include('hit.arm');
                done();
            });
            
            eve('hit.arm');
        });
    });
    
    it('can cancel publishing', function() {
        bridge.unpub();
    });
});