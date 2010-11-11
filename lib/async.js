define("bd/async", [
  "bd",
  "bd/dom"
], function(bd) {
///
// Augments the bd namespace with asynchronous processing machinery.

bd.async=
  ///namespace 
  // Contains the Backdraft asynchronous processing functions.
  bd.async || {};

var
  timerId= 0,
  callbacks= [],
  focusTarget= null,
  eq= function(target) {
    return function(item) {
      return item.callback==target.callback && item.context==target.context;
    };
  },
  neq= function(target) {
    return function(item) {
      return item.callback!==target.callback || item.context!==target.context;
    };
  };

bd.mix(bd.async, {
  delay:
    ///
    // The milliseconds that to wait before executing scheduled functions.
    10,

  exec: function(){
    ///
    // Executes all functions scheduled with bd.async.schedule.
    // `private
    // `warn
    // This routine is called internally by bd.async.schedule; it is exposed so that advanced users can override.
    var execQueue= callbacks;
    callbacks= [];
    clearInterval(timerId);
    timerId= 0;
    for (var i= 0, end= execQueue.length; i<end; i++) {
      var item= execQueue[i];
      item.callback.apply(item.context || bd.global, item.vargs);
    }
  },

  schedule: function(
    flags,    //("first") Only the first attempt to schedule a callback is executed.
              //("last") Only the last attempt to schedule a callback is executed.
              //("*") All scheduled callbacks are executed.
    callback, //(function) Function to execute asynchronously.
              //(string) Function name in context to execute asynchronously.
    context,  //(object, optional) Context in which to apply callback; falsy implies bd.global.
    vargs     //(variableArgs, optional) Zero or more arguments for application of callback.
  ){
    ///
    // Schedule a function for asynchronous execution.
    ///
    // If multiple attemps to schedule the same (`callback`, `context`) for asynchronous execution occur before a particular callback is executed,
    // flags determines which scheduled execution should occur. Notice that `vargs` do not influence "sameness".
    // For example,
    //
    //code
    // bd.async.schedule("first", myCallback, 0, "the first attempt");
    // bd.async.schedule(myOtherCallback);
    // bd.async.schedule("first", myCallback, 0, "the second attempt");
    ///
    // Would cause myCallback("the first attempt") to be executed before myOtherCallback(). Whereas,
    // 
    //code
    // bd.async.schedule("last", myCallback, 0, "the first attempt");
    // bd.async.schedule(myOtherCallback);
    // bd.async.schedule("last", myCallback, 0, "the second attempt");
    ///
    // Would cause myOtherCallback() to be executed before myCallback("the second attempt").
    //
    // Notice that the last flags argument seen for a particular (`callback`, `context`) override all other flags arguments given for that callback.
    if (bd.isString(callback)) {
      callback= (context ? context[callback] : bd.global[callback]);
    }
    context= context || 0;
    var item= {
      callback: callback,
      context: context,
      vargs: bd.array(arguments, 3)
    };

    if (!timerId) {
      timerId= setInterval(bd.hitch(bd.async, "exec"), bd.async.delay);
    }
    switch (flags) {
      case "first":
        bd.findFirst(callbacks, eq(item))===-1 && callbacks.push(item);
        break;
      case "last":
        callbacks= bd.filter(callbacks, neq(item));
        callbacks.push(item);
        break;
      default:
        callbacks.push(item);
        break;
    }
  },

  setFocus: function(
    target //(object) The object upon which to set focus.
  ) {
    ///
    // Sets the focus to target asynchronously.
    setTimeout(function() {
      target.focus();
    }, 0);
  }
});

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

