var expect = require('expect.js'),
    piper = require('../'),
    pipe = piper();

describe('events get raised through the on handler', function() {
    it('pipe has an on handler', function() {
        expect(pipe.on).to.be.ok();
    });

    it('the pipe has a namespace', function() {
        expect(pipe.ns()).to.be.ok();
    });

    it('can raise an event through on', function(done) {
        pipe.once('hi', done);
        pipe('hi');
    });

    it('can capture wildcard events as per eve', function(done) {
        pipe.once('*', done);
        pipe('bye');
    });

    it('raises events in eve on the namespace', function(done) {
        piper.eve.once(pipe.ns() + '.*', done);
        pipe('again');
    });

    it('correctly maps event arguments', function(done) {
        pipe.once('hit', function(thing) {
            expect(thing).to.equal('car');
            done();
        });

        pipe('hit', 'car');
    });
});
