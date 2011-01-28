define("bd/connect", ["bd/kernel", "dojo", "bd/declare"], function(bd, dojo) {
///
// Augments the bd namespace with machinery that extends the dojo connection framework.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

bd.connect= function(
  src,     //(object) The object that contains event.
           //(falsy) bd.global is the object that contains the event.
  event,   //(string) The function name in src that generates the event.
           //(function) The function is src that generates the event.
  watcher, //(string) The function name in dest that wants to watch the event.
           //(function) The function in dest that wants to watch the event.
  dest,    //(object) The object that contains watcher.
           //(falsy) bd.global contains watcher.
  vargs    //(variableArgs, optional) Zero or more arguments to automatically apply to watcher before any event arguments.
) {
  ///
  // dojo.connect with additional features.
  ///
  // As with all Backdraft functions that take a callback-like function argument, `(watcher, dest, vargs)`
  // is transformed to `bd.hitch(dest, watcher, arg1, arg2, ...)`.
  //warn
  // Owing to the bd.connect function signature, the dojo.connect argument dontFix is not available.
  ///
  // For example,
  //code
  // bd.connect(myWidget, "click", "myWatcher", myController, "this is a test");
  ///
  // results in the following (as other functionality discussed next)...
  //code
  // dojo.connect(myWidget, "click", bd.hitch(myController, "myWatcher", "this is a test"));
  ///
  // Unlike dojo.connect, bd.connect advises both the event and watcher sources if they contain the functions
  // adviseEventSource and adviseEventWatcher, respectively. Additionally, the handle returned is a full-fledged 
  // object that contains information about the connection and the method `disconnect` to facilitate 
  // disconnection (and prevent double-disconnects). See bd.connect.handle for details.
  return new bd.connect.handle(src || bd.global, event, dest || bd.global, watcher, dojo.connect(src, event, 0, bd.hitchCallback(arguments, 2)), dojoDisconnect);
};

var dojoDisconnect= function(handle) {
  dojo.disconnect(handle);
};

bd.disconnect= function(
  handle //(bd.connect.handle) A handle returned by bd.connect.
) {
  ///
  // Equivalent to `handle.disconnect()`.
  handle.disconnect();
};

bd.subscribe= function(
  topic,   //(string) The topic to subscribe to.
  watcher, //(string) The function name is dest that wants to watch the topic.
           //(function) The function in dest that wants to watch the topic.
  dest,    //(object) The object that contains watcher.
           //(falsy) bd.global contains watcher.
  vargs    //(variableArgs, optional) Zero or more arguments to automatically apply to watcher before any topic arguments.
) {
  ///
  // dojo.subscribe with additional features.
  ///
  // As with all Backdraft functions that take a callback-like function argument, `(watcher, dest, vargs)`
  // is transformed to `bd.hitch(dest, watcher, arg1, arg2, ...)`.
  // For example,
  //code
  // bd.subscribe("some/cool/topic", "myWatcher", myController, "this is a test");
  ///
  // results in the following (as other functionality discussed next)...
  //code
  // dojo.subscribe("some/cool/topic", bd.hitch(myController, "myWatcher", "this is a test"));
  ///
  // Unlike dojo.subscribe, bd.subscribe advises the watcher if it contains the function
  // adviseEventWatcher. Additionally, the handle returned is a full-fledged object with that contains information
  // about the connection and the method disconnect to facilitate disconnection (and prevent double-disconnects). See
  // bd.connect.handle.
  return new bd.connect.handle(dojo.publish, topic, dest, watcher, dojo.subscribe(topic, bd.hitchCallback(arguments, 1)), dojoUnsubscribe);
};

var dojoUnsubscribe= function(handle) {
  dojo.unsubscribe(handle);
};

bd.unsubscribe= function(
  handle //(bd.connect.handle) A handle returned by bd.subscribe.
) {
  ///
  // Equivalent to `handle.disconnect()`.
  handle.disconnect();
};


bd.connect.handle= bd.declare(
  ///
  // Manages connecting and disconnection events and watchers.
  ///
  // Construction of an object causes src.adviseEventSource (if any) and dest.adviseEventWatcher (if any) to be applied, thereby signaling
  // a connection.
  // 
  // The disconnect method causes the connection to be taken down via the disconnector property and src.adviseEventSource (if any)
  // and dest.adviseEventWatcher (if any) to be applied, thereby signalling a disconnection. The subsequent disconnects result in no-ops
  // and are therefore harmless.
  // 
  // This functionality can be used to define objects that ensure that all references are taken down when they are explicitly
  // destroyed. For the canonical example, study bd.visual.

  //superclasses
  [], 

  //members
  {
  src:
    ///
    //(any) The object that contains the event.
    ///
    // See bd.connect.handle.constructor.
    0,

  event:
    ///
    //(function) The function in src that is being watched.
    //(string) The function name in src that is being watched.
    ///
    // See bd.connect.handle.constructor.
    0,

  dest:
    ///
    //(any) The object that contains the watcher
    ///
    // See bd.connect.handle.constructor.
    0,

  watcher:
    ///
    //(function) The function in dest that is watcheding
    //(string) The function name in dest that is watching
    ///
    // See bd.connect.handle.constructor.
    0,

  handle:
    ///
    //(any) Opaque object that informs disconnector how to disconnect.
    ///
    // See bd.connect.handle.constructor.
    0,

  disconnector:
    ///
    //(function(handle)) Disconnects src.event from dest.water given handle.
    ///
    // See bd.connect.handle.constructor.
    0,

  uid:
    ///
    //(string) Legal JavaScript identifier as generated by bd.uid.
    ///
    // An application-wide unique identifier.
    bd.noDoc,

  constructor: function(
    src,         //(object) The object that contains event.
    event,       //(string) The function name in src that generates the event.
                 //(function) The function is src that generates the event.
    dest,        //(object) The object that contains watcher.
    watcher,     //(string) The function name is dest that wants to watch the event.
                 //(function) The function in dest that wants to watch the event.
    handle,      //(any) The handle returned by connecting function.
    disconnector //(function(handle)) The function to call to disconnect handle.
  ) {
    ///
    // Initializes a connection from src.event to dest.watcher and causes src.adviseEventSource (if any) and 
    // dest.adviseEventWatcher (if any) to be applied signalling a connection.
    this.src= src;
    this.event= event;
    this.dest= dest;
    this.watcher= watcher;
    this.handle= handle;
    this.disconnector= disconnector;
    this.uid= bd.uid();
  },

  postscript: function() {
    var o= this.src;
    if (o && bd.isFunction(o.adviseEventSource)) {
      o.adviseEventSource(this, true);
    }
    o= this.dest;
    if (o && bd.isFunction(o.adviseEventWatcher)) {
      o.adviseEventWatcher(this, true);
    }
  },

  disconnect: function() {
    ///
    // Disconnects a connection made by bd.connect.
    ///
    // Call dojo.disconnect as usual. Additionally calls event src.adviseEventSource and dest.adviseEventSource iff they exist.
    if (!this.src) {
      return;
    }
    var o= this.src;
    if (o && bd.isFunction(o.adviseEventSource)) {
      o.adviseEventSource(this, false);
    }
    o= this.dest;
    if (o && bd.isFunction(o.adviseEventWatcher)) {
      o.adviseEventWatcher(this, false);
    }
    this.disconnector(this.handle);
    this.src= this.event= this.dest= this.watcher= this.handle= this.disconnector= 0;
  }
});


});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

