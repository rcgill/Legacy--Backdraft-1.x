define("bd/test/result", [
  "dojo", "bd", "bd/test/namespace"
], function(dojo, bd) {
///
// Defines machinery for returning results within the Backdraft test framework.

bd.test.result=
  ///namespace
  // Contains the test result factories.
  bd.test.result || {};

bd.mix(bd.test.result, {
  base: {
    ///
    // The object used for the JavaScript prototype for built-in result instances.
    toString: function() {
      ///
      // Returns a string to indicate test outcome.
      if (this.pass) {
        if (this.todo) {
          return "TODO: test not implemented"; // iff this.todo is true
        } else {
          return "test passed"; // iff this.pass && !this.todo
        }
      } else if (this.threw) {
        return "test failed (test threw)";  // iff this.threw
      } else if (this.timeout) {
        return "test failed (test timed out)"; // iff this.timeout
      } else {
        return "test failed"; // otherwise
      }
    }
  },

  pass: function(
    vargs//(variableArgs, optional) Arguments to stuff into the args property of the result object
  ){
    ///
    // Creates a generic pass result object. //Returned Objects have:
    //
    // - pass: true
    // - args: the arguments object if any arguments passed to this fucntion; otherwise, undefined if none passed
    // - prototype: bd.test.result.base
    return dojo.delegate(bd.test.result.base, {pass:true, args: arguments.length ? arguments : undefined});
  },

  fail: function(
    vargs//(variableArgs, optional) Arguments to stuff into the args property of the result object
  ){
    ///
    // Creates a generic fail result object. //Returned Objects have:
    //
    // - pass:false
    // - args: the arguments object if any arguments passed to this fucntion; otherwise, undefined if none passed
    // - prototype: bd.test.result.base
    return dojo.delegate(bd.test.result.base, {pass:false, args: arguments.length ? arguments : undefined});
  },

  exception: function(
    vargs//(variableArgs, optional) Arguments to stuff into the args property of the result object
  ){
    ///
    // Creates a generic fail because test threw result object. //Returned Objects have:
    //
    // - pass: false
    // - threw: true
    // - args: the arguments object if any arguments passed to this fucntion; otherwise, undefined if none passed
    // - prototype: bd.test.result.base
    return dojo.delegate(bd.test.result.base, {pass:false, threw:true, args: arguments.length ? arguments : undefined});
  },

  timeout: function(
    vargs//(variableArgs, optional) Arguments to stuff into the args property of the result object
  ){
    ///
    // Creates a generic fail because test timed out result object. //Returned Objects have:
    //
    // - pass: false
    // - timeout: true
    // - args: the arguments object if any arguments passed to this fucntion; otherwise, undefined if none passed
    // - prototype: bd.test.result.base
    return dojo.delegate(bd.test.result.base, {pass:false, timeout:true, args: arguments.length ? arguments : undefined});
  },

  todo: function(
    vargs//(variableArgs, optional) Arguments to stuff into the args property of the result object
  ){
    ///
    // Creates a generic test wasn't implemented result object. //Returned Objects have:
    //
    // - pass: true
    // - todo: true
    // - args: the arguments object if any arguments passed to this fucntion; otherwise, undefined if none passed
    // - prototype: bd.test.result.base
    return dojo.delegate(bd.test.result.base, {pass:true, todo:true, args: arguments.length ? arguments : undefined});
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

