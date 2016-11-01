---
title: JavaScript Object to Flash SWF ExternalInterface Bridge
date: 2014-03-27 08:54:36
tags: Programming, Code, JavaScript, Flash
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

Have you ever wanted to bind your ActionScript ExternalInterface callbacks to JavaScript object methods, rather than use free functions? I've always found the lack of a member function callback solution quite frustrating since it causes me to write ugly static event handlers that break the flow of my code. The other day while adding Flash video streaming to [Symple](/symple) day I came up with a simple solution that is worth sharing. 

The answer isn't rocket science, it's just a intermediary object registry which stores indexed delegate callbacks that can be called from Flash via a custom AS3 `ExternalInterface` wrapper.

To get started include the `JFlashBridge` object somewhere in your JavaScript.

~~~ javascript
var JFlashBridge = {
    items: {},

    bind: function(id, klass) {
        console.log('JFlashBridge: Bind: ', id, klass);
        this.items[id] = klass;
    },

    unbind: function(id) {
       console.log('JFlashBridge: Unbind: ', id);
       delete this.items[id]
    },

    call: function() {
        console.log('JFlashBridge: Call: ', arguments);
        var klass = this.items[arguments[0]];
        if (klass) {
            var method = klass[arguments[1]];
            if (method)
                method.apply(klass, Array.prototype.slice.call(arguments, 2));
            else
                console.log('JFlashBridge: No method: ', arguments[1]);
        }
        else
            console.log('JFlashBridge: No binding: ', arguments);
    },

    getSWF: function(movieName) {
        if (navigator.appName.indexOf("Microsoft") != -1)
            return window[movieName];
        return document[movieName];
    }
};
~~~ 

And include this ActionScript file in your Flash project (SWF):

~~~ javascript
package sourcey.util
{
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.utils.Timer;
	
	public class JFlashBridge
	{
		public var objectName:String = "";
		public var jsReadyFuncName:String = "isJSReady";     // optional
		public var swfLoadedFuncName:String = "onSWFLoaded"; // optional
		
		public function JFlashBridge()
		{
		}
		
		public function initialize():void 
		{
			if (ExternalInterface.available) {
				objectName = getSWFObjectName();
				try {
					if (checkReady()) {
						available = true;
					} else {
						trace("JavaScript is not ready yet, creating timer.");
						var readyTimer:Timer = new Timer(100, 0);
						readyTimer.addEventListener(TimerEvent.TIMER, onReadyTimer);
						readyTimer.start();
					}
				} catch (error:SecurityError) {
					trace("A SecurityError occurred: " + error.message);
				} catch (error:Error) {
					trace("An Error occurred: " + error.message);
				}
			} else {
				trace("JavaScript external interface is not available.");
			}
		}
		
		//
		// Adds a callback for receiving method calls from our
		// external JavaScript interface.
		//
		public function addMethod(name:String, callback:Function):void 
		{
			ExternalInterface.addCallback(name, callback);				
		}		
		
		//
		// Calls an external JavaScript method.
		//
		public function call(method:String, ...parameters):* {
			//if (!available)
			//	trace("The JavaScript API is unavailable.");
			var args:Array = [];
			args.push("JFlashBridge.call");
			args.push(objectName);
			args.push(method);
			return ExternalInterface.call.apply(ExternalInterface, args.concat(parameters));
		}		
		
		public function getSWFObjectName():String 
		{
			// Returns the SWF's object name for getElementById
			
			var js:XML;
			js = <script><![CDATA[
				function(__randomFunction) {
					var check = function(objects){
							for (var i = 0; i < objects.length; i++){
								if (objects[i][__randomFunction]) return objects[i].id;
							}
							return undefined;
						};
		
						return check(document.getElementsByTagName("object")) || check(document.getElementsByTagName("embed"));
				}
			]]></script>;
			
			var __randomFunction:String = "checkFunction_" + Math.floor(Math.random() * 99999); // Something random just so it's safer
			ExternalInterface.addCallback(__randomFunction, getSWFObjectName); // The second parameter can be anything, just passing a function that exists
			
			return ExternalInterface.call(js, __randomFunction);
		}
		
		//
		// Protected
		//
		
		private function checkReady():Boolean 
		{			
			trace("JavaScript ready status: ", isReady);
			var res:* = call(jsReadyFuncName);
			if (res == undefined ||
				res == null) {
				// If no function exists then we return ready.
				return true;
			}			
			return Boolean(res);
		}
		
		private function onReadyTimer(event:TimerEvent):void 
		{
			var isReady:Boolean = checkReady();
			if (isReady) {
				Timer(event.target).stop();
				available = true;
			}
		}	
		
		//
		// Accessors
		//		
		
		private var _available:Boolean = false;	
		public function get available():Boolean { return _available; }			
		public function set available(value:Boolean):void
		{
			if (_available != value) {
				_available = value;
				if (_available) {
					call(swfLoadedFuncName);					
				}
			}
		}
	}
}
~~~ 

Add the following lines to your main ActionScript class:

~~~ javascript
package
{
	import sourcey.util.JFlashBridge;

	public class MySWF
	{
		public var jsBridge:JFlashBridge;	

		public function SymplePlayer()
		{
			jsBridge = new JFlashBridge();
			jsBridge.addMethod("someMethod", someMethod);
			
			super();
			
			jsBridge.initialize();	
		}
		
        // This is an internal callback that passes data to
        // the JavaScript application
		private function onCallback(data:String):void 
		{	
			trace("MySWF: onCallback", data);	
			jsBridge.call("onCallback", data);
		}

        // This method is bound to the ExternalInterface to 
        // receive data from the JavaScript application
		private function someMethod(data:String):Object
		{
			trace("MySWF: someMethod", data);
            onCallback(data);
        }
    }		
}
~~~ 

Below is the JavaScript object that will be communicating with your SWF.
Be sure to change the path member to point to your SWF location on the server.

~~~ javascript
function MyClass() {
    this.path = "/my-swf.swf" // The SWF path
    this.id = "my-swf"        // The SWF ID
};

MyClass.prototype = {

    // Embeds and binds the SWF
    setup: function () {
        // Embed the SWF 
        swfobject.embedSWF(this.path, this.id, '100%', '100%', '10.0.0', '/playerProductInstall.swf', {}, {
            quality: 'high',
            wmode: 'transparent',
            allowScriptAccess: 'sameDomain',
            allowFullScreen: 'true'
         }, {
           name: this.id
         });  

        // Bind the current object to the SWF for callbacks.
        JFlashBridge.bind(this.id, this);
    },

    // Returns the SWF instance
    swf: function () {
        return JFlashBridge.getSWF(this.id);
    },

    // Calls a Flash method
    someMethod: function (data) {
        // Note: SWF must be ready
        return this.swf().someMethod(data);
    },

    // Receives a callback from Flash
    onCallback: function(data) {
        console.log("onCallback: ", data);
    }
}
~~~ 

The implementation would look something like this:

~~~ javascript
var obj = new MyClass()
obj.setup()

// Call obj.someMethod and "hello flash" will be echoed 
// back via the onCallback method of the MyClass instance
obj.someMethod("hello flash")
~~~ 

Hope it helps!
