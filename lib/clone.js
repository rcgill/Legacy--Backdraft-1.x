define("bd/clone", ["bd/kernel", "dojo", "bd/declare"], function(bd, dojo) {
///
// Defines the function bd.clone.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

bd.clone= function(
  source,  //(any) object to clone
  watchdog //(integer, optional, 10) The maximum nesting depth of structures before a circular structure is assumed.
){
  ///
  // Clones source (deep copy).
  //
  //return
  //(number, boolean, string, null, undefined) by-value copy of source
  //> source is a number, boolean, string, null, or undefined
  //
  //(function) reference to source
  //> source is a function
  //
  //(object) new object with same set of properties as source, with each property, p, initialized to bd.clone(source[p])
  //> source is type Object (i.e., object.prototype.constructor===Object)
  //
  //(any) result of source.constructor.clone
  //> source.constructor.clone is function
  //
  //(any) result of bd.clone.factories.get(source.prototype.constructor)(source)
  //> bd.clone.factories.get(source.prototype.constructor)!==bd.notFound
  // 
  //(object) Object with the same set of properties, with each property, p, initialized to bd.clone(source[p])
  //> none of the other conditions above are satisfied.
  ///
  //warn
  //  Will not properly clone structures with cycles; throws an exception when source contains a cycle.
  //
  //warn
  //  Will not properly clone delegated objects.
  //
  //todo
  //  Add support for delegated objects.
  //
  var objectClone= function(source) {
    var clone;
    if (source.constructor) {
      clone= new source.constructor();
      for (var p in source) {
        if (source.hasOwnProperty(p)) {
          clone[p]= bd.clone(source[p], watchdog-1);
        }
      }
      return clone;
    }
    clone= {};
    for (p in source) {
      if (clone[p]!==source[p]) {
        clone[p]= bd.clone(source[p], watchdog-1);
      }
    }
    return clone;
  };

  if (watchdog===0) {
    throw new Error("bd.clone: cycle detected");
  }
  if (!watchdog) {
    watchdog= 10;
  }

  if (typeof source!=="object" || source===null || source===undefined || bd.isFunction(source)) {
    return source;
  }

  if (source.constructor===Object) {
    return objectClone(source);
  }

  if (bd.isFunction(source.clone)) {
    return source.clone(watchdog);
  }

  var cloneFunction= bd.clone.factories.get(source.constructor);
  if (cloneFunction!==bd.notFound) {
    return cloneFunction(source, watchdog);
  }

  return objectClone(source);
};

bd.clone.factories=
  ///
  // An instance of bd.hash that gives a map from constructor function to factory function for use with bd.clone. //
  // The factory functions are called assuming the same signature of bd.clone.
  //
  // bd.clone.factories is initialized to handle Arrays, Dates, Errors, and RegExps. Client
  // code can augment the array to handle other, client-defined types.
  (new bd.hash()).
    set(Array, function(source, watchdog) {
        watchdog--;
        for (var result= [], i= 0, end= source.length; i<end; result[i]= bd.clone(source[i++], watchdog));
        return result; 
      }).
    set(Date, function(source){
        return new Date(source.getTime());
      }).
    set(Error, function(source){
        return new Error(source.message);
      }).
    set(RegExp, function(source){
        return new RegExp(source.source, (source.global ? "g" : "") + (source.ignoreCase ? "i" : "") + (source.multiline ? "m" : ""));
      }).
    set(String, function(source){
        return new String(source.substring(0));
      }).
    set(Number, function(source){
        return new Number(source);
      }
    );

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

