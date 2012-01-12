var assert = require('assert'),
    sleeve = require('../')();
    
describe('events raised can be checked', function() {
    it('sleeve has an check handler', function() {
        assert.ok(sleeve.check);
    });
    
    it('check passes with no events', function(done) {
        sleeve.check('boo').on('pass', done);
    });
    
    it('check passes with events that return no value', function(done) {
        sleeve.on('hooray', function() {
        });
        
        sleeve.check('hooray').on('pass', done);
    });
    
    it('check responds to falsy return values', function(done) {
        sleeve.once('boo', function() {
            return false;
        });
        
        sleeve.check('boo').on('fail', done);
    });
    
    it('check waits when handlers return a function', function(done) {
        sleeve.once('hi', function() {
            return function(callback) {
                setTimeout(callback, 1000);
            };
        });
        
        var checker = sleeve.check('hi');
        
        // delay adding the checker for 200ms
        setTimeout(function() {
            checker.on('pass', done);
        }, 200);
    });
});