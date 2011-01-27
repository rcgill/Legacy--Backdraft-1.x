define("bd/descriptor/processor", [
  "dojo", "bd"
], function(dojo, bd) {
///
// Defines various machinery to process bd.descriptor objects.

bd.descriptor=
  ///namespace
  // Contains a set of functions for manipulating bd.descriptor objects.
  bd.descriptor || {};

bd.docGen("bd.descriptor", {
  program:
    ///type
    // An array of functions that transform a descriptor. //Each item in the array may be one of:
    // 
    // 1. a string that specifies a property of bd.descriptor.processor
    // 2. an array of a string that specifies a property of bd.descriptor.processor
    //    and additional arguments to apply when that function is applied to a descriptor
    // 3. a function
    // 
    // When a transform function is applied to a descriptor, the descriptor is always the first argument. Additional
    // arguments can be provided by providing the transform via variant [2] above,  or variant [3] above with the aid
    // of bd.partial. See bd.descriptor.processor.
    //
    0
});

bd.descriptor.processor= function(
  descriptor, //(bd.descriptor) the descriptor to transform
  program     //(array of bd.descriptor.program) the transforms and required arguments to apply to descriptor
) {
  ///
  // Applies each function given in program to descriptor. 
  ///
  // Transform functions allow convenient shorthand notation when defining a bd.descriptor object. For example, the
  // transform function bd.descriptor.processor.autotab sets the tab order while executing a depth-first traversal
  // of the descriptor's children (see bd.descriptor.processor.autotab for details).
  //
  dojo.forEach(program, function(item) {
    var
      fp,
      args= [descriptor];
    if (dojo.isString(item)) {
      fp= bd.descriptor.processor[item];
    } else {
      fp= bd.descriptor.processor[item[0]];
      args= args.concat(item.slice(1));
    }
    try {
      fp.apply(descriptor, args);
    } catch (e) {
      console.error("exception in bd.descriptor.processor (item=%o) (exception=%o)", item, e);
    }
  });
};

dojo.mixin(bd.descriptor.processor, {
  traverse: function(
    descriptor, //(bd.descriptor) The descriptor to traverse.
    proc        //(function) The transform function to apply to descriptor and its children.
  ) {
    ///
    // Applies proc to descriptor, then recurses into each child of descriptor (if any).
    proc(descriptor);
    if (!descriptor.children) {
      return;
    }
    for (var children= descriptor.children, i= 0, end= children.length; i<end; i++) {
      arguments.callee(children[i], proc);
    }
  },

  traverseChildren: function(
    descriptor, //(bd.descriptor) The descriptor to transform.
    proc        //(function) The transform function to apply to each of descriptor's children.
  ) {
    ///
    // Applies proc to each child, grandchild, etc.,  of descriptor.
    if (descriptor.children) for (var children= descriptor.children, i= 0, end= children.length; i<end; i++) {
      bd.descriptor.processor.traverse(children[i], proc);
    }
  },

  mixin: function(
    descriptor, //(bd.descriptor) The descriptor to transform.
    props       //(hash) Properties to mix into descriptor.
  ) {
    ///
    // Mixes props into descriptor.
    dojo.mixin(descriptor, props);
  },

  setTabs: function(
    descriptor, //(bd.descriptor) The descriptor to transform
    start       //(integer) The tab order number to start numbering.
  ) {
    ///
    // Sets the tab order in descriptor by a depth-first traversal.
    var order= start || 1;
    bd.descriptor.processor.traverseChildren(descriptor, function(child) {
      child.tabIndex= order++;
    });
  },

  setClass: function(
    descriptor
  ) {
    if (descriptor.name) {
      var s= descriptor["class"];
      descriptor["class"]= (s ? s + " " : "") + descriptor.name;
    }
    bd.descriptor.processor.traverseChildren(descriptor, bd.descriptor.processor.setClass);
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

