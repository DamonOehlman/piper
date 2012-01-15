============================
Sleeve - Eve events + extras
============================

Sleeve is a wrapper around the wonderful event library, `eve`__.  If it does anything cool, then it's all thanks to that library.  

__ https://github.com/DmitryBaranovskiy/eve

Why Use Sleeve?
===============

Sleeve won't be the choice for every situation where eve eventing is useful, and in many cases you should use eve directly.  There are three things that sleeve brings to the table over using eve directly.  These are explained briefly below but for more information, please consult the full `documentation`__ (especially regarding result checking).

__ http://sleeve.rtfd.org/

Event Namespacing
-----------------

The big difference with eve is that it provides an eventing system that is not bound to either DOM elements or objects.  This takes a little getting used to at first, and a good habit to get into is namespacing (TODO: include a link to an article on this) your events.

Sleeve requires you to namespace events by default, so you can use eve eventing without having to manually namespace your events.

`More Information <http://sleeve.readthedocs.org/en/latest/namespacing.html>`_

Function Chaining
-----------------

When registering event handlers in eve standard, the ``on`` function returns another function that allows you to tweak the order of the event handler in the list of registered handlers.  While this is definitely useful in some instances, Sleeve returns a sleeve reference that you can for function chaining.

`More Information <http://sleeve.readthedocs.org/en/latest/chaining.html>`_

Event Result Checking
---------------------

Eve does a wonderful job of returning results from event handlers when you call ``eve('eventname')`` to trigger an event.  Sleeve builds on this functionality to provide asynchronous event handling.

`More Information <http://sleeve.readthedocs.org/en/latest/result-checking.html>`_