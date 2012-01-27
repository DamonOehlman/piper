var piper = require('../'),
    pipe = piper('ns');

pipe
    .on('*', function() {
        console.log('some event fired');
    })
    .on('load', function() {
        console.log('loaded');
    })
    .emit('load');