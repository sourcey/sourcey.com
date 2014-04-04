---
title: WebRTC Native C++ to Browser Video Streaming Example
date: 2014-01-07 07:17:48
tags: c++, programming, webrtc
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---
# WebRTC Native C++ to Browser Video Streaming Example

There is a lot of information out there about browser to browser WebRTC streaming, but surprisingly there is not much coverage on how to stream video from a native application to the browser. Hopefully this post will be of some benefit to the multitudes out there who are looking to make use of this functionality!

We have repackaged the peerconnection_client and peerconnection_server projects from the WebRTC repository with a few modifications, and included a `native-to-browser-test.html` page which you can use to view the native video stream in your browser.

Follow the steps below to get the sample working:


1. Checkout and build the WebRTC repository
2. [Click here](2014-01-07-webrtc-native-to-browser-video-streaming-example/peerconnection.zip) to download our replacement peerconnection.zip
3. Extract peerconnection.zip into the `webrtc/trunk/talk/examples` folder, ensuring to rename and backup the existing `peerconnection` folder
4. Build WebRTC
5. Run the peerconnection_server and peerconnection_client executable located in `webrtc/trunk/build`
6. Fire up the `native-to-browser-test.html` page in Chrome
7. Select the "myclient" entry from the peerconnection_client window to begin broadcasting video to the browser page
8. If all went according to plan you should see your sexy self in the browser!


Note that this example only works in Chrome, as the DTLS SRTP signalling which is required by Firefox is not implemented. If you want to stream to both Chrome and Firefox then take a look at the Symple package which features a C++ test server that streams to the browser using a node.js server for signalling. The Anionu SDK also features a WebRTC plugin which implements cross-browser video streaming for the Anionu Spot client.

As always, if you found this information useful then share the love!