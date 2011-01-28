//TODO...get rid of this

define("bd/parentSpace", [
  "dojo", "bd"
], function(dojo, bd) {
///
// Augments the bd namespace with the bd.parentSpace class.

var
  parentPropertyGetNames= {},
  parentPropertySetNames= {},

  initParentPropertyNames= function(
    name
  ) {
    var uc= name.charAt(0).toUpperCase() + name.substr(1);
    parentPropertyGetNames[name]= '_get' + uc  + 'ParentProp';
    parentPropertySetNames[name]= '_set' + uc  + 'ParentProp';
    return false;
  },

  parentPropertyGetName= function(
    name
  ) {
    // cache attribute name values; note single this._parentPropertyPairNames for all widgets
    return parentPropertyGetNames[name] || initParentPropertyNames(name) || parentPropertyGetNames[name];
  },

  parentPropertySetName= function(
    name
  ) {
    // cache attribute name values; note single this._parentPropertyPairNames for all widgets
    return parentPropertySetNames[name] || initParentPropertyNames(name) || parentPropertySetNames[name];
  };

// Implementation is similar to dijit._Widget._attrPairNames/_getAttrNames. In particular, there is
// a single parentPropertyGetNames/parentPropertySetNames cache for all instances in all classes.

bd.parentSpace= bd.declare(null, {
  ///
  // A mixin that allows a child to provide an area in which a parent can store child-depending information. //The 
  // mixin implements this functionality by adding the single property "parentSpace" to the host instance. This property
  // holds an object that is referred to as the "parent space".

  getParentProp: function(
    propertyName, //(string) The name of the property which is to be retrieved.
    defaultValue  //(any, optional, undefined) If the property does not exist, set the property to this value; return this value.
  ) {
    ///
    // Returns the value of the property given by property name in the parent space.
    //
    //return
    //(any) The result of propertyName applied in the context of this instance (this).
    //> propertyName is a function in the parent space.
    //(any) The value of propertyName.
    //> propertyName is an existing non-function property in the parent space.
    //(defaultValue)
    //> propertyName does not exist in the parent space and defaultValue is defined.
    //(null)
    //> propertyname does not exist in the parent space and defaultValue was not provided.
    var methodName= parentPropertyGetName(propertyName);
    if (this[methodName]) {
      return this[methodName]();
    }
    if (!this.parentSpace) {
      this.parentSpace= {};
    }
    if (this.parentSpace[propertyName]!==undefined) {
      return this.parentSpace[propertyName];
    }
    if (this.descriptor && this.descriptor.parentSpace && this.descriptor.parentSpace[propertyName]!==undefined) {
      return this.parentSpace[propertyName]= this.descriptor.parentSpace[propertyName];
    };
    return this.parentSpace[propertyName]= defaultValue!==undefined ? defaultValue : null;
  },

  setParentProp: function(
    propertyName, //(string) The property name to set.
    value         //(any) The value to set.
  ) {
    ///
    // Sets the property given by property name to value in the parent space.
    if (value!==undefined) {
      //setter...
      var methodName= parentPropertySetName(propertyName);
      if (this[methodName]) {
        return this[methodName](value) || this;
      } else {
      if (!this.parentSpace) {
        this.parentSpace= {};
      }
      this.parentSpace[propertyName]= value;
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
  defaultValue  //(any, optional, undefined) If the property does not exist, set the property to this value; return this value.
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

