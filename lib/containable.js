define("bd/containable", [
  "bd"
], function(bd) {
///
// Defines the bd.containable class and associated machinery.

var
  parentPropertyGetNames= {},
  parentPropertySetNames= {},

  initParentPropertyNames= function(
    name
  ) {
    parentPropertyGetNames[name]= name + "GetPP";
    parentPropertySetNames[name]= name + "SetPP";
    return false;
  };

bd.containable= bd.declare(
  ///
  // Mixin class that allows a child to provide an area in which a parent can store child-dependent information. //The 
  // class implements this functionality by adding the single property (an object) "parentSpace" to the host instance.
  // 
  // The methods `getParentProp` and `setParentProp` are provided to facilitate retrieving and storing values in the parent space.
  // These methods allow (but do not require) subclasses to override how any particular property is retrieved/stored by providing the methods
  // ```propert-name``GetPP` and ```property-name``SetPP`. See bd.containable.getParentProp and 
  // bd.containable.setParentProp for details.
  //

  //superclasses
  [],

  //members
  {

  getParentProp: function(
    propertyName, //(string) The property name to get.
    defaultValue  //(any, optional, bd.notFound) If the property does not exist, set the property to and return this value.
  ) {
    ///
    // Returns the value of the property given by property name in the parent space.
    //
    //return
    //(any) The result of `this.``propertyName``GetPP()`.
    //> `this` contains the function ```propertyName``GetPP`.
    //(any) `this.parentSpace[propertyName]` 
    //> `this.parentSpace[propertyName]` is defined.
    //(any) defaultValue
    //> `this.parentSpace[propertyName]` is undefined.
    //(object) bd.notFound
    //> `this.parentSpace[propertyName]` is undefined and defaultValue was not provided.
    var methodName= parentPropertyGetNames[propertyName] || initParentPropertyNames(propertyName) || parentPropertyGetNames[propertyName];
    if (this[methodName]) {
      return this[methodName]();
    }
    var parentSpace= this.parentSpace || (this.parentSpace= {});
    if (parentSpace[propertyName]!==undefined) {
      return parentSpace[propertyName];
    }
    if (this.descriptor && this.descriptor.parentSpace && this.descriptor.parentSpace[propertyName]!==undefined) {
      return (parentSpace[propertyName]= this.descriptor.parentSpace[propertyName]);
    };
    return parentSpace[propertyName]= (defaultValue!==undefined ? defaultValue : bd.notFound);
  },

  setParentProp: function(
    propertyName, //(string) The property name to set.
    value         //(any) The value to set.
  ) {
    ///
    // Sets the property given by property name to value in the parent space. //If `this` contains the function ```propertyName``SetPP`, then
    // processing is delegated to that function; otherwise, `this.parentSpace[propertyName]` is set to value by operator=. `this.parentSpace`
    // is automatically created if required. Returns `this`.    
    bd.docGen("overload",
      function(
        values //(hash) Set of (property, value) pairs to set in the parent space.
      ) {
        ///
        // Syntactic sugar for `bd.forEachHash(values, function(value, name) { this.setParentProp(name, value); }, this)`.
      }
    );

    if (bd.isString(propertyName)) {
      var methodName= parentPropertySetNames[propertyName] || initParentPropertyNames(propertyName) || parentPropertySetNames[propertyName];
      if (this[methodName]) {
        return this[methodName](value) || this;
      } else {
        var parentSpace= this.parentSpace || (this.parentSpace= {});
        parentSpace[propertyName]= value;
        return this;
      }
    } else {
      for(var x in propertyName) {
        this.setParentProp(x, propertyName[x]);
      }
      return this;
    }
  }
});

bd.getParentProp= function(
  child,        //(any) An object that may or may not implement the bd.parentSpace interface.
  propertyName, //(string) The name of the property which is to be retrieved.
  defaultValue  //(any, optional, bd.notFound) If the property does not exist, set the property to this value; return this value.
) {
  ///
  // Fault-tolerant helper to retrieve a value in the parent space. //If child
  // implements bd.parentSpace, then delegate to child.getParentProp (see bd.parentSpace.getParentProp); otherwise,
  // return default value.
  if (child.getParentProp) {
    return child.getParentProp(propertyName, defaultValue);
  } else {
    return defaultValue;
  }
};

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

