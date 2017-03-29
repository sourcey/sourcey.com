---
title: Generating Beautiful C++ Markdown Documentation with Moxygen
date: 2016-11-10
tags: Documentation, Markdown, Moxygen
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

For years generating simple and elegant documentation has been a thorn in the side for C++ developers. The two main purpose built tools for the job that have been around forever are Doxygen and Sphynx, are either one would be ideal if you wanted to generate documentation that looks like it belongs in a Windows 3.1 help file.

I've been aware of the situation for some time, but about a month ago I resumed my search for a simple C++ documentation solution for [LibSourcey](http://sourcey.com/libsourcey/), and discovered there was still absolutely nothing out there. So as any self respecting hacker would so, I set out to build one in sheer disgust.

The following three sections are about the state of C++ parsers and documentation generators, so if you want to go straight to installing and using Moxygen then [click here](#using-moxygen)

## Why Markdown?

There are those that [dismiss](http://ericholscher.com/blog/2016/mar/15/dont-use-markdown-for-technical-docs/) Markdown as a viable solution for generating API documentation, and yes, it's true that the format has it's standardisation issues, but those are covered in all the important libraries, and if you don't need to generate highly technical documentation then I ask you, why not?

* Markdown is a pervasive format and only gaining traction
* You can keep your README and other help docs in the same format as your API spec
* It's easy to read in source
* There are many Markdown to HTML generators available
* You can drop the spec directly into a Jekyll or Middleman type static website generator
* GitBook can convert Markdown to PDF, Moby and ePub

OK enough blathering, point made...

## Parsing C++

The first thing that's required is to output C++ code into a more parsable format, such as XML or similar. The aren't many solutions for parsing C++, and the reason for that is because the language is so bloody hard to parse.

There only real viable open source solutions that I'm aware of are:

* **CastXML** — CastXML is as XML output extension for GCC, and the successor to GCCXML. While GCC is an awesome compiler and C++ parser, it only works on unix systems which makes cross platform an issue, and by the time the C++ is processed by the parser the comments are long gone - therefore and extra process would be required to extract source code comments. Doable, but not ideal.

* **Clang** — Clang has an awesome standards compliant C++ parser, it's cross platform, but unfortunately it outputs the [AST](http://clang.llvm.org/docs/IntroductionToTheClangAST.html) format which would be a Herculean feat to turn into something readable. Let's keep looking.

* **Doxygen XML** — I know I badmouthed Doxygen in the first paragraph, but Doxygen is actually pretty awesome (just the HTML output stinks). It works cross platform, supports many languages (good for the future development of our Markdown generator), and also outputs raw XML that is relatively easy to parse. Perfect!

## Generating Markdown

Markdown is a relatively new kid on the block, especially in the somewhat dusty world of C++, therefore one couldn't expect that there would be a lot of tools available in the Markdown department just yet.

I found two projects that were of some use:

* **cldoc** — [Cldoc](https://github.com/jessevdk/cldoc) is a python project based on the Clang parser, and actually outputs pretty nice [documentation](http://jessevdk.github.io/cldoc/example/) and apparently also outputs Markdown. Unfortunately though the issues are piling up on Github and it looks pretty unmaintained at this point in time.

* **doxygen2md** — [doxygen2md](https://github.com/pferdinand/doxygen2md) is a super simple nodejs parser for Doxygen XML output. Unfortunately it's only suitable for simple single page documentation. It borked at multiple points when parsing the Doxygen output from LibSourcey, and it also produced some pretty interesting output when I threw some nested namespaces at it.

As it stands the best C++ documentation parser available for C++ is currently Doxygen, and as nodejs is a quick and easy platform to work on I opted to extend the parser from doxygen2md in order to build [Moxygen](https://github.com/sourcey/moxygen).

## Using Moxygen

1. Install [Doxygen](https://www.stack.nl/~dimitri/doxygen/manual/install.html).
2. Add `GENERATE_XML=YES` to your `Doxyfile`.
3. Run `doxygen` to generate the XML documentation.
4. Install `moxygen` like so: `npm install moxygen -g`.
5. Run `moxygen` providing the folder location of the XML documentation as the first argument ie. `{OUTPUT_DIRECTORY}/xml`.  

~~~
Usage: moxygen [options] <doxygen directory>

Options:

  -h, --help             output usage information
  -V, --version          output the version number
  -v, --verbose          verbose mode
  -a, --anchors          add anchors to internal links
  -g, --modules          output doxygen modules into separate files
  -l, --language <lang>  programming language
  -t, --templates <dir>  custom templates directory
  -o, --output <file>    output file (must contain %s when using modules)
~~~

### Single Page Output

If you want single page Markdown output the you can run Moxygen like so:

~~~
moxygen --anchors --output api.md /path/to/doxygen/xml
~~~

### Multi Page Output

Moxygen supports the doxygen [modules](http://www.stack.nl/~dimitri/doxygen/manual/grouping.html#modules) syntax for generating multi page documentation.

Every [\defgroup](http://www.stack.nl/~dimitri/doxygen/manual/commands.html#cmddefgroup) in your source code will be parsed into a separate output files, with internal reference updated accordingly.

Example:

~~~
moxygen --anchors --modules --output api-%s.md /path/to/doxygen/xml
~~~

## Hosting Your Documentation

We use a combination of GitBook and Middleman for [LibSourcey](http://sourcey.com/libsourcey/). It's very easy to setup; the GitBook is located in the `doc` folder of the [repository](https://github.com/sourcey/libsourcey/tree/master/doc), with symlinks to the main README and LICENSE files so they can be reused in the book. Next the static GitBook HTML is copied across to out Middleman website and deployed using GitHub pages. All in all a very convenient (and cost effective!) solution.

You could also opt to store your documentation on a separate GitBook repository, that way you would just need to push your repository to update your live documentation.  

## Conclusion

It's my hope that with Moxygen, C++ developers will now have a way to generate more aesthetically pleasing and readable documentation. Since we only ever look at the docs when we absolutely have to, let's make the process as enjoyable as possible! :)
