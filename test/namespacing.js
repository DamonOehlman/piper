var expect = require('chai').expect,
    one = require('./helpers/piper')('1'),
    two = require('./helpers/piper')('2');
    
describe('events raised in one namespace are not triggered in the other', function() {
    it('namespaced functions are valid and different', function() {
        expect(one.on).to.exist;
        expect(two.on).to.exist;
        expect(one).to.not.equal(two);
    });
    
    it('one should not capture events raised in two', function(done) {
        one.on('hi', function() {
            throw new Error('Should not have got this event');
        });

        // trigger done in 100 ms
        setTimeout(done, 100);
        two('hi');
    });
    
    it('two should not capture events raised by one', function(done) {
        two.on('ho', function() {
            throw new Error('Should not have got this event');
        });

        // trigger done in 100 ms
        setTimeout(done, 100);
        one('ho');
    });
});