.. highlight:: js

.. _bridging:

========
Bridging
========

Bridging is probably one of the most powerful features of Piper.  Given the way in which eve handles events (and thus Piper) it becomes possible to route events across different process boundaries using JSON serialization.

Creating a bridge is really simple::
    
    // create the transport
    var transport = piper.createTransport('transport-name', args*);
    
    // create the bridge
    var bridge = piper.bridge(transport);
    
Publishing Events
=================

If you are creating a server of some kind, then you may want to publish your events via one of the available transports.  If you have created your bridge as outlined above this can be achieved very simply::
    
    // now publish events via the selected transport
    bridge.pub();
    
Selective Publishing
--------------------

If you are asking, *"What if I don't want to publish all my events?"* then I'm with you there.  The ``pub()`` function can take arguments that specify the eve event patterns that you wish to publish.  If no arguments are supplied, then ``*`` events are published.

It's also worth noting two things here:

1. When using eve, the wildcard in a pattern is optional.  For instance the pattern ``server.*`` and ``server`` are equivalent.

2. The ``pub`` function works on the raw event names and doesn't take into account the Piper namespaces.  So if you have created a pipe with the namespace of tests, and want to publish all those events, you should call ``bridge.pub('test')``.

Here's an example::

    // just publish server, player and test events
    bridge.pub('server.*', 'player', 'test');
    
Unpublishing
------------

To cancel the publication of events, you simply call the ``unpub()`` function on the bridge::

    // cancel publishing
    bridge.unpub();

Subscribing to Remote Events
============================

Subscribing to events is just as simple::

    // subscribe to events on the current bridge
    bridge.sub();
    
Once you have created a subscription, events will be routed passed through even in the usual way once the bridge captures events coming through the subscription.  

At the moment, there is not ability to selectively subscribe to certain events.  Remotely routed events can be detected, however, as the bridge is added as a final argument in the event handler.