========
Bridging
========

Bridging is probably one of the most powerful features of Piper.  Given the way in which eve handles events (and thus Piper) it becomes possible to route events across different process boundaries using JSON serialization.  

At this stage, the following transports are available:

Redis
=====

Powered By: `redis <https://github.com/mranney/node_redis>`_

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

