var sleeve = require('../')('ns');

sleeve
	.on('*', function() {
	    console.log('run: ' + sleeve.nt());
	})
	.on('load', function(input) {
		console.log('loaded');
	})
	.emit(process.argv.slice(2));