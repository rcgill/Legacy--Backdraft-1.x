define("bd/creatable", [
  "bd",
  "dojo",
  "bd/stateful",
  "bd/id",
  "bd/connectable",
  "bd/cssStateful",
  "bd/containable"
], function(bd, dojo) {
///
// Defines the bd.creatable class and associated machinery.

bd.creatable= bd.declare(
  ///
  // Mixin class for a Backdraft widget.
  ///
  // bd.creatable orchestrates creating a new instance of a widget class. Often these classes have complex
  // inheritance hierarchies. This class is inteneded to sit at the very bottom of any particularly class inheritance
  // hierarchy so that other classes can call `this.inherited` during the various creation phases without concern that 
  // a method will exist lower in the hierarchy.
  // 
  // Standard backdraft widget creation proceeds as follows:
  // 
  // 1. Any preamble and constructor functions present in the hierarchy are called as is standard with dojo.declare.
  //    Typically, neither of these functions are defined since the remaining steps of the process are usually sufficient
  //    to cause all required initialization.
  // 
  // 2. The postscript defined by this class is called. The postscript mixes kwargs (as given by bd.createWidget) and kwargs.descriptor
  //    into `this`. Then the following methods are called in order:
  //      a. precreateDom: typically used to initialize per-instance properties
  //      b. createDom: typically used to create and initialize the DOM subtree controlled by the instance.
  //      c. postcreateDom: typically used to wire instance and/or instance DOM tree event.
  // 
  // The class also defines the start and stop methods which cause any layout calculation to be made and kept valid (after start is called)
  // or not (after stop is called).
  //

  //superclasses
  [],

  //members
  {
  kwargs:
    ///
    // The argument passed to the constructor. //Although the constructor stores the argument passed into this
    // attribute, subclasses are free to discard part or all of this object during create processing.
    bd.nodoc,

  postscript: function(
    kwargs //(bd.createWidget.kwargs) Describes how to create an instance.
  ) {
    ///
    // Orchestrates initializing a new instance; trivial, see code for details.
    this.kwargs= kwargs || {};
    bd.mix(this, this.kwargs);
    var p, descriptor= kwargs.descriptor;
    for (p in descriptor) {
      //kwargs.descriptor.children should not be mixed; children is a container of widget instances, not descriptors
      if (p!=="children") {
        this[p]= descriptor[p];
      }
    }
    this.precreateDom();
    this.createDom();
    this.postcreateDom();
  },

  precreateDom: function() {
    ///
    // Called as part of the initializing process. //Called after kwargs and kwargs.descriptor have been mixed into
    // this, but before the DOM subtree is created. Typically, per-instance properties are initialized in this step.
    ///
    // This default implementation does nothing which allows classes higher in the hierarchy to call `this.inherited`
    // with assurance that a method lower in the hierarchy exists. This is particularly useful for mixin classes that
    // may be contained in several class hierarchies where some but not all have non-trivial precreateDom methods defined
    // lower in the hierarchy.
  },

  createDom: function() {
    ///
    // Called as part of the initializing process. //Called after precreateDom has been called. Typically this method 
    // creates the DOM subtree controlled by the instance.
    ///
    // This default implementation does nothing which allows classes higher in the hierarchy to call `this.inherited`
    // with assurance that a method lower in the hierarchy exists. This is particularly useful for mixin classes that
    // may be contained in several class hierarchies where some but not all have non-trivial precreateDom methods defined
    // lower in the hierarchy.
  },

  postcreateDom: function() {
    ///
    // Called as part of the initializing process. //Called after createDom has been called. Typically this method 
    // completes any final event wiring required by the instance.
    ///
    // This default implementation does nothing which allows classes higher in the hierarchy to call `this.inherited`
    // with assurance that a method lower in the hierarchy exists. This is particularly useful for mixin classes that
    // may be contained in several class hierarchies where some but not all have non-trivial precreateDom methods defined
    // lower in the hierarchy.
  },

  getCreateDomAttributes: function(
    attributes //(map:DOM-attribute-name(string) -> attribute-value(string), optional) The set of attributes to unconditionally include; 
               // if not provided, then `{id: this.id, widgetid: this.id}` is used.
  ) {
    ///
    // Creates a hash of DOM attributes to created and initialized when this.domNode is created. //Any defined attribute value for
    // any attribute contained in the set given by `this.initAttrs` is included in the calculation.
    attributes= attributes || {id: this.id, widgetid: this.id};
    bd.forEachHash(this.initAttrs, function(when, name) {
      if (this[name]!==undefined) {
        attributes[name]= this[name];
      }
    }, this);
    return attributes;
  },

  getChildrenDescriptors: function() {
    ///
    // Returns the array of children descriptors (if any) defined by this widget.
    if (this.descriptor.getChildrenDescriptors) {
      return this.descriptor.getChildrenDescriptors.call(this);
    } else {
      return this.descriptor.children || null;
    }
  },

  startup: function(
    top //(boolean) true if this is the root of the widget tree being started.
  ) {
    ///
    // Starts this widget; if top is true, then calls layout (if available). //Typically, start
    // is called on the root of a widget tree that is added to the document and stop is called when
    // a tree is removed from a document. The `started` state of a widget can be used to postpone
    // calculations and wiring until they are actually needed.
    if (!this.started) {
      this.started= true;
      top && this.layout && this.layout();
    }
  },

  stop: function() {
    ///
    // Toggles the `started` state to false; see bd.visual.started.
    this.started= false;
  },

  destroy: function() {
    ///
    // Destroys this widget and, if it's a container, all its descendents. //This is the standard method to
    // dispose of a widget no longer needed and ensures it can be garbage collected properly (assuming client
    // code does not keep any references to the widget). The widget is removed from the widget
    // manager and any attempt to access the destroyed widget in any way is undefined and will almost 
    // certainly result in an unexpected result.

    thid.parent && this.parent.removeChild(this);
    this.domNode && dojo.destroy(this.domNode);
    delete this.domNode;
    delete this.focusNode;
    delete this.containerNode;
  }
});

bd.startupChild= function(
  child //(object) The widget to start.
) {
  ///
  // Convenience function to start a child widget.
  ///
  // Calls startup on the child, and, if the parent is started, ensures layout is called iff available.
  if (child) {
    child.startup && child.startup();
    var parent= child.parent;
    if (parent && parent.started) {
      (parent.layout && parent.layout()) || (child.layout && child.layout());
    }
  }
};

bd.stopChild= function(
  child //(object) The widget to stop.
) {
  ///
  // Convenience function to stop a widget iff it contains the method `stop`.
  child && child.stop && child.stop();
};

});
// Copyright (c) 2008-2010, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
