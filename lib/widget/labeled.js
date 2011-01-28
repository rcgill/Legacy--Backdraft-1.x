define("bd/widget/labeled", [
  "bd",
  "dojo",
  "dijit",
  "bd/css",
  "bd/visual",
  "bd/focusable",
  "bd/mouseable",
  "bd/container"
], function(bd, dojo, dijit) {
///
// Defines the bd.widget.labeled class.

return bd.widget.labeled= bd.declare(
  ///
  // A container that contains and manages a single widget decorated by static text. //The class includes
  // features to conventiently position and style the label and the contained widget. 
  // 
  // tabIndex, focusable and disabled attributes are delegated to the contained widget. The descriptor
  // values for tabIndex and disabled (or default values, if no descriptor values are given) are passed
  // on to the contained widget when it is constructed.
  //note
  // After the contained widget is constructed, the bd.widget.labeled instance will contain tabIndex and disabled
  // properties, but these properties are ignored by the getters/setters.
  // 
  // click and double-click events
  // are delgated to the contained widget by default, but this behavior is controlled by the reflect attribute.
  // This can be useful for checkboxes and radio buttons where clicking on the label
  // is processed equivalently to clicking on the box/button.
  ///
  // The descriptor must contain the property "child" (a bd.descriptor) to describe the single child; behavior
  // is undefined otherwise.
 
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
    // The position of the child with respect to the box given by the attribute `childRefBox`.
    ///
    //(bd.css.cornerPosit, optional, "tl-tl") The position of the child with respect to the box given by the attribute `childRefBox`.

    "childPosit",

    "cc-cc", //initial value

    function(value) { //setter
      var oldValue= this.childPosit;
      if (value!==oldValue) {
        this.childPosit= value;
        this.layout();
      }
      return oldValue;
    }
  ),

  bd.attr(
    ///
    // The reference box to use when positioning the child.
    ///
    //(bd.css.abbreviatedBox) The reference box to use when positioning the child.
    //(falsy, default) Use the margin box for `this.domNode` for the reference box to use when positioning the child.

    "childRefBox",

    0, //initial value

    function(value) { //setter
      var oldValue= this.childRefBox;
      if (value!==oldValue) {
        this.childRefBox= value;
        this.layout();
      }
      return oldValue;
    }
  ),

  bd.attr(
    ///
    // Controls whether or not click and double-click mouse events are reflected to the contained widget.
    ///
    //(boolean, optional, true) If true, all click and double-click events that occur on any part of the
    // subtree defined by this class, *except the subtree defined by the contained widget*, are reflected to
    // the contained widget, and conversely.
    //
 
    "reflect",

    true //initial value
  ),

  bd.attr(
    ///
    // Reflects the disabled attribute to/from the contained child widget. //When the contained widget is created,
    // the disabled attribute is initialized as given by the bd.widget.labeled descriptor or the default.
    ///
    //(boolean, optional, false) Reflects the disabled attribute to/from the contained widget.
    "disabled",

    false, //default value

    function(value) { //setter
      var child= this.children[0];
      if (child) {
        return child.set("disabled", value);
      } else {
        return this.inherited(arguments);
      }
    },

    function() { //getter
      var child= this.children[0];
      if (child) {
        return child.get("disabled");
      } else {
        return this.inherited(arguments);
      }
    }
  ),

  bd.attr(
    ///
    // Reflects the tabIndex attribute to/from the contained child widget. //When the contained widget is created,
    // the tabIndex attribute is initialized as given by the bd.widget.labeled descriptor or default.
    ///
    //(boolean, optional, -1) Reflects the tabIndex attribute to/from the contained widget.

    "tabIndex",

    -1, //default value

    function(value) { //setter
      var child= this.children[0];
      if (child) {
        return child.set("tabIndex", value);
      } else {
        return this.inherited(arguments);
      }
    },

    function() { //getter
      var child= this.children[0];
      return (child && child.get("tabIndex")) || this.tabIndex;
    }
  ),

  bd.constAttr(
    ///
    // Reflects the focusable state of the child widget.
    ///
    //(boolean) false is the contained child (if any) has no use for the focus; true otherwise.
    "focusable",

     bd.noValue, //always calculated

     function() { //getter
       var child= this.children[0];
       return child && this.get("visible") && child.get("focusable");
     }
  ),

  bd.makeDeferredConnects(
    ///
    // Declares connection points.
    {
      onClick:["click", "domNode"], 
      onDblClick:["dblclick", "domNode"]
    },
    bd.visual, bd.focusable, bd.mouseable, bd.container
  ),

  {
  initAttrs:
    {dir:1, lang:1, "class":1, style:1, title:1},

  cssStatefulBases: 
    {dijitReset: 0, bdLabeled:1},

  cssStatefulWatch: 
    {visible:0, disabled:0, focused:0, hover:0},

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
    // Loads the child given by the descriptor property `child`.
    var kwargs= bd.mix({}, this.kwargs, {parent:this, descriptor:this.descriptor.child});
    kwargs.descriptor.disabled= this.disabled;
    kwargs.descriptor.tabIndex= this.tabIndex;
    return this.descriptor.child && bd.createWidget(kwargs, 0, onCreates);
  },

  addChild: function(
    child
  ) {
    this.inherited(arguments);
    //give an initial ping to cssStatefulWatch for the disabled attribute
    var value= !child.get("disabled");
    this.adviseWatchers("disabled", value, !value);
  },

  childGet: function() {
    return this.children[0];
  },

  onClick: function(
    e //(DOM event object) The event object consequent to the DOM event
  ) {
    ///
    // Reflects click events to the container or label to the contained widget iff the instance is not disabled, is visible, and contains
    // the onClick connection point.
    if (e.target===this.domNode || e.target===this.domNode.firstChild) {
      var child= this.children[0];
      this.reflect && child && !child.get("disabled") && child.get("visible") && child.onClick && child.onClick(e); 
    }
  },

  onDblClick: function(
    e //(DOM event object) The event object consequent to the DOM event
  ) {
    ///
    // Reflects double click events to the container or label to the contained widget iff the instance is not disabled, is visible, and contains
    // the onDblClick connection point.
    if (e.target===this.domNode || e.target===this.domNode.firstChild) {
      var child= this.children[0];
      this.reflect && child && !child.get("disabled") && child.get("visible") && child.onDblClick && child.onDblClick(e); 
    }
  },

  focus: function() {
    ///
    // Sets the focus to the contained widget iff `this.get("focusable")` returns true.
    //warn
    // In general, focus is set asynchronously. This ensures focus will be set correctly under all circumstances
    // (e.g., from a blur event handler); however, the focus will not have moved before this
    // function returns.
    if (this.focusableGet()) {
      dojo.window.scrollIntoView(this.domNode);
      this.children[0].focus();
    }
  },

  onFocus:function(by) {
    ///
    // Connection point for receiving the focus. //Nontrivial handler that simple passes focus to the contained widget.
    if (this.focusableGet()) {
      //if getting the focus by clicking on the container but not the contained widget, then delegate to the contained widget...
      bd.back(dijit._activeStack)===this.id && this.children[0].focus();
    } else {
      //should never get here; ping the parent in hopes that it will take our focus away
      this.parent.focus();
    }
  },

  getChildRefBox:function(
    totalBox,  //(bd.css.abbreviatedBox) The margin box of this widget instance.
    labelBox,  //(bd.css.abbreviatedBox) The margin box of the label.
    labelPosit,//(bd.css.cornerPosit) The `labelPosit` attribute.
    childPosit //(bd.css.cornerPosit) The `childPosit` attribute.
  ) {
    ///
    // Returns the child reference box. //By default, this is defined as `this.childRefBox || totalBox`.
    // The sole purpose of this method is to provide a convenient point for subclasses to override this default.
    return this.childRefBox || totalBox;
  },

  layout:function() {
    ///
    // Positions the label and the contained child; returns the margin box of this widget.
    if (!this.started) {
      return 0;
    }
    var
      labelBox, childBox, childRefBox,
      domNode= this.domNode,
      mb= bd.mix(dojo.marginBox(domNode), {t:0, l:0}),
      label= this.label.length && this.label,
      labelNode= label && this.domNode.firstChild,
      labelPosit= label && this.labelPosit.toLowerCase(),
      labelRefBox= label && (this.labelRefBox || mb),
      child= this.children[0],
      childNode= child && child.domNode,
      childPosit= childNode && this.childPosit.toLowerCase();
    if (!/(t|c|b)(l|c|r)\-(t|c|b)(l|c|r)/.test(labelPosit)) {
      labelPosit= 0;
    }
    if (!/(t|c|b)(l|c|r)\-(t|c|b)(l|c|r)/.test(childPosit)) {
      childPosit= 0;
    }
    if (label && labelPosit) {
      dojo.style(labelNode, {position:"absolute"});
      labelBox= dojo.marginBox(labelNode);
      labelBox.t= bd.css.cornerCalculators.getTop(labelPosit, labelBox, mb);
      labelBox.l= bd.css.cornerCalculators.getLeft(labelPosit, labelBox, mb);
      dojo.marginBox(labelNode, labelBox);
    }
    if (childNode && childPosit) {
      dojo.style(childNode, {position:"absolute"});
      childBox= (child.layout && child.layout()) || dojo.marginBox(childNode);
      childRefBox= this.getChildRefBox(mb, labelBox, labelPosit, childPosit);
      childBox.t= bd.css.cornerCalculators.getTop(childPosit, childBox, childRefBox);
      childBox.l= bd.css.cornerCalculators.getLeft(childPosit, childBox, childRefBox);
      dojo.marginBox(childNode, childBox);      
    }
    return mb;
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
