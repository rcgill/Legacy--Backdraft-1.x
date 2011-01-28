define("bd/widget/staticText", [
  "bd",
  "dojo", 
  "bd/visual",
  "bd/lang"
], function(bd, dojo) {
///
// Defines the bd.widget.staticText class.

return bd.widget.staticText= bd.declare(
  ///
  // A block of text.

  //superclasses
  [bd.visual], 

  //members
  bd.attr(
    ///
    // The contents of the text block.
    ///
    //(string, optional, "") The contents of the text block.

    "value",

    "", //initial value

    function(value) {
      var oldValue= this.value;
      if (oldValue!==value) {
        this.value= value;
        this.domNode && (this.domNode.innerHTML= value);
      }
      return oldValue;
    }
  ),

  {
  cssStatefulBases: {},

  cssStatefulWatch: {visible:0},

  createDom: function() {
    this.inherited(arguments);
    this.domNode.innerHTML= this.value;
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
