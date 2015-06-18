---
title: Simple Social Sharing Buttons Without JavaScript APIs
date: 2015-05-18
tags: Social, Foundation
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

So you want to implement simple social sharing buttons on your site or application, but you don't want the performance hit or resultant bloat from including each social network API just for these buttons. Good move!

The following code works with the glorious Foundation 5 and [Foundation Icons](http://zurb.com/playground/foundation-icon-fonts-3) to display the buttons in a Reveal Modal. Alternatively, you can just remove the modal code to use the buttons without any JavaScript at all.

To implement the code on your site just replace the variables in curly brackets with your own data.

<center>
<p><a href="#" class="action-button button radius" target="_blank" data-reveal-id="share-buttons-modal" title="Share the Love">Try it out</a></p>
</center>

<div id="share-buttons-modal" class="reveal-modal" data-reveal aria-hidden="true" role="dialog">
  <a href="https://www.facebook.com/sharer/sharer.php?u={PAGEURL}&t={PAGETITLE}" target="_blank" title="Share on Facebook"><i class="fi fi-social-facebook"></i></a>
  <a href="https://twitter.com/intent/tweet?source={PAGEURL}&text={PAGETITLE}:{PAGEURL}&via={TWITTERUSERNAME}" target="_blank" title="Tweet"><i class="fi fi-social-twitter"></i></a>
  <a href="https://plus.google.com/share?url={PAGEURL}" target="_blank" title="Share on Google+"><i class="fi fi-social-google-plus"></i></a>
  <a href="http://pinterest.com/pin/create/button/?url={PAGEURL}&media={PAGEIMAGEURL}&description={PAGEDESCRIPTION}" target="_blank" title="Pin it"><i class="fi fi-social-pinterest"></i></a>
  <a href="mailto:?subject={PAGETITLE}&body={PAGEDESCRIPTION}:{PAGEURL}" target="_blank" title="Email"><i class="fi fi-mail"></i></a>
</div>

<style>
#share-buttons-modal {
  width: 375px;
  border-radius: 3px;
  
  /* below definitions override Foundation responsive modal code */
  min-height: initial;
  margin: 0 auto;
  padding: 0;
  top: 100px;
  left: 0;
  right: 0;
}
#share-buttons-modal a {
  border-right: 1px solid #eee;
  height: 75px;
  width: 20%; /* fix subpixel rendering issue */
  float: left;
  font-size: 60px;
  line-height: 75px;
  color: #c00;
  text-align: center;
  border-radius: 3px;
}
#share-buttons-modal a:hover {
  background: #f6f6f6;
}
#share-buttons-modal a:focus {
  background: #c00;
  color: white;
}
#share-buttons-modal a:last-child {
  border-right: none;
}
</style>

~~~ html
<div id="share-buttons-modal" class="reveal-modal" data-reveal aria-hidden="true" role="dialog">
  <a href="https://www.facebook.com/sharer/sharer.php?u={PAGEURL}&t={PAGETITLE}" target="_blank" title="Share on Facebook"><i class="fi fi-social-facebook"></i></a>
  <a href="https://twitter.com/intent/tweet?source={PAGEURL}&text={PAGETITLE}:{PAGEURL}&via={TWITTERUSERNAME}" target="_blank" title="Tweet"><i class="fi fi-social-twitter"></i></a>
  <a href="https://plus.google.com/share?url={PAGEURL}" target="_blank" title="Share on Google+"><i class="fi fi-social-google-plus"></i></a>
  <a href="http://pinterest.com/pin/create/button/?url={PAGEURL}&media={PAGEIMAGEURL}&description={PAGEDESCRIPTION}" target="_blank" title="Pin it"><i class="fi fi-social-pinterest"></i></a>
  <a href="mailto:?subject={PAGETITLE}&body={PAGEDESCRIPTION}:{PAGEURL}" target="_blank" title="Email"><i class="fi fi-mail"></i></a>
</div>
~~~

~~~ css
#share-buttons-modal {
  width: 375px;
  
  /* below definitions override Foundation responsive modal code */
  min-height: initial;
  margin: 0 auto;
  padding: 0;
  top: 100px;
  left: 0;
  right: 0;
}
#share-buttons-modal a {
  border-right: 1px solid #eee;
  height: 75px;
  width: 20%; /* fix subpixel rendering issue */
  float: left;
  font-size: 60px;
  line-height: 75px;
  color: #c00;
  text-align: center;
  border-radius: 3px;
}
#share-buttons-modal a:hover {
  background: #f6f6f6;
}
#share-buttons-modal a:focus {
  background: #c00;
  color: white;
}
#share-buttons-modal a:last-child {
  border-right: none;
}
~~~

Have fun!


