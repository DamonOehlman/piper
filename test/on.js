var expect = require('chai').expect,
    piper = require('./helpers/piper'),
    pipe = piper();
    
describe('events get raised through the on handler', function() {
    it('pipe has an on handler', function() {
        expect(pipe.on).to.exist;
    });
    
    it('the pipe has a namespace', function() {
        expect(pipe.ns()).to.exist;
    });

    it('can raise an event through on', function(done) {
        pipe.on('hi', done);
        pipe('hi');
    });
    
    it('can capture wildcard events as per eve', function(done) {
        pipe.once('*', done);
        pipe('bye');
    });
    
    it('raises events in eve on the namespace', function(done) {
        piper.eve.on(pipe.ns() + '.*', done);
        pipe('again');
    });
});