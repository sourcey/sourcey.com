---
title: Recording Native WebRTC Streams with LibSourcey and FFmpeg
date: 2016-10-31
tags: Code, C++, WebRTC, LibSourcey, FFmpeg
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

The [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) lets us record WebRTC streams in the browser, but what about recording a live WebRTC stream in a native app or on the server side? [LibSourcey](/libsourcey) has a new WebRTC module available that lets you do exactly that.

Before going into details the full open source [demo code is here](https://github.com/sourcey/libsourcey/tree/master/src/webrtc/samples/webrtcrecorder).

## How it Works

Basically, the server operates as a standard WebRTC peer, so you connect to it from the browser (or another native app) as you would normally by initiating a `RTCPeerConnection`, and the server reads any media sent from the peer and encodes it in realtime using FFmpeg.

WebRTC signaling happens courtesy of [Symple](/symple), our propose built messaging protocol for scalable high speed native to browser communications.

For those of you familiar with the native WebRTC C++ codebase, what we are doing is overriding the `rtc::VideoSinkInterface<cricket::VideoFrame>` and `public webrtc::AudioTrackSinkInterface` in order to capture audio and video packets from the incoming `webrtc::MediaStream`. The `scy::av::MultiplexEncoder` then works with FFmpeg under the hood to encode and multiplex the live streams into the output file/stream.

The main WebRTC StreamRecorder class is [here](https://github.com/sourcey/libsourcey/blob/master/src/webrtc/samples/webrtcrecorder/streamrecorder.cpp).

## Using the Code

To get started compile LibSourcey with FFmpeg and WebRTC, and samples enabled. The `webrtcrecorder` binary will be compiled and you can test it with the provided client code (you will need Nodejs installed).

Please refer to the [README](https://github.com/sourcey/libsourcey/blob/master/src/webrtc/samples/webrtcrecorder/README.md) in the `webrtcrecorder` sample directory for more information.

If you find this code useful or end up using it in a real world scenario please share your thoughts and experience with others in the comments below.

All contributions to the codebase are welcome, and we hope to continue to improve our WebRTC integrations over time. Good luck and happy coding!
