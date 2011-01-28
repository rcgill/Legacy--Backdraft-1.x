define("bd/test/mockFrenzyServer", [
  "dojo", "bd", "bd/test/namespace"
], function(dojo, bd) {
///
// Defines the class bd.test.mockFrenzyServer

bd.test.mockFrenzyServer= bd.declare(
  ///
  // Simulates a frenzy server. //The constructor accepts a hash of functions that are used to simulate the
  // server-side procedures. The method bd.test.mockFrenzyServer` decodes a frenzy request message, calls all procedures
  // contained in the message that have also been defined in the instance (during construction, derivation, or otherwise), packages
  // the results and returns the frenzy response message.

  //superclasses
  [],

  //members
  {
  constructor: function(
    args //(hash) A set of objects (usually server-side function simulators) to mix into this instance.
  ){
    ///
    // Mixes args into the new instance.
    dojo.mixin(this, args);
  },

  postScript: function(
    result //The result created while servicing a frenzy message.
  ) {
    ///
    // The sole purpose of this function is to provide an place to hook an override function to manipulate results
    // after all simulated procedures have been run but before the frenzy response message is returned.
  },

  dispatchRequest: function(
    message //(frenzy request message) with the properties {responseText, responseXML, status, headers, method, url, user, password, content}
  ) {
    ///
    // Decodes the message, runs the simulator functions, packages and returns a response message.
    var
      request= dojo.fromJson(message.query),
      serviceInfo= request.serviceInfo,
      result= {
        serviceInfo: serviceInfo,
        results: []
      };

    result.serviceInfo.timeServiceRx= bd.getTime();

    dojo.forEach(request.calls, function(call) {
      var
        proc= this[call.procName],
        thisResult= {
          callId: call.callId,
          result: (proc ? proc.call(this, call.args, call.callId, serviceInfo) : 0)
        };
      result.results.push(thisResult);
    }, this);

    this.postScript(result);

    result.serviceInfo.timeServiceTx= bd.getTime();

    return {
      status: 200,
      responseText: dojo.toJson(result),
      responseXML: ""
    };
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

