define("bd/test/space", [
  "dojo", "dijit", "bd", "bd/test/robot", "bd/async"
], function(dojo, dijit, bd, robot) {
///
// Defines the class bd.test.space and associated machinery.

bd.test.spaces=
  ///
  // Holds all bd.test.space instances.
  ///
  // (map:``space``.id --> ``space``) Map from space instance `id` to space instance.
  {};

bd.test.space= bd.declare(
  ///
  // Manages the execution of a test tree. //Class instances are assigned a new unique identifier at
  // property `id` and stored in bd.test.spaces[```id```] upon construction. The framework anticipates
  // the possibility of concurent execution of multiple test trees, with each bd.test.space instance controlling
  // a single execution thread; see bd.test.activeSpace.
  
  //superclasses
  [],

  //members
  {
  breakFrequency:
    ///
    // The frequency in milliseconds that the test executer stops to give others a chance to execute.
    1000,

  debugOnFail:
    ///
    // Causes the text executer to call the debugger upon a failure if true, and conversely.
    false,

  abortOnFail:
    ///
    // Causes the text executer to abort the test upon the first failure detected if true, and conversely.
    true,

  abortOnScaffoldFail:
    ///
    // Causes the text executer to abort the test upon the first failure of a scaffold if true, and conversely.
    true,

  constructor: function(
    args
  ) {
    ///
    // Creates a new instance. //Mixes args into new instance.
    bd.docGen("kwargs", {
      breakFrequency:
        // (integer, optional, bd.test.space.breakFrequency) Override the default.
        undefined,

      debugOnFail:
        // (boolean, optional, bd.test.space.debugOnFail) Override the default.
        undefined,

      abortOnFail:
        // (boolean, optional, bd.test.space.abortOnFail) Override the default.
        undefined,

      abortOnScaffoldFail:
        // (integer, optional, bd.test.space.abortOnScaffoldFail) Override the default.
        undefined,

      name:
        // (string, optional, this.id) The `name` property value.
        undefined,

      publisher:
        // (bd.test.publisher, optional, new bd.test.publisher()) The destination for test results.
        undefined
    });
    args && dojo.mixin(this, args);

    this.id= bd.uid();
    bd.test.spaces[this.id]= this;
    !this.name && (this.name= this.id);
    !this.publisher && (this.publisher= new bd.test.publisher());
  },

  destroy: function() {
    ///
    // Removes the space from the bd.test.spaces collection.
    delete bd.test.spaces[this.id];
  },

  execute: function(
    root,         //(bd.test.proc) The root of the test tree to execute.
    finishHandler //(function(bd.test.space) //Function to call upon completion of test; this space is passed as the single argument.
  ) {
    ///
    // Execute the test process given by the hierarchy rooted at root; call finishHandler when the process completes.
    if (this.stream) {
      console.warn("Space cannot start a new test sequence since it is currently executing a sequence.");
      return false;
    }
    dojo.mixin(this, {
      stream:new bd.test.space.stream(),
      finishHandler:finishHandler || bd.noop,
      passCount:0,
      failCount:0,
      toDoCount:0,
      scaffoldErrorCount:0,
      results:[],
      deferred:new dojo.Deferred()
    });
    root.traverse(this.stream, true);
    return this.execute_();
  },

  execute_: function() {
    ///
    // The test execution engine.
    // `private
    //warn
    // This routine should not be called directly by client code; use bd.test.execute.
    if (!this.stream) {
      //some scaffold or demo panicked and probably called execAbort
      return false;
    }
    var
      stream= this.stream,
      startTime= bd.getTime(),
      result, next;
    bd.test.pushActiveSpace(this);
    while (!stream.exhausted()) {
      if ((this.scaffoldErrorCount && this.abortOnScaffoldFail) || (this.failCount && this.abortOnFail)) {
        this.execAbort();
        break;
      }
      if (bd.getTime()-startTime > this.breakFrequency) {
        var deferred= new dojo.Deferred();
        setTimeout(function(){ deferred.callback(true); }, 5);
        //add the continuation and then return the deferred to wait on before executing the contination...
        deferred.addCallback(this, "execute_");
        break;
      }
      next= stream.get();
      result= true;
      try {
        if (next.traverseIn) {
          this.publisher.publish("traverseIn", next.proc);
          result= next.proc.traverseIn(this);
        } else {
          result= next.proc.traverseOut(this);
        }
      } catch (e) {
        //unexpected exception...
        //an executing phase proc should never get here because it should fully process all its own errors...
        this.unexpectedException(e, next.proc, false, "scaffolding", next.traverseIn);
        stream.skip();
      }
      if (result instanceof dojo.Deferred) {
        result.addCallbacks(
          dojo.hitch(this, function(result) {
            if (result===bd.test.proc.failed) {
              //an executing phase proc should never get here because it should fully process all its own errors...
              this.scaffoldFailed(next.proc, next.traverseIn);
              stream.skip();
            }
            if (!next.traverseIn) {
              this.publisher.publish("traverseOut", next.proc);
            }
            return this.execute_();
          }),
          dojo.hitch(this, function(e) {
            //an executing phase proc should never get here because it should fully process all its own errors...
            this.unexpectedException(e, next.proc, false, "scaffolding", next.traverseIn);
            if (!next.traverseIn) {
              this.publisher.publish("traverseOut", next.proc);
            }
            stream.skip();
            return this.execute_();
          })
        );
        break;
      } else if (result===bd.test.proc.failed) {
        //an executing phase proc should never get here because it should fully process all its own errors...
        this.scaffoldFailed(next.proc, next.traverseIn);
        if (!next.traverseIn) {
          this.publisher.publish("traverseOut", next.proc);
        }
        stream.skip();
      } else if (!next.traverseIn) {
        this.publisher.publish("traverseOut", next.proc);
      }
    }
    if (stream && stream.exhausted() && !(result instanceof dojo.Deferred)) {
      this.finishExec();
    }
    bd.test.popActiveSpace();
    return result;
  },

  execAbort: function() {
    ///
    // Called by the test execution engine to abort a test process. //Attempts to clean up
    // scaffold (but no guarantee), and then calls bd.test.space.finishExec.
    if (this.stream) {
      //assume the previous this.stream.get was fully executed
      this.publisher.publish("abort");
      var next= this.stream.get();
      if (next) {
        var p= next.traverseIn ? next.proc.parent : next.proc;
        while (p && p!==bd.test.proc.root) {
          try {
            p.traverseOut(this);
          } catch (e) {
            //quiet...
          }
          p= p.parent;
        }
      }
      this.finishExec();
    }
  },

  finishExec: function() {
    ///
    // Calls the finishHandler for this test process and then deletes all process properties. //If
    // the client (the code that started the test) wants to keep the results around after the
    // test process has completed, then it should take its own reference in the finish handler.
    this.finishHandler(this);
    delete this.stream;
    delete this.finishHandler;
    delete this.passCount;
    delete this.failCount;
    delete this.toDoCount;
    delete this.scaffoldErrorCount;
    delete this.results;
    delete this.deferred;
  },

  startDemo: function(
    proc
  ) {
    ///
    // Called by the test execution engine just before a demo function--including associated each scaffolds--is executed.
    this.publisher.publish("startDemo", proc);
  },

  endDemo: function(
    proc
  ) {
    ///
    // Called by the test execution engine just after a demo function--including associated each scaffolds--has executed.
    this.publisher.publish("endDemo", proc);
  },

  scaffoldFailed: function(
    proc,
    traverseIn
  ) {
    ///
    // Called by the test execution engine when a scaffold failure is detected.
    this.adviseResult(bd.test.result.fail(proc, traverseIn));
    this.publisher.publish("scaffoldFailed", proc, traverseIn);
    this.scaffoldErrorCount++;
  },

  demoFailed: function(
    proc,
    traverseIn
  ) {
    ///
    // Called by the test execution engine when a demo failure is detected.
    ///
    // no-op; normally, this should be published directly in the demo (e.g., "the(something).is(expected)").
    // This hook is here for symetric completeness of the interface: client code can either override or dojo.connect to this method.
  },

  unexpectedException: function(
    e,         // (anything) the exception object
    proc,      // (bd.test.proc) the proc that caused the exception
    demo,      // (boolean) false => scaffold; true => demo
    phase,     // ("scaffolding" | "executing") the phase of the test runner algorithm in which the error occured
    traverseIn // (boolean) traversing in or out during phase
  ){
    ///
    // Called by the test execution engine when an exception happens that the test code did not anticipate.
    console.error(e);
    this.adviseResult(bd.test.result.exception(e, proc, demo, phase, traverseIn));
    if (demo) {
      this.publisher.publish("demoThrew", proc, traverseIn);
      this.failCount++;
    } else {
      this.publisher.publish("scaffoldThrew", proc, traverseIn);
      this.scaffoldErrorCount++;
    }
  },

  adviseResult: function(
    result
  ) {
    ///
    // Called when a result is determined; typically by bd.test.the.
    this.results.push(result);
    this.publisher.publish("result", result);
    if (result.pass) {
      this.passCount++;
    } else {
      this.failCount++;
      if (this.debugOnFail) {
        debugger;
      }
    }
  },

  scheduleProc: function(
    delay, //(integer) The delay in milliseconds before proc is executed.
    proc   //(function(bd.test.space) The function to execute.
  ) {
    ///
    // Execute proc after delay milliseconds.
    ///
    // Sets bd.test.activeSpace to this space before calling proc; passes this space as the sole argument to proc.
    // `return The a dojo.deferred object that waits for proc to execute; the deferred returns the result of proc.
    var
      me= this,
      result= new dojo.Deferred();

    setTimeout(
      function() {
        bd.test.activeSpace= me;
        result.callback(proc(me));
      },
      delay
    );
    return result;
  },

  watch: function(
    frequency, //(integer) The frequency in milliseconds to execute proc.
    maxDelay,  //(integer) The maximum number of milliseconds to try proc before assuming failure.
    proc       //(function(bd.test.space) The function to execute.
  ) {
    ///
    // Execute proc every frequency milliseconds until proc returns true or maxDelay is reached.
    ///
    // Returns a dojo.deferred that waits for proc to return true of maxDelay milliseconds to elapse. The Deferred returns
    // true if proc returned true in time; false if proc fails to return true in  maxDelay milliseconds or if proc threw an exception. 
    // Further, if proc throws an exception, then the error object is advised as a result.
    var
      me= this,
      result= new dojo.Deferred(),
      startTime= bd.getTime(),
      timerId= setInterval(
        function() {
          bd.test.activeSpace= me;
          try {
            var testDone= proc(me);
          } catch (e) {
            clearInterval(timerId);
            me.adviseResult(bd.test.result.exception(e));
            result.callback(false);
          }
          if (testDone) {
            clearInterval(timerId);
            result.callback(true);
          } else if (maxDelay < bd.getTime()-startTime) {
            clearInterval(timerId);
            me.adviseResult(bd.test.result.timeout());
            result.callback(false);
          }
        }, frequency
      );
    return result;
  },

  sandbox: function(
    module,
    testName,
    maxLoadDelay
  ) {
    maxLoadDelay= maxLoadDelay || 10000;
    var
      me= this,
      result= new dojo.Deferred(),
      startTime= bd.getTime(),
      timerId= setInterval(
        function() {
          if (maxLoadDelay < bd.getTime()-startTime) {
            clearInterval(timerId);
            timerId= 0;
            me.adviseResult(bd.test.result.timeout());
            result.callback(false);
          }
        }, 100
      ),
      frame= this.getIframe(),
      url= module.substring(0, 4)=="url:" ? module.substring(4) : dojo.url(module);
    frame.attr("src", url);
    var h= dojo.subscribe("frame-loaded", function(frameWindow) {
      if (frame.iframeNode.contentWindow===frameWindow) {
        dojo.unsubscribe(h);
        frameWindow.define(["bd/test"], function(test) { 
          test.loader.load(testName, function(module) {
            var tempSpace= new test.space({publisher:me.publisher});
            if (timerId) {
              //the test has NOT timed out yet; therefore, proceed...
              clearInterval(timerId);
              tempSpace.execute(module, function() {
                me.passCount+= tempSpace.passCount;
                me.failCount+= tempSpace.failCount;
                me.toDoCount+= tempSpace.toDoCount;
                me.scaffoldErrorCount+= tempSpace.scaffoldErrorCount;
                result.callback(tempSpace.failCount+tempSpace.scaffoldErrorCount==0);
              });
            } else {
              //TODO clean up the iframe
            }
          });
        });
      }
    });
    return result;
  },

  getNode: function(
    target //(id) a string that gives a DOM id; the id must not start with "wid:"
           //(widget-id) a string of the form "wid:<widget-id>" that gives a widget id
           //(node) a DOM node
           //(widget) a widget instance
           //([context, child]) context implies a DOM node or widget instance and may
           // be given as an id, widget-id, node, or widget as described above; child 
           // (always a string) defines an decendent of context:
           //   1. a property of context; context must be a widget; the property name must not begin with "css:", "child:", or "xpath:" (see next)
           //   2. a CSS selector given by "css:<selector>" rooted at context (if context implies a DOM node) or context.domNode (if context implies a widget)
           //   3. a decendent path given by "child:< <child-name>/<grand-child-name>/.../<target-name> >"; context must be a widget
           //   4. an xpath query given by "xpath:<query>" rooted at context (if context implies a DOM node) or context.domNode (if context implies a widget)
  ) {
    var node, parts;
    if (dojo.isArray(target)) {
      parts= target[1].split(":");
      switch (parts[0]) {
        case "child":
          node= dojo.isString(target[0]) ? dijit.byId(target[0].substring(4)) : target[0];
          dojo.forEach(parts[1].split("/"), function(childName) {
            node= node.getChild(childName);
          });
          node= node.domNode;
          break;
        case "css":
          node= this.getNode(target[0]);
          //TODO
          break;
        case "xpath":
          node= this.getNode(target[0]);
          //TODO
          break;
        default:
          node= (dojo.isString(target[0]) ? (/^wid:/.test(target[0]) ? dijit.byId(target[0].substring(4)) : dojo.byId(target[0])) : target[0])[target[1]];
      }
    }
    return node || (dojo.isString(target) ? (/^wid:/.test(target) ? dijit.byId(target.substring(4)).domNode : dojo.byId(target)) : target.domNode || target);
  },

  getShift: function(
    kwargs
  ) {
    if (dojo.isString(kwargs.shift)) {
      var shiftState= kwargs.shift.toLowserCase();
      kwargs.shift= shiftState.charAt(0)=="s";
      kwargs.control= shiftState.charAt(0)=="c";
      kwargs.alt= shiftState.charAt(0)=="a";
      kwargs.meta= shiftState.charAt(0)=="m";
    }
  },

  play: function(
    action,
    target,
    kwargs,
    continuation
  ) {
    if (/^mouse/.test(action)) {
      this.playMouse.apply(this, arguments);
    } else if (/^kb/.test(action)) {
      this.playKeyboard.apply(this, arguments);
    } else {
      //todo
    }
  },

  playMouse: function(
    action,
    target,
    kwargs,
    continuation
  ) {
    var node= this.getNode(target);
    if (dojo.isFunction(kwargs)) {
      continuation= kwargs;
      kwargs= {};
    } else {
      kwargs= kwargs || {};
    }
    if (!kwargs.clientX || !kwargs.clientY) {
      var coords= dojo.position(node);
      kwargs.clientX= coords.x + (coords.w/2);
      kwargs.clientY= coords.y + (coords.h/2);
    }
    this.getShift(kwargs);
    this["play_"+action](node, kwargs);
  },

  play_mouseclick: function(
    node,
    kwargs
  ) {
    robot.mouseEvent(node, "mousedown", kwargs.control, kwargs.alt, kwargs.shift, kwargs.meta, kwargs.clientX, kwargs.clientY, kwargs.screenX, kwargs.screenY, kwargs.detail);
    if (dijit._curFocus!==node && dijit.isTabNavigable(node)) {
      node.focus();
    }
    robot.mouseEvent(node, "mouseup", kwargs.control, kwargs.alt, kwargs.shift, kwargs.meta, kwargs.clientX, kwargs.clientY, kwargs.screenX, kwargs.screenY, kwargs.detail);
    robot.htmlEvent(node, "click");
  },

  decodeKeys: function(
    keys //(string | number)
  ) {
    if (dojo.isString(keys)) {
      var 
        keymap= bd.test.robot.keymap,
        result= [],
        i= 0, 
        length= keys.length,
        c, keyMapItem, match, shiftState;
      while (i<length) {
        c= keys.charAt(i++);
        if (c=="\\") {
          if (keys.charAt(i)=="\\") {
            i++;
            keyMapItem= keymap["\\"];
            result.push({shift:keyMapItem[0], keyCode:keyMapItem[1], charCode:keyMapItem[2]});
          } else {
            match= keys.substring(i).match(/^(([^-]*)-)?(\S*)\s/);
            if (match) {
              keyMapItem= keymap[match[3]];
              shiftState= match[2].toLowerCase() || "xxxx";
              result.push({shift:keyMapItem[0]||shiftState.charAt(0)=="s", control:shiftState.charAt(1)=="c", alt:shiftState.charAt(2)=="a", meta:shiftState.charAt(3)=="m", keyCode:keyMapItem[1], charCode:keyMapItem[2]});
              keys= keys.substring(i + match[0].length);
              i= 0;
              length= keys.length;
            } else {
              throw new Error("unknown keys for play keyboard");
            }
          }
        } else {
          keyMapItem= keymap[c];
          result.push({shift:keyMapItem[0], keyCode:keyMapItem[1], charCode:keyMapItem[2]});
        }
      }
    } else {
      result.push({keyCode:keys, charCode:0});
    }
    return result;
  },

  playKeyboard: function(
    action,       //(kbDown, kbPress, kbUp, kbType)
    target,       //(DOM node | dijit id | DOM id | falsey) if falsy, then play to current focus (if any) or document (if no current focus)
    keys,         //(robot key string)
    shiftState,   //(string, optional) a shift string (S|s|x)[(C|c|x)[(A|a|x)[(M|m|x)]]]
    continuation //function, optional)
  ) {
    var node= (target ? (this.getNode(target) || document) : dijit._curFocus);
    if (node!=dijit._curFocus) {
      node.focus();
    }
    keys= this.decodeKeys(keys);
    var shift;
    if (dojo.isString(shiftState)) {
      shift={shift:shiftState};
      this.getShift(args);
    } else {
      continuation= shiftState;
      shift= {shift:0, control:0, alt:0, meta:0};
    }
    this["play_"+action](node, keys, shift);
  },

  play_kbType: function(
    node,
    keys,
    shift
  ) {
    dojo.forEach(keys, function(key) {
      robot.keyboardEvent(node, "keydown", key.keyCode, 0, key.shift||shift.shift, key.control||shift.control, key.alt||shift.alt, key.meta||shift.meta);
      var
        control= key.control||shift.control,
        alt= key.alt||shift.alt,
        meta= key.meta||shift.meta,
        keyCode= 0,
        charCode= key.charCode;
      if (control || alt || meta) {
        keyCode= key.keyCode;
        charCode= 0;
      }
      robot.keyboardEvent(node, "keypress", keyCode, charCode, key.shift||shift.shift, control, alt, meta);
      robot.keyboardEvent(node, "keyup", key.keyCode, 0, key.shift||shift.shift, key.control||shift.control, key.alt||shift.alt, key.meta||shift.meta);
    });
  },

  play_kbDown: function(
    node,
    keys,
    shift
  ) {
    robot.keyboardEvent(node, "keydown", key.keyCode, 0, key.shift||shift.shift, shift.control, shift.alt, shift.meta);
  },

  play_kbPress: function(
    node,
    keys,
    shift
  ) {
    ///
    robot.keyboardEvent(node, "keypress", 0, key.charCode, key.shift||shift.shift, shift.control, shift.alt, shift.meta);
  },

  play_keyup: function(
    node,
    keys,
    shift
  ) {
    robot.keyboardEvent(node, "keyup", key.keyCode, 0, key.shift||shift.shift, shift.control, shift.alt, shift.meta);
  }
});

bd.test.space.stream= bd.declare(
  ///
  // A trivial FIFO stream object that helps with the test execution engine.
  ///
  // Records (via push) then plays (via get) the test tree traversal. The function skip skips over all
  // nodes between a closing traverseOut when an opening traverseIn fails.
  // `private

  //superclasses
  [],

  //members
  {
  constructor: function() {
    this.buffer= [];
    this.current= 0;
  },

  exhausted: function() {
    return this.current>=this.buffer.length;
  },

  get: function() {
    return this.buffer[this.current++];
  },

  skip: function() {
    var item= this.buffer[this.current-1];
    if (item && item.traverseIn) {
      var target= item.proc;
      while (this.buffer[this.current].proc!=target) {
        this.current++;
      }
    }
  },

  push: function(
    proc,
    traverseIn
  ) {
    this.buffer.push({traverseIn:traverseIn, proc:proc});
  }
});

bd.test.activeSpace=
  ///
  // The current active bd.test.space object.
  ///
  // The test execution algorithm ensures that scaffolding and demo functions are called with bd.test.activeSpace
  // set to the space that is executing the particular scaffold/demo. However, since scaffolds/demos may implement
  // asynchronous algorithms, they may need to manipulate the activeSpace directly to ensure the proper space is
  // referenced (for example, when advising results via bd.test.the). It is usually best to use bd.test.pushActiveSpace
  // and bd.test.popActiveSpace for this purpose.
  null;

bd.test.activeSpaces=
  ///
  // `private
  // The stack of active test spaces; see bd.test.pushActiveSpace and bd.test.popActiveSpace.
  [null];

bd.test.pushActiveSpace= function(
  space //(bd.test.space) space to make the new active space
) {
  ///
  // Push the current value of bd.test.activeSpace onto the stack maintained at bd.test.activeSpaces, then make that space the active space.
  bd.test.activeSpaces.push(space);
  bd.test.activeSpace= space;
};

bd.test.popActiveSpace= function() {
  ///
  // Pop the top of bd.test.activeSpaces; replace bd.test.activeSpace with the new top of the bd.test.activesSpaces.
  ///
  // Assuming the bd.test.activeSpace is manipulated via bd.test.pushActiveSpace and bd.test.popActiveSpace, then
  // bd.back(bd.test.activeSpaces)===bd.test.activeSpace is always true.
  //
  // `return The old top of bd.test.activeSpaces.
  var result= bd.test.activeSpaces.pop();
  bd.test.activeSpace= bd.back(bd.test.activeSpaces);
  return result;
};

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

