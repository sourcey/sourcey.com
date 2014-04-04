---
title: Generating Website Thumbnails in Rails 4 using Dragonfly and wkhtmltoimage
date: 2014-03-15 02:49:02
tags: programming, rails, ruby, thumbnails
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---
# Generating Website Thumbnails in Rails 4 using Dragonfly and wkhtmltoimage

I had a joyous time the other day trying to get a new rails app to take thumbnail snapshots of remote websites for http://gardn.net... Actually I lied, it wasn't really that fun, in fact it was a real pain in the ass - but you know how it is being a developer ;)

There are a few third party APIs out there, Bluga.net, Websnapr and ShrinkTheWeb to name a few, but they all cost money - and why pay for it when we can build it ourselves? So the idea is to generate our own thumbnails without using any third party services.

I ended up using a combination of <a href="https://github.com/markevans/dragonfly" target="_blank">Dragonfly</a> and <a href="http://wkhtmltopdf.org" target="_blank">wkhtmltoimage</a> to get the job done. The basic ideas is we use wkhtmltoimage to generate and store the thumbnail it in a temp location, then we pass the file to Dragonfly for processing. I'm currently generating the URL inside a validator, so if it fails then the URL entity will not be saved, and we can say to the user "well what's up with this dodgey URL?". This might not be the most scalable way of handling this (ie. not deferred), but it's OK for now as I'm using a thread based server, and again, because it's validatable! Code follows...

~~~ ruby
class MySexyModel < ActiveRecord::Base

  ... stuff

  # Generate the thumbnail on validate so we can return errors on failure
  validate :generate_thumbnail_from_url

  # Cleanup temp files when we are done
  after_save :cleanup_temp_thumbnail
  
  # Generate a thumbnail from the remote URL
  def generate_thumbnail_from_url

    # Skip thumbnail generation if:
    # a) there are already other validation errors
    # b) an image was manually specified
    # c) an image is already stored and the URL hasn't changed
    skip_generate = self.errors.any? || (self.image_changed? ||
        (self.image_stored? && !self.url_changed?))
    # p "*** generating thumbnail: #{!skip_generate}"
    return if skip_generate

    # Generate and assign an image or set a validation error
    begin
      tempfile = temp_thumbnail_path
      cmd = "wkhtmltoimage --quality 95 \"#{self.url}\" \"#{tempfile}\""
      # p "*** grabbing thumbnail: #{cmd}"
      system(cmd) # sometimes returns false even if image was saved
      self.image = File.new(tempfile) # will throw if not saved
    rescue => e
      # p "*** thumbnail error: #{e}"
      self.errors.add(:base, "Cannot generate thumbnail. Is your URL valid?")
    ensure
    end
  end
  
  # Return the absolute path to the temporary thumbnail file
  def temp_thumbnail_path
    File.expand_path("#{self.url.parameterize.slice(0, 20)}.jpg", Dragonfly.app.datastore.root_path)
  end

  # Cleanup the temporary thumbnail image
  def cleanup_temp_thumbnail
    File.delete(temp_thumbnail_path) rescue 0
  end
end
~~~ 

And with that we are peachy - no need for any third party services at all! Don't forget to show your love if this helped you.
