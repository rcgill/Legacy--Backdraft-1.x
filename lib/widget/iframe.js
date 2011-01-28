define("bd/widget/iframe", [
  "bd",
  "dojo",
  "bd/visual",
  "bd/focusable",
  "bd/mouseable"
], function(bd, dojo) {
///
// Defines the bd.widget.iframe class.

return bd.widget.iframe= bd.declare(
  ///
  // A container that can hold, manage, and layout a single iframe. //Creates a DOM tree that consists of a single div element that contains a single iframe element.
  // Ths iframe element is created on demand and the `src` attribute of the iframe may be set/modified after the widget has
  // been created. The widget controls the height and width of the contained iframe so that it always fits within the
  // content area of the parent div. As usual CSS styling can be used to control the visual appearance of the widget.

  //superclasses
  [bd.visual, bd.focusable, bd.mouseable],

  //members
  bd.attr(
    ///
    // The DOM `src` attribute for the iframe. //Destroys any existing iframe and creates a new iframe with the `src`
    // attribute.
    ///
    //(string, optional, "") Gives the DOM `src` attribute for the iframe; if falsy, then the iframe is not created.

    "src", 
    0, //initial value
   
    function(value) { //setter
      var oldValue= this.src;
      if (oldValue!==value) {
        this.src= value;
        if (bd.isString(value) && value.length) {
          this.createIframe();
        }
      }
      return oldValue;
    }
  ),

  {
  initAttrs:
    {dir:1, lang:1, "class":1, style:1, title:1, tabIndex:1},

  cssStatefulBases: 
    {dijitReset: 0, bdIFrame:1},

  cssStatefulWatch: 
    {visible:0, disabled:0},

  createIframe: function() {
    //destroys the old iframe (if any), creates a new empty iframe.
    this.domNode.innerHTML= "";
    var box= dojo.contentBox(this.domNode);
    this.iframeNode= dojo.create("iframe", {style:"margin:0; border:0; padding:0; overflow:auto;", src:this.src, width:box.w+"px", height:box.h+"px"}, this.domNode);
  },

  layout: function() {
    ///
    // Sets the iframe (if any) height and width to the size of the content box of this widget.
    var box= dojo.contentBox(this.domNode);
    this.iframeNode && dojo.attr(this.iframeNode, {width:box.w+"px", height:box.h+"px"});
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

