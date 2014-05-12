var pipe = require('..')();

pipe.on('*', function() {
  console.log('some event fired');
});

pipe.on('load', function() {
  console.log('loaded');
});

pipe('load');
