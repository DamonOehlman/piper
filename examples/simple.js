var sleeve = require('../')();

sleeve.on('*', function() {
	console.log('some event fired');
});

sleeve.on('load', function() {
	console.log('loaded');
});

sleeve('load');