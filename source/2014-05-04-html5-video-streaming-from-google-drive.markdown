---
title: HTML5 Video Streaming from Google Drive
date: 2014-05-04
tags: google, drive, html5, video, streaming
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

![Google Drive](logos/google-drive-704x344.png "Google Drive")

# HTML5 Video Streaming from Google Drive

If you made it here, then you're probably wondering weather or not Google Drive is a viable option for hosting streamable videos? Well, the answer is yes!

This is a follow-up to [HTML5 Video is Finally Ready](/html5-video-is-finally-ready), so read that first for more info on the state of HTML5 video.

In order to make files publicly playable by anyone you need to share the files as "Public on the web" via your Google Drive, otherwise standard OAuth rules apply.

Here is an example using an H.264/AVC encoded MP4 which plays on Chrome, Firefox and Safari, and apparently Internet Explorer 11 too (untested):

<video controls="controls" style="margin-bottom:20px;width:590px">
    <source src="https://drive.google.com/uc?export=download&id=0B0JMGMGgxp9WMEdWb1hyQUhlOWs" type='video/mp4'/>
</video>

<div class="panel callout radius">
This page has received a lot of traffic, so if the video isn't displaying then Drive may have temporarily restricted access to the file. In that case please try using the original source from: <a href="http://www.quirksmode.org/html5/videos/big_buck_bunny.mp4" traget="_blank">QuirksMode</a>. If you need, you can view the quota of your own videos via the "Quota" section of your <a href="https://code.google.com/apis/console" traget="_blank">Google APIs console</a> in the "Service" tab.
</div>
 
And the source code:

~~~ html
<video controls="controls">
    <source src="https://drive.google.com/uc?export=download&id=0B0JMGMGgxp9WMEdWb1hyQUhlOWs" type='video/mp4'/>
</video>
~~~

In order to be completely cross-browser we can't forget about the geriatric fathers of the browser world who still claim a market share, and require a Flash fallback. <!--; Internet Explorer. -->

As you may already know, Google automatically encodes uploaded videos into lower bitrate FLV files for playback using Flash via the Google Drive Viewer. This means the Google Flash player can be reused like so:

<object type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" data="https://video.google.com/get_player?el=leaf&amp;cc_load_policy=1&amp;enablejsapi=1" width="1280px" height="750px" id="vpl0" style="width: 590px; height: 370px; margin-bottom: 20px"><param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><param name="wmode" value="opaque"><param name="flashvars" value="status=ok&amp;hl=en&amp;allow_embed=0&amp;ps=docs&amp;partnerid=30&amp;autoplay=0&amp;docid=0B0JMGMGgxp9WMEdWb1hyQUhlOWs&amp;abd=0&amp;el=leaf&amp;title=big_buck_bunny.mp4&amp;iurl=https%3A%2F%2Fdocs.google.com%2Fvt%3Fauthuser%3D0%26id%3D0B0JMGMGgxp9WMEdWb1hyQUhlOWs&amp;ttsurl=https%3A%2F%2Fdocs.google.com%2Ftimedtext%3Fauthuser%3D0%26id%3D0B0JMGMGgxp9WMEdWb1hyQUhlOWs%26vid%3De578958e6e16e44f&amp;reportabuseurl=https%3A%2F%2Fdocs.google.com%2Fabuse%3Fauthuser%3D0%26id%3D0B0JMGMGgxp9WMEdWb1hyQUhlOWs&amp;token=1&amp;plid=V0QTaujn2CBLXA&amp;fmt_stream_map=18%7Chttps%3A%2F%2Fr8---sn-ntq7ened.c.docs.google.com%2Fvideoplayback%3Frequiressl%3Dyes%26shardbypass%3Dyes%26cmbypass%3Dyes%26id%3De578958e6e16e44f%26itag%3D18%26source%3Dwebdrive%26app%3Ddocs%26ip%3D59.101.83.21%26ipbits%3D0%26expire%3D1399190315%26sparams%3Drequiressl%252Cshardbypass%252Ccmbypass%252Cid%252Citag%252Csource%252Cip%252Cipbits%252Cexpire%26signature%3D1409A45041079AC97B82A53C82B72B176E7295BE.432A8FD910D8DB7C14D0ED93884BE6D55B9C918%26key%3Dck2%26ir%3D1%26ms%3Dnxu%26mt%3D1399186650%26mv%3Dm%26mws%3Dyes%2C34%7Chttps%3A%2F%2Fr8---sn-ntq7ened.c.docs.google.com%2Fvideoplayback%3Frequiressl%3Dyes%26shardbypass%3Dyes%26cmbypass%3Dyes%26id%3De578958e6e16e44f%26itag%3D34%26source%3Dwebdrive%26app%3Ddocs%26ip%3D59.101.83.21%26ipbits%3D0%26expire%3D1399190315%26sparams%3Drequiressl%252Cshardbypass%252Ccmbypass%252Cid%252Citag%252Csource%252Cip%252Cipbits%252Cexpire%26signature%3D18B8078AAA0F03717ADE0B017E752D1E797B9406.81C1DA43B6417F6B524AA33F654E5BE0D90F596%26key%3Dck2%26ir%3D1%26ms%3Dnxu%26mt%3D1399186650%26mv%3Dm%26mws%3Dyes%2C43%7Chttps%3A%2F%2Fr8---sn-ntq7ened.c.docs.google.com%2Fvideoplayback%3Frequiressl%3Dyes%26shardbypass%3Dyes%26cmbypass%3Dyes%26id%3De578958e6e16e44f%26itag%3D43%26source%3Dwebdrive%26app%3Ddocs%26ip%3D59.101.83.21%26ipbits%3D0%26expire%3D1399190315%26sparams%3Drequiressl%252Cshardbypass%252Ccmbypass%252Cid%252Citag%252Csource%252Cip%252Cipbits%252Cexpire%26signature%3D41EDA4A85EB4BBD63C31C15D6A9178B48B99FC49.177799E1DBD96CB7575DB86EFB115BD10DFA37A1%26key%3Dck2%26ir%3D1%26ms%3Dnxu%26mt%3D1399186650%26mv%3Dm%26mws%3Dyes&amp;fmt_list=18%2F640x360%2F9%2F0%2F115%2C34%2F640x360%2F9%2F0%2F115%2C43%2F640x360%2F99%2F0%2F0&amp;url_encoded_fmt_stream_map=itag%3D18%26url%3Dhttps%253A%252F%252Fr8---sn-ntq7ened.c.docs.google.com%252Fvideoplayback%253Frequiressl%253Dyes%2526shardbypass%253Dyes%2526cmbypass%253Dyes%2526id%253De578958e6e16e44f%2526itag%253D18%2526source%253Dwebdrive%2526app%253Ddocs%2526ip%253D59.101.83.21%2526ipbits%253D0%2526expire%253D1399190315%2526sparams%253Drequiressl%252Cshardbypass%252Ccmbypass%252Cid%252Citag%252Csource%252Cip%252Cipbits%252Cexpire%2526signature%253D1409A45041079AC97B82A53C82B72B176E7295BE.432A8FD910D8DB7C14D0ED93884BE6D55B9C918%2526key%253Dck2%2526ir%253D1%2526ms%253Dnxu%2526mt%253D1399186650%2526mv%253Dm%2526mws%253Dyes%26type%3Dvideo%252Fmp4%253B%2Bcodecs%253D%2522avc1.42001E%252C%2Bmp4a.40.2%2522%26quality%3Dmedium%2Citag%3D34%26url%3Dhttps%253A%252F%252Fr8---sn-ntq7ened.c.docs.google.com%252Fvideoplayback%253Frequiressl%253Dyes%2526shardbypass%253Dyes%2526cmbypass%253Dyes%2526id%253De578958e6e16e44f%2526itag%253D34%2526source%253Dwebdrive%2526app%253Ddocs%2526ip%253D59.101.83.21%2526ipbits%253D0%2526expire%253D1399190315%2526sparams%253Drequiressl%252Cshardbypass%252Ccmbypass%252Cid%252Citag%252Csource%252Cip%252Cipbits%252Cexpire%2526signature%253D18B8078AAA0F03717ADE0B017E752D1E797B9406.81C1DA43B6417F6B524AA33F654E5BE0D90F596%2526key%253Dck2%2526ir%253D1%2526ms%253Dnxu%2526mt%253D1399186650%2526mv%253Dm%2526mws%253Dyes%26type%3Dvideo%252Fx-flv%26quality%3Dmedium%2Citag%3D43%26url%3Dhttps%253A%252F%252Fr8---sn-ntq7ened.c.docs.google.com%252Fvideoplayback%253Frequiressl%253Dyes%2526shardbypass%253Dyes%2526cmbypass%253Dyes%2526id%253De578958e6e16e44f%2526itag%253D43%2526source%253Dwebdrive%2526app%253Ddocs%2526ip%253D59.101.83.21%2526ipbits%253D0%2526expire%253D1399190315%2526sparams%253Drequiressl%252Cshardbypass%252Ccmbypass%252Cid%252Citag%252Csource%252Cip%252Cipbits%252Cexpire%2526signature%253D41EDA4A85EB4BBD63C31C15D6A9178B48B99FC49.177799E1DBD96CB7575DB86EFB115BD10DFA37A1%2526key%253Dck2%2526ir%253D1%2526ms%253Dnxu%2526mt%253D1399186650%2526mv%253Dm%2526mws%253Dyes%26type%3Dvideo%252Fwebm%26quality%3Dmedium&amp;timestamp=1399186715856&amp;length_seconds=61&amp;playerapiid=vpl0"></object>

No doubt you could access the raw FLV stream using a custom player of your own design, in fact Symple has a [chromeless FLV player](/symple) which would be suitable for the task.