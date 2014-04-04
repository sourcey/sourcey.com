---
title: LibSourcey Using Libuv Networking Layer
date: 2014-02-10 00:23:26
tags: c, libsourcey, libuv, node-js, programming
layout: blogs
---
# LibSourcey Using Libuv Networking Layer

Node.js does a brilliant job of enabling developers to quickly and easily deploy high performance server stacks in the cloud using good old JavaScript.

Most developers who use <a href="http://www.joyent.com/" title="High-performance Cloud Computing" target="_blank">Joyent's</a> <a href="http://nodejs.org/" title="NodeJS" target="_blank">Node.js</a>, also know about <a href="https://github.com/joyent/libuv" title="Cross-platform asychronous I/O">libuv</a>, the underlying cross platform asynchronous I/O library which powers Node.js's awesomeness.

Once we began developing mission critical server deployments, such as our <a href="https://tools.ietf.org/html/rfc5245" title="Interactive Connectivity Establishment" target="_blank">ICE </a>stack (TURN/STUN server), HTTP server and <a href="http://sourcey.com/symple" title="Messaging Made Symple" target="_blank">Symple</a> messaging, our old multi-thread code design just wouldn't cut it.

<a href="http://sourcey.com/libsourcey" title="C++ Networking Evolved" target="_blank">LibSourcey </a>started it's life using Poco C++ libraries to abstract cross platform details. Poco is very well designed architecture, and it's clean coding style make for a brilliant library, but it's clearly not meant for high-performance networking. This is evident in the use of a thread-per-connection model in the HTTP stack implementations. 

Another niggle was the overuse or private methods and members which makes Poco almost impossible to extend in many basic scenarios. Some things about Poco's open source libraries just didn't seem as open as they could be, which is why we turned to C++11 and libuv.

The first thing that's great about working with libuv is that synchronization is no longer such an issue. Since the event loop runs in a single thread, and it forced us to refactor the way classes and models interacted to facilitate single-thread synchronization. Rather than blocking the thread, now we just wait for a callback on the next event loop iteration. The result was an easy 80% decrease in the use of synchronization primitives, and overall better code design. Nice!

One important consideration with this evented IO model is that the packet must be handled, and event loop freed as soon as possible in order to maintain good performance. LibSourcey uses the PacketStream class to handle all heavy asynchronous data processing, such as video capture and media encoding and the like. The <a href="http://sourcey.com/libsourcey-packetstream-api/" title="LibSourcey PacketStream API" target="_blank">PacketStream </a>receives packets from any thread and passes them to arbitrary PacketProcessor implementations which process the data and synchronize output with the event loop - usually for broadcasting via the socket.

If you want to save your sanity then stop writing multi-thread code, you'll see! Stick to a thread-per-core model if you can, especially for networking - your code will be better, faster, and easier to debug. There's a lot more to talk about here, but that's a post for another day. Any questions, just drop me a line!
