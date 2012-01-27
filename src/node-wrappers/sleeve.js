var eve = require('./eve');

//= ../sleeve

exports = module.exports = function(ns) {
    return sleeve(ns);
};

exports.bridge = require('./bridge');