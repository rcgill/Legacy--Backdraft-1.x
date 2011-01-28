define("bd/widget/radioGroup", [
  "bd",
  "dijit",
  "bd/css",
  "bd/visual",
  "bd/focusable",
  "bd/mouseable",
  "bd/container"
], function(bd, dijit) {
///
// Defines the bd.widget.radioGroup class.

bd.widget.radioButtonStyles= 
  ///namespace
  // Contains a set of descriptors that describe radio buttons that can be used with bd.widget.radioGroup
  bd.widget.radioButtonStyles || {};

bd.widget.radioButtonStyles.standard=
  ///
  // A radio button that looks like a dot in a circle.
  {
    className:"bd:widget.checkBox",
    cssStatefulBases: {dijitReset: 0, bdRadioChoice:1},
    checkBox: {
      cssStatefulBases:{bdRadioButton:0},
      value:false,
      sequence: [[false, "", "unpushed"], [true, "", "pushed"]],
      onClick: function() {
        this.set("value", true);
        this.domNode.focus();
      }
    }
  };

return bd.widget.radioGroup= bd.declare(
  ///
  // An optionally-labeled container that can hold, manage, and layout a set of radio buttons.

  //superclasses
  [bd.visual, bd.focusable, bd.mouseable, bd.container],

  //members
  bd.attr(
    ///
    // The text of the label.
    ///
    //(string, optional, "") The text of the label.

    "label",
  
    "", //initial value

    function(value) {
      var oldValue= this.label;
      if (value!==oldValue) {
        this.label= value;
        if (this.domNode) {
          this.domNode.firstChild.innerHTML= newValue;
          this.layout();
        }
      }
      return oldValue;
    }
  ),

  bd.attr(
    ///
    // The position of the label with respect to the box given by the attribute `labelRefBox`.
    ///
    //(bd.css.cornerPosit, optional, "tl-tl") The position of the label with respect to the box given by the attribute `labelRefBox`.

    "labelPosit",

    "tl-tl", //initial value

    function(value) { //setter
      var oldValue= this.posit;
      if (value!==oldValue) {
        this.posit= value;
        this.layout();
      }
      return oldValue;
    }
  ),

  bd.attr(
    ///
    // The reference box to use when positioning the label.
    ///
    //(bd.css.abbreviatedBox) The reference box to use when positioning the label.
    //(falsy, default) Use the margin box for `this.domNode` for the reference box to use when positioning the label.

    "labelRefBox",

    0, //initial value

    function(value) { //setter
      var oldValue= this.labelRefBox;
      if (value!==oldValue) {
        this.labelRefBox= value;
        this.layout();
      }
      return oldValue;
    }
  ),

  bd.attr(
    ///
    // The value of the DOM class attribute for the label DOM node. //The label
    // node will unconditionally contain the class "bdLabel".
    ///
    //(string, optional, "") The value of the DOM class attribute for the label DOM node.

    "labelClass",
    0, //initial value

    function(value) { //setter
      var oldValue= this.labelClass;
      if (oldValue!==value) {
        this.labelClass= value;
        if (this.domNode) {
          var node= this.domNode.firstChild;
          bd.forEach(oldValue.split(" "), function(className) {
            className && dojo.removeClass(node, className);
          });
          bd.forEach(newValue.split(" "), function(className) {
            className && dojo.addClass(node, className);
          });
          this.layout();
        }
      }
    }
  ),

  bd.attr( 
    ///
    // An ordered set of (label, value) that gives the label and value for each button.
    ///
    //(array of [string, any]) Gives the ordered set of (value, label) for each radio button.
    
    "buttons",

    []
  ),

  bd.attr(
    ///
    // Gives the the descriptor to use to create individual radio buttons.
    ///
    //(bd.descriptor, optional, bd.widget.radioGroup.type1) Gives the the descriptor to use to create individual radio buttons.
    
    "bStyle",

    bd.widget.radioButtonStyles.standard //default value
  ),

  bd.attr(
    ///
    //(boolean) true if the widget is disabled; false otherwise.
    ///
    // Overrides the bd.focusabe.disabled setter to provide for causes all contained radio buttons to be disabled.    
    "disabled",

    false, //default value

    function(value) { //setter
      var oldValue= this.inherited(arguments);
      if (value && !this.disabledCurtain) {
        this.disabledCurtain= dojo.create("div", {"class":"bdDisabledCurtain"}, this.domNode, "first");
      } else if (this.disabledCurtain) {
        dojo.destroy(this.disabledCurtain);
        delete this.disabledCurtain;
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

//TODO: ensure that all inherited function use the same short descriptions (and long descriptions if applicable)
//      maybe say "use the inherited text, plus some notes" via the doc generator.

    "focusable", 

    bd.noValue, // The value is always calculated, never stored.

    function() { //getter
      if (this.inherited(arguments)) {
        for (var children= this.children, i= 0, end= children.length; i<end; i++) {
          if (children[i].get("focusable")) {
            return true;
          }
        }
      }
      return false;
    }
  ),

  bd.attr(
    ///
    // Holds current value of the widget as given by the pressed radio button.
    ///
    //(any) The value of the pressed radio button.
    //(undefined) No radio button is pressed.

    "value",

    undefined, //default value

    function( //setter
      value
    ) {
      this.ignoreStateDelta= true;
      var oldValue= this.value;
      this.value= value;
      for (var child, children= this.children, i= 0, end= children.length; i<end; i++) {
        children[i].set("value", this.buttons[i][0]===value);
      }
      delete this.ignoreStateDelta;
      return oldValue;
    }
  ),


  bd.attr(
    ///
    // Specifies how to position the radio buttons. //The first character says where to position the
    // radio buttons relative to the label:
    // 
    // * "t" causes the buttons to be placed above the label.
    // * "b" causes the buttons to be placed below the label.
    // * "l" causes the buttons to be placed to the left of the label.
    // * "r" causes the buttons to be placed to the right of the label.
    ///
    //(/(t|b|l|r)\-(column|row)/, optional, "b-column") Specifies how to position the radio buttons.
    //(otherwise) Do not position the radio buttons.

    "format",

    "b-column" //default value
  ),

  bd.makeDeferredConnects(
    ///
    // Declares connection points.
    0, bd.visual, bd.focusable, bd.mouseable, bd.container
  ),

  {
  initAttrs:
    {dir:1, lang:1, "class":1, style:1, title:1, tabIndex:1},

  cssStatefulBases: 
    {dijitReset: 0, bdRadioGroup:1},

  cssStatefulWatch: 
    {visible:0, disabled:0, focused:0, hover:0},

  precreateDom: function() {
    this.inherited(arguments);
    this.arrangement= this.arrangement || "column";
    if (bd.isString(this.bStyle)) {
      this.bStyle= bd.get(this.bStyle);
    }
    this.bStyle= this.bStyle || bd.widget.radioGroup.type1;
  },

  getCreateDomAttributes: function(
     attributes
  ) {
    attributes= this.inherited(arguments);
    attributes.innerHTML= "<div class=\"bdLabel" + (this.labelClass ? (" " + this.labelClass) : "") + "\">" + this.label + "</div>";
    return attributes;
  },

  loadChildren: function(
    onCreates
  ) {
    ///
    // Creates all radio buttons mentioned in the `buttons` attibute.
    var 
      me= this,
      deferred= 0,
      createChild= function(childDescriptor, i) {
         return bd.createWidget(
          {parent:me, descriptor:childDescriptor},
           function(child) {
             me.children[i]= child;
           },
           onCreates
         );
      };
    bd.forEach(me.buttons, function(buttonInfo, i) {
      var result= createChild(bd.mix({}, me.bStyle, {label: buttonInfo[1], value:false}), i);
      if (result instanceof bd.Deferred) {
        if (deferred) {
          //JavaScript's lack of proper lexical scoping causes this ugliness...
          deferred.addCallback((function(result){ return function() { return result; };})(result));
        } else {
          deferred= result;
        }
      }
    });
    var finish= function() {
      for (var child, value= me.value, children= me.children, i= 0; i<children.length; i++) {
        child= children[i];
        child.set("value", me.buttons[i][0]===value);
        child.watch("value", "stateDelta", me, i);
      }
    };
    if (deferred) {
      deferred.addCallback(finish);
    } else {
      finish();
    }
    return deferred;
  },

  addChild: function(
    child
  ) {
    dojo.place(child.domNode, this.domNode);
    this.started && bd.startupChild(child);
  },

  _focus: function() {
    dojo.window.scrollIntoView(this.domNode);
    for (var children= this.children, i= 0, end= children.length; i<end; i++) {
      if (children[i].get("focusable")) {
        children[i].focus();
        return;
      }
    }
  },

  onFocus: function(by) {
    ///
    // Connection point for receiving the focus. //Nontrivial handler that simple passes focus to the first focusable radio button.
    if (this.focusableGet()) {
      //if getting the focus by clicking on the container but not the contained widget, then delegate to the contained widget...
      bd.back(dijit._activeStack)===this.id && this._focus();
    } else {
      //should never get here; ping the parent in hopes that it will take our focus away
      this.parent.focus();
    }
  },

  focus: function() {
    ///
    // Sets the focus to the first focusable radio button iff `this.get("focusable")` returns true.
    //warn
    // In general, focus is set asynchronously. This ensures focus will be set correctly under all circumstances
    // (e.g., from a blur event handler); however, the focus will not have moved before this
    // function returns.
    if (this.focusableGet()) {
      this._focus();
    } else {
      //should never get here; ping the parent in hopes that it will take our focus away
      this.parent.focus();
    }
  },

  onKeyPress: function(e) {
    ///
    // Connection point for keypress event. //Nontrivial connection point that cycles the focus among the 
    // focusable radio buttons if the arrow keys are pressed.
    if (this.disabled || !this.focused) {
      return;
    }
    for (var children= this.children, i= 0, end= children.length; i<end && !children[i].get("focused"); i++);
    var 
      inc= function() {
        i= (i==end-1 ? 0 : i+1);
      },
      dec= function() {
        i= (i==0 ? end-1 : i-1);
      },
      next= inc,
      current= i;
    switch (e.keyCode) {
      case dojo.keys.UP_ARROW:
      case dojo.keys.LEFT_ARROW:
        next= dec;
        //fall through...
      
      case dojo.keys.DOWN_ARROW:
      case dojo.keys.RIGHT_ARROW:
        if (i==end) {
          //nothing was current; cause the algorithm to start looking at the first button
          //and look for the next button, independent of what arrow key was actually pressed
          i= current= end - 1;
          next= inc;
        }
        next();
        while (!children[i].get("focusable") && i!==current) next();
        children[i].focus();
        dojo.stopEvent(e);
        break;
    }
  },

  stateDelta: function(
    index,
    value
  ) {
    //catches and processes changes in the `value` attribute of any contained button
    if (this.ignoreStateDelta) {
      return;
    }
    this.set("value", value ? this.buttons[index][0] : undefined);
  },

  layout: function(height, width) {
    ///
    // Positions all contained buttons and the label iff a valid `format` attribute exists. //The label 
    // is positioned and the available content box of the top DOM node is clipped to remove the area occupied
    // by the label as given by the `format` attribute. The radio buttons are then arranged in a single column (if the `arrangement` 
    // attribute is "column"), a single row otherwise.

    if (!this.started) {
      return 0;
    }
    var 
      quadrant, arrangment,
      domNode= this.domNode,
      mb= bd.mix(dojo.contentBox(domNode), {t:0, l:0}),
      match= this.format.toLowerCase().match(/(t|b|l|r)\-(column|row)/);
    if (match) {
      quadrant= match[1];
      arrangment= match[2];
    } else {
      return mb;
    }

    var
      buttonBox, available, childCount, chunk, remainder, labelBox,
      label= this.label.length && this.label,
      labelNode= label && this.domNode.firstChild,
      labelPosit= label && this.labelPosit.toLowerCase();
    if (!/(t|c|b)(l|c|r)\-(t|c|b)(l|c|r)/.test(labelPosit)) {
      labelPosit= 0;
    }
    if (label && labelPosit) {
      dojo.style(labelNode, {position:"absolute"});
      labelBox= dojo.marginBox(labelNode);
      labelBox.t= bd.css.cornerCalculators.getTop(labelPosit, labelBox, mb);
      labelBox.l= bd.css.cornerCalculators.getLeft(labelPosit, labelBox, mb);
      dojo.marginBox(labelNode, labelBox);
    }
    buttonBox= {t: mb.t, l:mb.l, h:mb.h, w:mb.w};
    if (labelBox) switch (quadrant) {
      case "t": buttonBox.h= labelBox.t; break;
      case "b": buttonBox.t= labelBox.t + labelBox.h; buttonBox.h= buttonBox.h - buttonBox.t; break;
      case "l": buttonBox.w= labelBox.l; break;
      case "r": buttonBox.l= labelBox.l + labelBox.w; buttonBox.w= buttonBox.w - buttonBox.l; break;
    }
    childCount= this.children.length;
    available= (arrangment=="column" ? buttonBox.h : buttonBox.w) - childCount;
    chunk= Math.floor(available / childCount);
    remainder= available % childCount;
    remainder && chunk++;
    if (arrangment=="column") {
      buttonBox.h= chunk;
    } else {
      buttonBox.w= chunk;
    }
    bd.forEach(this.children, function(child) {
      dojo.marginBox(child.domNode, buttonBox);
      child.layout(buttonBox.h, buttonBox.w);
      if (arrangment=="column") {
        buttonBox.t+= chunk + 1;
      } else {
        buttonBox.l+= chunk + 1;
      }
      if (remainder==1) {
        //just used up the last extra pixel
        chunk--;
        if (arrangment=="column") {
          buttonBox.h--;
        } else {
          buttonBox.l--;
        }
      }
      remainder--;
    });
    return mb;
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
