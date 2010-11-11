define(["dojo", "bd", "bd/descriptor/cache"], function(dojo, bd) {

//#include bd/test/testHelpers

module("The module bd/descriptor/cache", userDemo(function(space) {
    //first, we'll set up a mock frenzy server that returns descriptors...
    var
      transactions= 0,
      descriptorServer= new bd.test.mockFrenzyServer({
        // here are the "descriptors" that the server will return. Of course these aren't real
        // backdraft descriptors, but we can use then to demonstrate bd.descriptor.cache
        descriptors: {
         "dialog.save": '(function(){ return {testReturn: "dialog.save"}; })()',
         "dialog.print": '(function(){ return {testReturn: "dialog.print"}; })()'
        },

        getDescriptor: function(
          name
        ) {
          //keep track of how many times this function is called to make sure the machinery
          //is actually caching descriptors
          transactions++;
          return this.descriptors[name] || "";
        }
      }),

      //we'll use the URL "/unit.bd.descriptor.cache.demo" for our server
      filter= function(args) {
        return args.url=="/unit.bd.descriptor.cache.demo";
      };

    //install (filter, descriptorServer) in the mockXhr machinery
    bd.test.mockXhr.install(filter, dojo.hitch(descriptorServer, "dispatchRequest"));

    //create tha associated frenzy proxy...
    var descriptorService= new bd.frenzyProxy({xhrArgs:{url:"/unit.bd.descriptor.cache.demo"}});

    //finally, use the service as the basis for a bd.descriptor.constructor.creator function and create
    //a bd.descriptor.cache instance; notice that we set bd.descriptor.cache.constructor.keepRawText===true
    //so we can inspect the raw text.
    var descriptorCache= new bd.descriptor.cache(
      //the bd.decriptor.cache.constructor.creator...
      function(name, onLoad, onError) {
        descriptorService.call("getDescriptor", name,
          function(callInfo) {
            onLoad(callInfo.result);
          },
          function(error) {
            onError(error);
          }
        );
      },
      //bd.descriptor.cache.constructor.keepRawText...
      true
    );

    //now let's use the cache...

    //here's a little error function to report an unexpected error...
    function signalError(error) {
      bd.test.activeSpace= space;
      the(true).is(false); //always fail
    }

    //get the descriptor "dialog.save"
    var result1Fired= false;
    var result1= descriptorCache.get("dialog.save",
      //the onLoad function...
      function(descriptor) {
        bd.test.activeSpace= space;
        result1Fired= true;
        the(descriptor.testReturn).is("dialog.save");
        the(descriptorCache.getRaw("dialog.save")).is('(function(){ return {testReturn: "dialog.save"}; })()');
      },
      //the onError function...
      signalError
    );
    the(result1).isInstanceOf(dojo.Deferred);

    //since the descriptor wasn't in the cache, onLoad hasn't been fired
    the(result1Fired).is(false);

    //multiple requests for the same descriptor result in one transaction to the server
    var
      result2Fired= false,
      result2= descriptorCache.get("dialog.print",
        function(descriptor) {
          bd.test.activeSpace= space;
          result2Fired= true;
          the(descriptor.testReturn).is("dialog.print");
          the(descriptorCache.getRaw("dialog.print")).is('(function(){ return {testReturn: "dialog.print"}; })()');
        }, signalError),

      result3Fired= false,
      result3Canceled= false,
      result3= descriptorCache.get("dialog.print",
        function(descriptor) {
          bd.test.activeSpace= space;
          result3Fired= true;
          the(descriptor.testReturn).is("dialog.print");
          the(descriptorCache.getRaw("dialog.print")).is('(function(){ return {testReturn: "dialog.print"}; })()');
        },
        function(error) {
          //we're going to cancel this one, so the error callback is called in the dojo.Deferred...
          result3Canceled= true;

        }),

      result4Fired= false,
      result4= descriptorCache.get("dialog.print",
        function(descriptor) {
          bd.test.activeSpace= space;
          result4Fired= true;
          the(descriptor.testReturn).is("dialog.print");
          the(descriptorCache.getRaw("dialog.print")).is('(function(){ return {testReturn: "dialog.print"}; })()');
        }, signalError);

    //cancel one of the requests to make sure the others finish normally...
    result3.cancel();

    //in the wait function at the end of the test, we'll check that only two transactions occured:
    //dialog.save => result1, and dialog.print => result2, result4, _not_ 1 X dialog.save + 3 X dialog.print!

    var
      result5Fired= false,
      result5Canceled= false,
      result5= descriptorCache.get("dialog.print",
        function(descriptor) {
          result5Fired= true;
        },
        function(error) {
          //we're going to cancel this one, so the error callback is called in the dojo.Deferred...
          result5Canceled= true;
        }
      );
    //immediately cancel it, so the transaction should never occur...
    result5.cancel();

    var
      result6ErrorFired= false,
      result6= descriptorCache.get("non-existing-descriptor",
        function(descriptor) {
          //shouldn't get here...
          bd.test.activeSpace= space;
          the(true).is(false); //always fail
        },
        function(error) {
          bd.test.activeSpace= space;
          result6ErrorFired= true;
          the(error).isNot(undefined);
        }
      );

    return space.watch(20, 2000, function(space) {
      if (result1Fired) {
        the(result1Fired).is(true);
        the(result2Fired).is(true);
        the(result3Fired).is(false); //result3 was canceled
        the(result3Canceled).is(true); //result3 was canceled
        the(result4Fired).is(true);
        the(result5Fired).is(false); //result5 was canceled
        the(result5Canceled).is(true); //result5 was canceled

        //although 4 bd.descriptor.cache.get fired their dojo.Deferred's--
        //(1, 2, 4 completed normally, (6) resulted in an error) only 3 Frenzy
        //transactions were required since (2 and 4) both requested "dialog.print"
        the(transactions).is(3);

        the(result6ErrorFired).is(true);

        //now lets get the an object that has already been gotten (so we _know_ it's in the cache
        //onLoad should be executed before get returns...
        var resultFired= false;
        var result= descriptorCache.get("dialog.save",
          //the onLoad function...
          function(descriptor) {
            bd.test.activeSpace= space;
            resultFired= true;
            the(descriptor.testReturn).is("dialog.save");
          },
         //the onError function...
          signalError
        );
        the(resultFired).is(true);

        //and, but the way, the magic of a frenzy service resulted in only one off-host transaction
        //for all of this!
        the(descriptorService.transactionCounter).is(1);

        //clean up the test...
        bd.test.mockXhr.remove(filter);
        return true;
      } else {
        return false;
      }
    });
}));
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
