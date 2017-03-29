---
title: Installing Trac with Monit on CentOS
date: 2014-03-26 01:59:26
tags: Linux, Programming
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

We just finished installing Trac for Sourcey and thought we would share the process with others. Make sure you are logged in as `root` and let the fun begin!

There are a few ways to <a href="http://trac.edgewall.org/wiki/TracInstall" target="_blank">install Trac</a>, by Python's `easy_install` package makes the actual installation pretty straight forward so we'll use that.

Install Trac 1.0.1:

~~~ bash
easy_install Trac==1.0.1 
~~~ 

Or install latest development version:

~~~ bash
easy_install Trac==dev 
~~~ 

Next we create the environment:

~~~ bash
trac-admin /path/to/trac initenv
~~~

Make sure the user account under which the web front-end runs will have write permissions to the environment directory and all the files inside:

~~~ bash
chown -R deploy.deploy /path/to/trac 
~~~ 

You can fire up the server now to test everything. If you are only have a single Trac project you should use the -s option to bypass the "Available Projects" screen.

~~~ bash
tracd -s --port 9990 /path/to/trac 
~~~ 

For our purposes we are content using the tracd server behind an Nginx reverse proxy, but there are other alternatives to tracd should you need it. 

Next we create a bash script for tracd. Copy the contents of the below bash script into `/etc/init.d/tracd` and change the necessary variables:

~~~ bash
#!/bin/bash
#
# chkconfig: - 85 15
# description: tracd
# processname: tracd
# pidfile: /var/run/tracd.pid

# Source function library.
. /etc/rc.d/init.d/functions

## Options you should probably change ##
# If you only want to serve one project keep this variable
# empty and set the PROJECT_ENV variable 
ENV_PARENT_DIR=
PROJECT_ENV=/path/to/trac
PORT=9990

# Add any additional options (such as authentication) here.
# If you only have one project you should probably add -s here
ADDITIONAL_OPTS="-s --basic-auth='trac,/path/to/trac/htpasswd,My Realm'"

DAEMON=/usr/bin/tracd
NAME=tracd
DESC="web server"
PIDFILE=/var/run/$NAME.pid
SCRIPTNAME=/etc/init.d/$NAME

test -x $DAEMON || exit 1

set -e

DAEMON_OPTS="--daemonize --pidfile=$PIDFILE --port=$PORT $ADDITIONAL_OPTS"
if [ -n "$ENV_PARENT_DIR" ]; then
        DAEMON_OPTS="$DAEMON_OPTS --env-parent-dir=$ENV_PARENT_DIR"
else
        DAEMON_OPTS="$DAEMON_OPTS $PROJECT_ENV"
fi

LOCKFILE=${LOCKFILE-/var/lock/subsys/tracd}
RETVAL=0


start() {
        if [ -a $LOCKFILE ];
        then
                echo "tracd appears to be running, or has crashed, or was not stopped properly."
                echo "check $PIDFILE, and remove $LOCKFILE to start again."
                return -1;
        fi

        echo -n $"Starting $NAME: "
        LANG=$TRACD_LANG $DAEMON $DAEMON_OPTS 
        RETVAL=$?
        echo
        [ $RETVAL = 0 ] && touch ${LOCKFILE}
        return $RETVAL
}
stop() {
        if [ -a $PIDFILE ]
        then
                echo -n $"Stopping $NAME: "
                kill -9 `cat ${PIDFILE}`
                RETVAL=$?
                echo
                [ $RETVAL = 0 ] && rm -f ${LOCKFILE} ${PIDFILE}
        else
                echo "tracd appears not to be running."
        fi
}

# See how we were called.
case "$1" in
  start)
        start
        ;;
  stop)
        stop
        ;;
  *)
        echo $"Usage: $NAME {start|stop}"
        exit 1
esac

exit $RETVAL
~~~ 

Now run the following commands:

~~~ bash
chmod 755 /etc/init.d/tracd
chkconfig –-add /etc/init.d/tracd
~~~ 

Unless you want to create a public wiki you will want some form of authentication. The init.d script uses a htpasswd file for basic authentication, so we can build that now:

~~~ bash
htpasswd -c /path/to/trac/htpasswd MyUsername
~~~ 

Alternatively, if you want a completely public wiki you could do something like this to give anonymous users full privileges (be sure you know what you are doing before you run this command!):

~~~ bash
trac-admin /path/to/trac permission add anonymous "*"
~~~ 

To start the server you can run:

~~~ bash
service tracd start
~~~ 

Since we use monit to monitor our server stack we will add a quick script to ensure the server doesn't go down. Copy the following file to `/etc/monit.d/tracd`:

~~~ bash
check process tracd with pidfile /var/run/tracd.pid
  start program = "/etc/init.d/tracd start"
  stop  program = "/etc/init.d/tracd stop"
  if 5 restarts within 5 cycles then timeout
~~~ 

Now reload the monit configuration:
~~~ bash
monit reload
~~~ 

And we are done. Hopefully this saved you some time, and good luck with your projects!