define("bd/widget/stateButton", [
  "bd",
  "dojo", 
  "bd/widget/staticText",
  "bd/mouseable",
  "bd/focusable"
], function(bd, dojo) {
///
// Defines the bd.widget.stateButton class.


bd.widget.stateButton= {};

bd.widget.stateButton.advance= 
  ///const
  // Unique object with no properties that may be used with bd.widget.stateButton.keys to signal advance one state.
  {};

bd.widget.stateButton.reset= 
  ///const
  // Unique object with no properties that may be used with bd.widget.stateButton.keys to set the value to the first state.
  {};


bd.docGen("bd.widget.stateButton", {
  "info":
    ///type
    // An array of one, two, or three elements or a single non-array that gives value and display information for a single state
    // in a bd.widget.stateButton instance.
    ///
    // The first element in the array or the single non-array gives the value of a state.
    // 
    // The second element in the array, a string, gives the text to display for the state. If this element is missing (i.e., the value
    // is an array with length of one or not an array), then the empty string is assumed.
    // 
    // The third element in the array, a string, gives the CSS class to add to the DOM class attribute of the widget's DOM node for
    // the state. If this element is missing (i.e., the value is an array with length less than three or a not an array), then it is
    // assumed to be the string `"state"``i``` for the i'th state.
    //
    // See bd.widget.stateButton.sequence
    0
});


bd.widget.stateButton= bd.declare(
  ///
  // An interactive widget that cycles among an ordered set of values. //The legal set of values, their
  // order, a string associated with each value (termed the "value-text"), and a CSS string to add to the
  // DOM class attribute for each value is given by the attribute `sequence`. The
  // value-text associated with each value need not be unique and may be empty.
  // 
  // Typically, the value is changed by clicking on the widget or pressing the space bar while the widget has
  // the focus. 
  // 
  // Since the widget is connected to bd.cssStateful and further since `cssStatefulWatch`
  // includes the `cssState` attribute, it is a simple matter to configure a CSS style sheet
  // that changes the appearance of a widget instance based on its value. Typical examples are 
  // changing the background image (e.g., a checked or unchecked image), changing
  // the background color, or changing the text.
  // 
  // Notice that the class is derived from bd.widget.staticText. If the current value has
  // a non-empty value-text as per the `sequence` attribute, then the `text` attribute
  // is set accordingly.
  // 
  // Finally, the attribute `keys` gives a map from character codes as received from DOM keyboard 
  // `keypress` events to values. These may be viewed as accelerators to particular values
  // when a particular instance has the focus.

  //superclasses
  [bd.widget.staticText, bd.focusable, bd.mouseable],

  //members
  bd.attr(
    ///
    // The ordered set of possible values and optional display information.
    ///
    //(array of bd.widget.stateButton.info, optional, [[false, "", "unchecked"], [true, "", "checked"]]) Gives the
    // set of possible (value, value-text, CSS-text) in the order they transition.
    //
    "sequence",

    [[false, ""], [true, ""]], //default value 

    function( //setter
      value
    ) {
      var oldValue= this.sequence;
      this.sequence= bd.map(value, function(item) {
        if (bd.isArray(item)) {
          return [item[0], (item[1] ? item[1]+"" : ""), (item[2] ? item[2]+"" : 0)];
        } else {
          return [item, "", 0];
        }
      });
      this.set("value", this.value);
      return oldValue;
    }
  ),

  bd.attr(
    ///
    // Maps charCodes as received from a keypress event to a value. //Mapping to bd.widget.stateButton.reset
    // causes the key to set the value to the first state; mapping to bd.widget.stateButton.advance causes 
    // the key to behave like a mouse click and transition the state to the next state.
    ///
    // (map:charCode --> value, optional, see code for default) Maps charCodes as received from a DOM `keypress` event to a value.

    "keys",

    (function() { //default value
      var result= [];
      result[dojo.keys.ESCAPE]= bd.widget.stateButton.reset;
      result[dojo.keys.SPACE]= bd.widget.stateButton.advance;
      return result;
    })()
  ),

  bd.attr(
    ///
    // The current value of the widget. Must be a value from the `sequence` attribute or undefined; attempting to set
    // an illegal value is equivalent to setting the value to undefined.
    //
    //(value from the `sequence` attribute, optional, undefined) The current value of the widget.

    "value",

    undefined, //default value

    function( //setter
      value
    ) {
      var 
        oldValue= this.value,
        oldCssState= this.cssState;
      for (var sequence= this.sequence, i= 0, end= sequence.length; i<end; i++) {
        if (value===sequence[i][0]) {
          this.value= value;
          this.domNode && (this.domNode.innerHTML= sequence[i][1]);
          this.cssState= sequence[i][2] || "state"+i;
          break;
        }
      }
      if (i==end) {
        //never found value
        this.value= sequence[0][0];
        this.domNode && (this.domNode.innerHTML= sequence[0][1]);
        this.cssState= sequence[0][2] || "state0";
      }
      if (this.cssState!==oldCssState) {
        this.adviseWatchers("cssState", oldCssState, this.cssState);
      }
      return oldValue;
    }
  ),

  bd.constAttr(
    ///
    // The current string to add to the DOM class attibute that reflects the current value. //By separating
    // the value domain from the domain of strings that reflect the value in the DOM class attribute, the widget
    // can accept values on any domain (e.g., {true, false} or some set of objects) while still using CSS class
    // to paint the visual presentation of the state button as a function of value. For example, by default,
    // checkbox defines the values {true, false} and reflects these values in the DOM class attribute as {"checked",
    // "unchecked"} via bd.cssStateful.

    "cssState",

    bd.noValue, // The value is always calculated, never stored.

    function() { //getter
      return this.cssState;
    }
  ),

  bd.makeDeferredConnects(
    ///
    // Declares connection points.
    {},
    bd.visual, bd.focusable, bd.mouseable
  ),

  {
  initAttrs:
    {dir:1, lang:1, "class":1, style:1, title:1, tabIndex:1},

  cssStatefulBases: 
    {bdStateButton:1},

  cssStatefulWatch: 
    {visible:0, disabled:0, focused:0, hover:0, cssState:0},

  createDom: function() {
    this.inherited(arguments);
    this.focusNode= this.domNode;
    if (this.set("value", this.value)===bd.failed) {
      this.set("value", this.sequence[0][0]);
    }
  },

  moveState: function() {
    var sequence= this.sequence, i= 0, end= sequence.length;
    while (i<end && sequence[i][0]!==this.value) {
      i++;
    }
    if (i==end || i==end-1 || end<2) {
      this.set("value", sequence[0][0]);
    } else {
      this.set("value", sequence[i+1][0]);
    }
  },

  onClick: function(e) {
    ///
    // Nontrivial connection point that causes the state to move one position upon detecting a user click.
    if (this.disabled) {
      return;
    }
    this.moveState();
    this.domNode.focus();
  },

  onKeyPress: function(e) {
    ///
    // Nontrivial connection point that inspects a keypress for possible action as given by the
    // `keys` attribute.
    if (this.disabled) {
      return;
    }
    var code= e.charCode;
    if (this.keys[code]===bd.widget.stateButton.advance) {
      this.moveState();
    } else if (this.keys[code]===bd.widget.stateButton.reset) {
      this.set("value", sequence[0][0]);
    } else if (this.keys[code]!==undefined) {
      this.set("value", this.keys[code]);
    }
  }
});

return bd.widget.stateButton;

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

