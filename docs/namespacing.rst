.. highlight:: javascript

=================
Event Namespacing
=================

One of the simplest, yet very useful things that Piper does is make it very simple to namespace your events.  By default, eve routes all events through a single point and thus if were to use common event names such as ``click.%objectid%``, ``drag.%objectid%``, etc then you will likely have libraries capturing each others events.  

This can easily be avoided by namespacing your events, which is quite simple in eve directly::

    // generate a click event for and an object
    eve('app.click.#' + object.id, button);

And you can then handle those easily also::

    // handle app.click events
    eve.on('app.click', function(button) {
        // find the object id by parsing the event name (eve.nt())
    });

Given how easy this is, it's probably not suprising that namespacing is Piper's primary reason for existence (what we really value is :ref:`result-checking`), but it does make it a little simpler::

    // create an eventing namespace (pipe)
    var pipe = piper('app');
    
    // generate a click event
    pipe('click.' + object.id, button);
    
    // handle click events
    pipe.on('click', function(target, button) {
        console.log('clicked object was: ' + target);
    });

Piper just makes things that little bit easier.  Oh, you want to know what the target argument is in the click handler in the piper example?  Sure thing. 

Object ID Detection
===================

Given Piper has been built to make working with eve a little simpler, it also tries to be helpful if it detects an id in the last part of your event.  We use the convention of a hash (``#``) denoting an id here, which is consistent with other libraries like jQuery.

So, if Piper detects an object id, it will extract it from the event name and pass that in as the first argument in the handler, with other arguments passed through from eve following after, e.g.::

    // simulate a click for test
    pipe('click.#test', 'Hello there');
    
    // handle clicks
    pipe('click', function(target, message) {
        // target can be different things depending on context (see below)
    });

Now, if you are using Piper from Node, then the value of the target parameter will be a string value containing the object id.  This is also true if you are using Piper in the browser and there is no element with the id of test (i.e. ``document.getElementById('test')`` returns nothing).  If you are running in the browser and an element with the id of test does exist, however, target will then be a reference to that DOM element just to make things a little easier.

One thing to note is that object id detection is not used in the case where the event handler is specific to the event raised, e.g.::

    // simulate a click for test
    pipe('click.#test', 'Hello there');

    // handle clicks
    pipe('click.#test', function(message) {
        // target can be different things depending on context (see below)
    });