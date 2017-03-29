---
title: Combining Multiple RSS Feeds
date: 2014-03-26 03:58:20
tags: Ausca, Programming, RSS, Ruby
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

The <a href="http://ausca.com/" title="Ausca Ruby Gem" target="_blank">Ausca ruby gem</a> features an RSS joiner module that can be used to combine multiple RSS feeds into a single RSS feed.

This functionality is useful for creating scraper and news sites which aggregate news from outside sources.

Ausca uses `nokogiri` which makes short work of parsing HTML and XML, therefore it would be easy to customise the RSS joiner to parse news and information from non-standard feeds and abstract website formats.

The API is very simple:

~~~ ruby
require "ausca"

# Instantiate the RSS::Joiner
rss = Ausca::RSS::Joiner.new({
  :feeds => 
    [ "http://www.topix.com/rss/popular/topstories", "http://feeds.bbci.co.uk/news/rss.xml" ],
  :max_items => 50,
  :output_path => "feed.rss",
  :version => "2.0",
  :title => "test title",
  :description => "test description",
  :link => "test link",
  :author => "test author"  
})

# Fetch source feeds and generate the output
rss.generate
~~~ 