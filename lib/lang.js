define("bd/lang", ["bd/kernel", "dojo", "require"], function(bd, dojo, require) {
///
// Augments the bd namespace with several functions that provide basic JavaScript language features.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

// bd references some of dojo base so that the code isn't so tightly coupled to dojo--
// theoretically, the following could be changed to reference another library with
// identical semantics and everything would still work.
bd.hitch= dojo.hitch;
bd.Deferred= dojo.Deferred;

bd.docGen("bd", {
  hitch:
    function (
      context, //(object) Context in which to apply func.
      func,    //(function) Function to apply. 
      vargs    //(variableArgs, optional) Zero or more arguments for application of function.
    ) {
      ///
      // Returns a function equivalent to `function() { func.apply(context, bd.array(arguments, 2)); }`. //If
      // context is falsy, context is taken to imply bd.global. When there are no vargs,
      // the function returned is equivalent to `function() { func.call(context); }`.
      // 
      // The key purpose of this function is to generate functions that will operate equivalently irrespective 
      // of the calling context.
      //note
      // This function is an alias to dojo.hitch
      //warn
      // Notice that bd.hitch, dojo.hitch, and dojo.connect order function, context, and vargs as (context, function, vargs)
      // whereas every other function that takes similar arguments (e.g., bd.forEach, bd.schedule, dojo.forEach, etc.)
      // order the same arguments as (function, context, vargs).
      //nosource
      bd.docGen("overload",
        function(
          context,
          functionName, //(string) The name of a function property in context.
          vargs
        ) {
          ///
          // Returns a function equivalent to `function() { context[functionName].apply(context, bd.array(arguments, 0, args)); }`.  //If
          // context is falsy, context is taken to imply bd.global. When args are missing,
          // the function returned is equivalent to `function() { context\[functionName](); }`.
        }
      );
    },

  Deferred:
    function(
      canceler //(function) Function to call if the instance is canceled.
    ) {
      ///
      // Controls a chain of asynchronous execution.
      ///
      //note
      // This function is an alias for dojo.Deferred.
    }
});

bd.isString=
  function(
    test //(any) Item to test.
  ) {
    ///
    // Returns true iff test is a string literal or string object.
    return (typeof test == "string" || test instanceof String);
  };

bd.isArray= 
  function(
    test //(any) Item to test.
  ) {
    ///
    // Returns true iff test is an Array.
    return test instanceof Array;
  };

bd.isFunction=
  function(
    test //(any) Item to test.
  ) {
    ///
    // Returns true iff test is a Function.
    return test instanceof Function;
  };

bd.isObject= 
  function(
    test //(any) Item to test.
  ) {
    ///
    // Returns true iff test has Object at the end of its prototype chain. //In particular, object literals, instances of Object,
    // instances of String, array literals, instances of Array, function literals, instances of Function, regex literals and
    // instances of RegExp, instances of Date,
    // and all instances from user-defined constructor functions are considered objects by this function. Conversely, numbers 
    // literals, boolean literals, string literals, null, and undefined are not considered objects by this function.
    //warn
    // null is not considered an object by this function which is different the JavaScript typeof operator.
    return test instanceof Object;
  };

var arrayPrototypeSlice= Array.prototype.slice;
bd.array= 
  function(
    src,   //(array-like object) Some aggregate object that presents a continuous, integer-indexed interface to its
           // contents and a length property to say how many components it contains.
    start, //(integer, optional, 0) The first item in src to move to the result.
    dest   //(array, optional, []) The initial value of result before src is copied.
  ) {
    ///
    // Concatenates src[start..src.length-1] to dest and returns result.  //Typically, this function is used to convert array-like
    // objects--like the JavaScript arguments variable--to a proper array.
    return (dest||[]).concat(arrayPrototypeSlice.call(src, start||0));
  };

bd.hitchCallback= function(
  args,  //(arguments) The arguments object of a particular function application.
  offset //(integer) The position in arguments that (callback, context, vargs) starts.
) {
  ///
  // Hitches callback, context, and callback arguments.
  ///
  // All Backdraft functions that take a callback function as the last argument define those arguments as `(callback, context,
  // arg1, arg2, ...)`. For example, see bd.forEach. This function transforms the implied callback into a single function.
  //note
  // This function is mosly for internal use by Backdraft; it is exposed so that client programs can follow the same paradigm
  // if desired.
  if (args.length>offset+1) {
    return bd.hitch.apply(bd, bd.array(args, offset+2, [args[offset+1], args[offset]]));
  } else {
    return args[offset];
  }
};

var 
  empty= {},
  extraNames= ["hasOwnProperty", "valueOf", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "constructor"];
for(var i in {toString: 1}){ 
  extraNames = []; 
  break; 
}
var extraLen = extraNames.length;

bd.mix= 
  function(
    dest,     //(object) The object into which to mix src properties.
    src,      //(object*) The object(s) from which to take properties to mix into dest.
    overwrite //(not an object, optional, true) Overwrite dest properties iff truthy.
  ) {
    ///
    // Mix properties of src into dest. //If dest is falsy, then a new object is created to
    // hold the result. Multiple src objects may be provided in which case
    // properties are mixed from left to right. If the last argument is not an object, then it
    // is interpretted as a boolean that says whether or not to overwrite the properties in
    // dest (if true) or preserve the properties in dest (otherwise). In cases where multiple
    // source objects are provided and overwrite is missing or true, the right-most definition for
    // a particular property wins; conversely, when multiple source objects are provided and overwrite
    // is false, the left-most definition wins.
    //
    // Examples:
    //code
    // //missing first object
    // var x;
    // bd.mix(x, {a:1});       //=>{a:1}
    // bd.mix(0, {a: 1});      //=>{a: 1}
    // bd.mix(false, {a: 1});  //=>{a: 1}
    // 
    // //normal mixing
    // bd.mix({a: 1}, {b: 2});  //=>{a: 1, b: 2}
    // bd.mix({a: 1}, {a: 2});  //=>{a: 2}
    // 
    // //explicitly setting overwrite has the same effect as normal mixing
    // bd.mix({a: 1}, {a: 2}, true);  //=>{a: 2}
    // bd.mix({a: 1}, {a: 2}, 1);     //=>{a: 2}
    // 
    // //normal mixing multiple objects
    // bd.mix({a: 0}, {a: 1}, {a: 2});  //=>{a: 2}
    // bd.mix({x: 0}, {a: 1}, {a: 2});  //=>{x: 0, a: 2}
    // bd.mix({x: 0}, {y: 1}, {a: 2});  //=>{x: 0, y:1, a: 2}
    // 
    // //normal mixing multiple objects with overwrite explicitly false
    // bd.mix({a: 0}, {a: 1}, {a: 2}, false);  //=>{a: 0}
    // bd.mix({x: 0}, {a: 1}, {a: 2}, false);  //=>{x: 0, a: 1}
    // bd.mix({x: 0}, {y: 1}, {a: 2}, false);  //=>{x: 0, y:1, a: 2}
    var 
      args= arguments,
      length= arguments.length - 1,
      result= args[0] || {},
      //overwrite is declared in the signature for the documentation generator
      //since is may actually be an object to mix, DO NOT steop on it!
      overwrite_= (args[length] instanceof Object) ? true : args[length--],
      source, prop, j,  s,
      i= 1;
    while (i<=length) {
      source= args[i++];
      for (prop in source) {
        if (overwrite_ || !(prop in result)) {
          result[prop] = source[prop];
        }
      }
			for(j = 0; j < extraLen;){
				prop = extraNames[j++];
				s = source[prop];
				if(!(prop in result) || (overwrite_ && (result[prop] !== s && (!(prop in empty) || empty[prop] !== s)))){
					result[prop] = s;
				}
			}
  
    }
    return result;
  };

bd.partial= 
  function(
    func, //(function) Function to apply.
    vargs //(variableArgs, optional) Zero or more arguments for application of function.
  ) {
    ///
    // Returns a function equivalent to `function() { func.apply(bd.global, bd.array(arguments, 0, vargs)); }`
    vargs= bd.array(arguments, 1);
    return function() { 
      return func.apply(bd.global, bd.array(arguments, 0, vargs));
    };
  };

var delegateCtor= function() {};
bd.delegate=
  function(
    prototype, props
  ) {
    ///
    // Creates a new object with given prototype and properties.
    delegateCtor.prototype= prototype;
    var result= new delegateCtor();
    return props ? bd.mix(result, props) : result;
  };

bd.extend= 
  function(
    ctor, //(function) The constructor function whos prototype is to be modified.
    src   //(object) The object(s) from which to take properties to mix into ctor.prototype.
  ) {
    ///
    // Mixes src objects into ctor.prototype with bd.mix.
    bd.mix.apply(bd, bd.array(arguments, 1, [ctor.prototype]));
  };

bd.get=
  function(
    name,        //(jsName) The property to resolve.
    context,     //(falsy) Root object for name is given by dojo.global.
                 //(string) Root object for name is given by require(context).
                 //(otherwise) Root object for name.
    defaultValue //(any, optional) Value to initialize the property iff it is currently undefined.
  ) {
    ///
    // Resolves a string into a nested property value.
    ///
    // Returns the property given by ```context``.``name```.  If the property is undefined
    // and `defaultValue!==undefined`, then calls `bd.set(name, context, defaultValue)`.
    bd.docGen("overload", 
      function(
        name,      //(bd.modulePropertyName) property to resolve
        defaultValue
      ) {
        /// 
        // Returns the property implied by name.  //If the property is undefined
        // and `defaultValue!==undefined`, then calls `bd.set(name, defaultValue)`.
      }
    );
    //argument juggling
    var parts= name.split(":");
    if (parts.length==2) {
      defaultValue= context;
      context= require(parts[0]);
      name= parts[1];
    } else if (bd.isString(context)) {
      context= require(context);
    } else {
      context= context || dojo.global;
    }
    if (!context) {
      return undefined;
    }
    var 
      p, 
      temp= context, 
      i= 0, 
      end= (parts= name.split(".")).length;
    while (i<end) {
      p= parts[i++];
      if (temp===undefined || !(p in temp)) {
        return defaultValue!==undefined ? bd.set(name, context, defaultValue) : undefined;
      }
      temp= temp[p];
    }
    return temp;
  };

bd.exists= 
  function(
    name,   //(jsName) The property to resolve.
    context //(falsy) Root object for name is given by dojo.global.
            //(string) Root object for name is given by require(context).
            //(otherwise) Root object for name.
  ) {
    ///
    // Predicate: syntactic sugar for `bd.get(name, context)!==undefined`.
    bd.docGen("overload", 
      function(
        name //(bd.modulePropertyName) property to resolve
      ) {
        /// 
        // Predicate: syntactic sugar for `bd.get(name)==undefined`.
      }
    );
    return bd.get(name, context)!==undefined;
  };

bd.set=
  function(
    name,    //(jsName) The property to resolve.
    context, //(falsy) Root object for name is given by dojo.global.
             //(string) Root object for name is given by require(context).
             //(otherwise) Root object for name.
    value    //(any) Value to set.
  ) {
    ///
    // Sets to value of the property given by ```context``.``name``` to value.  //If the 
    // property is undefined, then create the implied chain of objects.
    //warn
    // If a module is implied by providing a string for context and that module does not exist,
    // then the function asserts failure and returns undefined (this function cannot create
    // a non-existing module).
    bd.docGen("overload", 
      function(
        name, //(bd.modulePropertyName) property to resolve
        value
      ) {
        /// 
        // Sets to value of the property implied by name to value.  //If the 
        // property is undefined, then create the implied chain of objects.
        //warn
        // If the implied module does not exist, then the function asserts 
        // failure and returns undefined (this function cannot create a non-existing module).
      }
    );

    //argument juggling
    if (arguments.length==2) {
      //since name and value are required, context must be missing
      value= context;
      context= 0;
    }
    var parts= name.split(":");
    if (parts.length==2) {
      context= require(parts[0]);
      name= parts[1];
    } else if (bd.isString(context)) {
      context= require(context);
    } else {
      context= context || dojo.global;
    }
    if (!context) {
      bd.assert(context);
      return undefined;
    }
    for (var i= 0, end= (parts= name.split(".")).length-1; i<end;) {
      name= parts[i++];
      context= context[name]= context[name] || {};
    }
    return (context[parts[i]]= value);
  };

bd.hijack=
  function(
    context,         //(object) The object that contains the function to hijack.
    functionName,    //(string) The name of the function to hijack.
    hijacker,        //(function) The replacement function.
    hijackerContext, //(object, optional, 0) The context in which to call hijacker; falsy implies bd.global
    chain            //(boolean, optional, false) Call the original function automatically after the hijacker finishes.
  ) {
    ///
    // Replaces context[functionName] with highjacker. //If chain is true, then the context[functionName] is 
    // called with original arguments (if any) immediately after hijacker returns.
    ///
    // Returns a handle to restore context[functionName] to its original value with overloaded signature to bd.hijack.
    bd.docGen("overload",
      function(
        handle //(bd.hijack.handle) A result returned by bd.hijack when a hijack was installed.
      ) {
        ///
        // Restores a hijacked function to its prior state.
      }
    );

    if (arguments.length>1) {
      //hijacking a function
      hijackerContext= hijackerContext || bd.global;
      var 
        originalFunction= context[functionName],
        handle= [context, functionName, originalFunction];
      if (chain) {
        context[functionName]= function() {
          var args= bd.array(arguments);
          hijacker.apply(hijackerContext, args);
          return originalFunction.apply(context, args);
        };
      } else {
        context[functionName]= bd.hitch(hijackerContext, hijacker);
      }
      context[functionName].original= originalFunction;
      return handle;
    } else {
      //context is actually a handle...
      context[0][context[1]]= context[2];
      return 0;      
    }  
  };

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

