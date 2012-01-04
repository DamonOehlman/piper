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
});