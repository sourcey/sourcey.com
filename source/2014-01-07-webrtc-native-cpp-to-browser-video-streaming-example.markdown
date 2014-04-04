---
title: WebRTC Native C++ to Browser Video Streaming Example
date: 2014-01-07 07:17:48
tags: c, programming, webrtc
layout: blogs
---
# WebRTC Native C++ to Browser Video Streaming Example

There is a lot of information out there about browser to browser WebRTC streaming, but surprisingly there is not much coverage on how to stream video from a native application to the browser. Hopefully this post will be of some benefit to the multitudes out there who are looking to make use of this functionality!

We have repackaged the peerconnection_client and peerconnection_server projects from the WebRTC repository with a few modifications, and included a `native-to-browser-test.html` page which you can use to view the native video stream in your browser.

Follow the steps below to get the sample working:

<ol>
<li>Checkout and build the WebRTC repository</li>
<li><a href="/wp-content/uploads/2014/01/peerconnection.zip">Click here</a> to download our replacement peerconnection.zip</li>
<li>Extract peerconnection.zip into the `webrtc/trunk/talk/examples` folder, ensuring to rename and backup the existing `peerconnection` folder</li>
<li>Build WebRTC</li>
<li>Run the peerconnection_server and peerconnection_client executable located in `webrtc/trunk/build`</li>
<li>Fire up the `native-to-browser-test.html` page in Chrome</li>
<li>Select the "myclient" entry from the peerconnection_client window to begin broadcasting video to the browser page</li>
<li>If all went according to plan you should see your sexy self in the browser!</li>
</ol>

Note that this example only works in Chrome, as the DTLS SRTP signalling which is required by Firefox is not implemented. If you want to stream to both Chrome and Firefox then take a look at the Symple package which features a C++ test server that streams to the browser using a node.js server for signalling. The Anionu SDK also features a WebRTC plugin which implements cross-browser video streaming for the Anionu Spot client.

As always, if you found this information useful then share the love!