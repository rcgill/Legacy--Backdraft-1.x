define(["bd", "bd/interactive", "bd/stateful"], function(bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/interactive",
  theClass("[bd.interactive]", demo("[*]", function() {
    var 
      getFocusedReturnValue= 0,
      myClass= bd.declare([bd.interactive, bd.stateful], {
        focusedGet: function() {
          return getFocusedReturnValue;
        }
      }),
      o;

    // by default, new objects are created with disabled===false
    o= new myClass();
    the(o.get("disabled")).is(false);

    // set to disabled returns the previous value...
    the(o.set("disabled", true)).is(false);
    the(o.get("disabled")).is(true);   
    the(o.set("disabled", false)).is(true);
    the(o.get("disabled")).is(false);

    // attempting to disable an object with the focus fails
    getFocusedReturnValue= true;
    the(o.set("disabled", true)).is(bd.failed);
    the(o.get("disabled")).is(false);
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
