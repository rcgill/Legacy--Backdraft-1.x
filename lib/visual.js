define("bd/visual", [
  "bd",
  "dojo",
  "dojo/i18n",
  "bd/creatable",
  "bd/id",
  "bd/stateful",
  "bd/connectable",
  "bd/cssStateful",
  "bd/containable"
], function(bd, dojo) {
///
// Defines the bd.visual class and associated machinery.

bd.domAttr= function(
  name,         //(string) The property name.
  defaultValue, //(any) The initial value for the attribute; undefined indicates no value should be set.
  target,       //(string) attribute in node is given by this.domNode.target
                //(pair of [domNode, target]) attribute in node is given by this[target[0]].[target[1]]
                //(single of [domNode]) attribute in node is given by this[target[0]].[name]
                //(falsy) attribute in node is given by this.domNode[name]
  setter,       //(function(newValue), optional, see description) Function that sets the property to newValue and returns the previous value.
  getter        //(function(), optional, see description) Function that returns the current value of property.
) {
  ///
  // Similar to bd.attr except that the attibute is a DOM attribute on the DOM node implied by target.
  ///
  // See bd.attr and bd.stateful for more details on getters and setters.

  // argument juggle
  var nodeName= "domNode";
  if (bd.isArray(target)) {
    nodeName= target[0];
    target= target.length==2 ? target[1] : name;
  } else if (!bd.isString(target)) {
    target= name;
  }

  var 
    result= {},
    setterName= name + "Set",
    getterName= name + "Get";
  result[name]= defaultValue;
  result[setterName]= setter || function(value) {
    var
      node= this[nodeName],
      oldValue= this[name];
    if (node) {
      if (value===undefined) {
        node && node.removeAttribute(target);
      } else {
        node.setAttribute(target, value);
      }
    }
    this[name]= value;
    return oldValue;
  };
  result[getterName]= getter || function() {
    return this[name];
  };
  return result;
};

bd.constDomAttr= function(
  name,         //(string) The property name.
  defaultValue, //(any) The initial value for the property.
  target,       //(string) attribute in node is given by this.domNode.target
                //(pair of [domNode, target]) attribute in node is given by this[target[0]].[target[1]]
                //(single of [domNode]) attribute in node is given by this[target[0]].[name]
                //(falsy) attribute in node is given by this.domNode[name]
  getter        //(function(), optional, see description) Function that returns the current value of property.
) {
  ///
  // Similar to bd.domAttr except that no setter is defined
  var result= bd.domAttr(name, defaultValue, target, 0, getter);
  delete result[name + "Set"];
  return result;
};

bd.visual= bd.declare(
  ///
  // Base class for a Backdraft widget.
  ///
  // A Backdraft class with a visual presentation that is creatable by bd.createWidget is termed a Backdraft
  // widget, and this class is designed to be used as the base class to build such classes. The key requirement
  // of a backdraft widget is that it must be constructable with a single argument of type bd.createWidget.kwargs and must be
  // findable via the widget registry (bd.object.registry). The widget registry requirement implies widgets must
  // contain a page-unique identifier.
  /// 
  // Although not required, a few more features are almost-always desired:
  // 
  //   * the features of bd.stateful
  //   * the features of bd.id
  //   * the features of bd.connectable
  //   * the features of bd.cssStateful
  //   * the features of bd.containable
  //   * a visual presentation via a DOM subtree
  // 
  // This class provides these features by deriving from the above-mentioned classes and
  // providing foundational machinery for creating and controlling a DOM subtree.
  //note 
  // Backdraft widgets need not include a DOM presentation--it is perfectly accepable and
  // useful to define widget classes that work as controller/processing automatons within the widget tree of an application.
  //note
  // It is not a requirement that a Backdraft widget is derived from this class. Other widget systems (e.g., Dojo's dijit
  // widgets) can be lightly wrapped to allow for creation by bd.createWidget.

  //superclasses
  [bd.creatable, bd.id, bd.stateful, bd.connectable, bd.cssStateful, bd.containable], 

  //members
  bd.attr(
    ///
    //(string) The name associated with this widget instance.
    ///
    // The name associated with this widget. //Typically, names are not page-unique, but rather are unique among siblings.
    "name", 
    
    "" //default value
  ), 

  bd.attr(
    ///
    //(boolean) true if this widget is visible; false otherwise.
    ///
    // Controls the presence of CSS state 'hidden' in the cssStateful string. //If true, 
    // then the cssStateful class toggles the state `hidden` off, and conversely. So
    // long as an appropriate CSS style sheet is loaded, this will control whether or not
    // the DOM subtree is visible. Attempting to set visible to false when the DOM subtree
    // has the focus or is selected will fail and result in a no-op.
    "visible", 

    true, //default value

    function(value) { //setter
      value= !!value;
      var oldValue= this.visible;
      if (oldValue!==value) {
        if (!value) {
          if (this.get("focused")) {
            dojo.onError("trying to hide a widget with the focus", [this]);
            return bd.failed;
          }
          if (this.get("selected")) {
            this.set("selected", false);
          }
        }
        this.visible= value;
      }
      return oldValue;
    }
  ),

  bd.constDomAttr(
    ///
    //(string) The DOM `lang` attribute.
    //(undefined) The DOM `lang` attribute is not set.
    ///
    // The DOM `lang` attribute for this.domNode.
    "lang"
  ), 
  
  bd.domAttr(
    ///
    //(string) The DOM `title` attribute.
    //(undefined) The DOM `title` attribute is not set.
    ///
    // The DOM `title` attribute for this.domNode.
    "title"
  ), 

  bd.domAttr(
    ///
    //(string) The DOM `class` attribute.
    ///
    // The DOM `class` attribute for this.domNode.
    ///
    // Setting a new class value results in removing the old class value from this.domNode. However,
    // manipulating the class value through this attribute will not affect other classes that have been
    // set on the DOM node through other means. For example, assuming `o` is a bd.visual-derived instance
    // variable that currently has no class attribute,
    //code
    // o.set("class", "myClass");
    // dojo.addClass(o.domNode, "someOtherClass");
    // dojo.getClass(o.domNode); //returns "myClass someOtherClass"
    // o.set("class", "myOtherClass");
    // dojo.getClass(o.domNode); //returns "myOtherClass someOtherClass"
    "class", 

    undefined, //default value

    0, //target is domNode

    function(value) { //setter
      var 
        node= this.classNode || this.domNode,
        oldValue= this["class"];
      if (node) {
       dojo.removeClass(node, oldValue);
       value && dojo.addClass(node, value);
      }
      this["class"]= value;
      return oldValue;
    }
  ),
 
  bd.domAttr(
    ///
    //(string) For the setter, a DOM style string suitable for `dojo.style`.
    //(hash)  For the setter, a hash of DOM style attributes suitable for `dojo.style`.
    //(string) For the getter, a DOM style cssText string.
    ///
    // The DOM `style` attribute.
    "style",

    undefined, //default value

    0, //target is domNode

    function(value) { //setter
      var 
        node= this.styleNode || this.domNode,
        oldValue= this.style;
      if (node) {
        if (bd.isString(value)) {
          if (node.style.cssText) {
            node.style.cssText += "; " + value;
          } else {
            node.style.cssText = value;
          }
        } else if (value) {
          dojo.style(node, value);
        }
      }
      this.style= node.style.cssText;
      return oldValue;
    }
  ),

  bd.constAttr(
    ///
    //(boolean) true is the widget or any of its decendents will not react to any user input; false otherwise.
    ///
    // True indicates the widget is either incapable of reacting, or, because of its current state, will not react to *any* user
    // input; false indicates the widget is capable of and will react to some kinds of user interaction (typcially, keyboard or mouse);
    //note
    // Since bd.visual does not define any kind of user interaction, it is always disabled. Classes derived from
    // bd.visual will often override this constant value and provide the setter.
    "disabled", 

    true //constant value
  ),

  bd.constAttr(
    ///
    //(boolean) false is the widget and all of its decendents has/have no use for the focus; true otherwise.
    ///
    //note
    // Since bd.visual does not define any kind of user interaction, focusable is always false. Classes derived from
    // bd.visual will often override this constant value and provide the setter.
    "focusable", 

    false //constant value
  ),

  bd.constAttr(
    ///
    //(boolean) true if this widget has the focus; false otherwise.
    ///
    // The focused attribute is not used to set the focus: it is strinctly a read-only attribute. Use the method `focus`
    // to set the focus to a particular widget instance.
    "focused", 

    false //constant value
  ),

  bd.constDomAttr(
    ///
    //(string) The DOM `dir` attribute.
    //(undefined) The DOM `dir` attribute is not set.
    ///
    // The DOM `dir` attribute for this.domNode.
    "dir", 
  
    undefined, //default value

    0,

    function() {
	    return (this.dir ? this.dir : (dojo._isBodyLtr() ? "ltr" : "rtl"));
    }
  ),

  {
  initAttrs:
    ///
    // (set) Gives the set of attributes to initialize during DOM creation.
    ///
    // The set of attributes to create when the root DOM node is created. //For every key in initAttrs, an attribute
    // of that name is created with the value `this[key]`. For example, if initAttributes is {dir:1, lang:1}, then
    // attributes are set as follows in the createDom phase of construction:
    //code
    // if (this.dir!==undefined) this.domNode.setAttribute("dir", this.dir);
    // if (this.lang!==undefined) this.domNode.setAttribute("lang", this.lang);
    ///
    // Notice that, as with all sets, the values of the properties in the object are ignored.
    {dir:1, lang:1, "class":1, style:1, title:1},

  cssStatefulWatch: 
    ///
    // The list of attributes for cssStateful to watch. //This is frequently
    // overridden by subclasses.
    {visible:0, disabled:0, focused:0},

  kwargs:
    ///
    // The argument passed to the constructor. //Although the constructor stores the argument passed into this
    // attribute, subclasses are free to discard part or all of this object during create processing.
    bd.nodoc,

  domNode:
    ///
    // The root DOM node controlled by each instance.
    0,

  createDom: function() {
    ///
    // Creates a DOM div node. //Initializes the node with attributes given by the method `getCreateDomAttributes`.
    this.domNode= dojo.create('div', this.getCreateDomAttributes());
  }
});

});
// Copyright (c) 2008-2010, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
