var expect = require('chai').expect,
    piper = require('./helpers/piper'),
    pipe = piper();
    
describe('events get raised through the on handler', function() {
    it('can raise an event with an object id', function(done) {
        pipe.on('hi', function(id) {
            expect(id).to.equal('test');
            done();
        });
        
        pipe('hi.#test');
    });
});