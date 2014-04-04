---
title: Twitter Follow Unfollow Retweeter Ruby Bot
date: 2014-01-26 04:34:22
tags: ausca, bot, gem, programming, ruby, twitter
layout: blogs
---
# Twitter Follow Unfollow Retweeter Ruby Bot

Let me start by saying that I don't condone the automation of social interaction... but we don't always take our best advice do we? The other day I was playing with the Twitter API for a new project and I decided to write a bot as an anti-social experiment :)

The motivation for writing the bot is that I have begun to question Twitter as a good source of sales leads. Twitter seems to be mostly spam these days - perhaps due to the limiting nature of posted content (144 chars) preventing any real interaction? Anyway, I wanted to run this experiment to see how many people are actually engaging on there, and what kind of a followback rate I could achieve.

The results were pretty impressive - I had a 33% followback rate on an established account with 500 existing followers. Bear in mind that these are not just any old followers either, they are targeted followers with the same interests as me (or my account :)), which are much more valuable. However, only about 4% of the followers who followed me actually clicked on my domain link, which pretty much confirms my belief that most people/businesses are using Twitter for advertising and any real engagement is happening elsewhere.

The code for using the bot is as follows:

```ruby
require 'ausca'

# Instantiate the bot
bot = Ausca::Twitter::Bot.new({
  :consumer_key => TWITTER_API_KEY,
  :consumer_secret => TWITTER_API_SECRET,
  :access_token => TWITTER_ACCESS_TOKEN,
  :access_token_secret => TWITTER_ACCESS_SECRET,
  :config_filename => "config.json",
  :search => "#awesome -rt",
  :want_num_retweets => 1,
  :want_num_favorites => 3
})

# Run the bot once
bot.run
```

The best idea would be to configure `cron` to run the script to run at a reasonable hourly interval - otherwise Twitter might suspend your account.

If you are interested in running any experiments for yourself the bot can be found in the <a href="http://ausca.com" target="_blank">Ausca</a> ruby gem - and don't forget to let me know how your experiment goes!