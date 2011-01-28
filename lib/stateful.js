define("bd/stateful", [
  "bd", 
  "bd/lang", 
  "bd/collections", 
  "bd/connect"
], function(bd) {
///
// Defines the class bd.stateful and associated machinery.

bd.stateful= bd.declare(
  ///
  // Mixin class that provides getters and watchable setters.
  ///
  // The method bd.stateful.watch allows clients to register a callback that is applied when any or a particular
  // attribute value is modified. In order for this machinery to work, clients must use the bd.stateful.get
  // and bd.stateful.set methods instead of calling getter/setter methods directly.
  //note
  // We use the term "attribute" to denote some quality or aspect representable by a value defined by a class instance.
  // A particular attribute may be only readable, only writable (highly unusual), or both. Although an attribute is almost
  // always implemented as a per-instance property value, this need not be the case. For example, interactive Backdraft
  // widgets define the attribute "focusable" that indicates whether or not a particular widget instance is capable
  // of accepting the keyboard focus. For Backdraft widgets, focusable is a read-only property that is calculated based
  // on the values of other properties (e.g., visible, disabled, etc.) and there is no JavaScript property "focusable"
  // that is explicitly defined and maintained within Backdraft widget instances.
  //warn
  // Clients of a particular class inteface must access attributes through the `get` and `set` methods to make the
  // design work. In particular, clients should use ```some-instance``.set(``some-attribute``, ``some-new-value``)`
  // since calling the setter directly (e.g., ```some-instance``.``some-attribute``Set(``some-new-value``)`)
  // *will not* cause the watcher callbacks to be applied.
  /// 
  // For class implementators, a getter is defined by a method named ```name``Get` that returns the
  // current value of the attribute ```name```. Typically, the attibute is a property of the same
  // name, but this is not required.
  // 
  // Similarly, a setter is defined by a method named ```name``Set` that accepts a single argument, ```value```. The
  // methods sets the value of the attribute ```name``` as given by the argument and returns the previous 
  // value. Typically, operator= is used to set the new value, but this is not required and there is no 
  // restriction on additional semantics defined by any particular setter.
  // 
  // The helper function bd.attr and bd.constAttr are available to help define getters and
  // setters in bd.declare'd classes.
  // 
  // The getter/setter methods are designed to be protected methods for use by class implementors, although
  // the notion of a "protected" method is not defined in JavaScript.
  ///
  //note
  // This code inspired by and derived from dojo.Stateful.
  //warn
  // The signature of the watcher callback function is different than the dojo version. Dojo passes `(name,
  // oldValue, newValue)` whereas Backdraft passes `(newValue, oldValue)` for named setter watchers and `(name,
  // newValue, oldValue)` for wildcard setter watchers.

  //superclasses
  [],

  //members
  {
  
  get: function(
    name //(string) The attribute name.
  ) {
    ///
    // Get the value of the attribute identified by name.
    name+= "Get";
    return this[name] && this[name]();
  },

  set: function(
    name, //(string) The attribute name.
    value //(any) The value to set name.
  ) {
    ///
    // Set the value of the attribute identified by name with value and return the old value.
    ////
    // If the oldValue!==value, then all watchers watching the named attribute are applied.
    bd.docGen("overload",
      function(
        changeSet //(hash name --> value(any)) A set of (name, value) pairs to set.
      ) {
        ///
        // Syntactic sugar for `bd.forEachHash(changeSet, function(value, name) { ``instance``.set(name, value); }`.
        // Returns this.
      }
    );
    if (bd.isObject(name)) {
      forEachHash(name, function(value, name) { this.set(name, value); }, this);
      return this;
    }
    if (this.has(name)==2) {
      //the dijit focus manager unconditionally calls widget.set("focused", true)
      //TODO submit dojo RFE for this behavior
      var oldValue= this[name + "Set"](value);
      oldValue!==bd.failed && oldValue!==value && this.adviseWatchers(name, oldValue, value);
      return oldValue;
    } else {
      return undefined;
    }
  },

  has: function(
    name //(string) The attribute name.
  ) {
    ///
    // Predicate that says if the instance has a particular property.
    //return
    //(2) The instance has a setter(which canonically implies it has a getter)
    //(1) The instance has a getter but no setter
    //(0) The instance has neither a getter nor a setter.
    return (this[name+"Set"] ? 2 : (this[name+"Get"] ? 1 : 0));
  },

  adviseWatchers: function(
    name,     //(string) Name of the attibute that changed via `set`.
    oldValue, //(any) The value of the attribute before the change.
    newValue  //(any) The value of the attribute after the change.
  ) {
    ///
    // Advises all watchers of the attribute ```name``` that it's value changed.
    var watchers= this.watchers;
    if (watchers) {
      if (watchers[name]) {
        bd.forEachHash(watchers[name], function(callback) {
          try {
            callback(newValue, oldValue);
          } catch(e) {
            console.error(e);
          }
        });
      }
      if (watchers["*"]) {
        bd.forEachHash(watchers["*"], function(callback) {
          try {
            callback(name, newValue, oldValue);
          } catch(e) {
            console.error(e);
          }
        });
      }
    }
  },

  watch: function(
    name,       //(string) The attribute name to watch; "*" indicates all names.
    callback,   //(function) Function to apply upon change of name.
    context,    //(object, optional) Context in which to apply callback.
    vargs       //(variableArgs, optional) Zero or more arguments for application of callback.
  ) {
    ///
    // Causes callback to be applied if one (`name` is a attribute name) or all properties (`name` is "*") change value via
    // `set`.
    ///
    // As with all Backdraft functions that take a callback-like function argument, `(callback, context, vargs)`
    // is transformed to `bd.hitch(context, callback, arg1, arg2, ...)`.
    ///
    // Returns a bd.connect.handle that may be used to disconnect the watch. context.adviseEventWatcher is called iff it
    // exists. See bd.connect and bd.connect.handle for details.
    //
    //warn
    // watch will *not* notify any changes that are not applied via the `set` method.
    var 
      transformedCallback= bd.hitchCallback(arguments, 1),
      watchers= this.watchers || (this.watchers= {}),
      watchList= watchers[name] || (watchers[name]= {}),
      watchId= bd.uid();
    watchList[watchId]= transformedCallback;
    return new bd.connect.handle(this, "watch", context, callback, [this, name, watchId], bd.disconnectWatch);
  }
});

bd.disconnectWatch=
  function(
    handle //([source-object, attribute-name, watch-id]) Handle returned by bd.stateful.watch.
  ) {
    // Disconnect the watch previously connected by bd.stateful.watch.
    var watchers= handle[0].watchers[handle[1]];
    delete watchers[handle[2]];
  };

});
