---
title: WebRTC Port Forwarding Pseudo TURN Proxy
date: 2014-02-13 04:00:41
tags: WebRTC, LibSourcey, ICE, TURN
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

![WebRTC](logos/webrtc-250x250.png "WebRTC"){: .align-left}
One of the tricky things about releasing native WebRTC applications build with the current spec is that it's just not designed for use behind corporate firewalls. When the current WebRTC implementation creates a socket, it binds port 0. This means it's up to the operating system to select a port, any port from 0 to 65535! Good like trying to convince any self respecting sysadmin, or security conscious customer for that matter, to expose every UDP port on their network! The same issue exists with RTMFP, which requires that all outbound UDP ports > 1023 be open, which is also an instant deal-breaker for many.

So how do we restrict WebRTC traffic to a specific socket? The best case scenario is to create an end-to-end peer connection on a single, pre determined UDP or TCP port, while adhering to the existing WebRTC methodology. Ideally we want to avoid TURN at all costs, since it's cumbersome and costly - a poor workaround to the internet video dilemma.

One of our current projects involves a native C++ WebRTC application which broadcasts video streams to a web browser client. In order to avoid enormous TURN costs we decided to implement the TURN protocol over the top of the native `PeerConnection`, and provide it to the client as a TURN server `turn://yourserverip` in the ICE media credentials.

By embedding a TURN server in the native application, the app now behaves just like a regular TURN server to the outside WebRTC client, the only difference is data is relayed locally instead of to and from a remote peer. Basically it's an embedded TURN proxy using <a href="http://sourcey.com/libsourcey" title="LibSourcey: C++ Networking Evolved">LibSourcey</a>.

Obviously this solution is not an option for browser only apps (unless via a plugin?), but it is a useful hack for native WebRTC apps looking for a way around the corporate firewall issue.