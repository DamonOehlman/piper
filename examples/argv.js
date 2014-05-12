var piper = require('../');
var pipe = piper('ns');

pipe
.on('*', function() {
  console.log('run: ' + piper.eve.nt());
})
.on('load', function(input) {
  console.log('loaded');
})
.emit(process.argv.slice(2));
