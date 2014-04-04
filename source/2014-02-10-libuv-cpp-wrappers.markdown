---
title: Libuv C++ Wrappers
date: 2014-02-10 04:06:56
tags: programming
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---
# Libuv C++ Wrappers

LibSourcey uses libuv for it's networking layer, as well as for abstracting other cross platform capabilities such as shared library loading, filesystem, timers and various helper methods. For anyone looking for libuv C++ wrappers, LibSourcey is a great place to start. The Node.js project is also good, since it is really just one big libuv wrapper, but the code is quite complex compared to LibSourcey, and there is more interdependent code within the library which make it hard to find clean examples. 

For those interested the following modules contain usable examples of libuv wrappers for programmers:

<dl>
<dt>Handle</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/uv/include/scy/uv/uvpp.h">src/net/include/scy/uv/handle.h</a></dd>
<dt>Timer</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/base/include/scy/base/timer.h">src/net/include/base/net/timer.h</a></dd>
<dt>Thread</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/base/include/scy/base/thread.h">src/net/include/base/net/thread.h</a></dd>
<dt>Asynchronous Context</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/base/include/scy/base/async.h">src/net/include/base/net/async.h</a></dd>
<dt>Synchronization Context</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/base/include/scy/base/synccontext.h">src/net/include/base/net/synccontext.h</a></dd>
<dt>Idler</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/base/include/scy/base/idler.h">src/net/include/base/net/idler.h</a></dd>
<dt>Filesystem</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/base/include/scy/base/filesystem.h">src/net/include/base/net/filesystem.h</a></dd>
<dt>Shared Library (.so/.dll)</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/base/include/scy/base/sharedlibrary.h">src/net/include/base/net/sharedlibrary.h</a></dd>
<dt>Socket</dt>
<dd>
<a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/net/include/scy/net/socket.h">src/net/include/scy/net/socket.h</a>
<a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/net/include/scy/net/tcpsocket.h">src/net/include/scy/net/tcpsocket.h</a>
<a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/net/include/scy/net/sslsocket.h">src/net/include/scy/net/sslsocket.h</a>
<a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/net/include/scy/net/udpsocket.h">src/net/include/scy/net/udpsocket.h</a>
</dd>
<dt>DNS</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/net/include/scy/net/network.h">src/net/include/scy/net/network.h</a></dd>
<dt>HTTP</dt>
<dd>
<a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/http/include/scy/http/client.h">src/net/include/scy/http/client.h</a>
<a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/http/include/scy/http/server.h">src/net/include/scy/http/server.h</a>
</dd>
<dt>Socket IO</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/socketio/include/scy/socketio/client.h">src/net/include/scy/socketio/client.h</a></dd>
<dt>Symple</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/symple/include/scy/symple/client.h">src/net/include/scy/symple/client.h</a></dd>
<dt>STUN</dt>
<dd><a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/stun/include/scy/stun/message.h">src/net/include/scy/stun/message.h</a></dd>
<dt>TURN</dt>
<dd>
<a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/turn/include/scy/turn/client.h">src/net/include/scy/turn/client.h</a>
<a href="https://bitbucket.org/sourcey/libsourcey/src/master/src/turn/include/scy/turn/server.h">src/net/include/scy/turn/server.h</a>
</dd>
</dl>