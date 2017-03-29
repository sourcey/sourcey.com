---
title: Add Grunt To Your Projects
date: 2014-03-26 05:43:37
tags: Automation, JavaScript
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

<div class="sidebar-section toc">
#### Contents
{:.no_toc}

* ToC
{:toc}
</div>

![Grunt](logos/grunt-400x400.png "Grunt"){: .align-left}
[Grunt](http://gruntjs.com) is a front end task automater on steroids; you just setup a `Gruntfile`, and watch it purrr. 
We've been using it to automate all kinds of boring tasks; CSS and JavaScript concentration, minification, image optimization, file watchers, and even running servers. Basically all the crap you want to setup once and never think about again.

Grunt has a really well designed and modular codebase. By itself, the core library is just a lonely task runner, but thanks to the good developer community who work tirelessly to maintain it's [awesome plugins](https://github.com/gruntjs), Grunt is a total beast. For me it's become one of those simple yet indispensable every day tools that I'd be lost without.

<!--
As good software should be, 

saving you time for better things by automating front end development tasks like a boar on roids.
It has tasks  

OK [Grunt], I think I love you. 

If you write JavaScript libraries and you don't use <a href="http://gruntjs.com/" title="Grunt" target="_blank">Grunt</a> yet, you should check it out! 

Grunt is a task automater with loads of useful plugins for things like optimising images and minifying CSS and JavaScript. 
The great thing about Grunt is that it's built on top of <a href="http://nodejs.org/" target="_blank">node.js</a>, 

-->

Grunt is built on top of <a href="http://nodejs.org/" target="_blank">node.js</a>, which we play around with quite a bit because it's underlying C library, libuv, also powers our very own <a href="http://sourcey.com/libsourcey/" title="LibSourcey">LibSourcey</a>.

I recently added Grunt to <a href="http://sourcey.com/mesh/" title="Mesh" target="_blank">Mesh</a> and <a href="http://sourcey.com/symple/" title="Symple" target="_blank">Symple</a>, so read on to find out how you can do the same.

## Setup Your Project

Lets say you have a basic project layout like so:

~~~ 
my-project
|-- src
  |-- *.css
  |-- *.js
|-- dist
~~~ 

First things first, install Grunt:

~~~ 
npm install grunt-cli
~~~ 

Create a `package.json` file in your root folder using this file as a template:

~~~ javascript
{
    "name" : "my-project",
    "version" : "0.0.1",
    "devDependencies": {    
        "grunt": "~0.4.2",
        "grunt-contrib-concat": "~0.1.3",
        "grunt-contrib-cssmin" : "~0.6.1",
        "grunt-contrib-watch" : "~0.5.3",
        "grunt-contrib-uglify" : "~0.2.0"
    }
}
~~~ 

Now create a `Gruntfile.js` in your root folder and insert the following:

~~~ javascript
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: [
                    'src/*.css'
                ],
                dest: 'dist/my-project.css'
            },
            js: {
                src: [
                    'src/*.js'
                ],
                dest: 'dist/my-project.js'
            }
        },
        cssmin: {
            css: {
                src: 'dist/my-project.css',
                dest: 'dist/my-project.min.css'
            }
        },
        uglify: {
            js: {
                files: {
                    'dist/my-project.min.js': ['dist/mesh.js']
                }
            }
        },
        watch: {
          files: ['src/*'],
          tasks: ['concat', 'cssmin', 'uglify']
       }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat:css', 'cssmin:css', 'concat:js', 'uglify:js']);
};
~~~ 

This simple `Gruntfile` tells Grunt to combine and minify the CSS and JS files from the `src` folder, and save the result to the `dist` folder.

Remember that the `Gruntfile` is just JavaScript, so you can add your own methods as you see fit.

To execute all default tasks just run the following command from the source directory (who would've guessed it): 

~~~ 
grunt
~~~ 

For a list of help commands on running specific tasks and more run the following command:

~~~ 
grunt --help
~~~ 

## Filesystem Watcher

Notice that we also included the `grunt-contrib-watch` plugin, which tells Grunt to watch the filesystem in real-time for changes to your source files, and updates the distribution files automatically. Nice!

In order to start the watcher run the following command:

~~~ 
grunt watch
~~~ 

Didn't I say it was easy? Now go forth and create :)