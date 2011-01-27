define("bd/command/dispatch", [
  "dojo", "dijit", "bd", "bd/command/namespace",
  "bd/async"
], function(dojo, dijit, bd) {
///
// Augments the bd.command namespace with the Backdraft command dispatch machinery.

var 
  hotContext= {
    cps: 
      // Array of no-op stub command handlers to dojo.connect one or more real handlers.
      {},
    handles:
      // Array of connections into this context
      []
  },

  contexts= [hotContext],

  dojoDisconnect= function(handle) {
    dojo.disconnect(handle);
  };

bd.docGen("bd.command", {
  context:
    ///type
    // (object) Simple container that holds a map of connection points at `cps` and connect handles at `handles`. See bd.command.hotContext.
    bd.nodoc
});

dojo.mixin(bd.command, {
  hotContext: 
    ///
    // (bd.command.context) The current active command context.
    ///
    // This variable controls connections between a bd.command.id and the handlers connected for that id. The first time a command handler
    // connects to some bd.command.id, say `cid`, via bd.command.connect, a single conection point is created at `hotContext.cps[cid]`. The connection
    // point is nothing more than than the function `function(){}`. With this in place, bd.connect is used to connect the connection point
    // to the handler. Subsequent handlers can also connect to the same connection point thus allowing a several handlers to be applied
    // when a single bd.command.id is dispatched. A bd.command.id is dispatched by applying the connection point associated with the id (i.e., executing
    // `hotContext.cps[cid]`). This should never be down directly, but rather through bd.command.dispatchCommand, bd.command.scheduleCommand, or,
    // as is usually the case, indirectly through a menu or accelerator.
    // 
    // When a command is connected, the handle returned by bd.connect is returned (see bd.connect). The Backdraft command machinery allows
    // the current hot context to be pushed and poped via bd.pushContext and bd.popContext. In order to ease the burden of disconnecting
    // handlers, each hotContext keeps a reference to all connection handles and when a hotContext is popped, automatically disconnects those
    // handles. Owing to the design of bd.connect, if client code decided to assume the responsibility of explicitly disconnecting, these
    // double-disconnects would result in a no-op. This design eases the burden of eliminating circular references and can improve the performance of the
    // JavaScript garbage collector.
    hotContext,

  contexts: 
    ///
    // (array of bd.command.context) The stack of previously active command contexts.
    contexts,

  pushContext: function() {
    ///
    // Saves the current bd.command.hotContext on a stack and creates a new, virgin hotContext. //The saved context
    // can be restored via bd.command.popContext.
    contexts.push(hotContext);
    hotContext= bd.command.hotContext= {cps:[], handles:[]};
  },

  popContext: function() {
    ///
    // Restores a bd.command.hotContext previously save by bd.command.pushContext.
    bd.forEach(hotContext.handles, function(h) {
      h.disconnect();
    });
    hotContext= bd.command.hotContext= contexts.pop();
  },

  connect: function(
    id,       //(bd.command.id) The command that triggers the handler.
    callback, //(bd.commandHandler) The function to apply when the command is dispatched.
    context,  //(object, optional) Context in which to apply callback.
    vargs     //(variableArgs, optional) Zero or more arguments for application of callback.

  ) {
    ///
    // Causes bd.command.dispatchCommand to apply callback when command is dispatched.
    bd.docGen("overload",
      function(
        hash //(hash:bd.command.id --> bd.commandHandler or [callback, context, vargs]) A set of command (id, handler)s to connect
      ) {
        ///
        // Applies bd.command.connect(id, handler) for each (id, handler) in hash. If handler is an array, then
        // then bd.command.connect(id, handler[0], handler[1], handler[2], ..., handler[n]) is applied for id; otherwise
        // bd.command.connect(id, handler) is applied.
      }
    );
    var result;
    if (arguments.length==1) {
      result= {};
      bd.forEachHash(id, function(callback, id) {
        if (bd.isArray(callback)) {
          result[id]= bd.command.connect.apply(bd.command, [id].concat(callback));
        } else {
          result[id]= bd.command.connect(id, callback);
        }
    });
      return result;
    } else {
      if (!hotContext.cps[id]) {
        //stub for other connections
        //TODO: no way to take down the last fp if all connections are disconnected
        hotContext.cps[id]= function(){};
      }
      result= new bd.connect.handle(bd.command.connect, id, context, callback, dojo.connect(hotContext.cps, id, bd.hitchCallback(arguments, 1)), dojoDisconnect);
      hotContext.handles.push(result);
      return result;
    }
  },

  createEvent: function(
    args //(hash) Properties to mixin to the new bd.commandObject
  ) {
    ///
    // Returns a new bd.commandObject object initialized with default values and mixed with args.
    return dojo.mixin({
      id:null,
      source:null,
      activeStack:dijit._activeStack,
      eventObject:null,
      stopEvent:true
    }, args);
  },

  eventObject: {
    ///type
    // (hash) Describes the current command being dispached.
    ///
    // This object is passed to each command handler associated with a particular command whcn that command is dispatched. 
    // Note that it is perfectly acceptable for applications to add addtional properties to this object as the command is
    // dispatched to communicate additional state information between command handlers.

    id:
      ///
      // (bd.command.id) The command being dispatched.
      bd.nodoc,

    source:
      ///
      // (object) The widget (menu, context menu, toolbar, etc.) that caused the command to be executed; null if an accelerator.
      bd.nodoc,

    activeStack:
      ///
      //(array of string) The active focus stack, as given by widget identifiers, at the time the command was issued.
      bd.nodoc,

    eventObject:
      ///
      // (DOM.event) The event object that caused the command, if any.
      bd.nodoc,

    stopEvent:
      ///
      // (boolean) Instructs the dispatcher to apply dojo.stopEvent on the eventObject at the completion of dispatching.
      bd.nodoc
  },

  dispatchCommand: function(
    id,   //(bd.command.id) The id property of the command item.
    source,      //(object) The widget (menu, context menu, toolbar, etc.) that caused the command to be executed; null if an accelerator.
    activeStack, //(array of string) The active focus stack, as given by widget identifiers, at the time the command was issued.
    eventObject  //(DOM.event) The event object that caused the command, if any.
  ) {
    ///
    // Dispatches a command.
    ///
    // After creating a bd.command.eventObject (call this object `ceo`), the dispatching algorithm is given as follows:
    // 
    // 1. `dojo.publish("bdExecCommandStart", [ceo])`
    // 2. Apply each connected command handler, passing `ceo`, in the order they were connected.
    // 3. `dojo.publish("bdExecCommandCapture", [ceo])`
    // 4. Apply `execCommand` for each object in the active stack that defines `execCommand`, passing `ceo`, from the bottom of
    //    the stack to the top.
    // 4. `dojo.publish("bdExecCommandBubble", [ceo])`
    // 5. Apply `execCommand` for each object in the active stack that defines `execCommand`, passing `ceo`, from the top of
    //    the stack to the bottom.
    // 6. `dojo.publish("bdExecCommandEnd", [ceo])`
    //
    // Typically, this function is called automatically consequent to a menu selection of accelerator; however, is it perfectly
    // acceptable to explicitly dispatch a command through this function. In such cases, the arguments `source`, `activeStack`, and
    // `eventObject` can be constructed with semantics that make sense to the task at hand.

    source= source || null;
    activeStack= activeStack || [];
    eventObject= eventObject || null;
    var commandEventObject= {
      id:id,
      source:source,
      activeStack:activeStack,
      eventObject:eventObject,
      stopEvent:true
    };
    dojo.publish("bdExecCommandStart", [commandEventObject]);
    var fp= hotContext.cps[id];
    if (fp) {
      fp(commandEventObject);
    }
    dojo.publish("bdExecCommandCapture", [commandEventObject]);
    var
      widget,
      i= 0,
      end= activeStack.length;
    for (; i<end; i++) {
      widget= dijit.byId(activeStack[i]);
      if (widget && widget.execCommand) {
        widget.execCommand(commandEventObject, "capturing");
      }
    }
    dojo.publish("bdExecCommandBubble", [commandEventObject]);
    for (i= end; i--;) {
      widget= dijit.byId(activeStack[i]);
      if (widget && widget.execCommand) {
        widget.execCommand(commandEventObject, "bubbling");
      }
    }
    dojo.publish("bdExecCommandEnd", [commandEventObject]);
    if (eventObject && commandEventObject.stopEvent) {
      dojo.stopEvent(eventObject);
    }
  },  

  asyncQ:
    ///
    // (array of bd.command.id) The asynchronous queue of commands pending execution.
    // `private
    [],

  asynchDispatcher: function() {
    ///
    // Executes all the commands in the asynchronous command queue
    //note
    // Commands that are added to the asynchronous queue while executing commands in the asynchronous queue are executed under a different (later) asynchronous event.
    // `private

    // other asynchronous commands me be added while processing the current queue; guarantee that these are processed in a different asynch event
    var queue= this.asyncQ;
    this.asyncQ= [];
    for (var i= 0, end= queue.length; i<end; i++) {
      var item= queue[i];
      try {
        bd.command.dispatchCommand(item.id, item.source, item.activeStack, item.eventObject);
      } catch (e) {
        console.debug("exception in bd.command.doCommand", e);
      }
    }
  },

  scheduleCommand: function(
    id,   //(bd.command.id) The id property of the command item.
    source,      //(object) The widget (menu, context menu, toolbar, etc.) that caused the command to be executed; null if an accelerator.
    activeStack, //(array of string, optional, null) The active focus stack as given by widget identifiers at the time the command was issued.
    eventObject  //(DOM.event, optional, null) The event object that caused the command, if any.
  ) {
    ///
    // Executes a command asynchronously. //Asynchronous command dispatch is useful
    // when you want the display to settle before executing a command (e.g., menus)
    bd.command.asyncQ.push({
      id:id,
      source:source||null,
      activeStack:activeStack||null,
      eventObject:eventObject||null
    });
    if (bd.command.asyncQ.length==1) {
      bd.async.schedule("last", "asynchDispatcher", this);
    }
  }
});

return bd.command;

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

