---
title: Flash Android Sony Xperia on Linux
date: 2015-06-29
tags: Android, Xperia, Flash
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

So your shiny Xperia Z3 has decided to shit itself, and is now a $600 brick. Perhaps is is stuck in a reboot loop, perhaps it just decided it just doesn't want to switch on anymore. The time has come to Flash your device, and this is the guide that will help you do it on Linux without having to find a Windoze machine.

First thing we need to do is add some udev.d rules so our USB device can be recognised:

~~~ bash
# run as root
sudo -i

# add the ruled
cd /etc/udev/rules.d
echo 'SUBSYSTEM=="usb", ACTION=="add", SYSFS{idVendor}=="0fce", SYSFS{idProduct}=="*", MODE="0777"' > 63-sonyxperia.rules

# reload udev rules
udevadm control --reload-rules
~~~

Next grab the FlashTool app from (http://www.flashtool.net/downloads.php)[http://www.flashtool.net/downloads.php] and unzip it somewhere. There will be a couple of dependencies to grab in order to get this running, so go ahead and install them if need be:

~~~ bash
# 7Zip for extracting the package
sudo apt-get install p7zip-full

# Java to run the program
# http://openjdk.java.net/install/
sudo apt-get install openjdk-7-jre
~~~

You will also need to download the latest firmware update from Sony, which will weigh in at about 1.5GB. A good source is [http://xperiafirmware.com](http://xperiafirmware.com), but there are others. Just make sure you find an official/trusted source.

Next thing is to open the FlashTool GUI and begin flashing the device.

~~~ bash
# run as root
sudo -i

# navigate to the FlashTool directory and run it
cd /etc/udev/rules.d
./FlashTool
~~~

The FlashTool is straight forward, just follow these steps.

1. Turn your phone off (hold the power key and back button(or volume down) simultaneously)
2. Click the "Flash" icon and select "Flashmode"
3. Check the "Source folder" to where you downloaded the firmware update (*.ftf file)
4. Configure and options, or leave everything as default
5. Click the "Flash" button!

The FlashTool will ask you to start your phone in Flash mode, so go ahead and do that. The flash process might take a minute or two, after which you should have a shiny updated phone. If not, you may have an issue with the drivers (re-examine the udev steps), or a more serious issue with your device which I'm afraid I don't have a magic wand for.

Good luck, and drop a line if something important was omitted, or this tutorial was useful to you.




