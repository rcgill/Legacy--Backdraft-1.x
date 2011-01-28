define("bd/widget/statusbar", [
  "bd",
  "dojo",
  "bd/visual",
  "bd/container"
], function(bd, dojo) {
///
// Defines the bd.widget.statusbar class.

return bd.widget.statusbar= bd.declare(
  ///
  // A container the can hold, manage, and layout a set of children widgets that are displayed as a single horizontal line of sizeable items.
 
  //superclasses
  [bd.visual, bd.container],

  //members
  {
  cssStatefulBases: {dijitReset: 0, bdStatusbar:0},

  cssStatefulWatch: {visible:0},

  constructor: function() {
    this.panes= [];
  },

  addChild: function(
    child, //(widget) The widget to add to this container.
    order  //(integer) The position within the other children at which to add this child.
  ){
    ///
    // Adds a child at location `order`. //Replaces and returns pre-existing child at that location, if any; 
    // place child in the DOM tree relative to siblings as given by order.

    order= order || this.panes.length;
    var result= this.panes[order] ? this.removeChild(this.panes[order]) : null;
    for (var i= this.panes.length; i<=order; i++) this.panes.push(null);
    this.panes[order]= child;
    i= order - 1;
    while (i>=0 && !this.panes[i]) i--;
    if (i>=0) {
      this.inherited(arguments, [child, this.panes[i].domNode, "after"]);
    } else {
      this.inherited(arguments, [child, this.domNode, "first"]);
    }
    return result;
  },

  removeChild: function(
    child
  ) {
    child= this.inherited(arguments);
    for (var i= 0, end= this.panes.length; i<end; i++) {
      if (this.panes[i]===child) {
        if (i==end-1) {
          //removing the last pane...
          this.panes.pop();
        } else {
          this.panes[i]= null;
        }
        break;
      }
    }
    return child;
  },

  layout: function() {
    ///
    // Positions the children. //If the `dir` attribute is "ltr" then all of the children but the first child
    // are positioned for the last child to the second child, one after another starting from the right edge. Finally,
    // the first child is positioned as the left edge and given all the remaining horizontal space. The analogous
    // algorithm is used if `dir` is "rtl".

    if (!this.started) {
      return 0;
    }
    
    var i, end, right, left, marginBox, child, panes= [];

    //get a pane vector with no holes
    for (i= 0, end= this.panes.length; i<end; i++) {
      child= this.panes[i];
      child && panes.push(child);
    }

    if (this.get("dir")=="ltr") {
      for (right= 0, i= panes.length-1; i>0; i--) {
        child= panes[i];
        dojo.style(child.domNode, {top:0, right:right});
        marginBox= dojo.marginBox(child.domNode);
        right+= marginBox.w;
        child.layout && child.layout(marginBox);
      }
      child= panes[0];
      if (child) {
        dojo.style(child.domNode, {top:0, left:0, right:right});
        marginBox= dojo.marginBox(child.domNode);
        child.layout && child.layout(marginBox);
      }
    } else {
      for (left= 0, i= 0, end= panes.length-1; i<end; i++) {
        child= panes[i];
        dojo.style(child.domNode, {top:0, left:left});
        marginBox= dojo.marginBox(child.domNode);
        left+= marginBox.w;
        child.layout && child.layout(marginBox);
      }
      child= panes[i];
      if (child) {
        dojo.style(child.domNode, {top:0, left:left, right:0});
        marginBox= dojo.marginBox(child.domNode);
        child.layout && child.layout(marginBox);
      }
    }
    return dojo.marginBox(this.domNode);
  },

  setPaneValue: function(
    value, //(any) The value to pass to the target pane.
    pane   //(integer or name) Indentifies the target pane.
  ) {
    ///
    // Sets the `value` attribute of the target pane.
    var child= (dojo.isString(pane) ? this.getChild(pane) : this.panes[pane]);
    child && child.set("value", value);
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

