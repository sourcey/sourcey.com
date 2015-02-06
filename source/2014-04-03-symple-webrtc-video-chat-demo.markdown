---
title: Symple WebRTC Video Chat Demo
date: 2014-04-03 01:41:32
tags: WebRTC, Symple, Video, Streaming, Demo
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

<div class="sidebar-section toc">
#### Contents
{:.no_toc}

* ToC
{:toc}
</div>

![Symple Logo](logos/symple-120x120.png "Symple Logo"){: .align-left} 
For those of you that don't know about Symple yet, it's a lightweight messaging and presence protocol for communication between our native and browser based apps. Most of our work with Symple until this point has been with WebRTC native to browser applications, so I thought it would be nice to create a demo which showcases just how easy it is to use Symple for building WebRTC video conferencing and real-time messaging applications.

Symple's client side libraries already implement most of what we need to build such an application; real-time messaging; user presence; WebRTC signalling; and HTML5 video embedding. If fact, due to the comprehensiveness of Symple, and the awesomeness of AngularJS, I was able to write the entire application in less than 100 of JavaScript.

Check out the live demo, and if you want to find what's happening under the hood then just keep on reading. If you're looking for the source, then you can find it on [Github](https://github.com/sourcey/symple-client-webrtc-demo). Enjoy!

<center>
<a href="http://symple.sourcey.com" class="action-button button success radius" target="_blank">launch the demo</a>
</center>

## Using the Demo

If you've used any sort of chat application before then this should be super easy for you! From the 'Login' panel just choose a handle/username to login. If you're testing then open another browser window and login again in order to have a conversation with yourself (I'm pretty sure it doesn't mean you're crazy).

A full list of users will be displayed on the left hand sidebar when you're logged in. 

![Symple WebRTC Video Chat Demo](/symple-webrtc-video-chat-demo/screenshot.png "Symple WebRTC Video Chat Demo")
### Video Chat

This guide assumes you have two browser windows open, and you have logged in with both. We refer to the client making the call as the 'caller', and the person receiving the call as the 'callee'.

Follow these steps to make a video call:

1. From the caller window, click open the 'Action' menu beside a handle in the sidebar and select 'Video chat'.
2. An 'Incoming call...' dialog will be displayed in the callee window. Go ahead and click 'Accept'.
3. Be sure to enable access the the video capture device in the caller window.
4. You should now be able to see your beautiful self in the caller window, and the callee should also be able to see the same video feed momentarily. 
5. When video is flowing from the caller to the callee, the callee can hot the 'Start video' button to start sending video to the caller. Again be sure to enable browser access to the video capture device (as above).
6. WebRTC FTW!

Note that if you are attempting to make a call to a remote endpoint, and both users are behind a NAT or firewall, then the call will probably fail. In production you would use a TURN relay server which would facilitate a relayed connection between both endpoints, but that is beyond the scope of this demo.
{: .panel .callout .radius}

### Instant Messaging

In order to broadcast messages to everyone who is online, just type something in the message from at the top of the 'Conversation' panel and hit 'Send'. If you want to send a direct message to a specific person, click the 'Action' menu beside their name and select 'Direct message'.

You should see the user handle appears to the lest of the send message form, this means you are now sending direct messages to that user, and only they will see your messages. In order to stop sending direct messages, click the '@' beside the send message form and select 'Send to everyone' from the menu to remove the user scope.

## Symple and WebRTC

[WebRTC](http://www.webrtc.org) is the new standard for p2p video on the web, and although the spec has not yet reached full maturity, WebRTC already has full support in Firefox, Chrome and Opera. Support for Internet Explorer and Safari is still a way off due to the never ending [h264 vs WebM debacle](http://gigaom.com/2013/10/30/google-sticks-with-vp8-opposes-ciscos-push-for-h-264), but many forward thinking online enterprises are already adopting it as part of their core business model.

WebRTC relies on the [ICE (Interactive Connectivity Establishment)](https://tools.ietf.org/html/rfc5245) protocol to determine the best method for endpoints to establish connectivity and data flow, but the actually signalling functionality is left to the client. This is where Symple comes in. Symple is not only a great way of signalling SDP metadata between clients, but is also handles cross-browser HTML5 `video` tag embedding which is necessary for WebRTC playback.

## Open Source Repositories

Symple and it's client/server implementations are open source, so feel free to grab them from Github and use them in your projects. For a full list of projects and the protocol specification see the Symple homepage: http://sourcey.com/symple 

I hope you enjoy the demo, and feel free to drop me a line if you have any questions.
