var pipe = require('..')('sample-ns');

pipe
.on('*', function() {
  console.log('event fired "' + pipe.nt() + '" which maps to eve event "' + pipe.eve.nt() + '"');
})
.on('load', function() {
  console.log('loaded');
})
.emit('load');
