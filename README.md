# sleeve - eve events + extras

Sleeve is a wrapper around the wonder event library, [eve](https://github.com/DmitryBaranovskiy/eve).  If it does anything cool, then it's all thanks to that library.

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