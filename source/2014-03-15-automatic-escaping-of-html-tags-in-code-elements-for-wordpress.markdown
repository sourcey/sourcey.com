---
title: Automatic Escaping of HTML Tags in Code Elements for Wordpress 
date: 2014-03-15 07:43:17
tags: php, programming, regex, wordpress
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---
# Automatic Escaping of HTML Tags in Code Elements for Wordpress 

For those of you who are using wordpress and don't want to manually escape or mangle HTML tags inside your "code" elements, just add the below code to your functions.php to save you from a hair-pulling experience. You can also escape code in "pre" or other elements by modifying the regex string.

~~~ php
// Escape HTML tags in post content
add_filter('the_content', 'escape_code_fragments');

// Escape HTML tags in comments
add_filter('pre_comment_content', 'escape_code_fragments');

function escape_code_fragments($source) {
  $encoded = preg_replace_callback('/<code(.*?)>(.*?)<\/code>/ims',
  create_function(
    '$matches',
    '$matches[2] = preg_replace(
        array("/^[\r|\n]+/i", "/[\r|\n]+$/i"), "",
        $matches[2]);
      return "<code" . $matches[1] . ">" . esc_html( $matches[2] ) . "`";'
  ),
  $source);

  if ($encoded)
    return $encoded;
  else
    return $source;
}
~~~ 