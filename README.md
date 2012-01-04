# sleeve - eve events + extras

Sleeve is a wrapper around the wonderful event library, [eve](https://github.com/DmitryBaranovskiy/eve).  If it does anything cool, then it's all thanks to that library.

## Example Usage

Similar to eve, but namespaced:

```js
var sleeve = require('sleeve')('ns');

sleeve.on('*', function() {
	console.log('some event fired');
});

sleeve.on('load', function() {
	console.log('loaded');
});

sleeve('load');
```

_or with chaining and the familiar emit function_

```js
var sleeve = require('sleeve')('ns');

sleeve
	.on('*', function() {
		console.log('some event fired');
	})
	.on('load', function() {
		console.log('loaded');
	})
	.emit('load');
```

## Extra Goodness

- as mentioned above, sleeve events are namespaced so two sleeves won't capture each others events.

- sleeve makes the `on` and `once` functions chainable, if you need to work with the original eve functionality (setting handler "zIndex") then use the `_on` and `_once` functions.

- the magical sleeve check function (in development - see [the check test](https://github.com/DamonOehlman/sleeve/blob/master/test/check.js))

- sleeve has some tests which validate both sleeve and eve work as designed.

## TODO

- Make work on the clientside as well as node