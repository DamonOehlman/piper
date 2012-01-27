var piper = require('../../'),
    eve = piper.eve,
    zmq = require('zmq'),
    expect = require('chai').expect,
    socketTarget = 'tcp://127.0.0.1:5555',
    transport, bridge;

describe('publishing', function() {
    it('can create the transport', function() {
        transport = piper.createTransport('zmq', socketTarget);
    });
    
    it('can create the bridge on the transport', function() {
        bridge = piper.bridge(transport);
        
        expect(bridge.transports).to.include(transport);
    });
    
    it('can start publishing', function() {
        bridge.pub();
    });
    
    it('can send a message over the bridge', function(done) {
        var sock = zmq.socket('pull');
        
        sock.connect(socketTarget);
        sock.on('message', function(buffer) {
            var msg = JSON.parse(buffer.toString());
            
            expect(msg).to.include('hit.arm');
            
            sock.close();
            done();
        });

            
        eve('hit.arm');
    });
    
    it('can cancel publishing', function() {
        bridge.unpub();
    });
    
    it('can create a subscription', function() {
        bridge.sub();
    });

    it('can capture messages', function(done) {
        var sock = zmq.socket('push');
        sock.bindSync(socketTarget);
        
        eve.once('hit.arm', function() {
            done();
        });
        
        sock.send('hit.arm');
    });
    
    it('can cancel subscriptions', function() {
        bridge.unsub();
    });
});