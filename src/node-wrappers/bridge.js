//= ../bridge

module.exports = function(eve) {
    return function(transports) {
        return new Bridge(eve, transports);
    };
};