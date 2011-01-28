define("bd/hash", ["bd/kernel", "bd/declare"], function(bd) {
///
// Defines the class bd.hash.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

bd.hash= bd.declare(
  ///
  // Implements a generalized hash. //Unlike a standard JavaScript object, this class can use any type for a key.
 
  //superclasses
  [],

  //members
  {
  constructor: 
    function(
      compareFunction //(bd.predicate2, optional, JavaScript operator ===) Function to use to compare keys.
    ) {
      ///
      // Creates a new hash instance. //If compareKeysByValue is provided, then that function
      // is used to compare keys; otherwise, keys are compared with operator ===.
      this.keys= [];
      this.values= [];
      this.compareFunction= compareFunction || false;
    },

  set:
    function(
      key,  //(any) Key for value in hash.
      value //(any) Value to be associated with key in hash.
    ) {
      ///
      // Sets the value for `key` in the hash.
      var comp= this.compareFunction;
      for (var keys= this.keys, i= keys.length; i--;) {
        if ((comp && comp(keys[i], key)) || keys[i]===key) {
          this.values[i]= value;
        }
      }
      keys.push(key);
      this.values.push(value);
      return this;
    },

  del:
    function(
      key //(any) Key to be deleted.
    ) {
      ///
      // Deletes the entry for `key` in the hash.
      var comp= this.compareFunction;
      for (var keys= this.keys, i= keys.length; i--;) {
        if ((comp && comp(keys[i], key)) || keys[i]===key) {
          keys.splice(i, 1);
          this.values.splice(i, 1);
          return true;
        }
      }
      return false;
    },

  get: 
    function(
      key //(any) Key that identifies value to be retrieved.
    ) {
      ///
      // Returns the value associated with `key` in the hash; returns bd.notFound if
      // no value has been entered for `key`.
      var comp= this.compareFunction;
      for (var keys= this.keys, i= keys.length; i--;) {
        if ((comp && comp(keys[i], key)) || keys[i]===key) {
          return this.values[i];
        }
      }
      return bd.notFound;
    },

  forEach:
    function(
      callback, //(function(key, value)) Function to call with each (key, value) pair in the hash.
                //(string) Function name in context to call with each (key,value) pair in the hash.
      context,  //(object, optional) Context in which to apply callback.
      vargs     //(variableArgs, optional) Zero or more arguments for application of function.
    ) {
      ///
      // Iterates over key key in the hash and passes (key, value) to callback. //As with all Backdraft 
      // functions that take a callback-like function argument, `(callback, context, vargs)`
      // is transformed to `bd.hitch(context, callback, arg1, arg2, ...)`.

      if (arguments.length>1) {
        callback= bd.hitch.apply(bd, bd.array(arguments));
      }
      for (var keys= this.keys, values= this.values, i= keys.length; i--;) {
        callback.call(null, keys[i], values[i]);
      }
    }
});

//TODO implement other collection functions

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

