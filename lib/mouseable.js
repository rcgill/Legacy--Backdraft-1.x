define("bd/mouseable", [
  "bd", 
  "dojo",
  "bd/interactive",
  "bd/async", 
  "dojo/window"
], function(bd, dojo) {
///
// Defines the bd.mouseable class.

bd.mouseable= bd.declare(
  ///
  // Mixin class for objects that interact with the mouse. //Defines the attributes `hover`
  // `mouseDown`, and `active` as well as connection points for all DOM mouse events.
  //
  // The implementation watches the Backdraft global capture state as well
  // as the `disabled` attribute (if any), thereby preventing mouse feedback when another object has 
  // captured the mouse or when the instance is disabled. If the `disabled` attribute is toggled
  // true while the mouse is hovering, down, and/or active, then all of these states are unconditionally
  // and automatically set false upon detection.
  //
  //warn
  // This class assumes it will be mixed with bd.connectable for connection handle management.

  //superclasses
  [bd.interactive],

  //members
  bd.makeDeferredConnects(
    ///
    // Declares connection points.
    //note
    // These will almost always be redefined in leaf classes.
    {
    onClick:["click", "domNode"],
    onDblClick:["dblclick", "domNode"],
    onMouseMove:["mousemove", "domNode"],
    onMouseDown:["mousedown", "domNode"],
    onMouseOut:["mouseout", "domNode"],
    onMouseOver:["mouseover", "domNode"],
    onMouseLeave:["mouseleave", "domNode"],
    onMouseEnter:["mouseenter", "domNode"],
    onMouseUp:["mouseup", "domNode"]
  }),

  bd.constAttr(
    ///
    //(boolean) true if the mouse is over this widget; false otherwise.
    ///
    // Returns true if the mouse is currently over the DOM subtree defined by this object. //By default, the subtree
    // is rooted at `this.domNode`; however, this can be controlled through the deferredConnects property.

    "hover", false
  ),

  bd.constAttr(
    ///
    //(boolean) true if a mouse button was pressed while over this widget; false otherwise.
    ///
    // Returns true if a mouse button is depressed with the mouse currently over the DOM subtree defined by this object. //By default, the subtree
    // is rooted at `this.domNode`; however, this can be controlled through the deferredConnects property.

    "mouseDown", false
  ),

  bd.constAttr(
    ///
    //(boolean) true if the mouse is over this widget and a mouse button is pressed; false otherwise.
    ///
    // Returns true if the mouse is currently over the DOM subtree defined by this object and a mouse button is depressed. //By default, the subtree
    // is rooted at `this.domNode`; however, this can be controlled through the deferredConnects property.

    "active", false
  ),

  {
    mouseableMouseupHandle: 0,

    precreateDom: function() {
      ///
      // Initializes watchers for the Backdraft global capture state and this object's disabled attribute.
      this.inherited(arguments);
      bd.subscribe("bd/mouse/captured", "onMouseCapture", this);
      this.watch("disabled", function(value) {
        !value && this.resetMouseState();
      }, this);     
    },

    resetMouseState: function() {
      ///
      // Unconditionally sets the `hover`, `active`, and `mouseDown` attributes false.
      this.set("hover", false);
      this.set("active", false);
      this.set("mouseDown", false);
      this.mouseableMouseupHandle && this.mouseableMouseupHandle.disconnect() && (this.mouseableMouseupHandle= 0);
    },
   
    onMouseCapture: function(
      by //(any) The object that captured th mouse
    ) {
      ///
      // Triggered when any object captures the mouse via the Backdraft capture machinery (see bd.mouse).
      // `connectionPoint
      by!==this && this.resetMouseState();
    },

    onMouseDown: function(
      e //(DOM event object) The event object associated with the mousedown DOM event.
    ) {
      ///
      // Triggered when mousedown event is detected on the DOM subtree controlled by this object. //Sets the `active`
      // and `mouseDown` attributes to true iff this object is not disabled.
      // `connectionPoint
      if (!this.get("disabled")) {
        this.set("active", true);
        this.set("mouseDown", true);
        this.mouseableMouseupHandle= bd.connect(bd.body, "onmouseup", "onMouseUp", this);
      }
    },

    onMouseUp: function(
      e //(DOM event object) The event object associated with the mouseup DOM event.
    ) {
      ///
      // Triggered when mouseup event is detected on the DOM subtree controlled by this object. //Sets the `active`
      // and `mouseDown` attributes to false.
      // `connectionPoint
      if (!this.get("disabled")) {
        this.set("active", false);
        this.set("mouseDown", false);
        this.mouseableMouseupHandle && this.mouseableMouseupHandle.disconnect() && (this.mouseableMouseupHandle= 0);
      }
    } ,

    onMouseOver: function(
      e //(DOM event object) The event object associated with the mouseover DOM event.
    ) {
      ///
      // Triggered when mouseover event is detected on the DOM subtree controlled by this object. //Sets the `hover`
      // attribute to true iff this object is not disabled.
      // `connectionPoint
      if (!this.get("disabled")) {
        this.set("hover", true);
      }
    },

    onMouseOut: function(
      e //(DOM event object) The event object associated with the mouseout DOM event.
    ) {
      ///
      // Triggered when mouseout event is detected on the DOM subtree controlled by this object. //Sets the `hover`
      // and `active` attributes to false.
      // `connectionPoint
      if (!this.get("disabled")) {
        this.set("hover", false);
        this.set("active", false);
      }
    },

    onMouseEnter: function(
      e //(DOM event object) The event object associated with the mouseenter DOM event.
    ) {
      ///
      // Clients chould not connect to this event; connect to the onMouseOver event instead.
      // `connectionPoint
      // `private
      this.onMouseOver(e);
    },

    onMouseLeave: function(
      e //(DOM event object) The event object associated with the mouseleave DOM event.
    ) {
      ///
      // Clients chould not connect to this event; connect to the onMouseOut event instead.
      // `connectionPoint
      // `private
      this.onMouseOut(e);
    },

    hoverSet: function(
      value
    ) {
      // private; not defined using bd.attr since this attribute is settable only via this class's internal machinery.
      var oldValue= this.value;
      value!=oldValue && (this.hover= value);
      return oldValue;
    },

    mouseDownSet: function(
      value
    ) {
      // private; not defined using bd.attr since this attribute is settable only via this class's internal machinery.
      var oldValue= this.value;
      value!=oldValue && (this.mouseDown= value);
      return oldValue;
    },

    activeSet: function(
      value
    ) {
      // private; not defined using bd.attr since this attribute is settable only via this class's internal machinery.
      var oldValue= this.value;
      value!=oldValue && (this.active= value);
      return oldValue;
    }
  }
);

});
