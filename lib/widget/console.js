define("bd/widget/console", [
  "bd", "dijit",
  "bd/visual"
], function(bd, dijit) {
///
// Defines the bd.widget.console class.

return bd.widget.console= bd.declare(
  ///
  // A container that dynamically displays lines of text. //This class can be used to simulate a very simple
  // teletype output console.

  //superclasses
  [bd.visual], 

  //members
  {
  cssStatefulBases: {dijitReset: 0, bdDijitConsole:0},

  cssStatefulWatch: {visible:0},

  baseClass: "bdDijitConsole",

  precreateDom: function() {
    this.inherited(arguments);
    this.lineOpen= false;
    this.indentValue= 0;
  },

  indent: function(
    delta
  ) {
    ///
    // Causes subsequent lines to be indented by the current indent value + `delta` ems. //The indent value starts at
    // zero and may be accessed directly through `this.indent`.
    this.indentValue+= delta;
  },

  write: function(
    text //(string) The text to write.
  ) {
    ///
    // Outputs text to the containing node. //newline characters cause new lines to be started; conversely, multiple
    // write applications with text that does not include any newline characters will all be written on the same line. All new
    // lines are indented by the current indent value as given by `this.indent`.
    var 
      lastNode= 0,
      style= "padding-left:" + (this.indentValue) + "em;";
    if (!text) {
      return;
    }
    text= text.replace(/</g, "&lt;");
    text= text.split("\n");
    for (var i= 0, end= text.length-1; i<end; i++) {
      if (!this.lineOpen) {
        lastNode= dojo.create('pre', {innerHTML:text[i], style:style}, this.domNode, "last");
      } else {
        this.lineOpen.innerHTML= this.lineOpen.innerHTML + text[i];
        this.lineOpen= false;
      }
    }
    if (text[i]) {
      //ended in a line without a new-line
      if (!this.lineOpen) {
        lastNode= this.lineOpen= dojo.create('pre', {innerHTML:text[i], style:style}, this.domNode, "last");
      } else {
        this.lineOpen.innerHTML= this.lineOpen.innerHTML + text[i];
      }
    }
    lastNode && dijit.scrollIntoView(lastNode);
  },

  clear: function() {
    ///
    // Clears all output in the containing node.
    this.domNode.innerHTML= "";
    this.lineOpen= false;
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

