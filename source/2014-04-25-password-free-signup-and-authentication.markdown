---
title: Password Free Signup and Authentication
date: 2014-04-25
tags: oauth, authentication, security
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

# Password Free Signup and Authentication

Signup and authentication is a vital part of the user experience since it is probably the first interaction a customer has with your product or service. Let's face it, reentering your information each time you signup for a new service gets to be a real pain the the butt, so anything we can do to reduce the déjà vu is a good thing.

Anyone who is dabbled with web services will be familiar with the [OAuth](http://tools.ietf.org/html/rfc6749) specification. OAuth enables your customers to signup and login to your service with their existing third-party accounts such as Google, Facebook, Twitter etc. 

In fact, with a good OAuth implementation you can remove the need for passwords and even the entire signup process completely. The beauty here is that your customers don't have to remember any pesky passwords, and there's one less security concern for the developer.

## Choosing an OAuth Provider

Choosing the right OAuth provider will come down to the nature of your product or service. Most big players in the industry provide OAuth APIs, so onless you are just looking for social login convenience, your decision will probably hinge on the other services offered by the provider.

### Facebook

The largest social network in the world is not surprisingly the [favourite OAuth provider](http://techcrunch.com/2013/04/08/report-46-of-social-login-users-still-choose-facebook-but-google-is-quickly-gaining-ground/) for many users. Facebook has a very well rounded API and developer SDK. One of the more powerful features is the [FQL](https://developers.facebook.com/docs/reference/fql/) language which enables you to query almost any social metadata on Facebook.

One gotcha to be aware of when using the JavaScript SDK is the "channelUrl" parameter. Without it set the SDK is **ridiculously** slow, so be sure that it points to a valid file on your server.

### Google

Probably the best IMO, especially for professional services. Google is a close second behind Facebook with regards to user adoption, and is ever increasing in popularity. Every professional on the Internet has a Google account, and there's a good chance they already use GMail and other Google services regularly. 

The real advantage of using Google however, is their [developer services](https://developers.google.com/products/). You can integrate your applications with Cloud Storage, Google Drive, YouTube, GMail and more, and it works seamlessly if your customers login with Google OAuth. 

### Twitter

Twitter is good, but I would only recommend it when creating applications that integrate specifically with Twitter. The reason for this is that Twitter doesn't provide you with a valid user email address like the other providers do. As a developer this means implementing another step to get an email address from the user, which adds complexity and kind of defeats the purpose of using OAuth to begin with. 

### LinkedIn

The social network for professionals is good when building services for web professionals. LinkedIn traffic is considered to be higher quality and have [higher conversions](http://blog.hubspot.com/blog/tabid/6307/bid/30030/LinkedIn-277-More-Effective-for-Lead-Generation-Than-Facebook-Twitter-New-Data.aspx) compared to other networks. Again it depends on your niche.

Personally, I'm not a great fan of LinkedIn. I find their pushy business model and dated interface detract from the experience and drive me to interact elsewhere.

## Going All The Way

It's often tempting for developers to get carried away and build the entire kitchen sink, and once you've finished theres always more to do.
There is merit in [keeping things simple](http://blog.codinghorror.com/how-to-be-lazy-dumb-and-successful/), which is why I subscribe to the belief that the best kind of code is code that you don't write yourself.

If you have a niche product or service, you may consider restricting access to a single OAuth provider. While this method may ostracise certain customers, it will give you credibility and traction with the die-hards in your chosen network.

For example, we are using Google authentication exclusively for our cloud video surveillance service, [Anionu](https://anionu.com). This means no passwords, and greater security for users, and access to their Google Drive for storing videos in the cloud. As well as the convenience of using familiar technology, Googlers have 15GB of free storage in their Google Drive which is a pretty solid incentive to signup. Nice!

## Security Considerations

Make sure you educate yourself on OAuth best practices before getting started. For all intents and purposes, the OAuth tokens you store are just like passwords, so the same cautions should be observed. Some implementation points to consider are:

* Using CSRF validation to verify OAuth callbacks. Most providers allow you to specify extra parameters with your initial OAuth request. This should contain a CSRF token, and be verified on response.
* Encrypt OAuth tokens in the database. You wouldn't store a clear text password now, would you?
* Social network SDKs are notoriously slow, especially when using a few of them! Don't forget to cache the remote .js files.

The obvious red flag for using OAuth is reliance on a third-party service, which we all want to keep to a minimum. The worst case scenario here is that the provider goes out of business; Google, not likely; Facebook, maybe given Zuckerberg's spending habits! As long as basic user information is retained locally there is no real risk to your business.

## Conclusion

Users are becoming increasingly wary of who they share their information with, and with [good reason](http://gigaom.com/2013/12/31/snapchat-hacked-4-6-million-usernames-and-phone-numbers-lifted/) too. This makes "password free signup" a great incentive to offer lazy and wary, security conscious, customers.

It's an exciting technological era we live in, and as the big players claim more of the market share it's becoming more necessary for new and smaller startups to effectively use and integrate with the more established players in order to gain traction and build a solid customer base.