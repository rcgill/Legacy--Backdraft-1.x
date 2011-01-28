define("bd/navigator", [
  "bd", 
  "dijit",
  "bd/focusable"
], function(bd, dijit) {
///
// Defines the class bd.navigator and associated machinery.

bd.navigator= bd.declare(
  ///
  // Mixin class that defines machinery for sequencing focus within a tree of container widgets.
  ///
  // This class allows sophisticated control over the movement of the focus upon reception of a navigate
  // command--usually consequent to pressing the tab key or other accelerators or toolbar/menu items.
  //
  // This class is intended to be mixed into classes that contain multiple children and controls the movement of the focus
  // between the children and the parent. The children may themselves be containers with several navigable children, just as the
  // parent may contain multiple containers with navigable children that are siblings of an instance of this class.
  //
  // The default algorithm as provided in bd.navigator.navigate attempts to find a child to which to pass the focus given a navigation command and
  // the current state. If such a child is found, and that child is also a bd.navigator, then further processing is delegated to that
  // child object; otherwise, focus is simple set to the child. If no such child is found, then processing is delegated to the parent (if any). If no
  // parent is found, then the trigger event may be ignored, thereby allowing the browser to navigate out of the document via default processing.
  // Notice in particular that this machinery allows applications to "trap" the focus inside the document for tab key navigation.
  //
  // Finally, the default algorithm includes several hooks where state-dependent navigation decisions can be made. For example, a common user-interface
  // paradigm includes a "yes/no" radio button followed by an "if yes, comment" field. The container of the radio button and comment field can choose
  // or skip the comment field depending on the value of the radio button.
  //
  // This class requires much of the interface defined by bd.focusable, and typically it will be mixed into classes that also mix bd.focusable. However
  // the design does *not* derive from bd.focusable to allow greater flexibility to class designers.

  // superclasses
  [bd.focusable],

  //members
  bd.constAttr(
    ///
    //(boolean) true is a child contolled by this object can recieve the focus; false otherwise.
    ///
    // Returns true if this object can receive the focus; false otherwise. //The 
    // calculation requires the object must be visible, not disabled, and 
    // have at least one child that is focusable.

    "focusable", 

    bd.noValue, // The value is always calculated, never stored.

    function() { //getter
      return this.get("visible") && !this.get("disabled") && bd.some(this.getChildren(), function(child) { return child.get("focusable"); });
    }
  ),

//TODO: make sure the dijit widgets all include the getter focusable

  bd.attr(
    ///
    //(bool) true if navigation should cycle within the children controlled by this navigator; false otherwise.
    ///
    // Causes the following calculations in bd.navigator.navigate:
    // 
    // * If truthy and a "previous" navigate command is given, cycle to the last child if currently on the first child.
    // * If truthy and any other navigate command is given, cycle to the first child is currently on the last child.
    // * Otherwise, delegate to the parent upon navigating beyond the first or last children.
    //
    // See bd.navigator.navigate.
    
    "cycleNavigation", false
  ),

  {
  lastFocused: 
    ///
    // (object) Holds the child that last had the focus (if any).
    null,

  onFocus: function() {
    ///
    // Connection point for receiving the focus. //Nontrivial handler hooks up machinery to remember that last child
    // that had the focus and select a when the container gets the focus.
    if (this.focusableGet()) {
      //if getting the focus by clicking on the container but not the contained widget, then delegate to the contained widget...
      this.focusWatcher= bd.subscribe("widgetFocus", function(widget) {
        // records this.lastFocused as widget iff widget is a child of this container.
        for (var children= this.getChildren(), i= children.length; i--;) {
          if (widget===children[i]) {
            this.lastFocused= widget;
            return;
          }
        }
      }, this);
      bd.back(dijit._activeStack)===this.id && this.navigate(bd.command.createEvent({id:"lastFocused"}));
    } else {
      //should never get here; ping the parent in hopes that it will take our focus away
      this.parent.focus();
    }


  },

  onBlur: function() {
    // Connection for called when this DOM subtree loses the focus as triggered by the dijit focus manager.
    // `connectionPoint
    this.focusWatcher && this.focusWatcher.disconnect();
    this.inherited(arguments);
  },

  onNavigateBefore: function(
    navState //(bd.navigator.eventObject) The object consequent to this navigation.
  ) {
    // Connection point to advise that a navigation move has been calculated. //`navState` may be modified
    // to affect the navigation; see bd.navigator.navigate.
  },

  onNavigateAfter: function(
    navState //(bd.navigator.eventObject) The object consequent to this navigation.
  ) {
    // Connection point to advise that a navigation move has occured. //`navState` should not be modified
    // and will not affect the navigation; see bd.navigator.navigate.
  },

  navigate: function(
    commandEventObject, //(bd.command.eventObject) The command that is demanding the navigation.
    next                //(object, optional, undefined) The next object to get the focus.
  ) {
    ///
    // Computes and executes the navigation command implied by commandEventObject, next,  and the current state of the application. //The default
    // algorithm is as follows:
    // 
    // 1. Initialize a bd.navigator.eventObject for use in the remaining steps.
    // 2. If next was not hard-set, select next via `this.selectNextActive`.
    // 3. If next is still undefined and cycle is true, then define next as the appropriate endpoint (see bd.navigator.cycle).
    // 4. If next is still undefined and an ancestor exists that is a navigator, delegate to that parent.
    // 5. If next is still undefined, return false to indicate the command was not handled.
    // 6. Otherwise, trigger the onNavigatorBeforeMove event; this event may change or cancel the navigation.
    // 7. Unless cancled, execute the navigation by moving the focus and trigger the onNavigatorAfterMove.
    //

    // find the current child
    for (var p= null, lastChild= null, activeStack= dijit._activeStack, i= activeStack.length; i-- && p!==this;) {
      lastChild= p;
      p= bd.object.get(activeStack[i]);
    }

    var navState= {
      currentChild: lastChild,
      currentFocusNode: dijit._curFocus,
      next: next,
      nextFocusNode: null,
      commandEventObject: commandEventObject,
      cancel: false
    };
    
    if (!navState.next) {
      this.selectNextActive(navState);
    }

    if (!navState.next &&  this.cycleNavigation) {
      var navCommand= commandEventObject.id;
      commandEventObject.id= (navCommand==="previous" ? "end" : "home");
      this.selectNextActive(navState);
      commandEventObject.id= navCommand;
    }

    if (!navState.next) {
      return this.delegateNavigate(commandEventObject);
    }

    this.onNavigateBefore(navState);
    if (navState.cancel || (navState.next===navState.currentChild && navState.nextFocusNode===navState.currentFocusNode)) {
      return true;
    }

    navState.next.focus();

    navState= {
      previous: navState.currentChild,
      previousFocusNode: this.currentFocusNode,
      current: navState.next,
      currentFocusNode: dijit._curFocus,
      commandEventObject: commandEventObject
    };
    this.onNavigateAfter(navState);

    return true;
  },

  delegateNavigate: function(
    commandEventObject //(bd.command.eventObject) The command that is demanding the navigation.
  ) {
    ///
    // Finds an ancester that contains a `navigate` method and, if found, applies that (ancestor, method) to commandEventObject.
    var parent= this.parent;
    while (parent && !parent.navigate) {
      parent= parent.parent;
    }
    if (parent && parent.navigate) {
      return parent.navigate(commandEventObject, this);
    } else {
      return false;
    }
  },

  selectNextActive: function(
    navState
  ) {
    ///
    // Selects the next child to get the focus given the navigate command. //The algorithm is given as follows:
    //
    // If a child controlled by the navigator currently has the focus, then,
    // 
    // 1. When the command==="next", select the next child according to tabIndex.
    // 2. When the command==="previous", select the previous child according to the tabIndex.
    // 
    // Otherwise,
    // 
    // 1. When the command is "next" or "home", select the child with the least tabIndex.
    // 2. When the command is "previous" or "last", select the child with the highest tabIndex.
    // 
    var movementCommand= navState.commandEventObject.id;
    if (!navState.currentChild) {
      //next/prev selects home/end of children when not already on a child
      movementCommand= movementCommand==="next" ? "home" : (movementCommand==="previous" ? "end" : movementCommand);
    }
    var f= this.selectors[movementCommand];
    f && f.call(this, navState);
  },

  find: function(
    currentTabIndex,
    condition
  ) {
    // helper that applies condition to all children; bd.navigator.selectors.
    var
      candidateWidget= null,
      candidateTabIndex= null;
    bd.forEach(this.children, function(child) {
      if (child.get && child.get("focusable")) {
        var tabIndex= child.get && child.get("tabIndex");
        if (tabIndex && condition(currentTabIndex, candidateTabIndex, tabIndex)) {
          candidateTabIndex= tabIndex;
          candidateWidget= child;
        }
      }
    });
    return candidateWidget;
  },

  selectors: {
    // helpers for bd.navigator.selectNextActive
    next: function(
      navState
    ) {
      if (navState.currentChild && navState.currentChild.get) {
	      var tabIndex= navState.currentChild.get("tabIndex");
	      if (tabIndex) {
	        navState.next= this.find(tabIndex, function(currentTabIndex, candidateTabIndex, tabIndex) {
            return tabIndex>currentTabIndex && (!candidateTabIndex || tabIndex<candidateTabIndex);
          });
	      }
      }
      if (!navState.next && this.cycleNavigation) {
        this.selectors.home.call(this, navState);
      }
    },

    previous: function(
      navState
    ) {
      if (navState.currentChild && navState.currentChild.get) {
	      var tabIndex= navState.currentChild.get("tabIndex");
	      if (tabIndex) {
	        navState.next= this.find(tabIndex, function(currentTabIndex, candidateTabIndex, tabIndex) {
            return tabIndex<currentTabIndex && (!candidateTabIndex || tabIndex>candidateTabIndex);
          });
	      }
      }
      if (!navState.next && this.cycleNavigation) {
        this.selectors.end.call(this, navState);
      }
    },

    home: function(
      navState
    ) {
      navState.next= this.find(Infinity, function(currentTabIndex, candidateTabIndex, tabIndex) {
        return tabIndex<currentTabIndex && (!candidateTabIndex || tabIndex<candidateTabIndex);
      });
    },

    end: function(
      navState
    ) {
      navState.next= this.find(-1, function(currentTabIndex, candidateTabIndex, tabIndex) {
        return tabIndex>currentTabIndex && (!candidateTabIndex || tabIndex>candidateTabIndex);
      });
    },

    lastFocused: function(
      navState
    ) {
      if (this.lastFocused) {
        navState.next= this.lastFocused;
      } else {
        this.selectors.home.call(this, navState);
      }
    }
  },

  focus: function() {
    ///
    // Sets the focus to a child of this object iff `this.get("focusable")` returns true.
    //warn
    // Focus is set asynchronously. This ensures focus will be set correctly under all circumstances
    // (e.g., from a blur event handler); however, the focus will not have moved before this
    // function returns.
    var candidate= this.find(Infinity, function(currentTabIndex, candidateTabIndex, tabIndex) {
      return tabIndex<currentTabIndex && (!candidateTabIndex || tabIndex<candidateTabIndex);
    });
    if (candidate) {
      candidate.focus();
    } else {
      bd.async.setFocus(this.domNode);
    }
  }
});

bd.navigator.commandHandler= function(
  commandEventObject
) {
  ///
  // Dispatches a navigate command to the current active object that contains the navigate method.

  for (var currentWidget= null, activeStack= dijit._activeStack, i= activeStack.length; i--;) {
    currentWidget= dijit.byId(activeStack[i]);
    if (currentWidget.navigate) {
      if (currentWidget.navigate(commandEventObject)) {
	      commandEventObject.stopEvent= true;
      }
      return;
    }
  }
  if (bd.navigator.commandHandler.unconditionallyStopEvent) {
    commandEventObject.stopEvent= true;
  }
};
bd.navigator.commandHandler.unconditionallyStopEvent= 
  ///
  // Causes bd.navigator.commandHandler to unconditionally stop any navigate command. //This can be used to
  // prevent the focus from shifting out of the document during tab navigation.
  false;

bd.docGen("bd.navigator", {
  eventObject: {
    ///type
    // (hash) Describes the current navigation being executed.
    ///
    // This object is passed among the various functions the calculate and execute a navigation via bd.navigator.navigate.
    currentChild: 
      ///
      // The child the currently owns the focus.
      bd.nodoc,

    currentFocusNode: 
      ///
      // The DOM node that currently owns the focus.
      dijit._curFocus,

    next: 
      ///
      // The object that is calculated to get the focus next.
      bd.nodoc,

    nextFocusNode:
      ///
      // The DOM node that is calculated to get the focus next.
      bd.nodoc,

    commandEventObject:
      ///
      // The bd.command.eventObject that caused the navigation.
      bd.noDoc,

    cancel: 
      ///
      // Indicates the navigation should be canceled and the focus remain unchanged.
      bd.noDoc
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

