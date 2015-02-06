# Auto Updates using Pacm C++ Package Manager

So you have coded a brilliant application, but now you need a way to keep it up-to-date, right? The good news is that C++ now has `pacm`, which works in a very similar way to popular package managers in other languages, such as `rubygems` for Ruby, and `npm` for NodeJS.

With `pacm` you can keep all your updated binaries on the server, and the client queries the server to determine if updates are available, and proceed to update as required.

There are a lot of factors to be considered when updating a native application, such as ABI compatability, versioning and file locks, especially if you have any kind of plugin architecture. That's the realm of the client implementation though, and outside the scope of this article, which only provides a generic solution to the issue at hand.

You have two main options here; you can embed Pacm and build it with your application; or you can distribute the command line tool with your executable and get the external process to do the heavy lifting.

## Embedding Pacm in Native Applications 

The advantage of embedding Pacm is that you get to work with the native API, which unlike the command line tool, has access to raw package data, progress updates and well ... the entire C++ language.

If you're embedding Pacm, then you can instantiate the package manager and download packages for the server like so:

~~~ cpp
pacm::PackageManager::Options options;
pacm::PackageManager pm(options);
pm.initialize();
pm.queryRemotePackages();
~~~

The next thing is to run `updatePackage` each time you run your application, or via a separate process, 
in order to download and install a newer version of the package if one is ever available. 
Note that the first time `updatePackage` is called the package will be installed if it hasn't been installed yet.

~~~ cpp
pm.updatePackage("SomeAutoUpdatingPackage");
~~~

Pretty simple right? Just the way it should be.

Things get a little more complicated if you are updating the current binary though, due to file locks. 
For that you need to run Pacm from a separate binary in exactly the same way. The workflow will be as follows, 
with _app_ representing the main application, and _updater_ representing the external updater binary.

TURN INTO PSEUDO CODE

**app**:

* _app_ starts
* _app_ checks for "unfinalized" updates
  * __True__: if "unfinalized" updates exist the _app_ exits and the _updater_ is run  
  * __False__: continue execution...  
* _app_ checks if a newer version is available from the server
  * __True__: _app_ installs the newer packages
    * __True__: continue execution... 
    * __False__: the package installation fails on "finalizing" because of a file lock (ie. trying to overwrite the current binary)
      * the _app_ exits and the _updater_ is run  
  * __False__: continue execution...  
   
**updater**:
   
* _updater_ waits for the _app_ to exit and finalizes the installation
* _updater_ exists and runs the _app_


The next thing would be to download the auto-updating package, which we will call `SomeAutoUpdatingPackage` from the server when the user first installs your software:
The basic workflow for auto updates is as follows:
* Remote 


pm.updateAllPackages();

## Updating 

With `pacm` it's easy to query the server and automatically update a local package set with one command from the binary

~~~ bash
pacm --endpoint https://someserver.com --uri /packages.json --update
~~~




 source code to query and update all your installed packages would look like this:



Bear in mind that 




For Auto updates 





Alternatively, you can just call the binary from your existing application. 



~~~ bash
~~~

If the exit code is `0`, then the command was run successfully.


. to do the heavy lifting without complicating your application.



call 

... two options, embed and redist ..









 it is the job of the client implementation to factor these 

If we were using a different language this would be easy. In Ruby we have `rubygems`, and NodeJS we have `npm`, but native C++ has come up short until `pacm`.

With `pacm` it's easy to query the server and automatically 

 keeps installed package manifests in JSON format on the local filesystem

This is a huge factor for native applications where things like ABI compatibility, versioning and file locks need to be considered, 
especially if you provide any kind of plugin architecture.


Over the last few years it's been interesting to watch most of the big companies on the internet transition from optional updates to automatic updates.
Gone are the days of the old fasioned "Do you want to update to version X?" dialog, now days what we tend to see is "You are now running version X" instead.
Since this post isn't about the moral implications of this transition, 
so I'll refrain from a rant, instead I'll show you how we implement 
this in out own applications easily and efficiently with the help of a little peice of open source software called `Pacm`.

Some of you may be farmiliar with our project, Anionu. Anionu has a native application called Spot, 
which is essentially a modular native plugin system that communicates with the Anionu API. 
In the case of Spot, auto updates are a must to ensure security fixes are always applied, 
and compatability is maintained with the current REST API.
None of the existing package managers out there met our requirements, 
they were all too convoluted or dependeny heavy, so we build `Pacm`.

In the example below




Spot consumes the Anionu API


For a native appliclation