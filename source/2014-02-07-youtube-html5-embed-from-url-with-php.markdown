---
title: YouTube HTML5 Embed from URL with PHP
date: 2014-02-07 10:49:29
tags: HTML5, PHP, Programming, Code, YouTube
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

Just a quick reference post for how to embed a YouTube video from a URL string with PHP.
The following code includes some extra options to make the player more minimal (less youtubey).

~~~ php
<?php
    $url = 'https://www.youtube.com/watch?v=u9-kU7gfuFA'
    preg_match('/[\\?\\&]v=([^\\?\\&]+)/', $url, $matches);
    $id = $matches[1];
    $width = '800px';
    $height = '450px';
?>
<iframe id="ytplayer" type="text/html" width="<?php echo $width ?>" height="<?php echo $height ?>"
    src="https://www.youtube.com/embed/<?php echo $id ?>?rel=0&showinfo=0&color=white&iv_load_policy=3"
    frameborder="0" allowfullscreen></iframe> 
~~~ 