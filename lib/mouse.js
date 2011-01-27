define("bd/mouse", [
  "dojo", "bd",
  "bd/collections"
], function(dojo, bd) {
///
// Augments the bd namespace with mouse capture machinery.

bd.mouse= 
  ///namespace 
  // Contains the mouse capture/release machinery.
  bd.mouse || {};

var
  doc= document,
  events= {mousedown:0, mouseup:0, mousemove:0, mouseover:0, mouseout:0, click:0, dblclick:0, blur:0},
  registeredHandlers= null,
  onReleaseAdvise= 0,
  registerHandlers,
  removeHandlers;

if (doc.addEventListener) {
  //normal case...
  registerHandlers= function(
    handlers,
    registeredHandlers
  ){
    var createHandler= function(handler, blur) {
      return function(e) {
        if (handler) {
          handler(e);
        }
        if (blur) {
          bd.mouse.release();
        } else {
          e.preventDefault();
        }
        e.stopPropagation();
      };
    };
    bd.forEachHash(dojo.mixin({}, events, handlers), function(handler, event) {
      registeredHandlers[event]= createHandler(handler, event=="blur");
      doc.addEventListener(event, registeredHandlers[event], true);
    });
  };

  removeHandlers= function(handlers){
    bd.forEachHash(handlers, function(handler, event) {
      doc.removeEventListener(event, handler, true);
    });
  };
} else if (doc.attachEvent) {
  //IE...
  registerHandlers= function(
    handlers,
    registeredHandlers
  ){
    var createHandler= function(handler, blur) {
      return function() {
        var e= dojo._event_listener._fixEvent(window.event);
        if (handler) {
          handler(e);
        }
        if (blur) {
          bd.mouse.release();
        } else {
          e.preventDefault();
        }
        e.stopPropagation();
      };
    };

    var element= doc.body;
    element.setCapture();
    bd.forEachHash(dojo.mixin({}, events, handlers), function(handler, event) {
      var registeredEvent= event=="blur" ? "onlosecapture" : "on" + event;
      registeredHandlers[registeredEvent]= createHandler(handler, event=="blur");
      element.attachEvent(registeredEvent, registeredHandlers[registeredEvent]);
    });
  };

  removeHandlers= function(handlers){
    var element= doc.body;
    bd.forEachHash(handlers, function(handler, event) {
      element.detachEvent(event, handler);
    });
    element.releaseCapture();
  };
} else {
  //TODO: warning and/or exception
}

bd.mouse.capture= function(
  by,            //(any) The objet that captured the mouse.
  handlers,      //(bd.mouse.handlerHash) The set of events and their handlers to capture.
  releaseAdvise  //(function(), optional) The function to call when the capture is released.
){
  ///
  // Captures the mouse. //Upon return, all mouse events cause any associated handler in handlers to be executed. The event object
  // is automatically instructed to prevent default processing and stop propagation.
  //
  // At a minimum, the mousedown, mouseup, mousemove, mouseover, mouseout, click, dblclick, and blur events are captured; other
  // events may be captured if specified in handlers.
  // 
  // handlers need not be completely filled with all events mentioned above. For example, if the capture client
  // has no need to process the mouseover event, then that entry can be set to falsy or be left missing from the hash.
  // The capture machinery will still connect to this event, stop default processing, stop propagation, and then
  // simply return rather then calling a client-provided handler.
  //
  // Upon reception of a blur event or execution of bd.mouse.release, the capture is released and releaseAdvise (if any) is called.
  // Attempts to call bd.mouse.capture without a subsequent release are ignored.
  //
  //return
  //(true) The mouse was successfully captured.
  //(false) The mouse is already captured.

  if (registeredHandlers) {
    //only one capture at a time...
    return false;
  }

  //doc and onReleaseAdvise persist during the capture lifetime
  doc= document;
  onReleaseAdvise= releaseAdvise;
  registeredHandlers= {};
  registerHandlers(handlers, registeredHandlers);
  bd.mouse.capture.by= by;
  dojo.publish("bd/mouse/captured", [by]);
  return true;
};

bd.docGen("bd.mouse", {
  handlerHash:
    ///type
    // A hash of event names to event handlers.  //For example,
    // in order to process each mousemove event, the following bd.mouse.handlerHash
    // could be provided:
    // 
    //code
    // {
    //   mousemove: function(e) {
    //     //do something interesting
    //   }
    // }
    ///
    // Note that e.preventDefault() and e.stopPropagation() are automatically called by
    // the capture machinery on each event (see bd.mouse.capture).
    // 
    // These events are triggered according to standard DOM semantics.
    // 
    // When called, any provided handler function will be passed an event object as normalized by dojo (i.e.,
    // it looks like a standards-based event object even if IE happens to be the browser).
    {}
});

bd.mouse.release= function() {
  ///
  // Releases the current capture and restores execution of other mouse handlers. //See bd.mouse.capture

  //guard against client recursion
  if (!registeredHandlers) {
    return;
  }

  removeHandlers(registeredHandlers);
  registeredHandlers= null;
  bd.mouse.capture.by= null;
  dojo.publish("bd/mouse/released");

  if (onReleaseAdvise) {
    // just in case onReleaseAdvise throws...
    var temp= onReleaseAdvise;
    onReleaseAdvise= 0;
    temp();
  }
};

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

