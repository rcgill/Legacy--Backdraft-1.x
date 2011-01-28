define("bd/widget/pane", [
  "bd",
  "bd/visual",
  "bd/container",
  "bd/navigator"
], function(bd) {
///
// Defines the bd.widget.pane class.

return bd.widget.pane= bd.declare(
  ///
  // A container that can hold and manage a set of children widgets. //The container is realized by. a DOM `form` element with
  // its `action` attribute set to `javascript:void(0)`.

  //superclasses
  [bd.visual, bd.container, bd.navigator],

  //members
  {
  initAttrs:
    {dir:1, lang:1, "class":1, style:1, title:1, tabIndex:1},

  cssStatefulBases: 
    {dijitReset: 0, bdPane:1},

  cssStatefulWatch: 
    {visible:0, disabled:0, readOnly:0, focused:0, hover:0},

  tabIndex: 
    undefined,

  createDom: function() {
    this.domNode= this.containerNode= dojo.create('form', this.getCreateDomAttributes({id: this.id, widgetId: this.id, action:"javascript:void(0)"}));
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
