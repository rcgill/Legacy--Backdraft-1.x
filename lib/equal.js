define("bd/equal", ["bd/kernel", "dojo", "bd/hash"], function(bd, dojo) {
///
// Defines the function bd.equal.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

bd.equal= function(
  lhs,     //(any) The left-hand-side object
  rhs,     //(any) The right-hand-side object
  watchdog //(integer, optional, 10) The maximum nesting depth of structures before a circular structure is assumed.
) {
  ///
  // Compute if lhs has the same type and value as rhs. //Works correctly with numbers, 
  // strings, booleans, null, Dates, Errors, RegExps, as well as arrays of and objects containing these types, 
  // including most objects created by a constructor function. Specialized objects (for example, objects who's
  // value is influenced by the result of executing a function) can be accommodated by adding to the bd.equal.comparators hash.

  if (lhs===rhs) {
    return true;
  }

  if ((lhs===null && rhs!==null) || (rhs===null && lhs!==null)) {
    return false;
  }

  if (typeof lhs !== "object" || typeof rhs !== "object") {
    return false;
  }

  if (lhs.constructor!==rhs.constructor) {
    return false;
  }

  if (watchdog===0) {
    //TODO: warn or exception?
    return true;
  }

  if (!watchdog) {
    watchdog= 10;
  }

  var comp= bd.equal.comparators.get(lhs.constructor);
  if (comp!==bd.notFound) {
    return comp(lhs, rhs, watchdog);
  }

  var count= 0;
  for (var p in lhs) {
    count++;
  }
  for (p in rhs) {
    if (--count<0 || !bd.equal(lhs[p], rhs[p], watchdog-1)) {
      return false;
    }
  }
  return count===0;
};

bd.equal.comparators=
  ///
  // An instance of bd.hash that gives a map from constructor function to compare function for use with bd.equal. //
  // The compare function must take two arguments and return true if the arguments are equal
  // by value, false otherwise.
  //
  // bd.equal.comparators is initialized to handle Arrays, Dates, Errors, and RegExps. Client
  // code can augment the hash to handle other, client-defined types.
  (new bd.hash()).
    set(Array, function(lhs, rhs, watchdog) {
        if (lhs.length!=rhs.length) {
          return false;
        }
        for (var i= 0, end= lhs.length; i<end; i++) {
          if (!bd.equal(lhs[i], rhs[i], watchdog-1)){
              return false;
          }
        }
        return true;
      }).
    set(Date, function(lhs, rhs) {
        return lhs.valueOf()==rhs.valueOf();
      }).
    set(Error, function(lhs, rhs) {
        return lhs.message==rhs.message;
      }).
    set(RegExp, function(lhs, rhs) {
        return lhs.source===rhs.source && lhs.global===rhs.global && lhs.ignoreCase===rhs.ignoreCase && lhs.multiline===rhs.multiline;
      }
    );

bd.equivP= function(
  target //(any) The reference target.
) {
  ///
  // Returns a function that takes a single argument, `test`, and returns `target===test`.
  return function(test) {
    return test===target;
  };
};

bd.equalP= function(
  target,  //(any) The reference target.
  watchdog //(integer, optional, 10) The maximum nesting depth of structures before a circular structure is assumed.
) {
  ///
  // Returns a function that takes a single argument, `test`, and returns `bd.equal(target, test, watchdog)`.
  watchdog= watchdog || 10;
  var equal= bd.equal;
  return function(test) {
    return equal(target, test, watchdog);
  };
};

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

