var assert = require('assert'),
    sleeve = require('../')();
    
describe('events get raised through the on handler', function() {
    it('sleeve has an on handler', function() {
        assert.ok(sleeve.on);
    });
    
    it('the sleeve has a namespace', function() {
        assert.ok(sleeve.ns());
    });

    it('can raise an event through on', function(done) {
        sleeve.on('hi', done);
        sleeve('hi');
    });
    
    it('can capture wildcard events as per eve', function(done) {
        sleeve.once('*', done);
        sleeve('bye');
    });
    
    it('raises events in eve on the namespace', function(done) {
        sleeve.eve.on(sleeve.ns() + '.*', done);
        sleeve('again');
    });
});