define("bd/namespace", [
  "dojo", "bd"
], function(dojo, bd) {
///
// Augments the bd namespace with the bd.namespace class.

bd.docGen("bd.namespace", {
  creator: 
    function(
      name,  //(string) The name of the object to add to the namespace.
      value  //(any) The object to add to the namespace.
    ) {
      ///type
      // A function used by a namespace instance to add new objects to the namespace. // The
      // function should add a new object by executing the statement
      //
      //c this._hash[<name>]= <value>;
      ///
      // The function is passed arguments provided to namespace.add (and namespace.get iff autocreate is true).
      // name is guaranteed to be at arguments[0], but other arguments may exist as the caller provides
      // them according to the semantics of creator. The default implementation simply executes
      //
      //c this._hash[name]= arguments[1]"
      ///
      // with arguments as given to add or get.
    },
  
  proc:
    function(
      name, //(string) The name associated with value.
      value //(any) An object stored in the namespace at name.  
    ) {
      ///type
      //sematics as required by client code
    },

  predicate:
    function(
      name, //(string) The name associated with value.
      value //(any) An object stored in the namespace at name.  
    ) {
      ///type
      //sematics return true if (name, value) satisfies the predicate as required by client code
    }
});

bd.namespace= bd.declare(
  ///
  // Implements a dynamic namespace that allows associating names with some value or reference.
  ///
  // The key differences between bd.namespace and a standard JavaScript object are as follows:
  // 
  //   * The ability to define a specialized function that adds names to the namespace and
  //     further guaranteeing that this function is executed to cause any name to be added.
  //   * The ability to connect to insert/delete/lookup events.

  //superclasses
  [], 

  //members
  {
  constructor: function(
    creator,   //(bd.namespace.creator, optional) called when a new object is added to the namespace.
    autocreate //(bool, optional, false) if true, then automatically create an object if lookup fails using the creator function.
  ){
    ///
    // Create a new instance. //If creator is not found, then the following default is used:
    //code
    // function(name, value) {
    //   this._hash[name]= value;
    //   return value;
    // };
    this._hash={};
    this.creator= creator || function(name, value) {
      this._hash[name]= value;
      return value;
    };
    this.autocreate= !!autocreate;
  },

  set: function(
    name, //(string) The name to add to the namespace
    vargs   //(any*) Arguments as required by the creator
  ) {
    ///
    // Add an object to the namespace.
    //return
    //(bd.namespace) The namespace object (this)
    this.creator.apply(this, arguments);
    return this;
  },

  del: function(
    name //(string) The name to delete from the namespace
  ){
    ///
    // Delete an object from the namespace.
    //return
    //(any) The object deleted from the namespace.
    var result= this._hash[name];
    delete this._hash[name];
    return result;
  },

  get: function(
    name //(string) The name to resolve
  ) {
    ///
    // Lookup and return a member of the namespace.
    //return
    //(any) The object associated with name.
    var result= this._hash[name];
    if (result===undefined && this.autocreate) {
      result= this._hash[name]= this.creator.apply(this, arguments);
    }
    return result;
  },

  forEach: function(
    proc,   //(bd.namespace.proc) Function to execute.
            //(string) Function to execute is given by context[function].
    context //(object, optional, dojo.global) Context in which to execute function.
  ) {
    ///
    // Apply proc to each (name,  object) in the namespace.
    context= context || dojo.global;
    if (dojo.isString(proc)) {
      proc= context[proc];
    }
    var hash= this._hash;
    for (var name in hash) {
      proc.call(context, name, hash[name]);
    }
  },

  filter: function(
    filter, //(bd.namespace.predicate) Predicate function.
            //(string) Predicate function is given by context[function].
    context //(object, optional, dojo.global) Context in which to execute function.
  ) {
    ///
    // Create a new namespace containing only the objects in the current namespace that satisfy the filter predicate.
    context= context || dojo.global;
    if (dojo.isString(filter)) {
      filter= context[filter];
    }
    var
      result= new bd.namespace(this.creator, this.autocreate),
      thisHash= this._hash,
      resultHash= result._hash;
    for (var name in thisHash) {
      if (filter.call(context, name, thisHash[name])) {
	      resultHash[name]= thisHash[name];
      }
    }
    return result;
  }
});

//TODO change the signatures of forEach and filter to the standard Backdraft callback signatures


});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
