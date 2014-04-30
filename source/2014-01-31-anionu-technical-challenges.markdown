---
title: Anionu Technical Challenges
date: 2014-01-31 00:24:36
tags: css3, html5, programming, symple, web-development
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---
# Anionu Technical Challenges
The purpose of this post is to share, and sometimes rant, about the technical challenges that we faced and overcame while developing Anionu.

## State of the Industry    
During our early research phase we worked some of the top, and most widely used surveillance systems available on the market; DVRs; CCTV networks; IP cameras; and some early cloud-based providers. We tested all these systems against the core values used to design Anionu: 

<ul>  
<li>Ease of use</li>
<li>Architectural security</li>
<li>Data security</li>
<li>Flexible deployment</li>
<li>Accessibility (especially remote)</li>
<li>Scalability</li>
<li>Extensibility</li>
<li>Hardware compatibility</li>
</ul> 

None of the systems we evaluated really came close, and certainly none of them had that indefinable quality that makes a software or a system brilliant. Some of the more consistent sticking points we found were:     

<ul>  
<li>Cameras that are only work with specific hardware or software</li>
<li>Hefty installation costs and ongoing support</li>
<li>Binding contracts</li>
<li>Interfaces which may well have been designed by early man on a cave wall</li>
<li>Bulky hardware</li>
<li>Restrictive architecture</li>
</ul> 
 
These initial findings were very exciting. The surveillance industry was stagnant, and the market was primed for Anionu to come along and disrupt the status quo.   

## War of the Browsers     

Let's start by saying that the Internet has come long way since the advent of HTML5 and CSS3, but we are still a long way from reaching any kind of consensus between browser vendors, especially with more complex web specifications.

The initial plan was for Anionu to work in ANY web browser. While this may be a realistic expectation for most standard websites, it's just not practical for a complex web application like Anionu - not with the way things currently stand.

During the early development phase we found ourselves writing more code for vendor workarounds than for actual implementations, and we knew something had to give when we found ourselves playing catchup with each new browser release. No developer should have to shoulder that kind of stress! 

The time comes when you need to decide where you stand with your projects; is it a future technology, or not? When we dropped support for Internet Explorer, not only did our lives and relationships take a turn for the better, our code base became lighter by 50%, and the responsiveness of the new interface felt great. No more JavaScript transitions and effects, and no more pesky workarounds to ruin some poor developer's day some time in the near future. As developers we should feel good about the code we write - it's time to take a stand!

That's not to say everything was roses once we switched to HTML5 and CSS3 - these are still very much emerging technologies. We created <a href="/mesh">Mesh</a> as a result of our research into HTML5 and CSS3, and it is now used extensively throughout the Anionu interface to get it to play nicely with all modern browsers.

## Interface Design

As the great masters teach us, "less is more". The surveillance software interfaces we tested, to put it bluntly, were just plain ugly - the devs had obviously missed Mr Miagi's lecture on interface design. Nobody likes using interfaces with heaps of features and buttons everywhere, and why shouldn't software be a joy to use? A good deal of the success attributed to companies like Apple, is because of their pretty interfaces and packaging - it's certainly not because of their ethical business methodologies (flames welcome).

Innovative future technologies should simplify our lives, not make them more complicated. We are, after all, talking about a state of mind. The idea is that anyone, even with limited computer literacy, can pick it up a piece of software and put it to work for them. Simplicity and elegance is key, but not at the cost of features, which should be there when you need them. 

Inline help is one feature we employed with great success throughout the dashboard interface. By inline help we mean little content specific help boxes that give the user pointers on how to use a specific part the software, and are displayed until they are dismissed. This is a great replacement for the good old "How-To Guide", because the information is right where you need it, and honestly, how many people rtfm anyway?

## Going Native

Ordinarily, it would be less than ideal for a web application to rely on a native application, right? Generally that would be true, but in the case of Anionu it is both necessary and prudent.

We created <a href="https://anionu.com/spot">Spot</a> to overcome numerous browser compatibility and security issues. Spot is a tiny native application which enables one to use any computer's attached audio and video capture devices for remote surveillance via the Anionu web application. 

Having Spot to do the heavy lifting has some vital benefits:

<ul>  
<li>Native performance for CPU intensive operations like motion detection, media encoding, and streaming (too much for a virtualised language like JavaScript)</li>
<li>Cross-platform support</li>
<li>Provision of a native C++ API</li>
<li>Integration with existing open source libraries</li>
<li>Strict control over security policies</li>
<li>Access to capture devices and filesystem</li>
<li>No more waiting on browser vendors to fix issues in a timely manner (many companies get burnt by this)</li>
</ul>      

Spot is based on a very simple, modular architecture, so it can be easily extended via <a href="https://anionu.com/plugins">plugins</a>, using the <a href="https://anionu.com/documents/sdk-overview">open source C++ SDK and API</a>.
Spot comes with a number of official plugins, including Surveillance Mode, Recording Mode, Media Plugin and WebRTC Streaming - the source code for all of which can be found in the <a href="http://github.com/sourcey/anionu-sdk">Anionu C++ SDK repository</a>.

We release most of our code as open source, but the Spot client itself is currently closed source in the interests of maintaining the highest level of security. This may change in the future after internal review, but for now, even though no sensitive information is shared between the server and Spot, that's the decision. The SDK and API are released under the GPL licence so as to keep public plugins open source for consumer protection.  

## Video and Audio Capture

When we started building Anionu, the HTML5 `getUserMedia` APIs were still non-existent, 
and there was no other way to access capture devices in the browser other than by using Flash. 
We have never been a fan of Flash, which was another reason for the push for a native application (Spot). 
As it turns out this was a good move, and relying on Flash would have just created more issues than it would have solved:

<ul>    
<li>Anoinu would be encumbered by a dependency on a third party client software and restricted to platforms with Flash support (which is growing by the way)</li>
<li>Anionu would be restricted to Adobe's proprietary media and transport protocols. Ugh.</li>
<li>Surveillance computers running Anionu would require the browser left open at all times which would raise obvious security concerns.</li>
<li>Let's face it, the life span of this technology is limited.</li>
</ul>    

In the end we went with OpenCV integration in Spot via the use of plugins.
As far as computer vision goes, OpenCV implements everything but the kitchen sink for media capture and manipulation on just about every platform.
This is great because it gives developers all the tools they need to extend Anionu with features like facial recognition, object detection and different forms of motion detection.

The only drawback we have found so far is that the `getUserMedia` APIs can't be used on windows computers while the capture is open in Spot. We can live with that.

## Video Delivery

Anyone who has done any research into field of Internet video knows that it is a total mess. It is a merciless battle to the death between the patent wielding Internet giants fighting for market supremacy. All the widely supported video formats are patent encumbered, and those that aren't only have marginal support.
As it currently stands, the main options are:

<dl>
<dt>H.264</dt>
<dd>Among the most widely supported is H.264 which is the intellectual property of MPEG-LA.
  In order to afford the privilege of encoding in H.264 one is required to sell one's soul along with a substantial share of one's profits to MPEG-LA. No thanks.</dd>

<dt>WebM</dt>
<dd>Another options is Google's WebM codec. WebM combines the non-standardized VP8 video codec with Vorbis audio in a Matroska container.
  Google is currently under fire over alleged breaches of other patented codecs. The future of WebM is still a bit uncertain at this stage.</dd>

<dt>Theora</dt>
<dd>Finally a codec unencumbered by patents, but Apple and Microsoft still refuse to implement it (because they can't make money from it).
  Quality is lacking compared to H.264, but apparently this is being attended to.</dd>
</dl>

Let's hope that the money grabbers who monopolize these codec patents can come to the outrageous realisation that a universally supported web media format is required before Internet video technology can move forward. We can always hope, right? Apologies for the accusational tone, but this issue costs startups hundreds of thousands, and a consensus really should have been reached years ago.

As a result Anionu's Spot client only understands plain old MJPEG by default; other media formats are implemented via official plugins, which we provide.
This enables Spot to record and stream just about any media format with the help of FFmpeg. If consumers want to enable other propriety media formats then they need to recompile the plugin and FFmpeg binaries. The source code for the official Media Plugin is available via the Anionu SDK repository.

## Real-time Communications and Presence

Over the years we have had plenty of experience working with instant messaging protocols, especially XMPP, so it seemed like the obvious choice to begin with.
XMPP is a mature technology, which offers a wide range of existing client server implementations and specifications for every aspect of instant messaging you can think of.
    
The flipside here is that these specifications also introduces a lot of bloat on the client and server sides, 
not to mention the use of XML with it's ridiculous message size overhead.
    
With this in mind we set about creating <a href="/symple">Symple</a>. Symple is essentially a bare-bones messaging protocol based on XMPP that uses JSON instead of XML. With the help of libuv on the native client side, and node.js (also based on libuv) on the server side, we had a blazing fast messaging protocol which enabled us to share arbitrary presence and message data between our native and browser applications. 
Symple has helped us increase the speed and efficiency of our real-time communications tenfold. Nice.

## Conclusion

There is many other aspects of development which haven't been covered here, but hopefully our challenges and insights can help others on the same path.

It's been an epic journey, but with hard work and perseverance amazing things can be achieved. If you want more information about any other aspects of Anionu's development then drop us a line. Happy coding!