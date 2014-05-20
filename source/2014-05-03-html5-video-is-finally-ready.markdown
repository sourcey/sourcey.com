---
title: HTML5 Video is Finally Ready
date: 2014-05-03
tags: html5, video, streaming
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

# HTML5 Video is Finally Ready

Today I had a pleasant surprise when I was able to get a H.264/AVC encoded MP4 video to play on Chrome (*34.0.1847.131*), Firefox (*28.0*) and Safari (*5.1.7*) using the native HTML5 video element. I'm also told that Internet Explorer 11 works, and has apparently had partial support since [version 9](http://stackoverflow.com/questions/6944679/html5-mp4-video-does-not-play-in-ie9).

I also had some luck getting this to work with videos hosted Google Drive: [HTML5 Video Streaming from Google Drive](/html5-video-streaming-from-google-drive).

<!--
Anyway, thCross-browser HTML5 video is finally a go, keep on reading to find out how.
Safari plays the video when source is provided with the `video/mp4` mime type.

Here's the trick though, both Chrome and Firefox will play the **same file** if it's provided with a `video/webm` attribute. 
Yes, this is a hack and MP4 files shouldn't be served with `video/webm`, but the point is that it works.

-->

Here is the video:

<video controls="controls" style="margin-bottom:20px;width:590px">
    <source src="http://media.sourcey.com/big_buck_bunny.mp4" type='video/mp4'/>
</video>

<div class="panel callout radius">
Please note that MP4 doesn't work out-of-the box on Chrome or Firefox because of software patents, so you will need to have a thrid-party H.264 decoder installed. See <a href="https://developer.mozilla.org/en-US/docs/HTML/Supported_media_formats">this page</a> on MDN for more information.
</div>

And the source code in all its simplicity, as it should have been years ago:

~~~ html
<video controls="controls">
    <source src="http://media.sourcey.com/big_buck_bunny.mp4" type='video/mp4'/>
</video>
~~~

This is exactly what us developers wanted from HTML5 video since the beginning; a ubiquitous video format that works across all major browsers with no more having to store multiple encodings of each damn video just to cater for different browser vendors and their ridiculous licensing schemes.
Well, now we have it (mostly), and it seems that H.264 MP4 has won the race. 

Remember that Chrome and Firefox people still have to have a H.264 decoder installed on their system,
but they are mostly likely going to be tech people anyway who will already have it installed.
It would be interesting to see some statistics on this, but thats a job for another time or person.

Unfortunately the prevailing video codec (H.264) is about as patent encumbered as a NASA spaceship, which begs the next question; what's left for Theora and WebM? 
I'm a massive advocate for both Theora and WebM, mainly since I like to be able to encode videos without having to pay royalties to MPEG LA ... I know, crazy right?
At this stage though, these codec's "openness" may not be enough to shift the balance.

Drop a comment with your browser version and weather or not it works for you, or if have any other thoughts to add.