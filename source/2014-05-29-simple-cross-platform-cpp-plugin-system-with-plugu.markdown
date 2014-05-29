---
title: Simple Cross-platform C++ Plugin System with Plugu
date: 2014-05-29
tags: code, cpp, api
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

# Simple Cross-platform C++ Plugin System with Plugu

When designing a plugin management system for C++ there are some important language nuances and gotchas to consider, such as binary compatibility, strict API versioning, and interprocess memory management. Sounds like fun right? Well, if you get it wrong then it sure as hell won't be, but if you get it right then it's really not so bad. We built Plugu as a simple and elegant solution to the issue, and we're sharing the code with you as open source. 

This article also talks about some key factors to consider when designing your own plugin API, and how we've addressed them in our own code.

## ABI and Binary Compatibility

The first issue to address is the [ABI (binary compatibility)](http://en.wikipedia.org/wiki/Application_binary_interface). Unless you want a suicide inducing customer support nightmare on your hands, then stick to this one simple rule: only ever pass POD (plain old data) data types between process boundaries.

This means no passing STL containers and other complex types between the application and plugins, and no throwing any standard exceptions either. "But this is C++!!", you cry in anguish, and unless you're rockin' a mullet with a stubbie cooler then who could blame you? In this case all we can do is bite our collective tongues and accept that that's the way it is. The reason is that the default standard libraries vary from compiler to compiler, and platform to platform, so if you really must use complex types then you will need to ensure that plugins are compiled on exactly the save version of exactly the same compiler using identical system libraries. In short, screw that!

There are alternatives, such as embedding the standard libraries in your project using [STLport](http://www.stlport.org) or similar to ensure consistency between platforms, but why bother? It's overkill. The easiest alternative it just to pass a `void*` or a `char*` buffer and encode/decode it as required across the process boundary.

The method we've been using recently is actually quite simple. Let's say that on the plugin side we have a single method which accepts arbitrary commands from the application. Commands are namespaced using a [REST](http://en.wikipedia.org/wiki/Representational_state_transfer) style interface like so `resource:action`, and the data buffer contains either a JSON encoded message which for representing and converting to an STL container such a `std::vector` or `std::map` to pass to the internal API, or it may just be a raw data buffer that can be used directly.

Take the following code for example:

~~~ cpp
bool onCommand(const char* node, const char* data, unsigned int size)
{    
    try {
        // Handle a JSON encoded options hash
        if (strcmp(node, "options:set") == 0) {   
            json::Value root;
            json::Reader reader;
            if (!reader.parse(data, size, root))          
                throw std::runtime_error("Invalid JSON format: " + reader.getFormatedErrorMessages());
                
            // Do something with JSON data here...
        }

        // Handle raw file data
        else if (strcmp(node, "file:write") == 0) {
            std::string path("test.bin");
            std::ofstream ofs(path, std::ios::out|std::ios::binary);
            if (!ofs.is_open())
                throw std::runtime_error("Cannot write to output file: " + path);
            ofs.write(data, size);
            ofs.close();
        }

        // Handle unknown commands
        else throw std::runtime_error("Unknown command");
    }
    catch (std::exception& exc) {
        // Catch exceptions here and return false.
        // You could set a lastError string here which is exposed to
        // the application that returns the error message as a char*.
        // See the full example for details.
        std::cerr << "Command error: " << exc.what() << std::endl;
        return false;
    }
    return true;
}
~~~

Using this method you're free to implement almost any kind of functionality without having to add new methods and break the API each time you roll out a new feature. Nice!

<!-- TODO: Helper methods that convert to data structures and throw exceptions -->

## Interprocess Memory Handling

One other simple rule that should be adhered to when building your plugin system is: any memory allocated by a process should be deallocated by the same process. 
Let's say the application asks the plugin to allocate and return a `char*` buffer, and then proceeds to delete the buffer when it's done with it. Honk! Big no no, you're asking for a crash.

Two examples, this is bad:

~~~ cpp
bool askPluginForSomeSugar(Plugin* plugin)
{    
    // allocate buffer of some sort
    char* data = plugin->gimmeSomeSugarBaby();

    // do something cool with data

    // don't manage memory data allocated by the other process!
    delete[] data;
}
~~~

This is good:

~~~ cpp
bool askPluginForSomeSugar(Plugin* plugin)
{    
    // allocate buffer of some sort
    char* data = plugin->gimmeSomeSugarBaby();

    // do something cool with data

    // hand the pointer back to the plugin to be deallocated
    plugin->putSugarBackInTheBowl(data);
}
~~~

## Plugin System API

Lets take a look at the simple plugin system API used by Plugu.
The API consists of a single header file that defines a set of macros which export a `PluginDetails` structure that exposes basic plugin information, a compile time API version, and a static function for instantiating plugins. By having an intermediary `PluginDetails` structure we can do some important runtime checks before safely instantiating the plugin.

The API also forward declares a `IPlugin` virtual base class for plugins which must be defined in your own code, see [Plugin API](#plugin-api).

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

#ifndef SCY_Plugu_H
#define SCY_Plugu_H


#include "scy/base.h"


namespace scy {
namespace plugu {


// Forward declare the plugin class which must be defined externally.
class IPlugin;

// Define the API version.
// This value is incremented whenever there are ABI breaking changes.
#define SCY_PLUGIN_API_VERSION 1
    
#ifdef WIN32
# define SCY_PLUGIN_EXPORT __declspec(dllexport)
#else
# define SCY_PLUGIN_EXPORT // empty
#endif

// Define a type for the static function pointer.
SCY_EXTERN typedef IPlugin* (*GetPluginFunc)();

// Plugin details structure that's exposed to the application.
struct PluginDetails {
    int apiVersion;
    const char* fileName;
    const char* className;
    const char* pluginName;
    const char* pluginVersion;
    GetPluginFunc initializeFunc;
};

#define SCY_STANDARD_PLUGIN_STUFF \
    SCY_PLUGIN_API_VERSION,       \
    __FILE__

#define SCY_PLUGIN(classType, pluginName, pluginVersion)     \
  extern "C" {                                               \
      SCY_PLUGIN_EXPORT scy::plugu::IPlugin* getPlugin()     \
      {                                                      \
          static classType singleton;                        \
          return &singleton;                                 \
      }                                                      \
      SCY_PLUGIN_EXPORT scy::plugu::PluginDetails exports =  \
      {                                                      \
          SCY_STANDARD_PLUGIN_STUFF,                         \
          #classType,                                        \
          pluginName,                                        \
          pluginVersion,                                     \
          getPlugin,                                         \
      };                                                     \
  }


} } // namespace scy::plugu


#endif // SCY_Plugu_H
~~~

## Plugin API

The plugin API defines the virtual `IPlugin` class that's forward declared in the [Plugin System API](#plugin-system-api) header. All virtual plugin methods and functionality are exposed by this class, which will be distributed to your clients and customers for extending and implementing their own plugins.

Blow is a bare-bones example that only implements a single `onCommand` method:

~~~ cpp
// testpluginapi.h

#ifndef SCY_TestPluginAPI_H
#define SCY_TestPluginAPI_H


#include "scy/plugu/plugu.h"


namespace scy {
namespace plugu {

  
class IPlugin
    // Virtual plugin interface
{
public:
    IPlugin() {};
    virtual ~IPlugin() {};

    virtual bool onCommand(const char* node, const char* data, unsigned int size) = 0;
        // Handles a command from the application.
};


} } // namespace scy::plugu


#endif
~~~

## Implementing Plugins

Plugin implementations extend from the [Plugin API](#plugin-api) to implement plugin functionality.

~~~ cpp
// testplugin.h

#ifndef SCY_TestPlugin_H
#define SCY_TestPlugin_H


#include "testpluginapi.h"


class TestPlugin: public scy::plugu::IPlugin 
    // Test plugin implementation
{
public:
    TestPlugin();
    virtual ~TestPlugin();

    virtual bool onCommand(const char* node, const char* data, unsigned int size);
        // Handles a command from the application.
};


#endif
~~~

~~~ cpp
// testplugin.cpp

#include "testplugin.h"
#include <iostream>


SCY_PLUGIN(TestPlugin, "Test Plugin", "0.1.1")


TestPlugin::TestPlugin()
{
    std::cout << "TestPlugin: Create" << std::endl;
}


TestPlugin::~TestPlugin() 
{
    std::cout << "TestPlugin: Destroy" << std::endl;
}
  

bool TestPlugin::onCommand(const char* node, const char* data, unsigned int size)
{
    std::cout << "TestPlugin: Command: " << node << ": " << data << std::endl;  
    // Process commands as required
    return true;
}
~~~

## Instantiating Plugin

Instantiating plugins and calling plugin methods from the application side is easy using the LibSourcey `SharedLibrary` class.

~~~ cpp
#include "scy/plugu/plugu.h"
#include "scy/sharedlibrary.h"
#include "testpluginapi.h"
#include <iostream>
#include <assert.h>


using namespace scy;


int main(int argc, char** argv) 
{ 
    // Set the plugin shared library location
    std::string path(SCY_INSTALL_PREFIX);
    path += "/bin/testplugin/testplugin";
#if WIN32
# ifdef _DEBUG
    path += "d.dll";
# else
    path += ".dll";
# endif
#else
    path += ".so";
#endif
    
  try {
      std::cout << "Loading: " << path << std::endl;

      // Load the shared library
      SharedLibrary lib;
      lib.open(path);
      
      // Get plugin descriptor and exports
      plugu::PluginDetails* info;
      lib.sym("exports", reinterpret_cast<void**>(&info));
      std::cout << "Plugin Info: " 
          << "\n\tAPI Version: " << info->apiVersion 
          << "\n\tFile Name: " << info->fileName 
          << "\n\tClass Name: " << info->className 
          << "\n\tPlugin Name: " << info->pluginName 
          << "\n\tPlugin Version: " << info->pluginVersion
          << std::endl;
      
      // API Version checking 
      if (info->apiVersion != SCY_PLUGIN_API_VERSION)
          throw std::runtime_error(
              util::format("Plugin ABI version mismatch. Expected %s, got %s.", 
                  SCY_PLUGIN_API_VERSION, info->apiVersion));
      
      // Instantiate the plugin
      auto plugin = reinterpret_cast<plugu::IPlugin*>(info->initializeFunc());
    
      // Call plugin methods
      assert(plugin->onCommand("some:command", "random:data", 11));  

      // Close the plugin and free memory
      std::cout << "Closing" << std::endl;
      lib.close();
  }
  catch (std::exception& exc) {
      std::cerr << "Error: " << exc.what() << std::endl;
      assert(0);
  }   

  return 0;
}
~~~

## Installing Plugu

For a full working example just build [LibSourcey](https://sourcey.com/libsourcey) with the [Plugu](https://github.com/plugu) module enabled, or see the [Plugu insallation guide](https://sourcey.com/plugu#installing) for more detailed instructions.

And there you have it, a super simple C++ plugin system that you can use in your own projects. Enjoy!
