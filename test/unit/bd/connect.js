define(["dojo", "bd", "bd/connect"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/connect",
  theClass("[bd.connect.handle]", demo("[*]", function() {
    var
      disconnectCalled= 0,
      disconnect= function(h) {
        disconnectCalled++;
        the(h).is(handle);
      },
      src= {},
      event= {},
      dest= {},
      watcher= {},
      handle= {};

    //check initialization
    var result= new bd.connect.handle(src, event, dest, watcher, handle, disconnect);
    the(result.src).is(src);
    the(result.event).is(event);
    the(result.dest).is(dest);
    the(result.watcher).is(watcher);
    the(result.handle).is(handle);
    the(result.disconnector).is(disconnect);
    the(result.uid).isString();

    //check that all references are released on disconnect
    result.disconnect();
    the(disconnectCalled).is(1);
    the(result.src).is(0);
    the(result.event).is(0);
    the(result.dest).is(0);
    the(result.watcher).is(0);
    the(result.handle).is(0);
    the(result.disconnector).is(0);

    //double disconnect is no-op
    result.disconnect();
    the(disconnectCalled).is(1);

    var srcHandle, srcConnecting, destHandle, destConnecting;
    src= {
      adviseEventSource: function(handle, connecting) {
        srcHandle= handle;
        srcConnecting= connecting;
      }
    };
    dest= {
      adviseEventWatcher: function(handle, connecting) {
        destHandle= handle;
        destConnecting= connecting;
      }
    };

    //advises called iff available
    srcHandle= srcConnecting= destHandle= destConnecting= 0;
    result= new bd.connect.handle(src, event, dest, watcher, handle, disconnect);
    the(srcHandle).is(result);
    the(srcConnecting).is(true);
    the(destHandle).is(result);
    the(destConnecting).is(true);

    srcHandle= srcConnecting= destHandle= destConnecting= 1;
    result.disconnect();
    the(srcHandle).is(result);
    the(srcConnecting).is(false);
    the(destHandle).is(result);
    the(destConnecting).is(false);
  })),

  theClass("[bd.connect]", demo("[*]", function() {
    var
      triggerCalled,
      trigger= function(x, y) {
        triggerCalled++;
      },
      src= {
        trigger: trigger
      },
      expectedConnecting,
      adviseSourceCalled,
      adviseSourceHandle,
      srcWithAdviseEventSource = {
        trigger: trigger,
        adviseEventSource: function(handle, connecting) {
          adviseSourceCalled++;
          adviseSourceHandle= handle;
          the(connecting).is(expectedConnecting);
        }
      },
      watcherCalled,
      watcherArgs,
      watcher= function(a, b, x, y) {
        watcherCalled++;
        watcherArgs= bd.array(arguments);
      },
      dest= {
        watcher: watcher
      },
      adviseWatcherCalled,
      adviseWatcherHandle,
      destWithAdviseEventWatcher = {
        watcher: watcher,
        adviseEventWatcher: function(handle, connecting) {
          adviseWatcherCalled++;
          adviseWatcherHandle= handle;
          the(connecting).is(expectedConnecting);
        }
      },
      clear= function() {
        triggerCalled= adviseSourceCalled= adviseSourceHandle= watcherCalled= adviseWatcherCalled= adviseWatcherHandle= 0;
      },
      handle;

      //dest missing, watcher is a function
      clear();
      handle= bd.connect(src, "trigger", watcher);
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue([1, 2]);

      clear();
      handle.disconnect();
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(0);

      //dest missing, watcher is a function name
      clear();
      bd.global.watcher= watcher;
      handle= bd.connect(src, "trigger", "watcher");
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue([1, 2]);

      clear();
      handle.disconnect();
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(0);
      delete bd.global.watcher;

      //src and dest with no advise functions
      clear();
      handle= bd.connect(src, "trigger", "watcher", dest);
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue([1, 2]);

      clear();
      handle.disconnect();
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(0);

      //dest missing, watcher is a function, watcher arguments hitched
      clear();
      handle= bd.connect(src, "trigger", watcher, 0, "a", "b");
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue(["a", "b", 1, 2]);

      clear();
      handle.disconnect();
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(0);

      //dest missing, watcher is a function name, watcher arguments hitched
      clear();
      bd.global.watcher= watcher;
      handle= bd.connect(src, "trigger", "watcher", 0, "a", "b");
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue(["a", "b", 1, 2]);

      clear();
      handle.disconnect();
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(0);
      delete bd.global.watcher;

      //src and dest with no advise functions, watcher arguments hitched
      clear();
      handle= bd.connect(src, "trigger", "watcher", dest, "a", "b");
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue(["a", "b", 1, 2]);

      clear();
      handle.disconnect();
      src.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(0);

      //src and dest with advise* causes those functions to be called on connect/disconnect
      clear();
      expectedConnecting= true;
      handle= bd.connect(srcWithAdviseEventSource, "trigger", "watcher", destWithAdviseEventWatcher);
      the(adviseSourceCalled).is(1);
      the(adviseSourceHandle).is(handle);
      the(adviseWatcherCalled).is(1);
      the(adviseWatcherHandle).is(handle);

      srcWithAdviseEventSource.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue([1, 2]);

      clear();
      expectedConnecting= false;
      handle.disconnect();
      the(adviseSourceCalled).is(1);
      the(adviseSourceHandle).is(handle);
      the(adviseWatcherCalled).is(1);
      the(adviseWatcherHandle).is(handle);

      clear();
      srcWithAdviseEventSource.trigger(1, 2);
      the(triggerCalled).is(1);
      the(watcherCalled).is(0);
  })),
  theFunction("[bd.subscribe]", demo("[*]", function() {
    var
      expectedConnecting,
      watcherCalled,
      watcherArgs,
      watcher= function(a, b, x, y) {
        watcherCalled++;
        watcherArgs= bd.array(arguments);
      },
      dest= {
        watcher: watcher
      },
      adviseWatcherCalled,
      adviseWatcherHandle,
      destWithAdviseEventWatcher = {
        watcher: watcher,
        adviseEventWatcher: function(handle, connecting) {
          adviseWatcherCalled++;
          adviseWatcherHandle= handle;
          the(connecting).is(expectedConnecting);
        }
      },
      clear= function() {
        watcherCalled= adviseWatcherCalled= adviseWatcherHandle= 0;
      },
      handle;

      //dest missing, watcher is a function
      clear();
      handle= bd.subscribe("unit/test/bd.subscribe", watcher);
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue([1, 2]);

      clear();
      handle.disconnect();
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(0);

      //dest missing, watcher is a function name
      clear();
      bd.global.watcher= watcher;
      handle= bd.subscribe("unit/test/bd.subscribe", "watcher");
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue([1, 2]);

      clear();
      handle.disconnect();
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(0);
      delete bd.global.watcher;

      //src and dest with no advise functions
      clear();
      handle= bd.subscribe("unit/test/bd.subscribe", "watcher", dest);
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue([1, 2]);

      clear();
      handle.disconnect();
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(0);

      //dest missing, watcher is a function, watcher arguments hitched
      clear();
      handle= bd.subscribe("unit/test/bd.subscribe", watcher, 0, "a", "b");
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue(["a", "b", 1, 2]);

      clear();
      handle.disconnect();
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(0);

      //dest missing, watcher is a function name, watcher arguments hitched
      clear();
      bd.global.watcher= watcher;
      handle= bd.subscribe("unit/test/bd.subscribe", "watcher", 0, "a", "b");
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue(["a", "b", 1, 2]);

      clear();
      handle.disconnect();
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(0);
      delete bd.global.watcher;

      //src and dest with no advise functions, watcher arguments hitched
      clear();
      handle= bd.subscribe("unit/test/bd.subscribe", "watcher", dest, "a", "b");
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue(["a", "b", 1, 2]);

      clear();
      handle.disconnect();
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(0);

      //src and dest with advise* causes those functions to be called on connect/disconnect
      clear();
      expectedConnecting= true;
      handle= bd.subscribe("unit/test/bd.subscribe", "watcher", destWithAdviseEventWatcher);
      the(adviseWatcherCalled).is(1);
      the(adviseWatcherHandle).is(handle);

      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(1);
      the(watcherArgs).hasValue([1, 2]);

      clear();
      expectedConnecting= false;
      handle.disconnect();
      the(adviseWatcherCalled).is(1);
      the(adviseWatcherHandle).is(handle);

      clear();
      dojo.publish("unit/test/bd.subscribe", [1, 2]);
      the(watcherCalled).is(0);
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
