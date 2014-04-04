---
title: LibSourcey
date: 2014-01-29 00:45:47
tags: 
---
# LibSourcey

<div class="status">    
  <dl>
    <dt>Repository</dt>
    <dd>
      <a class="external" href="https://github.com/sourcey/libsourcey">https://github.com/sourcey/libsourcey</a>
      <!--<a class="external" href="https://bitbucket.org/sourcey/libsourcey">https://bitbucket.org/sourcey/libsourcey</a>-->
    </dd>     
    <dt>Licence</dt>
    <dd>
      LGPL, <a href="/licence">Sourcey Licence</a>
    </dd>     
    <dt>Required Dependencies</dt>
    <dd>
      C++11, libuv, cmake
    </dd>       
    <dt>Optional Dependencies</dt>
    <dd>
      OpenCV, RtAudio, FFmpeg, WebRTC, OpenSSL, JsonCpp
    </dd>
  </dl>           
</div>  
  
  
<img src="/images/libsourcey-logo-120.png" title="LibSourcey Logo" alt="LibSourcey Logo" class="logo alignleft" />  
 
LibSourcey is a collection of open source cross platform C++11 modules and classes which provide developers with a flexible, high performance arsenal for the rapid development of real-time communication and media streaming applications. 

Modern design principles and event-based asynchronous IO based on Node.js's underlying libuv library are utilised throughout LibSourcey in to minimise concurrency reliance and increase performance for mission critical server side applications.

LibSourcey currently contains native protocol implementations for TCP, SSL, UDP, HTTP, JSON, WebSockets, STUN, TURN, ICE, SDP, SDP, RTP, XML and XMPP.

<!--
has been completely ported to C++11, and 
LibSourcey was been used in private production by Sourcey since 2005, and was open sourced in 2013 under the LGPL licence to promote development in the field of web media for a new era of web applications. Since version 0.92, 
 LibSourcey in an open source library which includes components and modules for the primary purpose of facilitating communication between cross platform native and browser based web applications. 
-->
 

## Public Modules

The following modules are included in the public LibSourcey repository:
 
### Base 
**dependencies:** libuv
Re-usable utility classes and interfaces used throughout LibSourcey.

### Net
**dependencies:** libuv, OpenSSL
TCP, SSL and UDL socket implementation build on top of libuv architecture.

### HTTP
**dependencies:** libuv, JsonCpp
HTTP server and client stack including support for WebSockets, multipart streaming, and file transfers.        
    
### Media
**dependencies:** libuv, OpenCV, FFmpeg, RtAudio
Wrappers around FFmpeg and OpenCV for device capture, encoding, recording and streaming. The Media API makes extensive use of the PacketStream classes so that encoders, processors and packetisers can be dynamically added and removed from a media source.             

### STUN
<a href="http://tools.ietf.org/rfc/rfc5389">RFC 5389</a> implementation which includes support for ICE and TURN and TURN TCP messages. 

### TURN
**dependencies:** libuv
Server and client stack which supports both <a href="http://tools.ietf.org/rfc/rfc5766">RFC 5766 (Traversal Using Relays around NAT)</a> and <a href="http://tools.ietf.org/rfc/rfc6062">RFC 6062 (Traversal Using Relays around NAT Extensions for TCP Allocations)</a> specifications. 

### SDP
<a href="http://tools.ietf.org/rfc/rfc4566">RFC 4566</a> implementation which includes extra support for ICE headers. 
  
### SocketIO
**dependencies:** libuv, JsonCpp

SocketIO C++ client. Read more about <a href="http://socket.io">SocketIO</a>. 

### Symple
**dependencies:** libuv, JsonCpp
C++ implementation of Sourcey's home grown message protocol for the raid development of real time messaging and presence applications. <a href="/symple">More about Symple</a>. 

### Pacman
**dependencies:** libuv, JsonCpp
Pacman is an embeddable package manager which speaks JSON with the server. <a href="/pacman">More about Pacman</a>.    

### UVPP
**dependencies:** libuv
UVPP is a set of C++ wrappers for Joyent's fantastic libuv library. 

### JSON
**dependencies:** JsonCpp
Thin wrappers around the JsonCpp library. 
  
## Private Modules

The following closed source modules are available.
Please contact us if you are interested in using any of them in your projects.

### ICE
**dependencies:** libuv
The ICE module is a complete implementation of <a href="http://tools.ietf.org/html/rfc5245">RFC 5245</a> (Interactive Connectivity Establishment) based on LibSourcey architecture.
ICE is a protocol for Network Address Translator (NAT) Traversal for Offer/Answer protocols.
This module is currently not open source. Please contact us if you are interested in using it.

### RTP
**dependencies:** libuv
Our RTP module is quite basic. At this point it only supports RTP and RTCP packetisation. RTCP session management still needs to implemented.
If anyone happens to make a project of this we would be very happy to improve our RTP module. 

### XML
**dependencies:** pugixml
Very thin wrappers around the pugixml XML library to better support LibSourcey architecture.
    
### XMPP
**dependencies:** pugixml, libstrophe
Our XMPP module includes a client with full Jingle session support. 
This module has been neglected for a while now in favor of other projects. 
Any bugfixes and improvements are welcome.  

## External Modules

The following LibSourcey modules are available in external repositories. 

### Anionu
**dependencies:** libuv, OpevCV
The Anionu module includes a REST client interface for communicating with the Anionu public API.        

### ISpot
**dependencies:** JsonCpp
ISpot is a complete C++ SDK and API for building <a href="http://anionu.com/spot">Spot</a> based applications and plug-ins. 
Spot is a part of <a href="http://anionu.com/spot">Anionu's</a> surveillance serivice.

## Install SDK Libraries and Tools

<dl>
  <dt>Install Git</dt>
  <dd>
    <ul>
      <li><em>Windows users</em>: Install <a href="http://code.google.com/p/tortoisegit/" class="external">TortoiseGit</a>, a convenient git front-end, which integrates right into Windows Explorer. MinGW users can take msysgit from <a class="external" href="http://code.google.com/p/msysgit/downloads/list">http://code.google.com/p/msysgit/downloads/list</a>.</li>
      <li><em>Linux users</em>: Install command-line git utility using your package manager, e.g. `apt-get install git` on Ubuntu and Debian. You can use <a href="http://www.syntevo.com/smartgithg/index.html" class="external">SmartGit</a> as a GUI client. SmartGit is cross-platform, btw.</li>
      <li><em>Mac users</em>: If you installed Xcode (which you will need anyway), you already have git. You can use <a href="http://www.sourcetreeapp.com/" class="external">SourceTree</a> as a very good GUI client.</li>
    </ul>
  </dd>

  <dt>Install CMake</dt>
  <dd>
    
      CMake is the build system which enables the LibSourcey build system to support a wide range of platforms and compilers. CMake is also required to generate makefiles for OpenCV.
      You can get CMake here: <a class="external" href="http://www.cmake.org/cmake/resources/software.html">http://www.cmake.org/cmake/resources/software.html</a>
    
  </dd>

  <dt>Clone the LibSourcey repository</dt>
  <dd> 
    
      LibSourcey can be obtained from our BitBucket repository:
      `git clone https://bitbucket.org/sourcey/libsourcey.git`
     
    
      If you haven't got Git (for some strange reason), you can download the packages here: <a class="external" href="https://bitbucket.org/sourcey/libsourcey">https://bitbucket.org/sourcey/libsourcey</a>
    
  </dd>
</dl>