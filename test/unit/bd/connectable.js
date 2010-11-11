define(["dojo", "bd", "bd/connectable"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

var
  deferredWatcherSinkHit= 0,
  deferredWatcherSink= function() {
    deferredWatcherSinkHit++;
  };

module("The module bd/connectable",
  theClass("[bd.connectable]", 
    bd.test.reflectorScaffold(each, bd, "deferredWatcherSink", deferredWatcherSink, 0, true),
    demo("[*]", function() {
      // set up some more scaffolding...
      var
        o, signalingMethodWatcherResults, finalEventSourceResults,

        // we use this function to watch the signaling methods
        signalingMethodWatcher= function(which, arg1, arg2) {
          signalingMethodWatcherResults[which]= [arg1, arg2];
        },

        // we use this function as the final event source
        finalEventSource= function(which, arg1, arg2) {
          finalEventSourceResults[which]= [arg1, arg2];
        },

        // clear all the watched variable between tests
        clear= function() {
          deferredWatcherSinkHit= 0;
          signalingMethodWatcherResults= [];
          finalEventSourceResults= [];
        };

      // test our scaffold...
      clear();
      bd.deferredWatcherSink();
      the(deferredWatcherSinkHit).is(1);

      // declare a class that has
      var myBase= bd.declare(
        [bd.connectable],
        bd.makeDeferredConnects({
          signalingMethod1: ["finalEventSource1"], //this.deferredSource || this implied as final event source
          signalingMethod2: ["finalEventSource2"], //this.deferredSource || this implied as final event source
          signalingMethod3: ["finalEventSource3", "prop"], //this.prop implied as final event source
          signalingMethod4: ["finalEventSource4", "prop"]  //this.prop implied as final event source
        }), {
          finalEventSource1: bd.partial(finalEventSource, 1),
          finalEventSource2: bd.partial(finalEventSource, 2),
          prop: {
            finalEventSource3: bd.partial(finalEventSource, 3),
            finalEventSource4: bd.partial(finalEventSource, 3)
          }
        }
      );
  
      // count the number of connects and disconnects
      var 
        totalConnects= 0,
        hijackConnectHandle= bd.hijack(dojo, "connect", function() { totalConnects++; }, 0, true),
        hijackDisconnectHandle= bd.hijack(dojo, "disconnect", function() { totalConnects--; }, 0, true); 
  
      o= new myBase();
      // makeDeferredConnects automatically defined the methods signalingMethod*...
      the(o.signalingMethod1).is(bd.deferredWatcherSink);
      the(o.signalingMethod2).is(bd.deferredWatcherSink);
      the(o.signalingMethod3).is(bd.deferredWatcherSink);
      the(o.signalingMethod4).is(bd.deferredWatcherSink);
  
      // firing the final event before connecting to the signaling method won't fire the signalingMethod
      clear();
      o.finalEventSource1("a", "b");
      o.prop.finalEventSource3("c", "d");
      the(finalEventSourceResults[1]).hasValue(["a", "b"]);
      the(finalEventSourceResults[3]).hasValue(["c", "d"]);
      the(deferredWatcherSinkHit).is(0);
  
      // connect to the signaling method and fire again, this time we see the event...
      bd.connect(o, "signalingMethod1", signalingMethodWatcher, 0, 1);    
      bd.connect(o, "signalingMethod3", signalingMethodWatcher, 0, 3);    
      clear();
      o.finalEventSource1("a", "b");
      o.prop.finalEventSource3("c", "d");
      the(finalEventSourceResults[1]).hasValue(["a", "b"]);
      the(finalEventSourceResults[3]).hasValue(["c", "d"]);
      the(signalingMethodWatcherResults[1]).hasValue(["a", "b"]);
      the(signalingMethodWatcherResults[3]).hasValue(["c", "d"]);
      the(deferredWatcherSinkHit).is(2);
      o.destroy();
      the(totalConnects).is(0);
  
      // try it again when the target source is contained in the deferredSource property
      // notice that the final event source has changed even though the deferredConnects vector has not
      var myClass1= bd.declare(
        [myBase],
        {
          deferredSource: {
            finalEventSource1: bd.partial(finalEventSource, 1),
            finalEventSource2: bd.partial(finalEventSource, 2)
          }
        }
      );
      o= new myClass1();
      clear();
      bd.connect(o, "signalingMethod1", signalingMethodWatcher, 0, 1);    
      o.deferredSource.finalEventSource1("a", "b");
      the(finalEventSourceResults[1]).hasValue(["a", "b"]);
      the(signalingMethodWatcherResults[1]).hasValue(["a", "b"]);
      the(deferredWatcherSinkHit).is(1);
      o.destroy();
      the(totalConnects).is(0);
      
      // try it again when the target source is a completely external object
      // the deferredConnects vector need to change to make this happen, let's
      // use makeDeferredConects to add to an already-existing vector...
      var 
        p= {
          finalEventSource5: bd.partial(finalEventSource, 5)
        },
        myClass2= bd.declare(
          [myBase],
          bd.makeDeferredConnects({signalingMethod5: ["finalEventSource5", p]}, myBase)
        );
      o= new myClass2();
      clear();
      bd.connect(o, "signalingMethod1", signalingMethodWatcher, 0, 1);    
      bd.connect(o, "signalingMethod5", signalingMethodWatcher, 0, 5);    
      o.finalEventSource1("a", "b");
      p.finalEventSource5("a", "b");
      the(finalEventSourceResults[1]).hasValue(["a", "b"]);
      the(finalEventSourceResults[5]).hasValue(["a", "b"]);
      the(signalingMethodWatcherResults[1]).hasValue(["a", "b"]);
      the(signalingMethodWatcherResults[5]).hasValue(["a", "b"]);
      the(deferredWatcherSinkHit).is(2);
      o.destroy();
      the(totalConnects).is(0);
  
      var 
        myWatcherCalled= 0,
        mySignalCalled= 0,
        myClass3= bd.declare([bd.connectable], {
          myWatcher: function() { myWatcherCalled++; },
          mySignal: function() { mySignalCalled++; }
        }),
        someWatcherCalled= 0,
        someSignalCalled= 0,
        someWatcher= function() { someWatcherCalled++; },
        someSignal= {flash: function() { someSignalCalled++; }},
        h1, h2;
      o= new myClass3();
      h1= bd.connect(o, "mySignal", someWatcher);
      the(totalConnects).is(1);
      h2= bd.connect(someSignal, "flash", "myWatcher", o);
      the(totalConnects).is(2);
  
      o.mySignal();
      the(someWatcherCalled).is(1);
      someSignal.flash();
      the(myWatcherCalled).is(1);
  
      h1.disconnect();
      the(totalConnects).is(1);
  
      someSignal.flash();
      the(myWatcherCalled).is(2);
  
      h2.disconnect();
      the(totalConnects).is(0);
  
      o.mySignal();
      the(someWatcherCalled).is(1);
      someSignal.flash();
      the(myWatcherCalled).is(2);
      
      h1= bd.connect(o, "mySignal", someWatcher);
      the(totalConnects).is(1);
      h2= bd.connect(someSignal, "flash", "myWatcher", o);
      the(totalConnects).is(2);
  
      o.mySignal();
      the(someWatcherCalled).is(2);
      someSignal.flash();
      the(myWatcherCalled).is(3);
      
      o.destroy();
      the(totalConnects).is(0);
  
      o.mySignal();
      the(someWatcherCalled).is(2);
      someSignal.flash();
      the(myWatcherCalled).is(3);
  
      // clean up
      hijackConnectHandle= bd.hijack(hijackConnectHandle);
      hijackDisconnectHandle= bd.hijack(hijackDisconnectHandle);
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
