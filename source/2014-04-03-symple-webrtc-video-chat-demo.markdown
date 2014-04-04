---
title: Symple WebRTC Video Chat Demo
date: 2014-04-03 01:41:32
tags: programming, symple, video, webrtc
layout: blogs
---
# Symple WebRTC Video Chat Demo

For those of you that don't know about Symple yet, it's a lightweight messaging and presence protocol for communication between our native and browser based apps. Most of our work with Symple until this point has been with WebRTC native to browser applications, so I thought it would be nice to create a demo which showcases just how easy it is to use Symple for building instant messaging and WebRTC video conferencing applications.

Symple's client side libraries already have most of the functions required to build such an application, including real-time messaging, user presence, WebRTC signalling and HTML5 video embedding. If fact, due to the comprehensiveness of Symple, and the awesomeness of AngularJS, I was able to write the entire application in less than 100 of JavaScript.

So without further ado, check out the live demo, and by all means keep reading to find out more about what's happening under the hood. If you're into code geekery, the entire source code is available on Github. Enjoy!

View The Demo

## Using the Demo
For those of you who have used a chat application it should be pretty straight forward. Just choose a handle/username to login. for testing you can just open another browser window and login again to have a conversation with yourself (I'm pretty sure it doesn't mean you're crazy).

A full list of users will be displayed on the left hand sidebar when you have logged in. 

### Video Chat
Making a video call is dead easy. This guide assumes you have two browser windows open, and both are logged in. We refer to the client making the call as the 'caller', and the person receiving the call as the 'callee'.

Note that if you are attempting to make a call to a remote endpoint, and both users are behind a NAT or firewall, then the call will probably fail. In production you would use a TURN relay server which would facilitate a relayed connection between both endpoints, but that is beyond the scope of this demo.

<ol>
	<li>From the caller window, click open the 'Action' menu beside a handle in the sidebar and select 'Video chat'.</li>
	<li>An 'Incoming call...' dialog will be displayed in the callee window. Go ahead and click 'Accept'.</li>
	<li>Be sure to enable access the the video capture device in the caller window.</li>
	<li>You should now be able to see your beautiful self in the caller window, and the callee should also be able to see the same video feed momentarily. WebRTC FTW!</li>    
	<li>When video is flowing from the caller to the callee, the callee can hot the 'Start video' button to start sending video to the caller. Again be sure to enable browser access to the video capture device (as above).</li>    
</ol>

### Instant Messaging
In order to broadcast messages to everyone who is online, just type something in the message from at the top of the 'Conversation' panel and hit 'Send'. If you want to send a direct message to a specific person, click the 'Action' menu beside their name and select 'Direct message'.

You should see the user handle appears to the lest of the send message form, this means you are now sending direct messages to that user, and only they will see your messages. In order to stop sending direct messages, click the '@' beside the send message form and select 'Send to everyone' from the menu to remove the user scope.

## Symple and WebRTC
WebRTC[link] is the new standard for p2p video on the web, and although the spec has not yet reached full maturity, WebRTC already has full support in Firefox, Chrome and Opera. Support for Internet Explorer and Safari is still a ways off due to the h264 vs WebM debacle[link], but many forward thinking online enterprises are already adopting it as a core part of their business model.

WebRTC relies on the ICE[link] specification to determine the best method for endpoints to establish connectivity and data flow, but this functionality is left to the client, which is where Symple comes in. Symple is not only a great way of signalling SDP metadata between clients, but is also handles the tricky work of HTML5 video embedding[link] which is necessary for playback.

Symple also has C++ modules which enables WebRTC to be used in native applications, which also make it ideal for real-time remoting between desktop and browser applications, but that is another story for another day :)

I hope you like the demo, and don't hesitate to drop me a line if you have any questions.
