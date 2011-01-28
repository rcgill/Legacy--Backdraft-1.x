define("bd/widget/root", [
  "bd", "dojo",
  "bd/stateful",
  "bd/connectable",
  "bd/container",
  "bd/async"
], function(bd, dojo) {
///
// Defines the bd.widget.root class.

return bd.widget.root= bd.declare(
  ///
  // A container that attaches to the body element that can hold and manager a set of children widgets. //Typically, a single instance of
  // bd.widget.root functions as the top-level container for a Backdraft application. 
  // 
  // The class calls layout on all of its children whenever it detects a document resize event.
  // 
  // The class includes the method bd.widget.root.destroyLoadingMessage that removes the subtree rooted at the element with the DOM `id` attribute "bdLoading". 
  // Such a subtree can be used to hold a user pacifier while an application is loading.
  // 
  // Notice that since this widget class always attaches to the `body` element, there will be at most one instance of this class
  // present in an application. By default, the `id` attribute is set to "root", but this may be set changed by providing an
  // `id` property in the creating descriptor.
  // 
  // Upon construction, the DOM document resize event is watched and any resize events are delegated to all children (via the method `layout`) as well
  // as published to the topic "bd/viewportResize". See bd.widget.root.onResize.
  //

  [bd.stateful, bd.connectable, bd.container], 

  {
  constructor: function(
    kwargs
  ) {
    // this widget does not include bd.createable; therefore, it must orchestrate its own initialization...
    this.kwargs= kwargs;
    bd.mix(this, kwargs);
    bd.mix(this, kwargs.descriptor);
    this.id= this.id || "root";
    bd.object.set(this);     
    this.domNode= this.containerNode= dojo.body();
    this.domNode.id= this.id;
    //required for bd.connectable
    this.postcreateDom();
    bd.connect(bd.global, 'onresize', 'resize', this);
    this.started= true;
  },

  destroyLoadingMessage:function() {
    var node= dojo.byId("bdLoading");
    node &&  dojo._destroyElement(node);
  },

  resize: function() {
    bd.async.schedule("last", "onResize", this);
  },

  onResize: function() {
    ///
    // Nontrivial connection point that watches the DOM resize event on the document. //Queries the body node for
    // its margin box and passes the new size to all children as well as publishes the topic "bd/viewportResize" with
    // a single object argument that contains the height and width of the new viewport size in pixels at`h` and `w`.
    var mb= dojo.marginBox(this.domNode);
    bd.forEach(this.children, function(child) {
      child.layout && child.layout(mb.h, mb.w);
    });
    dojo.publish("bd/viewportResize", [mb]);
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
