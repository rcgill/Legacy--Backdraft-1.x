define("bd/collections", ["bd/kernel", "dojo", "bd/lang"], function(bd, dojo) {
///
// Augments the bd namespace with several functions that operate on collections.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

bd.docGen("bd", {
  collectionCallback: function(
    item,      //(any) The current item in collection
    offset,    //(integer) If collection is an array, the current offset of item in collection.
               //(string) If collection is an object, the property name at which item resides.
    collection //(array or hash) The collection.
  ){
    ///
    // Function signature expected by several collection functions that iterate of a collection.
    ///
    // collection[offset]===item is guaranteed true.
    ///
    // Side effects and return semantics as given by client-code and the particular collection function.

    //as required by semantics of client code
  },

  collectionPredicate: function(
    item,      //(any) The current item in collection
    offset,    //(integer) If collection is an array, the current offset of item in collection.
               //(string) If collection is an object, the property name at which item resides.
    collection //(array or hash) The collection.
  ){
    ///
    // Function signature expected by several collection functions that search for
    // an item in a collection. //The function must return true if item is the target item; false otherwise.
    ///
    // collection[offset]===item is guaranteed true.

    //as required by semantics of client code
  },

  collectionOrder: function(
    item //(any) The item to test.
  ) {
   ///
   // Function signature expected by bd.binarySearch; returns the relative order of an item to a target.
   ///
   //return
   //(-1) item is less than target.
   //(0) item is equal to target.
   //(1) item is greater than target.

   //code to determine order of item relative to some target.
  }
});

var fixCallback= function(args, callbackIndex, useHashArgs) {
  var callback= args[callbackIndex];
  if (args.length>callbackIndex+1) {
    return bd.hitch.apply(bd, bd.array(args, callbackIndex+2, [args[callbackIndex+1], callback]));
  } else if (bd.isString(callback)) {
    return (useHashArgs ? new Function("item", "key", "hash", callback) : new Function("item", "index", "array", callback));
  } else {
    return callback;
  }
};

bd.hasNative= function(
  collection, //(any) The collection to test.
  methodName  //(string) The method name to test.
) {
  ///
  // Returns true iff collection contains the method methodName.
  ///
  // This can be used to turn off usage of built-in collection functions (e.g. Array.forEach) as
  // well as during unit testing of the collections module.
  return bd.isFunction(collection[methodName]);
};

bd.forEach= function(
    collection, //(bd.collection) The collection to iterate.
    callback,   //(bd.collectionCallback) Function to apply to each item in the collection.
    context,    //(object, optional) Context in which to apply callback.
    vargs       //(variableArgs, optional) Zero or more arguments for application of callback.
  ) {
  ///
  // Applies callback to each item in the collection. 
  ///
  // If collection is falsy (e.g., an undefined variable, 0, false, or null was passed), then the function
  // returns without executing any processing.
  // 
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  // 
  // The function delegates to collection.forEach if the collection contains the method forEach. Note in particular
  // that Array.forEach will be used in environments that define that function. Otherwise,
  // iterate from front to back over each item in the collection.
  //note
  // See [JavaScript 1.5 Array forEach specification](https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach).
  bd.docGen("overload",
    function(
      collection,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!collection) {
    //short cuircuit return
    return;
  }
  callback= fixCallback(arguments, 1);
  if (bd.hasNative(collection, "forEach")) {
    collection.forEach(callback);
  } else {
    for (var i= 0, end= collection.length; i<end; i++) {
      callback(collection[i], i, collection);
    }
  }
};

bd.map= function(
  collection, //(bd.collection) The collection to iterate.
  callback,   //(bd.collectionCallback) Function to apply to each item in the collection.
  context,    //(object, optional) Context in which to apply callback.
  vargs       //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Returns the array of results of applying callback to each item in collection.
  ///
  // If collection is falsy (e.g., an undefined variable, 0, false, or null was passed), then the function
  // returns an empty array without executing any processing.
  // 
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  // 
  // The function delegates to collection.map if the collection contains the method map. Note in particular
  // that Array.map will be used in environments that define that function. Otherwise,
  // iterate from front to back over each item in the collection.
  //note
  // See [JavaScript 1.5 Array map specification](https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map).
  bd.docGen("overload",
    function(
      collection,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!collection) {
    //short cuircuit return
    return [];
  }
  callback= fixCallback(arguments, 1);
  if (bd.hasNative(collection, "map")) {
    return collection.map(callback);
  }
  var result= [];
  for (var i= 0, end= collection.length; i<end; i++) {
    result.push(callback(collection[i], i, collection));
  }
  return result;
};

bd.findFirst= function(
  collection, //(bd.collection) The collection to inspect.
  predicate,  //(bd.collectionPredicate) Returns true when applied to target item.
  start,      //(positive integer, optional, 0) search begining with start; ignored if collection is not an array.
  callback,   //(bd.collectionCallback, optional) The function to apply to found item (if any).
  context,    //(object, optional) Context in which to apply callback.
  vargs       //(variableArgs, optional) Zero or more arguments for application of predicate.
) {
  ///
  // Searches for the first item that satisfies predicate.
  ///
  // Returns the index (if no callback is provided) or the result of the callback (if a callback is provided)
  // of the first item in collection that satisfies the predicate (if such an item
  // exists); otherwise, when no item satsifies the predicate, the callback (if any) is not called and -1 is returned.
  // 
  // If collection is falsy (e.g., an undefined variable, 0, false, or null was passed), then the function
  // returns -1 immediately without executing any processing.
  // 
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  // 
  // The function delegates to collection.findFirst if the collection contains the method findFirst.
  // 
  // Seaching starts at index start (if start>0), at index length+start (if start<0),
  // or 0 (if start is 0 or missing) and proceeds front-to-back.
  // 
  //return
  //(any) callback(item, index, collection)
  //> item matches at index and callback is given.
  //(integer) offset of match into collection of match
  //> match is found and collection is an array
  //(-1)
  //> no item satisfies predicate or collection is falsy
  bd.docGen("overload",
    function(
      collection,
      predicate,
      start,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!collection) {
    //short cuircuit return
    return -1;
  }
  var start_= 0;
  if (typeof start=="number") {
    callback= fixCallback(arguments, 3);
    start_= ((start<0 && collection.length) ? (collection.length + start) : start);
  } else {
    callback= fixCallback(arguments, 2);
  }
  if (bd.hasNative(collection, "findFirst")) {
    return start===undefined ? collection.findFirst(predicate, callback) : collection.findFirst(predicate, start, callback);
  }
  for(var i= Math.min(collection.length, Math.max(start_, 0)), end= collection.length; i<end; i++) {
    if (predicate(collection[i], i, collection)) {
      return callback ? callback(collection[i], i, collection) : i;
    }
  }
  return -1;
};

//TODO bd.findLast

bd.some= function(
  collection, //(bd.collection) The collection to inspect.
  predicate,  //(bd.collectionPredicate) Returns true when applied to target item.
  context,    //(object, optional) Context in which to apply predicate.
  vargs       //(variableArgs, optional) Zero or more arguments for application of predicate.
) {
  ///
  // Returns true if some item in collection satisfies predicate; false otherwise.
  ///
  // If collection is falsy (e.g., an undefined variable, 0, false, or null was passed), then the function
  // returns false immediately without executing any processing.
  // 
  // If context is given, then the predicate is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  // 
  // The function delegates to collection.some if the collection contains the method some. Note in particular
  // that Array.some will be used in environments that define that function. Otherwise,
  // iterate from front to back over each item in the collection until predicate is satisfied or the array is
  // exhausted
  //note
  // See [JavaScript 1.5 Array some specification](https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/some).
  if (!collection) {
    //short cuircuit return
    return false;
  }
  predicate= fixCallback(arguments, 1);
  return ((bd.hasNative(collection, "some")) ? collection.some(predicate) : (bd.findFirst(collection, predicate)!==-1));
};

bd.every= function(
  collection, //(collection) The collection to inspect.
  predicate,  //(bd.collectionPredicate) Returns true when applied to target item.
  context,    //(object, optional) Context in which to apply predicate.
  vargs       //(variableArgs, optional) Zero or more arguments for application of predicate.
) {
  ///
  // Returns true if every item in collection satisfies predicate; false otherwise.
  ///
  // If collection is falsy (e.g., an undefined variable, 0, false, or null was passed), then the function
  // returns false immediately without executing any processing.
  // 
  // If context is given, then the predicate is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  //
  // The function delegates to collection.every if the collection contains the method every. Note in particular
  // that Array.every will be used in environments that define that function. Otherwise,
  // iterate from front to back, until predicate is not satisfied or the array is exhausted.
  //note
  // See [JavaScript 1.5 Array every specification](https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/every).
  if (!collection) {
    //short cuircuit return
    return true;
  }
  predicate= fixCallback(arguments, 1);
  if (bd.hasNative(collection, "every")) {
    return collection.every(predicate);
  }
  for(var i= 0, end= collection.length; i<end; i++) {
    if (!predicate(collection[i], i, collection)) {
      return false;
    }
  }
  return true;
};

bd.indexOf= function(
  collection, //(bd.collection) The collection to inspect.
  target,     //(any) The target to find via operator ===.
  start,      //(integer, optional, 0) Index to start search at.
  callback,   //(bd.collectionCallback, optional) The function to apply to found item (if any).
  context,    //(object, optional) Context in which to apply callback.
  vargs       //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Searches from front to back for the first item===target.
  ///
  // If collection is falsy (e.g., an undefined variable, 0, false, or null was passed), then the function
  // returns -1 immediately without executing any processing.
  // 
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  // 
  // The function delegates to collection.indexOf if the collection contains the method indexOf. Note in particular
  // that Array.indexOf will be used in environments that define that function. Otherwise,
  // iterate as implied by start to the back of the collection until an item===target or the array is exhausted.
  // 
  // Seaching starts at index start (if start>0), at index length+start (if start<0),
  // or 0 (if start is 0 or missing) and proceeds front-to-back.
  //
  //return
  //(integer) index of first item===target
  //> an item is found such that item===target
  //(-1)
  //> no item is found such that item===target or collection was falsy
  ///
  //note
  // See [JavaScript 1.5 Array indexOf specification](https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf).
  bd.docGen("overload",
    function(
      collection,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!collection) {
    //short cuircuit return
    return -1;
  }
  var start_= 0;
  if (typeof start=="number") {
    callback= fixCallback(arguments, 3);
    start_= (start<0 ? (collection.length + start) : start);
  } else {
    callback= fixCallback(arguments, 2);
    start= undefined;
  }
  var result, i, end;
  if (bd.hasNative(collection, "indexOf")) {
    result= (start===undefined ? collection.indexOf(target) : collection.indexOf(target, start));
    return ((result!=-1 && callback) ? callback(collection[result], result, collection) : result);
  }
  for(i= Math.min(collection.length, Math.max(start_, 0)), end= collection.length; i<end; i++) {
    if (collection[i]===target) {
      return callback ? callback(collection[i], i, collection) : i;
    }
  }
  return -1;
};

bd.lastIndexOf= function(
  collection, //(bd.collection) The collection to iterate.
  target,     //(any) the target to find via operator ===.
  start,      //(integer, optional, 0) Index to start search at.
  callback,   //(bd.collectionCallback, optional)The function to apply to found item (if any).
  context,    //(object, optional) Context in which to apply callback.
  vargs       //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Searches from back-to-front for the first item===target.
  ///
  // If collection is falsy (e.g., an undefined variable, 0, false, or null was passed), then the function
  // returns -1 immediately without executing any processing.
  // 
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  // 
  // The function delegates to collection.lastIndexOf if the collection contains the method lastIndexOf. Note in particular
  // that Array.lastIndexOf will be used in environments that define that function. Otherwise,
  // iterate as implied by start to the front of the collection until an item===target or the array is exhausted.
  // 
  // Seaching starts at index start (if start>0), at index length+start (if start<0),
  // or 0 (if start is 0 or missing) and proceeds front-to-back.
  //
  //return
  //(integer) index of first item===target
  //> an item is found such that item===target
  //(-1)
  //> no item is found such that item===target or collection was falsy
  ///
  //note
  // See [JavaScript 1.5 Array lastIndexOf specification](https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf).
  bd.docGen("overload",
    function(
      collection,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!collection) {
    //short cuircuit return
    return -1;
  }
  var start_= collection.length;
  if (typeof start=="number") {
    start_= ((start<0) ? collection.length + start : start);
    callback= fixCallback(arguments, 3);
  } else {
    callback= fixCallback(arguments, 2);
    start= undefined;
  }
  var result, i;
  if (bd.hasNative(collection, "lastIndexOf")) {
    result= (start===undefined ? collection.lastIndexOf(target) : collection.lastIndexOf(target, start));
    return ((result!=-1 && callback) ? callback(collection[result], result, collection) : result);
  }
  for(i= Math.min(collection.length-1, start_); i>=0; i--) {
    if (collection[i]===target) {
      return callback ? callback(collection[i], i, collection) : i;
    }
  }
  return -1;
};

bd.filter= function(
  collection, //(bd.collection) The collection to iterate.
  callback,   //(bd.collectionCallback) The predicate that filters.
  context,    //(object, optional) Context in which to apply callback.
  vargs       //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Creates an array that contains all items in collection that satisfy callback.
  ///
  // If collection is falsy (e.g., an undefined variable, 0, false, or null was passed), then the function
  // returns an empty array immediately without executing any processing.
  // 
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  // 
  // The function delegates to collection.filter if the collection contains the method filter. Note in particular
  // that Array.filter will be used in environments that define that function. Otherwise,
  // iterate from front to back over each item in the collection.
  //note
  // See [JavaScript 1.5 Array filter specification](https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter).
  bd.docGen("overload",
    function(
      collection,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!collection) {
    //short cuircuit return
    return [];
  }
  callback= fixCallback(arguments, 1);
  if (bd.hasNative(collection, "filter")) {
    return collection.filter(callback);
  }
  var result= [];
  for (var i= 0,  end=collection.length; i<end; i++) {
    if (callback(collection[i], i, collection)) {
      result.push(collection[i]); 
    }
  };
  return result;
};

bd.doTimes= function(
  range,    //(integer) End point of range to apply callback; 0 is implied for start.
            //(array [start, end]) Range to apply callback.
  callback, //(function(index)) Function to apply to each integer in range.
  context,  //(object, optional) Context in which to apply callback.
  vargs     //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Apply callback to range of integers.
  ///
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  // 
  // If range is an integer, then range is [0..n-1]; otherwise range is [n[0]..n[1]-1]. 
  callback= fixCallback(arguments, 1);
  var i= 0;
  if (bd.isArray(range)) {
    i= range[0];
    range= range[1];
  }
  while (i<range) {
    callback(i++);
  }
};

bd.back= function(
  collection //(array) The array from which to return the last element.
) {
  ///
  // Returns the last element of an array.
  ///
  //return
  //(any) collection[collection.length-1]
  //> collection.length > 0
  //
  //(undefined)
  //> collection.length==0
  var end= collection && collection.length;
  return end ? collection[end-1] : undefined;
};

bd.binarySearch= function(
  collection, //(array) The array to search.
  comp        //(bd.collectionOrder) Compares an element of collection to the item being sought.
) {
  ///
  // Finds a target item in an ordered array using a binary search algorithm. //
  // If collection is falsy (e.g., an undefined variable, 0, false, or null was passed), then the function
  // returns immediately without executing any processing.
  // 
  //warn
  // The array must be ordered.
  ///
  //return
  //(integer) Index of target item.
  //> comp return 0 for some item.
  // 
  //bd.notFound
  //> comp failed to return 0 for any item.

  if (!collection || !collection.length) {
    return bd.notFound;
  }
  var
    left= 0, right= collection.length-1, current, order;
  while (left<=right) {
    current= Math.floor((left + right) / 2);
    order= comp(collection[current]);
    if (order>0) {
      right= current - 1;
    } else if (order<0) {
      left= current + 1;
    } else {
      return current;
    }
  }
  return bd.notFound;
};


bd.lengthHash= function(
  hash //(hash) The hash to check.
       //(falsy) Return 0
) {
  ///
  // Returns the number of elements in hash.
  ///
  //return 
  //(integer) The number of elements contained in hash.
  //(0) The hash has no elements or is falsy.
  var i= 0;
  for (var p in hash) {
    ++i;
  }
  return i;
};

bd.isEmptyHash= function(
  hash //(hash) The hash to check.
       //(falsy) Implies an empty hash.
) {
  ///
  // Determines if hash contains any elements.
  ///
  //return 
  //(false) The hash contains at least one element.
  //(true) The hash contains elements or is falsy.

  for (var p in hash) {
    if (hash.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
};

bd.forEachHash= function(
  hash,     //(hash) The hash to iterate.
  callback, //(bd.hashCallbackFunction) Function to apply to each item in the hash.
  context,  //(object, optional) Context in which to apply callback.
  vargs     //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Applies callback to each item in the hash. 
  ///
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  //warn
  // Behavior of the function is undefined if the hash is modified in the callback. If you
  // the callback semantics modify the hash, use bd.forEachHashSafe.
  bd.docGen("overload",
    function(
      hash,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!hash) {
    //short cuircuit return
    return;
  }
  callback= fixCallback(arguments, 1, true);
  for (var p in hash) {
    callback(hash[p], p, hash);
  }
};

//TODO: unit test for bd.forEachHashSafe
bd.forEachHashSafe= function(
  hash,     //(hash) The hash to iterate.
  callback, //(bd.hashCallbackFunction) Function to apply to each item in the hash.
  context,  //(object, optional) Context in which to apply callback.
  vargs     //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Applies callback to each item in the hash; the hash may be modified in the callback.  //An
  // attempt is made to call every key that exists in the hash upon entry. No attempt is made
  // to call keys added by callbacks.
  ///
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  bd.docGen("overload",
    function(
      hash,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!hash) {
    //short cuircuit return
    return;
  }
  callback= fixCallback(arguments, 1, true);
  var keys= [];
  for (var p in hash) {
    keys.push(p);
  }
  for (var i= 0, end= keys.length; i<end; i++) {
    var key= keys[i];
    callback(hash[key], key, hash);
  }
};

bd.mapHash= function(
  hash,    //(hash) The hash to iterate.
  callback,//(bd.hashCallbackFunction) Function to apply to each item in the hash.
  context, //(object, optional) Context in which to apply callback.
  vargs    //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Returns the array of results of applying callback to each item in hash.
  ///
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before iteration.
  bd.docGen("overload",
    function(
      hash,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!hash) {
    //short cuircuit return
    return [];
  }
  callback= fixCallback(arguments, 1, true);
  var result= [];
  for (var p in hash) {
    result.push(callback(hash[p], p, hash));
  }
  return result;
};

bd.findHash= function(
  hash,     //(hash) The hash to inspect.
  predicate,//(bd.hashTargetPredicate) Returns true when applied to target item.
  callback, //(bd.hashCallbackFunction, optional) The function to apply to found item.
  context,  //(object, optional) Context in which to apply callback.
  vargs     //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Searches for the first item that satisfies predicate.
  ///
  // Returns the key (if no callback is provided) or the result of the callback (if a callback is provided)
  // of the first item in hash that satisfies the predicate (if such an item
  // exists); otherwise, when no item satsifies the predicate, the callback (if any) is not called and bd.notFound is returned.
  // 
  // If context and any vargs are given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before proceeding as described next.
  // 
  //return
  //(any) callback(item, key, hash)
  //> item matches at key and callback is given.
  // 
  //(key) the property name of the match
  //> match is found at hash[key]
  //
  //(bd.notFound)
  //> no match is found or hash is falsy
  bd.docGen("overload",
    function(
      hash,
      predicate,
      start,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!hash) {
    //short cuircuit return
    return bd.notFound;
  }
  callback= fixCallback(arguments, 2, true);
  for (var p in hash) {
    if (predicate(hash[p], p, hash)) {
      return callback ? callback(hash[p], p, hash) : p;
    }
  }
  return bd.notFound;
};

bd.someHash= function(
  hash,     //(hash) The hash to inspect.
  predicate,//(bd.hashPredicate) Returns true when applied to target item.
  context,  //(object, optional) Context in which to apply predicate.
  vargs     //(variableArgs, optional) Zero or more arguments for application of predicate.
) {
  ///
  // Returns true if some item in hash satisfies predicate; false otherwise.
  ///
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before proceeding.
  if (!hash) {
    //short cuircuit return
    return false;
  }
  return bd.findHash(hash, fixCallback(arguments, 1, true))!==bd.notFound;
};

bd.everyHash= function(
  hash,      //(hash) The hash to inspect.
  predicate,//(bd.hashPredicate) Returns true when applied to target item.
  context,  //(object, optional) Context in which to apply predicate.
  vargs     //(variableArgs, optional) Zero or more arguments for application of predicate.
) {
  ///
  // Returns true if every item in hash satisfies predicate; false otherwise.
  ///
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before proceeding.
  if (!hash) {
    //short cuircuit return
    return false;
  }
  predicate= fixCallback(arguments, 1, true);
  for (var p in hash) {
    if (!predicate(hash[p], p, hash)) {
      return false;
    }
  }
  return true;
};

bd.keysOf= function(
  hash,    //(hash) The hash to inspect.
  target,  //(any) The target to find via operator ===.
  callback,//(bd.hashCallbackFunction, optional) The function to apply to found item (if any).
  context, //(object, optional) Context in which to apply callback.
  vargs    //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Searches for the hash for all items that satisfies target and returns the associated keys.
  ///
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before proceeding.
  ///
  // If a callback is given, then the callback is applied to each match found.
  bd.docGen("overload",
    function(
      hash,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!hash) {
    //short cuircuit return
    return [];
  }
  callback= fixCallback(arguments, 2, true);
  var keys= [];
  for (var p in hash) {
    if (hash[p]===target) {
      keys.push(p);
      callback && callback(hash[p], p, hash);
    }
  }
  return keys;
};


bd.filterHash= function(
  hash,    //(hash) The hash to iterate.
  callback,//(bd.hashCallbackFunction) The predicate that filters.
  context, //(object, optional) Context in which to apply callback.
  vargs    //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Creates a new hash that contains all items in hash that satisfy callback.
  ///
  // If context is given, then the callback is transformed into `bd.hitch(callback, context, arg1, arg2, ...)` before proceeding.
  bd.docGen("overload",
    function(
      hash,
      callback   //(string) Source text of a callback function.
    ) {
      ///
      // As above except that callback is taken as
      //code
      // new Function("item", "index", "array", callback)
    }
  );
  if (!hash) {
    //short cuircuit return
    return {};
  }
  callback= fixCallback(arguments, 1, true);
  var result= {};
  for (var p in hash) {
    if (callback(hash[p], p, hash)) {
      result[p]= hash[p];
    }
  };
  return result;
};

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

