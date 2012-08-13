var expect = require('expect.js'),
    pipe = require('./helpers/piper')();
    
describe('events raised can be checked', function() {
    it('pipe has an check handler', function() {
        expect(pipe.check).to.be.ok();
    });
    
    it('check passes with no events', function(done) {
        pipe.check('boo').on('pass', done);
    });
    
    it('check passes with events that return no value', function(done) {
        pipe.on('hooray', function() {
        });
        
        pipe.check('hooray').on('pass', done);
    });
    
    it('check responds to falsy return values', function(done) {
        pipe.once('boo', function() {
            return false;
        });
        
        pipe.check('boo').on('fail', done);
    });
    
    it('check waits when handlers return a function', function(done) {
        pipe.once('hi', function() {
            return function(callback) {
                setTimeout(callback, 1000);
            };
        });
        
        var checker = pipe.check('hi');
        
        // delay adding the checker for 200ms
        setTimeout(function() {
            checker.on('pass', done);
        }, 200);
    });
});