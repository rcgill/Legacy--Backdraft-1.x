define("bd/declare", ["bd/kernel", "dojo", "bd/lang"], function(bd, dojo) {
///
// Defines bd.declare.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

bd.declare=
  function(
    superClasses, //(array, optional, []) The list of base classes for the new class.
    vargs         //(variableArgs) One or more objects that give properties for prototype for the new constructor
  ) {
    ///
    // Creates a new constructor function. //This is a wrapper around dojo.declare that adds additional capabilities:
    // 
    // 1. The new class includes the factory function `create` where `ctor.create(``arguments...``)`, `ctor` a constructor
    //    function returned by `bd.declare`, is equivalent
    //    to `new ctor(``arguments...``)`, thereby allowing objects to be created by `apply`. This eliminates the requirement
    //    for the defective JavaScript `new` operator.
    // 2. The prototype may be specified by providing multiple objects compared to just one; an example of the value of this
    //    is given below.
    // 
    ///
    // vargs are mixed to form one object. For example,
    //code
    // attr= function(name, defaultValue) {
    //   var result= {};
    //   result[name]= defaultValue;
    //   result[name + "Set"]= function(value) { this[name]= value; };
    //   result[name + "Get"]= function() { return this[name]; };
    // };
    //
    // bd.declare([], {
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
    ///
    // This idea allows for writing functions that help build up specialized class machinery. See bd.stateful for
    // a canonical example.
    for (var proto= bd.mix({}, vargs), i= 2; i<arguments.length; i++) {
      proto= bd.mix(proto, arguments[i]);
    }
    var result= dojo.declare(superClasses, proto);

    result.create= function() {
      return result.apply(null, bd.array(arguments));
    };
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

