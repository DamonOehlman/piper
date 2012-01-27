var eve = require('./eve');

//= ../piper

exports = module.exports = function(ns) {
    return piper(ns);
};

exports.bridge = require('./bridge');
exports.eve = eve;