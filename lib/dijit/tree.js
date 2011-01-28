define("bd/dijit/tree", [
  "bd",
  "dijit",
  "bd/containable",
  "bd/dijit/compat",
  "dijit/Tree"
], function(bd, dijit) {
///
// Defines the class bd.dijit.tree.

bd.dijit.treeNode= dojo.declare(
  ///
  // Dojo's dijit._TreeNode patched to properly track the last focused node as child items are inserted/deleted.

  [dijit._TreeNode], {
  setChildItems: function(items){
    var 
      result= this.inherited(arguments),
      tree= this.tree;
    if (tree.lastFocused) {
      //did we remove the focused node?
      var p= tree.lastFocused;
      while (p && p!=tree.rootNode) p= p.getParent();
      if (p!=tree.rootNode) {
        //must have removed a subtree that included the node tree.lastFocused
        tree.lastFocused= null;
      }
    }
    return result;
  }
});

return bd.dijit.tree= bd.declare(
  ///
  // Dojo's dijit.Tree wrapped for use with the Backdraft framework. //Includes the following features:
  // 
  // * A constructor compatible with bd.createWidget.
  // * A `disabled` attribute that prevents all user interaction if true and has no effect otherwise.
  // * A `visible` attribute that shows/hides the widget.
  // * A `focusable` attribute that computes the whether or not the widget can receive the focus based in enabled/visible status.
  // * The bd.containable mixin.
  // 
  // All of these features are implemented uniformily through several mixin classes.
  // 
  // Also added the "onSelectNode" event attach point and the focus method.
  //
  [
  dijit.Tree,
  bd.containable,
  bd.dijit.disabled,
  bd.dijit.visible,
  bd.dijit.focusable,
  bd.dijit.constructor], {
    onSelectNode: function(node, oldNode) {
    },

    focus: function() {
      if (this.lastFocused) {
        this.focusNode(this.lastFocused);
      }
    },

  	_selectNode: function(/*_tree.Node*/ node){
      var oldNode= this.selectedNode;
		  if(this.selectedNode && !this.selectedNode._destroyed){
  			this.selectedNode.setSelected(false);
	  	}
		  if(node){
  			node.setSelected(true);
	  	}
		  this.selectedNode = node;
      this.onSelectNode(node, oldNode);
  	}
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

