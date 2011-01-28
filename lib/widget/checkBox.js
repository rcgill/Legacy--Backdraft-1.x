define("bd/widget/checkBox", [
  "bd",
  "dojo",
  "bd/widget/stateButton",
  "bd/widget/labeled"
], function(bd, dojo) {
///
// Defines the bd.widget.checkBox class.

return bd.widget.checkBox= bd.declare(
  ///
  // A container that can hold, manage, and layout a single bd.widget.statebutton inside a bd.widget.labeled widget.
  ///
  // Packages a bd.widget.statebutton, usually styled as a checkBox, inside a bd.widget.labeled widget. This
  // allows the statebutton label, the button itself, and the box controlling the layout to be specified in
  // a terse, yet easy-to-understand descriptor. For example, the descriptor
  //code
  // {
  //   className:"widget.checkBox",
  //   label:"Are checkBoxes awesome?",
  //   style: {height:"3em", width:"20em"}
  // }
  ///
  // Specifies a 3x20 em box with the checkBox centered vertically on the left side of the box and the text
  // "Are checkBoxes awesome?" centered vertically to the right of the checkBox.
  // 
  // By default, the contained bd.widget.stateButton is described by
  //code
  // {className:"widget.stateButton", cssStatefulBases:{bdCheckBoxBox:0}}
  ///
  // However, any or all of this description can be overridden by providing a `checkBox` property in the descriptor. See 
  // bd.widget.checkBox.loadChildren for details.
  // 
  // Layout is controlled with the `format` attribute together with the CSS styles. The root DOM node of the subtree of
  // the entire widget as well as the root DOM node of the state button subtree contain the CSS class "bdCheckBox"
  // in the DOM class string attribute. As usual, styles and classes can be added/subtracted on a per-descriptor or per-instance
  // basis.

  //superclasses
  [bd.widget.labeled],

  //members
  bd.attr(
    ///
    // Describes how to layout the checkBox. //The value must be a string of the form xx-xx-y-zz-zz, where
    // xx-xx and zz-zz are both bd.css.cornerPosit values. The y value may be "l", indicating the left
    // side of the content box holds the state button and space occupied by the state button "chopped off" 
    // and the remaining box is used as the reference box when positioning the label; analogously for "r".
    // 
    // Although some legal configurations may result in ugly checkBoxes, all nice looking checkBoxes are also
    // well-described by this notation.

    "format",

    "cl-cl-l-cl-cl", //initial value

    function(value) { //setter
      var oldValue= this.format;
      if (oldValue!==value) {
        this.format= value;
        this.layout();
      }
    }   
  ),

  bd.attr(
    ///
    // Reflects the value state to/from the contained bd.widget.stateButton. //When the contained widget is created,
    // if the value is other than bd.noValue, then the value property of the contained widget is set accordingly.
    //(any, optional, bd.noValue) This initial value is only used to initialize the contained bd.widget.stateButton;
    // thereafter, value is reflected to/from the contained stateButton.

    "value",

    bd.noValue, //bd.noValue says don't initialize the contained stateButton (the child descriptor should contain an initial value).

    function(value) { //setter
      var child= this.children[0];
      if (child) {
        return child.set("value", value);
      } else {
        var oldValue= this.value;
        this.value= value;
        return oldValue;
      }
    },

    function() { //getter
      var child= this.children[0];
      return (child && child.get("value")) || this.value;
    }
  ),

  {
  cssStatefulBases: 
    {dijitReset: 0, bdCheckBox:1},

  loadChildren: function(
    onCreates
  ) {
    ///
    // Loads the contained bd.widget.stateButton. //The descriptor property `checkBox` can be used to override the
    // default stateButton descriptor given by:
    //code
    // {
    //   className:"bd:widget.stateButton", 
    //   cssStatefulBases:{bdCheckBoxBox:0}, 
    //   sequence:[[false, "", "unchecked"], [true, "", "checked"]]
    // }
    ///
    // The disabled and tabIndex attribute values are passed to the stateButton; if the value attribute hold a value other than bd.noValue, then it is are also passed to the stateButton.
    var 
      descriptor= bd.mix({className:"bd:widget.stateButton", cssStatefulBases:{bdCheckBoxBox:0}, sequence:[[false, "", "unchecked"], [true, "", "checked"]]}, this.descriptor.checkBox || {});
    descriptor.disabled= this.disabled;
    descriptor.tabIndex= this.tabIndex;
    if (this.value!==bd.noValue) {
      descriptor.value= this.value;
      delete this.value;
    }
    return bd.createWidget(bd.mix({}, this.kwargs, {parent:this, descriptor:descriptor}), 0, onCreates);
  },

  addChild:function(
    child
  ) {
    this.inherited(arguments);
    child.watch("value", function(newValue, oldValue) { this.adviseWatchers("value", oldValue, newValue); }, this);
    dojo.setSelectable(this.domNode, false);
  },

  layout: function() {
    ///
    // Layout the widget, return the margin box.
    // `private
    if (!this.started) {
      return 0;
    }
    // format is xx-xx-y-zz-zz; xx-xx is the child posit, zz-zz is the label posit
    // if y is l then the left of the whole box is chopped to get the label reference box
    // if y is r then the right of the whole box is chopped to get the label reference box
    var format= this.format.toLowerCase();
    if (!/(t|c|b)(l|c|r)\-(t|c|b)(l|c|r)\-(l|r)\-(t|c|b)(l|c|r)\-(t|c|b)(l|c|r)/.test(format)) {
      return this.inherited(arguments);
    }
    var
      labelBox, labelRefBox,
      domNode= this.domNode,
      mb= bd.mix(dojo.marginBox(domNode), {t:0, l:0}),
      label= this.label.length && this.label,
      labelNode= label && this.domNode.firstChild,
      labelPosit= format.substring(8),
      child= this.children[0],
      childNode= child && child.domNode,
      childBox= childNode && dojo.marginBox(childNode),
      childPosit= format.substring(0, 5);
    if (childNode) {
      childBox.t= bd.css.cornerCalculators.getTop(childPosit, childBox, mb);
      childBox.l= bd.css.cornerCalculators.getLeft(childPosit, childBox, mb);
      dojo.marginBox(childNode, childBox);      
    }
    if (format.charAt(6)=="l") {
      labelRefBox= {t:mb.t, h:mb.h, l:childBox.l+childBox.w, w:mb.w-childBox.l-childBox.w};
    } else {
      labelRefBox= {t:mb.t, h:mb.h, l:0, w:childBox.l};
    }
    if (label && labelPosit) {
      dojo.style(labelNode, {position:"absolute", width:labelRefBox.w+"px"});
      labelBox= dojo.marginBox(labelNode);
      labelBox.t= bd.css.cornerCalculators.getTop(labelPosit, labelBox, labelRefBox);
      labelBox.l= bd.css.cornerCalculators.getLeft(labelPosit, labelBox, labelRefBox);
      dojo.marginBox(labelNode, labelBox);
    }
    return mb;
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

