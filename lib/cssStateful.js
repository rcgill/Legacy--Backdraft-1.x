define("bd/cssStateful", [
  "bd"
], function(bd) {
///
// Defines the bd.cssStateful class.

bd.cssStateful= bd.declare(
  ///
  // Mixin class for widgets that mirror certain attribute values in a DOM node class attribute.
  ///
  // The machinery provided by this mixin watches the set of attributes given in the cssStatefulWatch hash
  // and when a change to any attribute is detected, the DOM class attribute for `this.stateNode` or `this.domNode` is
  // recalculated and set to reflect the changed attribute value(s).
  // 
  // The class attribute (call this the "class string") calculation formulates a set of state classes that
  // reflect the value of the watched attributes.  The set begins with the classes in cssStatefulBases. Then,
  // the set of state classes is aggregated to form a valid class string as follows:
  // 
  // * If the value of a particular watched attribute is 0 in the cssStatefulWatch hash, then the state class
  //   associated with that attribute as calculated by cssStatefulGet (if any) is added to the class string.
  // 
  // * If the value of a particular watched attribute is a positive integer in the cssStatefulWatch hash, then the state class
  //   returned by cssStatefulGet is multiplied with any other watched attribute state classes that are also designated to be
  //   multiplied. Multiplied means that every possible combination of attributes is calculated. The value of a particular
  //   attribute in the cssStatefulWatch hash gives the order of combined state classes.
  // 
  // For an example, if a particular class defines...
  //code
  // csssStateBases: {navigateable:0, coolWidget:1}
  // cssStatefulWatch: {focus:0, state:2, readOnly:3}
  ///
  // And cssStatefulGet returns state classes focus->"focus", state->"Error", readOnly->"ReadOnly", then the class string would
  // be
  //code
  // "navigateable focus coolWidget Error coolWidgetError ReadOnly coolWidgetReadOnly ErrorReadOnly coolWidgetErrorReadOnly"
  ///
  // Notice how the values associated with items in cssStatefulBases and cssStatefulWatch completely determine what is multiplied
  // and the order of individual class states in multiplied items.
  //
  // The machinery is careful not to change components of the class string that it does not control.
  //warn
  // This class requires a postscript process to properly find and connect all non-trivial connection points. Often,
  // this class is used in a hierarchy that includes bd.visual which includes a sufficient postscript process. If
  // you are using this class in a derivation chain where no other class includes a postscript, then ensure that bd.cssStateful.create is
  // applied during the creation process.
  
  //superclasses
  [],

  //members
  {
  cssStatefulBases: 
    ///
    // A hash of class names to add to the class string unconditionally. //A value of zero indicates the particular class name
    // should not be multiplied; a positive value indicates the position relative to other multiplied class names in the class
    // string. See bd.cssStateful.
    {},

  cssStatefulWatch: 
    ///
    // A hash of the attributes to watch. //A value of zero indicates the class name (as returned by `this.cssStatefulGet`)
    // should not be multiplied; a positive value indicates the position relative to other multiplied class names in the class
    // string. See bd.cssStateful. See bd.cssStateful. See bd.visual.cssStatefulWatch for an example.
    {},

  cssStatefulSet: 
    ///
    // The current set of class names that have been added to the class attribute of the DOM node.
    //private
    //nosource
    [],

  postcreateDom: function() {
    ///
    // Initializes the class attribute of the DOM node with the class names this instance controls.
    this.inherited(arguments);  
    bd.forEachHash(this.cssStatefulWatch, function(mx, attribute) {
      this.watch(attribute, "cssStatefulSetClass", this, attribute);
    }, this);
    // Set state initially; the mouse states are almost-certainly unpredictable until the mouse is moved *after*
    // the new DOM tree is present.
    this.cssStatefulSetClass();
  },

  cssStatefulGet: function(
    name, //(string) Attribute name.
    value //(any) The result of this.get(name).
  ) {
    ///
    // Return the class state (i.e., the class name) for the attribute `name` with value `value`. //`value` is the current value
    // of the attribute, but the class state may depend on more than just this item. Falsy implies
    // the attribute does not currently have a class state.
    // 
    // Client classes may override this member in order to expand or change computation of particular attributes.
    //return
    //(string) The class state of attribute `name`;
    //(falsy) There is currently no class state for attribute `name`.
    switch (name) {
      case "visible":
        return !value && "Hidden";

      case "rtl":
        return !this.isLeftToRight() && "Rtl";

      case "selected":
        return value && "Selected";

      case "disabled":
        return value && "Disabled";

      case "readOnly":
        return value && "ReadOnly";

      case "focused":
        return value && "Focused";

      case "active":
        return value && "Active";

      case "hover":
        return value && (this.cssStatefulWatch.active===undefined || !this.get("active")) && "Hover";

      default:
        //e.g., this.state
        return value && value;
    }
  },

  cssStatefulSetClass: function(){
    ///
    // Sets the class attribute on `this.stateNode` or `this.domNode` to reflect the current value of
    // the watched attributes. //Components in the class attribute that are not controlled by this
    // machinery are not affected. See bd.cssStateful.
    //note
    // Typically, client do not apply this method directly (although such an application would be harmless). Instead,
    // this method is applied automatically upon modification of a watched attribute.
    var 
      states= [],
      mxStates= [];
    bd.forEachHash(this.cssStatefulBases, function(order, base) { 
      if (order) {
        mxStates.push([base, order]);
      } else {
        states.push(base);
      }
    });
    bd.forEachHash(this.cssStatefulWatch, function(order, attribute) {
      var 
        value= this.get(attribute),
        state= this.cssStatefulGet(attribute, value);
      if (state) {
        if (order) {
          mxStates.push([state, order]);
        } else {
          states.push(state);
        }
      }
    }, this);

    //do any multiplication
    var result= [];
    bd.forEach(mxStates.sort(function(lhs, rhs) { return lhs[1]-rhs[2]; }), function(item) {
      var state= item[0];
      result= result.concat(bd.map(result, function(existing) { return existing + state; }), state);
    });
    states= states.concat(result);

    // Remove old state states and add new ones.
    // For performance concerns we only write into domNode.className once.
    var 
      node= this.stateNode || this.domNode,
      classString= bd.trim(node.className),
      classHash= {};

    // get set of all classes (state and otherwise) for node
    if (classString) {
      bd.forEach(node.className.split(" "), function(item) { classHash[item]= 1; });
    }

    // delete all the states previously set
    bd.forEach(this.cssStatefulSet, function(item) { delete classHash[item]; });

    // add all the states just calculated
    bd.forEach(states, function(state) { classHash[state]= 1; });

    // convert to a proper class string and set
    node.className= bd.mapHash(classHash, function(value, name) { return name; }).join(" ");

    // remember what we just did for the next time
    this.cssStatefulSet= states;
  }
});

});
