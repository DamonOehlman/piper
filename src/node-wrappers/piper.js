var eve = require('./eve');

//= ../piper

exports = module.exports = function(ns) {
    return piper(ns);
};

exports.bridge = require('./bridge')(eve);
exports.eve = eve;

exports.createTransport = function(name) {
    return require('./transports/' + name).apply(null, Array.prototype.slice.call(arguments, 1));
};