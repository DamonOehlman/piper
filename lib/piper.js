var piper = require('../dist/commonjs/piper');

piper.createTransport = function(name) {
    return require('./transports/' + name).apply(null, Array.prototype.slice.call(arguments, 1));
};

module.exports = piper;