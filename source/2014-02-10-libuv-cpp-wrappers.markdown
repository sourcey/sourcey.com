---
title: Libuv C++ Wrappers
date: 2014-02-10 04:06:56
tags: programming
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---
# Libuv C++ Wrappers

LibSourcey uses libuv for it's networking layer as well as for abstracting cross platform capabilities such as shared library loading, filesystem, timers and other various helper methods. For anyone looking for libuv C++ wrappers, LibSourcey is a great place to start. The Node.js project is also good since it is really just one big libuv wrapper, but the code is quite complex compared to LibSourcey, and there is more interdependent code within the library which make it hard to find clean examples. 

The following modules contain usable examples of libuv wrappers:


Handle
: [src/net/include/scy/uv/handle.h](https://github.com/sourcey/libsourcey/tree/master/src/uv/include/scy/uv/uvpp.h)

Timer
: [src/net/include/base/net/timer.h](https://github.com/sourcey/libsourcey/tree/master/src/base/include/scy/base/timer.h)

Thread
: [src/net/include/base/net/thread.h](https://github.com/sourcey/libsourcey/tree/master/src/base/include/scy/base/thread.h)

Asynchronous Context
: [src/net/include/base/net/async.h](https://github.com/sourcey/libsourcey/tree/master/src/base/include/scy/base/async.h)

Synchronization Context
: [src/net/include/base/net/synccontext.h](https://github.com/sourcey/libsourcey/tree/master/src/base/include/scy/base/synccontext.h)

Idler
: [src/net/include/base/net/idler.h](https://github.com/sourcey/libsourcey/tree/master/src/base/include/scy/base/idler.h)

Filesystem
: [src/net/include/base/net/filesystem.h](https://github.com/sourcey/libsourcey/tree/master/src/base/include/scy/base/filesystem.h)

Shared Library (.so/.dll)
: [src/net/include/base/net/sharedlibrary.h](https://github.com/sourcey/libsourcey/tree/master/src/base/include/scy/base/sharedlibrary.h)

Socket
: [src/net/include/scy/net/socket.h](https://github.com/sourcey/libsourcey/tree/master/src/net/include/scy/net/socket.h)  
[src/net/include/scy/net/tcpsocket.h](https://github.com/sourcey/libsourcey/tree/master/src/net/include/scy/net/tcpsocket.h)  
[src/net/include/scy/net/sslsocket.h](https://github.com/sourcey/libsourcey/tree/master/src/net/include/scy/net/sslsocket.h)  
[src/net/include/scy/net/udpsocket.h](https://github.com/sourcey/libsourcey/tree/master/src/net/include/scy/net/udpsocket.h)  

DNS
: [src/net/include/scy/net/network.h](https://github.com/sourcey/libsourcey/tree/master/src/net/include/scy/net/network.h)

HTTP
: [src/net/include/scy/http/client.h](https://github.com/sourcey/libsourcey/tree/master/src/http/include/scy/http/client.h)  
[src/net/include/scy/http/server.h](https://github.com/sourcey/libsourcey/tree/master/src/http/include/scy/http/server.h)

Socket IO
: [src/net/include/scy/socketio/client.h](https://github.com/sourcey/libsourcey/tree/master/src/socketio/include/scy/socketio/client.h)

Symple
: [src/net/include/scy/symple/client.h](https://github.com/sourcey/libsourcey/tree/master/src/symple/include/scy/symple/client.h)

STUN
: [src/net/include/scy/stun/message.h](https://github.com/sourcey/libsourcey/tree/master/src/stun/include/scy/stun/message.h)

TURN
: [src/net/include/scy/turn/client.h](https://github.com/sourcey/libsourcey/tree/master/src/turn/include/scy/turn/client.h)  
[src/net/include/scy/turn/server.h](https://github.com/sourcey/libsourcey/tree/master/src/turn/include/scy/turn/server.h)