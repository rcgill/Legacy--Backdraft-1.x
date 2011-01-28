define("bd/dijit/compat", [
  "bd", 
  "dojo"
], function(bd, dojo) {
///
// Defines the bd.dijit.disabled, bd.dijit.visible, bd.dijit.focusable, and bd.dijit.constructor mixin classes.

bd.dijit= 
  ///namespace
  // Contains the Dojo widgets wrapped for use with the Backdraft framework.
  bd.dijit || {};

// switch out the real bd.attr--we want the documentation generator to work but
// don't want to actually define Backdraft-style attributes.
var saveBdAttr= bd.attr, saveBdConstAttr= bd.constAttr;
bd.attr= bd.constAttr= bd.noop;

bd.dijit.disabled= bd.declare(
  ///
  // Mixin class that uniformily provides a `disabled` attribute for dojo widgets.

//TODO: don't mix this into dijit classes that already have a disabled attribute
//TODO: add the bdDisabledCurtain CSS attributes for z-order, position, height, width

  //superclasses
  [],

  //members
  bd.attr(
    ///
    // Controls whether or not the widget will respond to user input.  //When set true, a "curtain" is drawn over 
    // the widget instance at a higher z-order than the instance. Although the curtain
    // is semitransparent, it effectively blocks all user input (keyboard and mouse) from reaching the instance.
    ///
    //(boolean, optional, false) Causes the underlying widget to be disabled from all user input iff true; no
    // affect on widget otherwise.

    "disabled",

     false
  ),

  {
  disabled: false,

  _setDisabledAttr: function(value) { //setter
    if (value && this.domNode && !this.disabledCurtain) {
      this.disabledCurtain= dojo.create("div", {"class":"bdDisabledCurtain"}, this.domNode, "first");
    } else if (!value && this.disabledCurtain) {
      dojo.destroy(this.disabledCurtain);
      delete this.disabledCurtain;
    }
    var oldValue= this.disabled;
    this.disabled= value;
    return oldValue;
  },

  destroy: function() {
    if (this.disabledCurtain) {
      dojo.destroy(this.disabledCurtain);
      delete this.disabledCurtain;
    }
    this.inherited(arguments);
  }
});

bd.dijit.visible= bd.declare(
  ///
  // Mixin class that provides a `visible` attribute for dojo widgets.

  //superclasses
  [],

  //members
  bd.attr(
    ///
    // Controls whether or not the widget is visible.  //Changes the z-index attribute on the underlying widget instance to be set to -100 iff false; no
    // affect on widget otherwise. //This has the net effect of hiding the widget without changing other styling (display, size,
    // position, and so on).
    ///
    //(boolean, optional, true)  true if this widget is visible; false otherwise.

    "visible",

     true
  ),
  
  {
  visible: true,

  _setVisibleAttr: function(value) {
    if (!value && this.domNode && !this.invisible) {
      dojo.style(this.domNode, {zIndex:-100});
      this.invisible= true;
    } else if (value && this.invisible) {
      dojo.style(this.domNode, {zIndex:""});
      this.invisible= false;
    }
    var oldValue= this.visible;
    this.visible= value;
    return oldValue;
  }
});

bd.dijit.focusable= bd.declare(
  ///
  // Mixin class that provides a `focusable` attribute (getter only) for dojo widgets.

  //superclasses
  [],

  //members
  bd.constAttr(
    ///
    // Indicates whether or not the widget will accept the focus.
    // 
    //(boolean) false is the widget and all of its decendents has/have no use for the focus; true otherwise.

    "focusable"
  ),

  {
  _getFocusableAttr: function() {
    // Returns true if this widget can receive the focus; false otherwise.
    return this.get("visible") && !this.get("disabled");
  }
});

var preambleIdentity= function() {
  return arguments;
};

bd.dijit.constructor= bd.declare(
  ///
  // Mixin class that changes constructor signature so that dojo widgets are compatible with bd.createWidget.

  //superclasses
  [],

  //members
  {
  preamble:function(
    kwargs //(bd.createWidget.kwargs) Describes how to create an instance.
  ) {
    // kill the preamble property so that "this" won't have it since this is passed
    // to other contructors. E.g., in dijit/tree we see 
    //   this.dndController = new this.dndController(this, params);
    // is in PostCreate.
    this.preamble= preambleIdentity;
    return [kwargs.descriptor];    
  },

  postscript: function(
    kwargs //(bd.createWidget.kwargs) Describes how to create an instance.
  ) {
    this.create(kwargs.descriptor);
    this.parent= kwargs.parent;
  }
});

bd.attr= saveBdAttr;
bd.constAttr= saveBdConstAttr;

});
