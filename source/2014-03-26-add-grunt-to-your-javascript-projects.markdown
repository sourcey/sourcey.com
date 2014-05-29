---
title: Add Grunt To Your JavaScript Projects
date: 2014-03-26 05:43:37
tags: automation, grunt, javascript
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

# Add Grunt To Your JavaScript Projects

![Grunt](logos/grunt-400x400.png "Grunt"){: .align-left}
If you write JavaScript libraries and you don't use <a href="http://gruntjs.com/" title="Grunt" target="_blank">Grunt</a> yet, you should check it out! Grunt is a task automater with loads of useful plugins for things like optimising images and minifying CSS and JavaScript. It's one of those indespensible yet simple pieces of software that makes a developers life much easier and more productive.

Grunt is built on top of <a href="http://nodejs.org/" target="_blank">node.js</a>, which is famous for bringing JavaScript to the server side. The other reason node.js is great, is because it's underlying library, libuv, is also the high speed networking layer for our very own <a href="http://sourcey.com/libsourcey/" title="LibSourcey">LibSourcey</a>.

I recently added Grunt to <a href="http://sourcey.com/mesh/" title="Mesh" target="_blank">Mesh</a> and <a href="http://sourcey.com/symple/" title="Symple" target="_blank">Symple</a>, and this guide shows how you can do the same. Feel the grunt baby!

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

Notice that we also included the watch plugin, which tells Grunt us to watch the filesystem in real-time for changes to your source files, and updates the distribution files automatically. Nice!

In order to start the watcher execute the following command from the source directory:

~~~ 
grunt watch
~~~ 

Didn't I say it was easy? Now go forth and create :)