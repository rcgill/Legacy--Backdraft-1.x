define("bd/container", [
  "bd",
  "dojo"
], function(bd, dojo) {
///
// Defines the bd.container class and associated machinery.

var traverse= function(children, callback) {
  for (var child, grandChildren, i=0, end= children.length; i<end; i++) {
    child= children[i];
    grandChildren= bd.isFunction(child.children) ? child.children() : child.children;
    grandChildren && traverse(grandChildren, callback);
    callback(child);
  }
};

bd.container= bd.declare(
  ///
  // Mixin class that manages children widgets.
  ///
  // Children are contained in an array facilitating fast lookup (no DOM querying required).
  // Children may also be cataloged by name and name need only be unique per bd.container instance. This
  // allows (e.g.) several panes with the same design but different contents to exist concurrently.
  // Notice that if we required each widget to have a unique name, then some sort of runtime
  // naming machinery would be required to allow several panes with the same design to exist 
  // concurrently.
  //
  // The design of this class is similar to dijit.\_Container except that this class exerts
  // more direct control over the children compared to dijit.\_Container which relys on the DOM.
  //

  //superclasses
  [],

  //members
  {
  constructor: function() {
    this.children= [];
    this.childrenByName= {};
  },

  startup: function() {
    ///
    // Calls startup on all children and then delegates further processing to the superclass. //See, for example, bd.visual.
    if (!this.started) {
      bd.forEach(this.children, bd.startupChild);
      this.inherited(arguments);
    }
  },

  stop: function() {
    ///
    // Calls stop on all children and then delegates further processing to the superclass. //See, for example. bd.visual.
    if (this.started) {
      bd.forEach(this.children, bd.stopChild);
      this.inherited(arguments);
    }
  },

  initChild: function(
    child
  ) {
    ///
    // Starts the child iff this container is started. //Automatically called for each child added to this container via bd.container.addChild.
    this.started && bd.startupChild(child);
  },

  uninitChild: function(
    child
  ) {
    ///
    // Stops the child. //Automatically called for each child added to this container via bd.container.removeChild.
    bd.stopChild(child);
  },

  addChild: function(
    child,         //(any, typically a widget) The child to add.
    referenceNode, //(DOM node, optional, `this.containerNode` || `this.domNode`) The reference node for placement of child into DOM.
    position       //("before", "after", "first", "last", optional, "last") The position relative to reference node to place child.
  ) {
    ///
    // Adds a child to this container.
    ///
    // The following tasks are executed:
    // 
    // 1. Pushes the child into the children array.
    // 2. Adds the child to the name hash if the name is unique (warns otherwise).
    // 3. If `child.domNode` exists, then places the child in the DOM document as given by (referenceNode, position).
    // 4. Applies initChild to the child (which starts the child if the container is already started).
    //
    // Notice that there are no requirements on child (other than it exist). In particular, a child may be a purely computational
    // object that does not define any DOM presentation.
    this.children.push(child);
    var name= child.get && child.get("name");
    if (name) {
      if (this.childrenByName[name]) {
        console.warn("attempting to add two children with the same name");
      } else {
	      this.childrenByName[name]= child;
      }
    }
    child.domNode && dojo.place(child.domNode, referenceNode || this.containerNode || this.domNode, position || "last");
    this.initChild(child);
  },

  removeChild: function(
    child //(any) A child previously added to this container via bd.container.addChild.
  ) {
    ///
    // Removes the child from the container. //Applies uninitChild to the child (which stops the child).
    bd.docGen("overload",
      function(
        name //(string) Name of a child previously added to this container via bd.container.addChild.
      ) {
        ///
        // Syntactic sugar for ```instance``.removeChild(``instance``.getChild(name))`.
      }
    );
    child= bd.isString(child) && this.childrenByName[child] || child;
    if (child.name && this.childrenByName[child.name]===child) {
      delete this.childrenByName[child.name];
    }
    for (var children= this.children, i= 0, end= children.length; i<end; i++) {
      if (children[i]===child) {
	      children.splice(i, 1);
   	    var node= child.domNode;
	      node.parentNode.removeChild(node);
	      this.uninitChild(child);
	      return child;
      }
    }
    return null;
  },

  getChildren: function() {
    ///
    // Returns the array of children managed by this container. //This interface allows defining other container types
    // that may not actually maintain an array of children.
    return this.children;
  },

  hasChildren: function() {
    ///
    // Returns true is this container has any children; false otherwise.
    return this.getChildren().length>0;
  },

  getChild: function(
    name //(string) Name of a child previously added to this container via bd.container.addChild.
  ) {
    ///
    // Returns the child with the name `name` if such a child exists; false otherwise.
    bd.docGen("overload",
      function(
        child //(any other than string) A child.
      ) {
        ///
        // Returns child. This design provides an interface analogous to dojo.byId and dijit.byId whereby 
        // requesting the target object results in the identity function.
      }
    );
    return bd.isString(name) && this.childrenByName[name] || name;
  },

  destroy: function() {
    ///
    // Destroys all children and then delegates to the superclass.
    bd.forEach(this.children, function(child){
      child.destroy();
    });
    delete this.childrenByName;
    delete this.children;
    this.inherited(arguments);
  },

  layout: function() {
    ///
    // Applies layout to all children and returns this object's margin box if this container is started; no-op otherwise.
    if (!this.started) {
      return 0;
    }
    for (var child, children= this.children, i= 0, end= children.length; i<end; i++) {
      (child= children[i]) && child.layout && child.layout();
    }
    return dojo.marginBox(this.domNode);
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

