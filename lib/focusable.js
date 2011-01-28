define("bd/focusable", [
  "bd", 
  "dojo",
  "bd/interactive",
  "bd/async", 
  "dojo/window"
], function(bd, dojo) {
///
// Defines the bd.focusable class.

bd.focusable= bd.declare(
  ///
  // Mixin class for objects (widgets) that interact with the keyboard. //Provides
  // machinery to track, inspect, watch, and set the focus and a getter/setter for
  // the DOM tabIndex attribute.

  //superclasses
  [bd.interactive],

  //members
  bd.attr(
    ///
    //(integer) The DOM `tabIndex` attribute.
    //(undefined) Remove the DOM `tabIndex` attribute from the target node.
    ///
    // The DOM `tabIndex` attribute (integer or undefined) for this DOM subtree. //The 
    // target node is given by `this.focusNode` or `this.domNode`. If
    // `tabIndex` is falsy but not zero, then the tabIndex attribute is removed from
    // the target node; otherwise, tabIndex must be an integer, and the tabIndex attribute of
    // the target node is set accordingly.

    "tabIndex",

    -1, //initial value

    function(value) { //setter
      var oldValue= this.tabIndex;
      //tabIndex is either an integer or falsy...
      this.tabIndex= value= (value===0 ? 0 : ((!value || isNaN(value)) ? undefined : Number(value)));
      var node= this.focusNode || this.domNode;
      if (node && !this.get("disabled")) {
        if (value===undefined) {
          node.removeAttribute("tabIndex");
        } else {
          node.setAttribute("tabIndex", value);
        }
      }
      return oldValue;
    }
  ),

  bd.attr(
    ///
    //(boolean) true if the widget is disabled; false otherwise.
    ///
    // Overrides the bd.interactive.disabled setter.  //Includes additional functionality to add/removed the tabIndex
    // attribute to/from the focus node upon entering the enabled/disabled state. Further, if the instance is
    // currently focused and the diabled attribute set true, then the onFocus connection
    // point of the parent is signaled (typically, parents should adjust the focus).
    "disabled",
  
    bd.noValue, //use the default given by bd.interactive

    function(value) { //setter
      var oldValue= this.inherited(arguments);
      if (value && !oldValue) {
        //going from !disabled to disabled
        var node= this.focusNode || this.domNode;
        node && node.removeAttribute("tabIndex");
        this.focused && this.parent.focus();
      } else if (!value && oldValue) {
        this.set("tabIndex", this.get("tabIndex"));
      }
      return oldValue;
    }
  ),

  bd.constAttr(
    ///
    //(boolean) true if this widget can receive the focus; false otherwise. 
    ///
    // Indicates whether or not this object can recieve the focus.
    ///
    // The default calculation requires the object must be visible, not disabled, and have a tabIndex value defined
    // in order to receive the focus.

    "focusable", 

    bd.noValue, // The value is always calculated, never stored.

    function() { //getter
      return this.tabIndex!==undefined && this.get("visible") && !this.get("disabled");
    }
  ),

  bd.makeDeferredConnects(
    ///
    // Declares connection points.
    {
    onKeyDown:["keydown", "domNode"],
    onKeyPress:["keypress", "domNode"],
    onKeyUp:["keyup", "domNode"]
  }),  

  {
    focus: function() {
      ///
      // Sets the focus to this widget iff `this.get("focusable")` returns true.
      //warn
      // Focus is set asynchronously. This ensures focus will be set correctly under all circumstances
      // (e.g., from a blur event handler); however, the focus will not have moved before this
      // function returns.
      if (this.focusableGet()) {
        var node= this.focusNode || this.domNode;
        if (node) {
          dojo.window.scrollIntoView(node);
          bd.async.setFocus(node);
        }
      }
    },

    onFocus: function(by) {
      // Connection for called when this DOM subtree gets the focus as triggered by the dijit focus manager.
      // `connectionPoint
      if (!this.focusableGet()) {
        //should never get here; ping the parent in hopes that it will take our focus away
        this.parent.focus();
      }
    },

    onBlur: function(by) {
      // Connection for called when this DOM subtree loses the focus as triggered by the dijit focus manager.
      // `connectionPoint
    },

    onKeydown: function(e) {
      // Connection point for DOM keydown event on `this.domNode`.
      // `connectionPoint
    },

    onKeypress: function(e) {
      // Connection point for DOM keypress event on `this.domNode`.
      // `connectionPoint
    },

    onKeyup: function(e) {
      // Connection point for DOM keyup event on `this.domNode`.
      // `connectionPoint
    },

    _onFocus: function(
      by //("mouse" or undefined) Says what caused dijit focus manager to pass message.
    ) {
      ///
      // Watches the dijit focus manager; triggers the onFocus connection point.
      // `private
      if (!this.focused) {
        this.focused= true;
        this.adviseWatchers && this.adviseWatchers("focused", false, true);
        this.onFocus(by);
      }
    },

    _onBlur: function(
      by //("mouse" or undefined) Says what caused dijit focus manager to pass message.
    ) {
      ///
      // Watches the dijit focus manager; triggers the onBlur connection point.
      // `private
      if (this.focused) {
        this.focused= false;
        this.adviseWatchers && this.adviseWatchers("focused", true, false);
        this.onBlur(by);
      }
    }
  }
);

});

