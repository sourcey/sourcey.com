---
title: LibSourcey Event-driven Networking with Libuv
date: 2014-02-10 00:23:26
tags: Cpp, LibSourcey, Libuv, Performance
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

![LibSourcey Logo](logos/libsourcey-120x120.png "LibSourcey Logo"){: .align-left} 
<a href="http://sourcey.com/libsourcey" title="C++ Networking Evolved" target="_blank">LibSourcey</a> began it's life built on the brilliant [Poco C++ libraries](http://pocoproject.org/), but once we began developing mission critical server-side code like our <a href="https://tools.ietf.org/html/rfc5245" title="Interactive Connectivity Establishment" target="_blank">ICE </a>stack (TURN/STUN server), HTTP server and <a href="http://sourcey.com/symple" title="Messaging Made Symple" target="_blank">Symple</a> messaging, the old multi-thread design just wouldn't cut it.

Poco is a well designed and cleanly coded C++ library with cross-platform implementations for just about everything you would ever need to build most console applications, but it's not without it's niggles:

* Poco clearly isn't meant for high-performance networking, which is evident in the thread-per-connection model used in the HTTP stack. 
* Overuse or private methods and members which make it almost impossible to extend and override even the most basic functionality. 

Performance issues aside, some things about Poco just didn't seem as open or intuitive as they could be, which is why we turned to libuv and C++11.

Most developers know about <a href="http://nodejs.org/" title="NodeJS" target="_blank">Node.js</a>, which is a runtime that makes it a sinch to quickly and easily deploy high performance networking applications in the cloud using good ol' JavaScript. The underlying library which powers Node.js's cross-platform event-driven awesomeness is of course <a href="https://github.com/joyent/libuv" title="Cross-platform asychronous I/O">libuv</a>, and now it powers LibSourcey too.

The great thing about working with libuv is that it's event-based rather than thread-based, so rather than relying on threads for asynchronicity, the event loop is used instead. From a performance standpoint the thread-per-core model is ideal for evented IO, that is; one event loop, per thread, per CPU core. This is by no means a hard and fast rule, since the use of threads is still appropriate for long blocking tasks, although it's definitely something to aspire towards when writing your code.

Since the event loop runs in a single thread very little synchronization is required, other than to pass data between threads which is sometimes unavoidable (such as when using a load balancer). By refactoring the LibSourcey codebase to use an event-based architecture we were able to decrease the use of synchronization primitives by 90%.

<!--cross-platform asynchronous I/O 
One important consideration with this evented IO model is that the packet must be handled, and event loop freed as soon as possible in order to maintain good performance. LibSourcey uses the `PacketStream` class to handle all heavy asynchronous data processing, such as video capture and media encoding and the like. The <a href="http://sourcey.com/libsourcey-packetstream-api/" title="LibSourcey PacketStream API" target="_blank">PacketStream</a> receives packets from any thread and passes them to arbitrary PacketProcessor implementations which process the data and synchronise output with the event loop - usually for broadcasting via the socket. We were able to achieve, so stick to a thread-per-core model if you can
-->

Event-driven programming has helped us write better code and yield massive performance gains, especially for networking applications. If you want to save your sanity then stop writing multi-threaded code - your code will be better, faster, and easier to debug. There's a lot more to talk about here, but that's a song for another day.
