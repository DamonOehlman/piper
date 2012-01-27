.. _bridging:

========
Bridging
========

Bridging is probably one of the most powerful features of Piper.  Given the way in which eve handles events (and thus Piper) it becomes possible to route events across different process boundaries using JSON serialization.  

At this stage, the following transports are available:

Redis
=====

Powered By: `redis <https://github.com/mranney/node_redis>`_

.. literalinclude:: ../examples/transports/redis.js
    :language: js

Now, if you were to run this example, while running the ``MONITOR`` command within the redis-cli you should see something like::

    redis 127.0.0.1:6379> monitor
    OK
    1327677978.544554 "monitor"
    1327678022.363266 "info"
    1327678022.364069 "publish" "eve-piper" "[\"test.hit\",\"car\"]"
    

**Transport Source and Test Suite:**

https://github.com/sidelab/piper/blob/master/src/transports/node/redis.js
https://github.com/sidelab/piper/blob/master/test/bridging/redis.js


Socket.IO
=========

*Incomplete*

Powered By: `socket.io <https://github.com/LearnBoost/socket.io>`_

**Transport Source and Test Suite:**

https://github.com/sidelab/piper/blob/master/src/transports/node/socket.io.js
https://github.com/sidelab/piper/blob/master/test/bridging/socket.io.js

Pure WebSockets
===============

Powered By: `ws <https://github.com/einaros/ws>`_

**Transport Source and Test Suite:**

https://github.com/sidelab/piper/blob/master/src/transports/node/ws.js
https://github.com/sidelab/piper/blob/master/test/bridging/ws.js


ZeroMQ (0MQ)
============

Powered by: `zmq <https://github.com/JustinTulloss/zeromq.node>`_

**Transport Source and Test Suite:**

https://github.com/sidelab/piper/blob/master/src/transports/node/zmq.js
https://github.com/sidelab/piper/blob/master/test/bridging/zmq.js

