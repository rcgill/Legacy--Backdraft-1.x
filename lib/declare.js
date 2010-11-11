define("bd/declare", ["bd/kernel", "dojo", "bd/lang"], function(bd, dojo) {
///
// Defines bd.declare.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

bd.declare=
  function(
    className,    //(jsName) The location to store the result in context and the `declaredClass` property.
    context,      //(string) The module in which to store result if className is provided.
                  //(otherwise) Store result in bd.global if className is provided.
    superClasses, //(array, optional, []) The list of base classes for the new class.
    vargs         //(variableArgs) One or more objects that give properties for prototype for the new constructor
  ) {
    ///
    // Creates a new constructor function. //This is a wrapper around dojo.declare that adds additional capabilities:
    // 
    // 1. The new class is stored at at `bd.get(className``[``, context``]``)`.
    // 2. The new class includes the factory function `create` where `ctor.create(``arguments...``)`, `ctor` a constructor
    //    function returned by `bd.declare`, is equivalent
    //    to `new ctor(``arguments...``)`, thereby allowing objects to be created by `apply`. This eliminates the requirement
    //    for the defective JavaScript `new` operator.
    // 3. The prototype may be specified by providing multiple objects compared to just one; an example of the value of this
    //    is given below.
    // 
    // Examples:
    //code
    //  bd.declare("myNamespace.myClassName", myModule, [], {});
    ///
    // is equivalent to...
    //code
    // var temp= dojo.declare([], {});
    // bd.set("myNamespace.myClassName", myModule, temp);
    // temp.declaredClass= "myNamespace.myClassName";
    ///
    // Notice that context can be a string or falsy with semantics as given by bd.get.
    //warn
    // If `className` is given and the provided value is *not* a bd.modulePropertyName (i.e., a string containing a ":"), then
    // `context` *must* be provided.
    // 
    // vargs are mixed to form one object. For example,
    //code
    // attr= function(name, defaultValue) {
    //   var result= {};
    //   result[name]= defaultValue;
    //   result[name + "Set"]= function(value) { this[name]= value; };
    //   result[name + "Get"]= function() { return this[name]; };
    // };
    //
    // bd.declare("myNamespace.myClassName", myModule, [], {
    //   attr("x", 0),
    //   attr("y", 0),
    //   attr("color", "red")
    // });
    ///
    // is equivalent to...
    //code
    // var temp= dojo.declare([], {
    //   x: 0,
    //   xSet: function(value) { this["x"]= value; };
    //   xGet: function(value) { return this["x"]; };
    //   y: 0,
    //   ySet: function(value) { this["y"]= value; };
    //   yGet: function(value) { return this["y"]; };
    //   color: 0,
    //   colorSet: function(value) { this["color"]= value; };
    //   colorGet: function(value) { return this["color"]; };
    // });
    // bd.set("myNamespace.myClassName", myModule, temp);
    // temp.declaredClass= "myNamespace.myClassName";
    ///
    // This idea allows for writing functions that help build up specialized class machinery. See bd.stateful for
    // a canonical example.
    bd.docGen("overload",
      function(
        className, //(bd.modulePropertyName) The location to store the resulting constructor.
        superClasses,
        vargs
      ) {
        ///
        // Same as primary signature except that context is derived from className. This signature is recognized by the first argument
        // being of type bd.modulePropertyName (i.e., a string containing a ":").
      },
      function(
        superClasses,
        vargs
      ) {
        ///
        // Same as primary signature except that result is not stored and `declaredClass` is not initialized. This signature is recognized
        // by the first argument *not* a string.
      }
    );
    var
      currentValue,
      result,
      parts,
      getProto= function(base, start, args) {
        for (var i= start; i<args.length; i++) {
          base= bd.mix(base, args[i]);
        }
        return base;
      };
 
    if (bd.isString(className)) {
      parts= className.split(":");
      if (parts[0]==className) {
        result= dojo.declare(superClasses, getProto(vargs, 4, arguments));
        currentValue= bd.get(className, context);
      } else {
        // className is a bd.modulePropertyName, therefore signature is (className, superClasses, arg0, arg1, ...)
        // context holds superClasses; superClasses holds first vargs, 
        result= dojo.declare(context, getProto(superClasses, 3, arguments));
        context= 0;
        currentValue= bd.get(className);
      }
    } else {
      // no className, and therefore, no context
      // className holds superClasses, context holds first vargs
      return dojo.declare(className, getProto(context, 2, arguments));
    }
    //RCGTODO: check this
    result.prototype.declaredClass= className;

    var f= function(){};
    f.prototype= result.prototype;
    result.create= function() {
      var o= new f();
      result.apply(o, bd.array(arguments));
      return o;
    };

    bd.set(className, context, result);
    currentValue && bd.mix(result, currentValue);
    return result;
  };

bd.safeMixin= 
  ///
  // Safely mix properties into objects created with bd.declare; an alias for dojo.safeMixin.
  //note
  // This function is an alias for dojo.Deferred.
  dojo.safeMixin;

bd.noValue=
  ///const
  // Unique object recognized by bd.attr and bd.constAttr to say that no explicit property is defined for a particular attribute. //This implies
  // the attribute value will always be calculated rather then read from a property.
  {};

bd.attr= function(
  name,         //(string) The property name.
  defaultValue, //(any) The initial value for the property.
  setter,       //(function(value), optional, see description) Function that sets the property to `value` and returns the previous value.
  getter        //(function(), optional, see description) Function that returns the current value of the property.
) {
  ///
  // Creates an object that may be used with bd.declare to cause an attribute with the name `name` and associated
  // getter/setter functions to be defined in the prototype. //For example,
  //code
  // bd.declare(
  //   [],
  //   attr("x", 0),
  //   attr("y", 0),
  // );
  ///
  // Is equivalent to 
  //code
  // bd.declare(
  //   [],
  //   {
  //     x: 0,
  //     xGet: function() { return this.x; },
  //     xSet: function(value) { var oldValue= this.x; this.x= value; return oldValue; }
  //   },
  //   {
  //     y: 0,
  //     yGet: function() { return this.y; },
  //     ySet: function(value) { var oldValue= this.y; this.y= value; return oldValue; }
  //   }
  // );
  ///
  // The implementation of the setter and/or getter functions can be specified by providing setter and/or getter function
  // arguments. If you desire to provide a custom getter while using the default setter, provide falsy for the setter 
  // arguments.

  var result= {};
  defaultValue!==bd.noValue && (result[name]= defaultValue);
  result[name + "Get"]= getter || function() {
    return this[name];
  };
  result[name + "Set"]= setter || function(value) {
    var oldValue= this[name];
    this[name]= value;
    return oldValue;
  };
  return result;
};

bd.constAttr= function(
  name,         //(string) The property name.
  defaultValue, //(any) The initial value for the property.
  getter        //(function(), optional, see description) Function that returns the current value of property.
) {
  ///
  // Similar to bd.attr except that no setter is defined.
  var result= {};
  defaultValue!==bd.noValue && (result[name]= defaultValue);
  result[name + "Get"]= getter || function() {
    return this[name];
  };
  return result;
};
  
});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

