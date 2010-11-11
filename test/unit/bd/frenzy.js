define(["dojo", "bd", "bd/frenzy", "bd/test/mockFrenzyServer", "bd/test/mockXhr"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

var 
  serverMessageData= [],
  takedownScaffold,
  exercise,
  scaffold,
  setupScaffold= function(delay, circulate) {
    scaffold= {};
    dojo.mixin(scaffold, {
      frenzyService:new bd.test.mockFrenzyServer({
        postScript: function(
          result
        ) {
          if (this.scheduleLongCallTimeout && this.scheduleLongCallTimeout < bd.getTime() && result.serviceInfo.transactionId>this.scheduleLongCallTransactionId) {
            result.results.push({callId:this.scheduleLongCallId, result:this.scheduleLongCallResult});
            delete this.scheduleLongCall;
            delete this.scheduleLongCallId;
            delete this.scheduleLongCallResult;
          } else if (this.scheduleLongCallId) {
            //this is fake...we're pulling the result out of result.results; a real server would never put the result in
            for (var i= 0; i<result.results.length; i++) {
              if (result.results[i].callId==this.scheduleLongCallId) {
                result.results.splice(i, 1);
                return;
              }
            }
          }
          if (result.serviceInfo.transactionId < serverMessageData.length) {
            result.results.push({serverMessage:"someMessageClass", result:serverMessageData[result.serviceInfo.transactionId-1]});
          }
        },
  
        identity: function(
          args
        ) {
          return args;
        },
  
        longCall: function(
          args,
          callId,
          serviceInfo
        ){
          //this call takes a long time
          this.scheduleLongCallTimeout= bd.getTime() + 500;
          this.scheduleLongCallId= callId;
          this.scheduleLongCallResult= args;
          this.scheduleLongCallTransactionId= serviceInfo.transactionId;
        }
      }),
  
      filter:function(args) {
        return args.url=="/unit.bd.frenzy.testService";
      },
  
      frenzy:new bd.frenzyProxy({xhrArgs:{url:"/unit.bd.frenzy.testService"}, delay:delay, circulate:!!circulate}),
  
      slots:[],
  
      successCount:0,
  
      failCount:0,
  
      onResults:function(callInfo) {
        scaffold.successCount++;
        scaffold.slots[callInfo.params.callId]= callInfo;
      },
  
      onError:function(callInfo) {
        scaffold.failCount++;
        scaffold.slots[callInfo.params.callId]= callInfo;
      }
  
  
    });
    bd.test.mockXhr.install(scaffold.filter, dojo.hitch(scaffold.frenzyService, "dispatchRequest"));

    takedownScaffold= function() {
      bd.test.mockXhr.remove(scaffold.filter);
      delete scaffold.filter;
      delete scaffold.frenzyService;
      scaffold.frenzy.stop();
      delete scaffold.frenzy;
      delete scaffold.slots;
      delete scaffold.successCount;
      delete scaffold.failCount;
      delete scaffold.onResults;
      delete scaffold.onErrorGenerator;
    },
  
    exercise= function(space, valueStart, delay) {
      scaffold.frenzy.call("identity", {value:valueStart++}, scaffold.onResults, scaffold.OnError);
      scaffold.frenzy.call("identity", {value:valueStart++}, scaffold.onResults, scaffold.OnError);
      return space.scheduleProc(delay, bd.noop);
    };

    return scaffold;
  };


module("The module bd/frenzy.", 
  userDemo([bd.frenzy], function(space) {
    //first, we'll set up a mock frenzy server that resolves a uid to a name.
    var nameResolver= new bd.test.mockFrenzyServer({
      names: {
       "1.1": "Rawld Gill",
       "1.2": "Alex Russell",
       "1.3": "Craig Rieche",
       "2.2": "Bill Bingham",
       "2.3": "Tim Eastham"
      },

      getName: function(
        args
      ) {
        return this.names[args.uid] || "";
      }
    });

    //we'll use the URL "/unit.bd.frenzy.nameResolverServer" for our server
    //here is a filter function that returns true for this URL
    var filter= function(args) {
      return args.url=="/unit.bd.frenzy.nameResolverServer";
    };

    //finally, install (filter, nameResolver) in the mockXhr machinery
    bd.test.mockXhr.install(filter, dojo.hitch(nameResolver, "dispatchRequest"));

    //
    // !!NOTICE!!
    //
    // At this point, if we use dojo.xhrPost to transact a well-formed frenzy request, we should get back
    // a well formed frenzy response.
    //
    // In other words, in 7 lines of real code (not including data and comments), we've simulated a server
    // that can be used through XHR to resolve names. We think this is pretty cool!
    //

    //Let's try it...
    var succeeded;
    dojo.xhrPost({
      url:"/unit.bd.frenzy.nameResolverServer",
      postData: dojo.toJson({
        serviceInfo: {
          requestId: 1,
          timeClientTx: bd.getTime()
        },
        calls: [{
          callId: 1,
          procName: "getName",
          args: {
            uid: "1.1"
          }
        },{
          callId: 2,
          procName: "getName",
          args: {
            uid: "2.2"
          }
        }]
      }),
      load: function(text) {
        succeeded= true;
        var result= dojo.fromJson(text);
        // result should look like this:
        //
        //  {
        //    serviceInfo: {
        //      requestId:1,
        //      timeClientRx:<time>,
        //      timeClientTx:<time>,
        //      timeServiceRx:<time>,
        //      timeServiceTx:<time>
        //    },
        //   results: [{
        //      callId: 1,
        //      result: "Rawld Gill"
        //    },{
        //      callId: 2,
        //      result: "Bill Bingham"
        //    }]
        //  }

        the(result.serviceInfo.requestId).is(1);
        the(result.results.length).is(2);
        the(result.results[0].callId).is(1);
        the(result.results[0].result).is("Rawld Gill");
        the(result.results[1].callId).is(2);
        the(result.results[1].result).is("Bill Bingham");
      },
      error: function() {
        succeeded= false;
      },

      //we'll do the call synchronously to make it easy to step through the code in the debugger to see what's happening
      //but both mockFrenzyServer and mockXhr also fully support asynchronous operation
      sync:true
    });

    the(succeeded).is(true);

    //now let's get to the real point of demonstrating frenzy; first we need a frenzy instance that's
    //hooked to the server we just made. This time we're going to operate asynchronously (lacking "sync:true").
    var nameService= new bd.frenzyProxy({xhrArgs:{url:"/unit.bd.frenzy.nameResolverServer"}});

    //that's all we need!! Let's try it...

    //here is an onResults function generator that checks the result...
    var returnCount= 0;
    var getOnResults= function(expected) {
      return function(result) {
        returnCount++;
        the(result.result).is(expected);
      };
    };

    //and an onError function that just signals something went wrong...
    var onError= function() {
      returnCount++;
      the(1).is(0); //always fails
    };

    //finally here are two frenzy calls...
    nameService.call("getName", {uid:"1.1"}, getOnResults("Rawld Gill"), onError);
    nameService.call("getName", {uid:"2.2"}, getOnResults("Bill Bingham"), onError);

    //Notice that both service requests were made with ONE XHR transaction!
    //Imagine a page that contains a bunch of names, but the names are delivered as UIDs,
    //When the page is loading, it is most natural and simplest to resolved the names by
    //multiple calls to the server (one call per name). This is likely the way it would be
    //done if the server was local, perhaps in-process, machinery. But, if niave XHR
    //machinery is used, such a design would result in many round-trips, probably causing
    //the page to perform badly. With frenzy, only one round-trip would occur!
    //And that's just one of the key advantages of frenzy.

    //since we're executing asynchronously, we've got to wait for the results to appear...
    //WARNING: if you're stepping through the debugger watching code as the frenzy transaction is executed,
    //         it is likely that this will timeout and give a "false" error. If you get a trailing fail,
    //         turn off all breakpoints and run the test...it works on our machines!
    return space.watch(10, 1000, function() {
      if (returnCount==2) {
        //clean up...
        bd.test.mockXhr.remove(filter);
        the(succeeded).is(true);
        return true;
      } else {
        return false;
      }
    });
  }),

  describe("[call-sequence-1] Scaffold that installs a frenzy service that delays 50ms and some helpers.",
    scaffold(each, function(space) { setupScaffold(50); }, function(space) { takedownScaffold(space); }),
    note("The timings are big to make sure the desired control paths are traversed."),
    describe("Scaffold that makes several calls to the frenzy service, then delays 20 ms.",
      scaffold(each, function(space) { return exercise(space, 1, 20); }),
      describe("Scaffold that makes several calls to the frenzy service, then delays 100 ms.",
        scaffold(each, function(space) { return exercise(space, 3, 100); }),
        describe("Scaffold that makes several calls to the frenzy service, then delays 20 ms.",
          scaffold(each, function(space) { return exercise(space, 5, 20); }),
          describe("Scaffold that makes several calls to the frenzy service, then delays 20 ms.",
            scaffold(each, function(space) { return exercise(space, 7, 20); }),
            demo("Notice the first two sets of calls are handled by one transaction and then the second two sets of calls are handled by another transaction.", function(space) {
              return space.watch(10, 2000, function() {
                if (scaffold.failCount + scaffold.successCount==8) {
                  for (var i= 1; i<=4; i++) {
                    the(scaffold.slots[i].result.value).is(i);
                    the(scaffold.slots[i+4].result.value).is(i+4);
                    the(scaffold.slots[i].serviceInfo.transactionId).is(1);
                    the(scaffold.slots[i+4].serviceInfo.transactionId).is(2);
                  };
                  return true;
                } else {
                  return false;
                }
              });
            })
          )
        )
      )
    )
  ),

  describe("[call-sequence-2] Scaffold that installs a frenzy service that delays 10ms and some helpers.",
    scaffold(each, function(space) { setupScaffold(10); }, function(space) { takedownScaffold(space); }),
    note("The timings are big to make sure the desired control paths are traversed."),
    describe("Scaffold that makes several calls to the frenzy service, then delays 50 ms.",
      scaffold(each, function(space) { return exercise(space, 1, 50); }),
      describe("Scaffold that makes several calls to the frenzy service, then delays 50 ms.",
        scaffold(each, function(space) { return exercise(space, 3, 50); }),
        describe("Scaffold that makes several calls to the frenzy service, then delays 50 ms.",
          scaffold(each, function(space) { return exercise(space, 5, 50); }),
          describe("Scaffold that makes several calls to the frenzy service, then delays 50 ms.",
            scaffold(each, function(space) { return exercise(space, 7, 50); }),
            demo("Notice that each set of calls are handled by an individual transaction.", function(space) {
              return space.watch(10, 2000, function() {
                if (scaffold.failCount + scaffold.successCount==8) {
                  for (var i= 1; i<=8; i++) {
                    the(scaffold.slots[i].result.value).is(i);
                    the(scaffold.slots[i].serviceInfo.transactionId).is(Math.floor((i+1) / 2)); //1, 1, 2, 2, 3, 3, 4, 4
                  };
                  return true;
                } else {
                  return false;
                }
              });
            })
          )
        )
      )
    )
  ),

  describe("[long-call] Call a server procedure that takes a long time to complete.",
    scaffold(each, function(space) { setupScaffold(10); }, function(space) { takedownScaffold(space); }),
    demo("Call the long-running proc (only); resulting in periodic polling for the result until it is returned.", function(space) {
      var 
        currentTransactionId= scaffold.frenzy.transactionId;
      scaffold.frenzy.call("longCall", {value:1}, scaffold.onResults, scaffold.OnError);
      return space.watch(50, 2000, function() {
        if ((scaffold.failCount + scaffold.successCount)==1) {
          the(scaffold.slots[1].result.value).is(1);
          the(scaffold.slots[1].serviceInfo.transactionId).isNot(currentTransactionId+1);
          return true;
        } else {
          return false;
        }
      });
    }),

    note(//Normally, a server would not return until it had something to return (perhaps only a keep-alive message after a long timeout).
         //With such a design, the "polling" algorithm is effectively an asynchronous event signalling algorithm.
    ),

    demo("Call the long-running proc and some short ones; resulting in periodic polling for the result until it is returned.", function(space) {
      var
        currentTransactionId= scaffold.frenzy.transactionCounter;
      scaffold.frenzy.call("identity", {value:1}, scaffold.onResults, scaffold.OnError);
      scaffold.frenzy.call("identity", {value:2}, scaffold.onResults, scaffold.OnError);
      scaffold.frenzy.call("longCall", {value:3}, scaffold.onResults, scaffold.OnError);

      return space.watch(50, 2000, function() {
        if ((scaffold.failCount+scaffold.successCount)==3) {
          the(scaffold.slots[1].result.value).is(1);
          the(scaffold.slots[1].serviceInfo.transactionId).is(currentTransactionId+1);
          the(scaffold.slots[2].result.value).is(2);
          the(scaffold.slots[2].serviceInfo.transactionId).is(currentTransactionId+1);
          the(scaffold.slots[3].result.value).is(3);
          the(scaffold.slots[3].serviceInfo.transactionId).isNot(currentTransactionId+1);
          return true;
        } else {
          return false;
        }
      });
    })
  ),

  describe("[circulating] Circulating Frenzy",
    describe("Circulation with no client-side calls.",
      scaffold(each, function(space) { setupScaffold(50, true); }, function(space) { takedownScaffold(space); }),
      demo(function(space) {
        //this variable is defined at the top of this test unit...
        serverMessageData= "This is some server data and this is junk to show that we didn't properly disconnect".split(" ");


        scaffold.serverData= [];
        scaffold.serverDataAccumulator= function(word) {
          scaffold.serverData.push(word);
          if (scaffold.serverData.length==5) {
            scaffold.frenzy.disconnect("someMessageClass", scaffold.serverDataAccumulator);
          }
        };
        scaffold.frenzy.connect("someMessageClass", scaffold.serverDataAccumulator);

        return space.watch(50, 2000, function() {
          if (scaffold.frenzy.transactionCounter>10) {
            scaffold.frenzy.stop();
            the(scaffold.serverData.join(" ")).is("This is some server data");
            return true;
          } else {
            return false;
          }
        });
      })
    )
  )
);
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
