var expect = require('chai').expect,
    piper = require('./helpers/piper'),
    pipe = piper();
    
describe('events get raised through the on handler', function() {
    it('can raise an event with an object id', function(done) {
        pipe.once('hi', function(id) {
            expect(id).to.equal('test');
            done();
        });
        
        pipe('hi.#test');
    });
    
    it('will not include an id parameter for exact event handlers', function(done) {
        pipe.once('hi.#test', function(id) {
            expect(id).to.not.exist;
            done();
        });
        
        pipe('hi.#test');
    });
});