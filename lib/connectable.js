define("bd/connectable", [
  "bd", 
  "bd/lang", 
  "bd/collections", 
  "bd/connect"
], function(bd) {
///
// Defines the bd.connectable class and associated machinery.

bd.deferredWatcherSink= 
  function() {
    ///
    // A no-op function used as the connection point when a class does not explicitly define its own connection point.
    ///
    // See bd.connectable, bd.connectable.deferredConnects, and bd.makeDeferredConnects for more details.
  };

bd.makeDeferredConnects= function(
  deferredConnects, //(bd.deferedConnectSet) //TODOC
  supers            //(zero or more constructor functions) Zero to many superclasses from which to get deferred connection information.
) {
  ///
  // Helper function to build the per-class bd.connectable.deferredConnects property. //Automatically
  // generates stub methods for deferred-connectable events as implemented in bd.connectable. For example,
  //code
  // bd.declare([bd.connectable],
  //   bd.makeDeferredConnects({
  //     onFocus: ["focus", "domNode"], 
  //     onClick: ["click", "domNode"]}
  //   );
  // );
  ///
  // Is equivalent to...
  //code
  // bd.declare([bd.connectable],
  //   deferredConnects: {
  //     onFocus: ["focus", "domNode"], 
  //     onClick: ["click", "domNode"]
  //   },
  //   onFocus: bd.deferredWatcherSink;
  //   onClick: bd.deferredWatcherSink;
  // );
  ///
  // The deferredConnects contents in each of the supers (if any) is included in the result. This information
  // is computed before the deferredConnects argument is computed and in the order given. This algorithm causes information
  // in deferredConnects to take precidence over information about the same
  // connection point in any super, and, similarly, information in the last super given to take precidence over information
  // in any previous super for any particular connection point. For example,
  //code
  // var
  //   A= bd.declare(
  //     // supers
  //     [],
  // 
  //     bd.makeDeferredConnects({
  //       onEvent1: ["event1A"]
  //       onEvent2: ["event2A"]
  //       onEvent3: ["event3A"]
  //     })
  //     // ...
  //   ),
  // 
  //   B= bd.declare(
  //     // supers
  //     [],
  // 
  //     bd.makeDeferredConnects({
  //       onEvent1: ["event1B"]
  //       onEvent3: ["event3A"]
  //     })
  //     // ...
  //   ),
  // 
  //   C= bd.declare(
  //     // supers
  //     [A, B],
  //     
  //     bd.makeDeferredConnects({
  //       onEvent3: ["event3C"]
  //     },
  //     A, B)
  //     // ...
  //   ),
  ///
  // The `deferredConnects` object created by bd.makeDeferredConnects in C's definition contains:
  // 
  //   * `onEvent3: ["event3C"]` since the deferredConnects argument overides all super arguments.
  //   * `onEvent1: ["event1B"]` since the the super B comes after the super A, its deffered connection info
  //     for the connection point onEvent1 wins over A's information.
  //   * `onEvent2: ["event2A]` since neither C nor B define this connection point and A was provided as a super to
  //     makeDeferredConnects.
  var result= {}, protoProps= {};
  for (var i= 1; i<arguments.length; i++) {
    bd.forEachHash(arguments[i].prototype.deferredConnects, function(rootEventSourceInfo, connectionPoint) {
      result[connectionPoint]= rootEventSourceInfo;
    });
  }
  bd.forEachHash(deferredConnects, function(rootEventSourceInfo, connectionPoint) {
    if (connectionPoint!="useEventSource" && connectionPoint!="otherSupers") {
      result[connectionPoint]= rootEventSourceInfo;
      protoProps[connectionPoint]= bd.deferredWatcherSink;
    }
  });
  protoProps.deferredConnects= result;
  return protoProps;
};

bd.connectable= bd.declare(
  ///
  // Mixin class that manages connections from, to, and within instances. 
  ///
  // This class provides adviseEventSource and adviseEventWatcher methods to keep track of connections to/from individiual instances as well as a destroy method that
  // disconnects all existing connections. This can be used to ease the burden of eliminating circular
  // references and thereby improve the performance of the JavaScript garbage collector.
  // 
  // The class also provides an implementation of "deferred connectable events". The idea is to define
  // a class that has the capability of signaling events but only make the necessary connections if
  // a client when demanded. This allows classes to provide rich
  // connection point interfaces without suffering the cost of making any of the connections until
  // a client actually connects.
  // 
  // Each potential connection is defined by a source event and a connection point. The connection point is always an instance method;
  // the source event may be any function or DOM event; see bd.connectable.deferredConnects for details.
  // Until and unless a client makes a connection to
  // the connection point no connections are made. However, when the first client attempts to connect to a connection point
  // by `bd.connect`, two connections are made: (1) a connection between the source event and the connection point, and (2) a connection
  // between the connection point and the client watcher. For example, assume you've defined a class that has the source event
  // (this.domNode, "click") and the connection point "onClick". When some client attempts to connect to the `onClick` connection
  // point on a particular instance of your class by executing `bd.connect(someInstance, "onClick", clientListener)`, `bd.connectable`
  // automatically makes the connection `bd.connect(this.domNode, "click", this, "onClick")`.
  // 
  // Notice that the connection point functions as both a watcher and an event source: it watches the source event, and then
  // sources that event to other watchers.
  // 
  // Another use for this machinery is to allow subclasses to define non-trivial connection point methods and (1) be free of the burden
  // of connecting to the source event, and (2) maintain a single, orderly flow from source events to any number of
  // watchers.
  // 
  // At the point in a class hierarchy that a deferred event is defined, a connection point for the deferred event *must* also be defined. If
  // the defining class has no need to watch the source event itself, then is must define the connection point  method to be
  // identical to bd.deferredWatcherSink. This causes the constructor to *not* connect the source event to
  // the connection point until some external client demands the connection. The convenience function bd.makeDeferredConnects is available to
  // automatically generate these function definitions.
  //warn
  // This class requires a postscript process to properly find and connect all non-trivial connection points. Often,
  // this class is used in a hierarchy that includes bd.visual which includes a sufficient postscript process. If
  // you are using this class in a derivation chain where no other class includes a postscript, then a default postscript
  // is supplied; if using this class in a derivation chain that includes a postscript, then ensure that this class's
  // postscript (or equivalent) is applied during the creation process.

  //superclasses
  [], 

  //members
  {
  deferredConnects: 
    ///
    // Map from connection points to event sources. //The map type is defined as 
    // {``connection-point-name``(string) --> [``source-event``(string or function), ``source-event-context``(string, falsy, object, optional)])}.
    // 
    // `classattr
    // 
    // For the source event:
    // 
    // * `["someMethodName"]` implies `this["someMethodName"]`.
    // * `[someFunction]` implies the function `someFunction`.
    // * `["somePropertyName", someObject]` implies the function `someObject["somePropertyName"]`
    // * `["someEventName", someDomNode]` implies the DOM event `"someEventName"` on someDomNode and therefore `addEventListener` is used to connect.
    // * `["someEventName", "somePropertyName"]` implies the function `this["somePropertyName"]["someEventName"]`; notice
    //   if `this["somePropertyName"]` is a DOM node then `addEventListener` is used to connect.
    // 
    // An entry in the map causes `bd.connect(``source-event``, ``connection-point-name``, this)` to executed the first time 
    // either of the following conditions are detected:
    // 
    //   * `this[``connection-point-name``]` is detected to be something other than `bd.deferredWatcherSink` at construction.
    //   * an attempt is made to connect to `this[``connection-point-name``]`
    // 
    // For classes derived from bd.connectable, simply defining a non-trivial connection point will automatically cause the
    // source event to be connected to the connection point. For example,
    //code
    // var myClass= bd.declare([bd.connectable], {
    //   deferredConnects: {onFocus: ["focus", "domNode"], onClick: ["click", "domNode"]},
    //   //etc.
    // });
    // 
    // var myClass= bd.declare("mySubclass", [myClass], {
    //   onFocus: function() {
    //     //do something spectacular!
    //   }
    // });
    // 
    // var o= new mySubclass();
    // // At this point bd.connect(this.domNode, "focus", "onFocus", this) has automatically been connected,
    // // but click has not!
    ///
    // Simply connecting to a connection point will be noticed and cause the connection point to be connected to the event source. For example,
    //code
    // // continuing from above...
    // bd.connect(o, "onClick", "someHandler", someController);
    // // causes two connects...
    // //
    // //   1. bd.connect(o.domNode, "click", "onClick", o);
    // //   2. bd.connect(o, "onClick", "someHandler", someContoller);
    {},

  deferredConnected:
    ///
    // Map that holds the handle that was returned when source event was connected in an instance of this class. //The map type is defined as 
    // {``connection-point``(string) --> bd.connect.handle}.
    // `private
    // `nosource
    0,

  connects:
    ///
    // Map that holds each bd.connect.handle that manages a connection to/from an instance of this class. //The map type is defined as 
    // {bd.connect.handle.uid --> bd.connect.handle}.
    // `private
    // `nosource
    0,

  connectConnectionPoint: function(
    connectionPointName
  ) {
    if (!this.deferredConnected[connectionPointName]) {
      var 
        eventSourceInfo= this.deferredConnects[connectionPointName],
        event= eventSourceInfo[0],
        source= eventSourceInfo[1] || this.deferredSource || this;
      bd.isString(source) && (source= this[source]);
      this.deferredConnected[connectionPointName]= bd.connect(source, event, connectionPointName, this);
    }
  },

  postcreateDom: function() {
    // connect up deferred connects if there's a non-trivial handler defined...
    this.inherited(arguments);
    this.connects= {};
    this.deferredConnected= {};
    var deferredWatcherSink= bd.deferredWatcherSink;
    bd.forEachHash(this.deferredConnects, function(eventSourceInfo, connectionPointName) {
      if (this[connectionPointName]!==deferredWatcherSink) {
        this.connectConnectionPoint(connectionPointName);
      }
    }, this);
  },

  destroy: function() {
    ///
    // Disconnect all connections made to and from this object.

    // can't just iterate through connects because disconnect calls this.advise* which modifies connects
    bd.forEachHashSafe(this.connects, function(handle, uid) {
      handle.disconnect();
    });
    bd.forEachHashSafe(this.deferredConnected, function(handle, connectionPointName) {
      handle.disconnect();
    });
  },

  adviseEventSource: function(
    handle,    //(bd.connect.handle) Information about the connection.
    connecting //(boolean) true if connecting, false if disconnecting.
  ) {
    ///
    // Records this instance serves an event source. //Automatically called by bd.connect; see bd.connect.
    //note
    // Typically, this method is not applied by client code; instead, it is called automatically by bd.connect.
    if (connecting) {
      this.connects[handle.uid]= handle;
      this.deferredConnects[handle.event] && this.connectConnectionPoint(handle.event);
    } else {
      delete this.connects[handle.uid];
    }
  },

  adviseEventWatcher: function(
    handle,    //(bd.connect.handle) Information about the connection.
    connecting //(boolean) true if connecting, false if disconnecting.
  ) {
    ///
    // Records this instance serves an event watcher. //Automatically called by bd.connect; see bd.connect.
    //note
    // Typically, this method is not applied by client code; instead, it is called automatically by bd.connect.
    if (connecting) {
      this.connects[handle.uid]= handle;
    } else {
      delete this.connects[handle.uid];
    }
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
