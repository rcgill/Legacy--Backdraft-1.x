define("bd/descriptor/cache", [
  "dojo", "bd",
  "bd/namespace"
], function(dojo, bd) {
///
// Defines the class bd.decriptor.cache.

bd.descriptor.cache= bd.declare(
  ///
  // Implements a cache of Backdraft descriptors.
  
  //superclasses
  [bd.namespace], 

  //members
  {

  preamble: function(
    creator, //(*bd.descriptor.cache.constructor.creator)
    keepRawText //(*bd.descriptor.cache.constructor.keepRawText)
  ){
    ///
    // Arranges constructor arguments appropriate for the superclass bd.namespace.
    return [creator, false];
  },

  constructor: function(
    creator,    //(*) Function used to retrieve the raw text of a descriptor
    keepRawText //(boolean, optional, false] The raw script text is maintained and available through bd.descriptor.cache.getRaw iff true.
  ){
    ///
    // Initializes a new cache.
    this._rawHash={};
    this._inFlight= {};
    this.keepRawText= !!keepRawText;
  },

  get: function(
    name,   //(string) Identifies the descriptor to get.
    onLoad, //(function(descriptor)) The function to call back when the descriptor is available.
    onError //(function(error)) The function to call back if an error occures retrieving the descriptor.
  ) {
    ///
    // Retrieves the descriptor given by name calls back onLoad with the result. //Calls back onError
    // with the error object in the event the retrieval fails.
    //
    // Descriptors are cached as they are retrieved. A dojo.Deferred is created that waits for the retriveal
    // operation to complete and then calls onLoad. If the descriptor is in the cache, then onLoad is called immediately.
    // Canonically, onError is called if retrieving the descriptor results in an error.
    //
    // Notice that a dojo.Deferred is created and returned that controls calling onLoad/onError whether or not
    // the descriptor was already in the cache; this should simplify client code.

    var
      result= new dojo.Deferred(dojo.hitch(this, "_onCancel", name)),
      descriptor= this._hash[name];
    result.addCallbacks(onLoad||null, onError||null);
    if (descriptor) {
      result.callback(descriptor);
    } else if (this._inFlight[name]) {
      this._inFlight[name].push(result);
    } else {
      this._inFlight[name]= [result];
      this.creator(name, dojo.hitch(this, "_onLoad", name), dojo.hitch(this, "_onError", name));
    }
    return result; //(dojo.Deferred) The dojo.Deferred object that controls the asynchronous retrieval of the descriptor.
  },

  getRaw: function(
    name // (*bd.descriptor.cache.constructor.name)
  ) {
    ///
    // Returns the raw text of a descriptor script.
    ///
    // The cache must be created with bd.descriptor.cache.constructor.keepRawText true in order for raw text to be
    // available. Additionally, the descriptor must have been already successfully retrieved by bd.descriptor.get. Failure to meet
    // either of these two requirements results in this function returning undefined.

    return this._rawHash[name];
  },

  _onLoad: function(
    name,         // (*bd.descriptor.cache.constructor.name)
    rawDescriptor // (string) The descriptor raw text.
  ) {
    ///
    // Processes a newly arrived descriptor. //dojo.eval the descriptor, store it in the cache, call back all dojo.Deferred objects waiting on the descriptor.
    // `private

    var descriptor= dojo.eval(rawDescriptor + "\r\n//@ sourceURL=" + name);
    if (!(descriptor instanceof Object)) {
      dojo.forEach(this._inFlight[name], function(item) { item.errback(Error("Data returned by server was not a descriptor.")); });
    } else {
      descriptor.descriptorId= name;
      this._hash[name]= descriptor;
      if (this.keepRawText) {
        this._rawHash[name]= rawDescriptor;
      }
      dojo.forEach(this._inFlight[name], function(item) { item.callback(descriptor); });
    }
    delete this._inFlight[name];
  },

  _onError: function(
    name, // (*bd.descriptor.cache.constructor.name)
    error // (any) The error signaled by the creator.
  ) {
    ///
    // Signals an error to all dojo.Deferred objects waiting on the descriptor.
    // `private

    dojo.forEach(this._inFlight[name], function(item) { item.errback(error); });
    delete this._inFlight[name];
  },

  _onCancel: function(
    name,       // (*bd.descriptor.cache.constructor.name)
    theDeferred // (dojo.Deferred) The dojo.Deferred to cancel.
  ) {
    ///
    // Cancel a waiting dojo.Deferred.
    // `warn This results in the onError handler being called for each waiting dojo.Deferred.
    // `private

    for (var inFlight= this._inFlight[name], i= 0, end= inFlight.length; i<end; i++) {
      if (inFlight[i]===theDeferred) {
        inFlight.splice(i, 1);
        return;
      }
    }
  }
});

bd.descriptor.cache.constructor.creator= function(
  name, //(string) Indentifies the descriptor to retrieve.
  onLoad, //(function(desciptorText)) The function to apply to the raw descriptor text upon reception.
  onError //(function(error)) The function to apply to the Error object upon an error during retrieval.
){
  ///
  // Retrieves (asynchronously) the raw decriptor text as given by name and passes the result to onLoad; upon
  // failure, passes the error to onError.
  // `type
};

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
