# piper

Piper is small module that provides automatic namespacing helpers when
working with [eve](https://github.com/adobe-webplatform/eve).


[![NPM](https://nodei.co/npm/piper.png)](https://nodei.co/npm/piper/)

[![Build Status](https://img.shields.io/travis/DamonOehlman/piper.svg?branch=master)](https://travis-ci.org/DamonOehlman/piper)

## Example Usage

```js
var pipe = require('piper')('sample-ns');

pipe
.on('*', function() {
  console.log('event fired "' + pipe.nt() + '" which maps to eve event "' + pipe.eve.nt() + '"');
})
.on('load', function() {
  console.log('loaded');
})
.emit('load');

```

## Example Usage: Bridge via Redis

In addition to namespacing helpers, piper also provides some transport
helpers for directing messages via a network transport (such as
redis pubsub):

```js
var piper = require('piper');
var testpipe = piper('test');

// publish events via redis
var bridge = piper.bridge(require('piper/transports/redis')({
  host: 'localhost',
  channel: 'redis-test-channel'
}));

// start the bridge publishing
bridge.pub();

// fire an event
testpipe('hit', 'car');

```

This example would display something similar to the following if you were
using the `MONITOR` command in the redis-cli:

```
1399858559.348511 [0 127.0.0.1:39324] "publish" "redis-test-channel" "[\"test.hit\",\"car\"]"
```

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
