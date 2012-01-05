var sleeve = require('../')('ns');

sleeve
	.on('*', function() {
		console.log('some event fired');
	})
	.on('load', function() {
		console.log('loaded');
	})
	.emit('load');