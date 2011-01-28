define("bd/frenzy", [
  "dojo", "bd"
], function(dojo, bd) {
///
// Augments the bd namespace with the bd.frenzy class.

//TODO improve documentation.

bd.frenzyProxy= bd.declare(
  ///
  // Implements a proxy to a Frenzy service.

  //superclasses
  [], 

  //members
  {
  maxLiveTransactions:
    ///
    // The maximum number of concurrent requests than may be issued to the server. (integer)
    2,

  delay:
    /// 
    // Milliseconds to wait before sending a queued request to the server. (integer)
    // `note Changes to this attribute will not take place until the next scheduled transaction with the server.
    20,

  circulate:
    /// 
    // Require that at least one request always be issued. (boolean) //This allows the server to send messages to the client immediately.
    // `warn
    // Do not access this property directly; use bd.frenzyProxy.start and bd.frenzyProxy.stop.
    // `private 
    false,

  stopped:
    /// 
    // Indicates the instance has stopped processing transactions. (boolean)
    // `warn 
    // Do not access this property direction; use bd.frenzyProxy.start and bd.frenzyProxy.stop.
    // `private 
    false,

  constructor: function(
    args //(kwargs) Configuration properties for new frenzy service instance.
  ) {
    /// 
    // Creates a new instance.
    dojo.mixin(this, args, {
      callCounter:0,
      transactionCounter:0,
      liveTransactionCount:0,
      pendingCalls:{},
      queuedCalls:[],
      messageHandlers:{}
    });
    if (this.circulate) {
      //let this object fully construct and possibly let clients get some initial calls made, but start circulating within 10ms
      this.timer= setTimeout(dojo.hitch(this, "startTransaction"), 10);
    }
  },

  call: function(
    procName, //(string) The name of the procedure to call at the Frenzy service.
    args,     //(any) The single argument to pass to the Frenzy procedure; multiple arguments are passed in an array or hash.
    onResult, //(bd.frenzyProxy.onResult) Function that's called upon successful completion of the service request.
    onError   //(bd.frenzyProxy.onError) Function that's called upon encountering an error during a service request.
  ) {
    /// 
    // Calls a service procedure. //Return successful result to onResult; call onError in the event of XHR failure.

    if (this.stopped) {
      throw Error("Attempt to call stopped frenzy instance.");///(error) If this frenzy proxy instance is stopped.
    }

    var
      callId= ++this.callCounter,
      callInfo= {
        params: {
	  callId:callId,
	  procName:procName,
	  args:args
        },
        deferred:new dojo.Deferred(dojo.hitch(this, "cancelCall", callId))
      };
    callInfo.deferred.addCallbacks(onResult||null, onError||null);
    this.pendingCalls["_"+callId]= callInfo;
    this.queuedCalls.push(callId);
    this.scheduleTransaction();
    return callInfo; ///(bd.frenzyProxy.callInfo) Contains all information about this call.
  },

  cancelCall: function(
    callId //(interger) A bd.frenzyProxy.callId previously returned by bd.frenzyProxy.call.
  ) {
    /// 
    // Cancels a call if it is still pending,

    this.queuedCalls= dojo.filter(this.queuedCalls, function(queuedCallId) {
      return queuedCallId!=callId;
    });
    this.deletePendingCall(callId);
    return new Error("Frenzy call cancelled.");
  },

  connect: function(
    message, //(string) Identifies the server message.
    proc     //(bd.frenzyProxy.serverMessageHandler) The callback function.
  ){
    /// 
    // Connects a handler to a server message. //Once connected, upon receipt of the message `message` consequent to
    // a frenzy transaction, proc is called.

    if (!this.messageHandlers[message]) {
      this.messageHandlers[message]= [proc];
    } else {
      this.messageHandlers[message].push(proc);
    }
  },

  disconnect: function(
    message, //(string) Identifies the server message.
    proc     //(bd.frenzyProxy.serverMessageHandler) A callback function that was previously connected.
  ){
    /// 
    // Disconnects a handler from a server message. //See bd.frenzy.connect.

    for (var handlers= this.messageHandlers[message], i= 0, end= handlers.length; i<end; i++) {
      if (handlers[i]===proc) {
        handlers.splice(i, 1);
        return;
      }
    }
  },

  stop: function(
    cancelAll //(boolean, optional, false) If true, then cancel all incomplete calls.
  ) {
    /// 
    // Stops all outgoing calls; optionally cancel all pending calls.

    this.stopped= true;
    this.circulate= false;
    if (cancelAll) {
      var callList= [];
      for (var p in this.pendingCalls) {
        callList.push(p);
      }
      for (var i= 0, end= callList.length; i<end; i++) {
        this.pendingCalls[callList[i]].deferred.cancel();
      }
    }
  },

  start: function(
    circulate //(*bd.frenzyProxy.circulate)
  ) {
    /// 
    // Restarts outgoing calls and, optionally, circulation.
    // `note Harmless if already "started".

    this.stopped= false;
    if (circulate) {
      this.circulate= true;
      this.timer= setTimeout(dojo.hitch(this, "startTransaction"), 10);
    }
  },

  getServiceInfo: function(
    id //(integer) The transaction number.
  ) {
    /// 
    // Returns the serviceInfo property of a service request object. //Override this method
    // to include special data (e.g., cookies) that is meaningful to the particular frenzy server.

    return {
      transactionId: id,
      timeClientTx: bd.getTime()
    };
  },

  scheduleTransaction: function() {
    ///
    // Sets a timer to call the server if required.
    // `private

    if (this.stopped || this.timer) {
      return;
    }
    var resultsPending= this.queuedCalls.length;
    if (!resultsPending && this.liveTransactionCount==0) {
      for (var p in this.pendingCalls) {
        resultsPending= true;
        break;
      }
    }
    if (
      this.liveTransactionCount < this.maxLiveTransactions &&
      (resultsPending || (this.circulate && this.liveTransactionCount==0))
    ) {
      this.timer= setTimeout(dojo.hitch(this, "startTransaction"), this.delay);
      console.log("just set frenzy delay, t= " + bd.getTime());
    }
  },

  startTransaction: function() {
    ///
    // Constructs a service request object and sends the request to the Frenzy service.
    // `private
    this.timer= 0;
    if (this.stopped) {
      return;
    }
    console.log("frenzy.call server, t= " + bd.getTime());

    var content= {
      serviceInfo:this.getServiceInfo(++this.transactionCounter),
      calls:dojo.map(this.queuedCalls, function(callId) { return this.getPendingCall(callId).params; }, this)
    };

    var callList= this.queuedCalls;
    this.queuedCalls= [];

    this.liveTransactionCount++;
    var xhrDeferred= dojo.xhrPost(dojo.mixin({}, this.xhrArgs, {postData: dojo.toJson(content)}));
    xhrDeferred.addCallbacks(
      dojo.hitch(this, "onTransactionComplete"),
      dojo.hitch(this, "onTransactionError", callList)
    );
  },

  onTransactionComplete: function(
    result//(JSON) The result of a service request.
  ) {
    ///
    // Processes the result of a service request.
    // `private
    result= dojo.fromJson(result);
    var serviceInfo= result.serviceInfo;
    serviceInfo.timeClientRx= bd.getTime();
    dojo.forEach(result.results, function(result) {
      var callInfo= this.getPendingCall(result.callId);
      if (callInfo) {
        callInfo.result= result.result;
        callInfo.serviceInfo= serviceInfo;
        callInfo.deferred.callback(callInfo);
        this.deletePendingCall(result.callId);
      } else if (this.messageHandlers[result.serverMessage]) {
        for (var handlers= this.messageHandlers[result.serverMessage], i= 0, end= handlers.length; i<end; i++) {
          handlers[i](result.result, serviceInfo);
        }
      }
    }, this);
    this.liveTransactionCount--;
    this.scheduleTransaction();
    return result;
  },

  onTransactionError: function(
    callList, //(array of bd.frenzyProxy.callId) The set of calls upon which to signal an error.
    error     //(any) The error to signal.
  ) {
    ///
    // Processes an error generated by a service request.
    // `private
    dojo.forEach(callList, function(callId) {
      var callInfo= this.getPendingCall(callId);
      callInfo.error= error;
      callInfo.serviceInfo= serviceInfo;
      callInfo.deferred.errback(callInfo);
      this.deletePendingCall(callId);
    }, this);
    this.liveTransactionCount--;
    this.scheduleTransaction();
  },

  getPendingCall: function(
    callId //(integer) The callId that identifies the call to return
  ){
    ///
    // Gets the bd.frenzyProxy.callInfo for callId from the pendingCalls cache.
    // `private
    return callId ? this.pendingCalls["_"+callId] : undefined;
  },

  deletePendingCall: function (
    callId //(integer) The callId that identifies the call to return
  ){
    ///
    // Deletes the bd.frenzyProxy.callInfo for callId from the pendingCalls cache.
    // `private
    delete this.pendingCalls["_"+callId];
  }
});

bd.docGen("bd.frenzyProxy", {
  "constructor.kwargs": {
    ///
    // Describes how to initialize a bd.frenzyProxy instance.
    xhrArgs: 
      ///(hash) The argument to provide to dojo.xhr in order to initiate a Frenzy transaction.
      undefined,
    maxLiveTransactions: 
      ///(integer, optional) Initial value for bd.frenzyProxy.maxLiveTransactions.
      undefined,
    circulate: 
      ///(boolean, optional) Override bd.frenzyProxy.circulate.
      undefined,
    delay:
      ///(integer, optional) Override bd.frenzyProxy.delay.
      undefined,
    getServiceInfo:
      ///(bd.frenzyProxy.serviceInfo, optional) Override getServiceInfo.
      undefined
  },

  callId:
    ///type
    // An integer that uniquely indentifies a service request made through bd.frenzyProxy.call. //Also
    // see bd.frenzyProxy.cancelCall.
    ///
    // Each service request initiated via bd.frenzyProxy.call results in generating a
    // sequential callId. This can be used to untangle calls when they finish out of order.
    bd.noDefault,

  transactionId:
    ///type
    // An integer that identifies a single single send-receive transaction with the server. //Several service 
    // requests as initialized through bd.frenzyProxy.call may be bundled into a single transaction (indeed,
    // this is one of the key purposes of the frenzy protocol.
    bd.noDefault,

  callInfo: {
    ///type
    // Information about a particular Frenzy call.
    params:
      //(bd.frenzyProxy.callParams) Provides the outgoing call parameters.
      0,
    deferred:
      //(dojo.Deferred) The dojo.Deferred instance that controls the call.
      0,
    serviceInfo:
      //(bd.frenzyProxy.serviceInfo) Provides call sequencing and timing information.
      0,
    result:
      //(any) The service response to the call.
      0
  },

  callParams: {
    ///type
    // Contains the outgoing call parameters.
    callId:
      //(bd.frenzyProxy.callId) The callId for this call.
      bd.noDefault,
    procName:
      //(string) The service name requested.
      bd.noDefault,
    args:
      //(any) Arguments to accompany the service request
      null
  },

  serviceInfo: {
    ///type
    // Contains service request (call) sequencing and timing information.
    transactionId:
      //(bd.frenzyProxy.transactionId) The sequence number of this transaction.
      bd.noDefault,
    timeClientTx:
      //(integer) Date in milliseconds this service request was made by the client.
      bd.noDefault,
    timeClientRx:
      //(integer) Date in milliseconds this service request was received from the service.
      bd.noDefault,
    timeServiceRx:
      //(integer) Date in milliseconds this service received the request.
      bd.noDefault,
    timeServiceTx:
      //(integer) Date in milliseconds this service transmitted the response.
      bd.noDefault
  },

  onResult: function(
    result,     //(any) The result (after applying eval) of the response received consequent to a service request.
    serviceInfo //(bd.frenzyProxy.serviceInfo) Information about this particular Frenzy transaction.
  ) {
    ///type
    // Client-provided function that's called upon successful completion of a Frenzy service request. //
    // 
    // The return value, if any, will be passed up the continuation change for the dojo.Deferred object that controls this particular Frenzy service request
  },

  onError: function(
    result //(error) The Error object.
  ) {
    ///type
    // Client-provided function that's called upon failure of a Frenzy service request. //
    // The return value, if any, will be passed up the continuation change for the dojo.Deferred object that controls this particular Frenzy service request
  },

  serverMessageHandler: function(
    result, //(any) The result sent with the service message as defined by the server.
    serviceInfo //(bd.frenzyProxy.serviceInfo) Information about this particular Frenzy transaction.
  ) {
    ///type
    // Client-provided functions that may be connected to a known service message. //See bd.frenzyProxy.connect.
  }
   
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

