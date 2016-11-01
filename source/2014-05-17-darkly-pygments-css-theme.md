---
title: Darkly Pygments CSS Theme
date: 2014-05-17
tags: Pygments, CSS, Themes
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

Sourcey has no shortage of beautiful code, so it's about time we had some sexy syntax highlighting to match. 

Darkly is a pygments syntax highlighting theme which uses a broad spectrum of light and dark colours to create a luminous contrast that is both pleasing to the eye and great for readability.

If you want to use it yourself then please be our guest, here is the content of `darkly.css`:

~~~ css
/* 
  Darkly Pygments Theme
  (c) 2014 Sourcey
  http://sourcey.com
*/

.highlight {
  white-space: pre; 
  overflow: auto; 
  word-wrap: normal; /* horizontal scrolling */
  -moz-border-radius: 3px; 
  -webkit-border-radius: 3px; 
  border-radius: 3px;
  padding: 20px; 
  background: #343642;
  color: #C1C2C3;
}
.highlight .hll { background-color: #ffc; }
.highlight .gd { color: #2e3436; background-color: #0e1416; }
.highlight .gr { color: #eeeeec; background-color: #c00; }
.highlight .gi { color: #babdb6; background-color: #1f2b2d; }
.highlight .go { color: #2c3032; background-color: #2c3032; }
.highlight .kt { color: #e3e7df; }
.highlight .ni { color: #888a85; }
.highlight .c,.highlight .cm,.highlight .c1,.highlight .cs { color: #8D9684; }
.highlight .err,.highlight .g,.highlight .l,.highlight .n,.highlight .x,.highlight .p,.highlight .ge,
.highlight .gp,.highlight .gs,.highlight .gt,.highlight .ld,.highlight .s,.highlight .nc,.highlight .nd,
.highlight .ne,.highlight .nl,.highlight .nn,.highlight .nx,.highlight .py,.highlight .ow,.highlight .w,.highlight .sb,
.highlight .sc,.highlight .sd,.highlight .s2,.highlight .se,.highlight .sh,.highlight .si,.highlight .sx,.highlight .sr,
.highlight .s1,.highlight .ss,.highlight .bp { color: #C1C2C3; }
.highlight .k,.highlight .kc,.highlight .kd,.highlight .kn,.highlight .kp,.highlight .kr,
.highlight .nt { color: #729fcf; }
.highlight .cp,.highlight .gh,.highlight .gu,.highlight .na,.highlight .nf { color: #E9A94B ; }
.highlight .m,.highlight .nb,.highlight .no,.highlight .mf,.highlight .mh,.highlight .mi,.highlight .mo,
.highlight .il { color: #8ae234; }
.highlight .o { color: #989DAA; }
.highlight .nv,.highlight .vc,.highlight .vg,.highlight .vi { color: #fff; }
~~~

Looking for a demonstration? Every piece of code on this website!

#### Ruby

~~~ ruby
require 'httparty'

class GooglePlus
  include HTTParty
  base_uri 'https://accounts.google.com'

  def initialize(params = {})
    @params = params
  end

  # POST /o/oauth2/token HTTP/1.1
  def token(code)
    GooglePlus.post('/o/oauth2/token', body: @params.merge({
      code: code,
      grant_type: 'authorization_code'
    }))
  end

  # POST /o/oauth2/token HTTP/1.1
  def refresh_token(token)
    GooglePlus.post('/o/oauth2/token', body: @params.except(:redirect_uri).merge({
      refresh_token: token,
      grant_type: 'refresh_token'
    }))
  end
end
~~~

#### Python

~~~ python
#!/usr/bin/env python
import socket
import subprocess
import sys
from datetime import datetime

# Clear the screen
subprocess.call('clear', shell=True)

# Ask for input
remoteServer    = raw_input("Enter a remote host to scan: ")
remoteServerIP  = socket.gethostbyname(remoteServer)

# Print a nice banner with information on which host we are about to scan
print "-" * 60
print "Please wait, scanning remote host", remoteServerIP
print "-" * 60

# Check what time the scan started
t1 = datetime.now()

# Using the range function to specify ports (here it will scans all ports between 1 and 1024)

# We also put in some error handling for catching errors

try:
    for port in range(1,1025):  
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((remoteServerIP, port))
        if result == 0:
            print "Port {}: \t Open".format(port)
        sock.close()

except KeyboardInterrupt:
    print "You pressed Ctrl+C"
    sys.exit()

except socket.gaierror:
    print 'Hostname could not be resolved. Exiting'
    sys.exit()

except socket.error:
    print "Couldn't connect to server"
    sys.exit()

# Checking the time again
t2 = datetime.now()

# Calculates the difference of time, to see how long it took to run the script
total =  t2 - t1

# Printing the information to screen
print 'Scanning Completed in: ', total
~~~

#### JavaScript

~~~ javascript
function Mammal(name) { 
	this.name = name;
	this.offspring = [];
} 
Mammal.prototype.haveABaby = function() { 
	var newBaby = new Mammal("Baby "+ this.name);
	this.offspring.push(newBaby);
	return newBaby;
} 
Mammal.prototype.toString = function() { 
	return '[Mammal "' + this.name + '"]';
} 


Cat.prototype = new Mammal();               // Here's where the inheritance occurs 
Cat.prototype.constructor = Cat;            // Otherwise instances of Cat would have a constructor of Mammal 
function Cat(name) { 
	this.name = name;
} 
Cat.prototype.toString = function() { 
	return '[Cat "' + this.name + '"]';
} 


var someAnimal = new Mammal('Mr. Biggles');
var myPet = new Cat('Felix');
console.log('someAnimal is ' + someAnimal); // results in 'someAnimal is [Mammal "Mr. Biggles"]' 
console.log('myPet is ' + myPet);           // results in 'myPet is [Cat "Felix"]' 

myPet.haveABaby();                          // calls a method inherited from Mammal 
console.log(myPet.offspring.length);        // shows that the cat has one baby now 
console.log(myPet.offspring[0]);            // results in '[Mammal "Baby Felix"]' 
~~~

#### C++

~~~ cpp
//
// LibSourcey
// Copyright (C) 2005, Sourcey <http://sourcey.com>
//
// LibSourcey is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.
//
// LibSourcey is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
//
// This file uses the public domain libb64 library: http://libb64.sourceforge.net/
//


#ifndef SCY_Hex_H
#define SCY_Hex_H


#include "scy/interface.h"
#include "scy/exception.h"
#include "scy/logger.h"
#include <iostream>
#include <assert.h>
#include <cstring>


namespace scy {
namespace hex {


struct Decoder: public basic::Decoder
{		
	Decoder() : lastbyte('\0') {}
	virtual ~Decoder() {} 

	virtual std::size_t decode(const char* inbuf, std::size_t nread, char* outbuf)
	{
		int n;
		char c;
		std::size_t rpos = 0;
		std::size_t nwrite = 0;	
		while (rpos < nread)
		{
			if (readnext(inbuf, nread, rpos, c))
				n = (nybble(c) << 4);

			else if (rpos >= nread) {	
				// Store the last byte to be
				// prepended on next decode()
				if (!iswspace(inbuf[rpos - 1]))
					std::memcpy(&lastbyte, &inbuf[rpos - 1], 1); 	
				break;
			}
			
			readnext(inbuf, nread, rpos, c);
			n = n | nybble(c);
			std::memcpy(outbuf + nwrite++, &n, 1);
		}
		return nwrite;
	}

	virtual std::size_t finalize(char* /* outbuf */)
	{
		return 0;
	}
	
	bool readnext(const char* inbuf, std::size_t nread, std::size_t& rpos, char& c)
	{
		if (rpos == 0 && lastbyte != '\0') {
			assert(!iswspace(lastbyte));
			c = lastbyte;
			lastbyte = '\0';
		}
		else {
			c = inbuf[rpos++];
			while (iswspace(c) && rpos < nread)
				c = inbuf[rpos++];
		}
		return rpos < nread;
	}

	int nybble(const int n)
	{
		if      (n >= '0' && n <= '9') return n - '0';
		else if (n >= 'A' && n <= 'F') return n - ('A' - 10);
		else if (n >= 'a' && n <= 'f') return n - ('a' - 10);
		else throw std::runtime_error("Invalid hex format");
	}

	bool iswspace(const char c)
	{
		return c == ' ' || c == '\r' || c == '\t' || c == '\n';
	}

	char lastbyte;
};


} } // namespace scy::hex


#endif // SCY_Hex_H
~~~

#### Bash

~~~ bash
CommandLineOptions__config_file=""
CommandLineOptions__debug_level=""

getopt_results=`getopt -s bash -o c:d:: --long config_file:,debug_level:: -- "$@"`

if test $? != 0
then
    echo "unrecognized option"
    exit 1
fi

eval set -- "$getopt_results"

while true
do
    case "$1" in
        --config_file)
            CommandLineOptions__config_file="$2";
            shift 2;
            ;;
        --debug_level)
            CommandLineOptions__debug_level="$2";
            shift 2;
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "$0: unparseable option $1"
            EXCEPTION=$Main__ParameterException
            EXCEPTION_MSG="unparseable option $1"
            exit 1
            ;;
    esac
done

if test "x$CommandLineOptions__config_file" == "x"
then
    echo "$0: missing config_file parameter"
    EXCEPTION=$Main__ParameterException
    EXCEPTION_MSG="missing config_file parameter"
    exit 1
fi
~~~

Thanks for reading and have fun with Darkly!