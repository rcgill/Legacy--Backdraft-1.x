define("bd/command/accelerators", [
  "dojo", "dijit", "bd", "bd/command/namespace",
  "bd/collections",
  "bd/command/item",
  "bd/command/dispatch"
], function(dojo, dijit, bd, command) {
///
// Augments the bd.command namespace with the Backdraft keyboard accelerator machinery.

bd.command.accelStates= {
  ///enum
  // The possible states of the accelerator machinery.

  active:
    ///
    //(0) The accelerator machinery is active.
    0,

  suspendedOnce:
    ///
    //(1)The accelerator machinery is suspended for one keydown, keypress, ..., keypress, keyup sequence.
    1,

  suspendedOnceNeedKeyup:
    ///
    //(2) The accelerator machinery is on some keypress event during a suspended keydown, keypress, ..., keypress, keyup sequence.
    2,

  suspended:
    ///
    //(3) The accelerator machinery is suspended.
    3
};

bd.docGen("bd.command", {
  accelTable:
    ///type
    // Map from keyboard event information to bd.command.id. // The map is a two-dimensional hash given by 
    // {(single character or key code) --> {bd.command.shiftState --> bd.command.id}}
    ///
    // If the key is a single-character, then a keypress event matching that character is processed; if the key is
    // a key code, then a keydown event matching the key code is processed. In either case, when a keypress or keydown event is processed,
    // if the shift state associated with the event matches an entry in the accelTable item that triggered
    // the processing, then that command identifier is dispatched. For example, the following map entries
    // cause `command1`, `command2`, or `command3` to be dispatched when a control-a, alt-a, or B is noticed on a
    // keydown, keydown, or keyPress event, respectively.
    //code
    // map[65]= {"xCx":"command1", "xxA":"command2"}
    // map["B"]= {"xxx":"command3"}
    //note
    // Since a keypress event incorporates the shift state in th `keyChar` property of the even object (e.g., shift-"a" is 
    // causes `keyChar` to hold "A") the accelerator machinery design requires the shift state key to be "xxx" for 
    // keypress-generated accelerators as in the example above.
    bd.nodoc
});

bd.mix(bd.command, {
  accelTables:
    ///
    // (array of bd.command.accelTable) The stack of pushed accelerator tables.
    [],

  activeAccelTable:
    ///
    // (bd.command.accelTable) The current accelerator table.
    {},

  pushAccels: function(
    ids //(array of bd.command.id) The commands to insert into the new table.
  ) {
    ///
    //  Saves the current accelerator table, creates a new table, and initializes it with the accelerators given by ids. //Use 
    // bd.command.popAccels to restore the saved table.
    this.accelTables.push(this.activeAccelTable);
    this.activeAccelTable= {};
    bd.forEach(ids, function(id) {
      this.insertAccel(id);
    }, this);
  },

  pushAccelTable: function(
    ids //(bd.command.accelTable) The new table to make active.
  ) {
    ///
    // Saves the current accelerator table, and makes the passed table the new table. //Use 
    // bd.command.popAccels to restore the saved table.
    this.accelTables.push(this.activeAccelTable);
    this.activeAccelTable= ids;
  },

  popAccels: function() {
    ///
    // Replaces the current accelerator table with the table previously pushed by bd.command.pushAccelerators.
    var result= this.activeAccleratorTable;
    this.activeAccelTable= this.accelTables.pop();
    return result; // the previously active accelerator table
  },

  insertAccel: function(
    id,        //(bd.command.id) References the command to execute upon detection of accelerator.
    keyCodeOrKeyChar, //(integer or char) A scan code or a single character that identifies the accelerator key.
    shiftState,       //(bd.command.shiftState, optional, "") The shift state associated with keyCodeOrKeyChar.
    table             //(bd.command.accelTable, optional, bd.command.activeAccelTable) The table in which to insert the accelerator.
  ) {
    ///
    //  Inserts an accelerator into table. //If/when the table is active, pressing the keyboard chord given by (keyCodeOrKeyChar, shiftState)
    // causes `bd.command.dispatchCommand(id, null, dijit._activeStack, e)` to be applied (`e` is the keyboard event).
    bd.docGen("overload",
      function(
        id //(bd.command.id) The command item given by `bd.command.get(id)` gives accelerator parameters.
      ) {
        ///
        // Syntactic sugar for bd.insertAccel(id, bd.command.getItem(id).accelKey, bd.command.getItem(id).accelShift)`.
      }
    );

    //figure out what was actually passed...
    if (arguments.length==1) {
      //nothing but id was provided
    } else if (keyCodeOrKeyChar && keyCodeOrKeyChar.constructor===Object) {
      //neither keyCodeOrKeyChar not shiftState were provided (keyCodeOrKeyChar is actually a table)
      table= keyCodeOrKeyChar;
      keyCodeOrKeyChar= null;
      shiftState= null;
    } else if (shiftState && shiftState.constructor===Object) {
      //shiftState was not provided (shiftState is actually a table)
      table= shiftState;
      shiftState= null;
    }

    table= table || this.activeAccelTable;
    if (!keyCodeOrKeyChar) {
      var item= this.getItem(id);
      if (item) {
        bd.command.insertAccel(id, item.accelKey, item.accelShift, table);
      } else {
        console.error("id not found in bd.command.insertAccel");
      }
    } else {
      if (shiftState && bd.isString(keyCodeOrKeyChar)) {
        // looking for a keyCode, not a charCode
        keyCodeOrKeyChar= keyCodeOrKeyChar.toUpperCase().charCodeAt(0);
      }
      var entry= (table[keyCodeOrKeyChar]= (table[keyCodeOrKeyChar] || {}));
      entry[this.getShiftStateKey(shiftState)]= id;
    }
  },

  insertMenuAccels: function(
    menu //(bd.menu) The menu to search for accelerators.
  ) {
    ///
    // Fully traverses menu and inserts the accelerator and for any command item found during the traversal that defines
    // an accelerator, insert that accelerator into the active accelerator table.
    var
      menuRole= bd.command.roles.menu,
      processItem= function(submenu, menuItemId) {
        var item= bd.command.getItem(menuItemId);
        if (item.accelKey) {
          bd.command.insertAccel(item.id, item.accelKey, item.accelShift);
        }
        if (item.role==menuRole) {
          bd.forEachHash(submenu, processItem);
        }
      };
    bd.forEachHash(menu, processItem);
  },

  removeAccel: function(
    keyCodeOrKeyChar, //(integer or char) A scan code or a single character that identifies the accelerator key.
    shiftState,       //(bd.command.shiftState, optional, "") Any combination of "shift", "control", "alt", "s", "c", "a" and any other characters.
    table             //(bd.command.accelTable, optional, bd.command.activeAccelTable) The table in which to insert the accelerator.
  ) {
    ///
    // Removes the given accelerator from the given table.
    if (!bd.isString(shiftState)) {
      //shiftState not provided (shiftState is actually a table)
      table= shiftState;
      shiftState= null;
    }
    table= table || this.activeAccelTable;
    var entry= (table[keyCodeOrKeyChar]= (table[keyCodeOrKeyChar] || {}));
    entry[this.getShiftStateKey(shiftState || "")]= 0;
  },

  accelState:
    ///
    // (bd.command.accelStates) The current state of the accelerator machinery. //
    bd.command.accelStates.active,

  suspendAccelOnce: function(
  ) {
    ///
    // Suspends the accelerator machinery for one keydown, keypress, ..., keypress, keyup sequence.
    this.accelState= this.accelStates.suspendedOnce;
  },

  suspendAccels: function(
  ) {
    ///
    // Suspends the accelerator machinery until it is resumed with command.resumeAcclerators.
    this.accelState= this.accelStates.suspended;
  },

  resumeAccels: function(
  ) {
    ///
    // Resumes the accelerator machinery after suspending with command.suspendAccels.
    this.accelState= this.accelStates.active;
  },

  dispatchAccel: function(
    e //(raw DOM event object) If the browser supports addEventListener
      //(undefined) If the browser is IE; find the event object at window.event
  ) {
    ///
    // Dispatches the id associated with the accelerator implied by e (if any), a keyboard event.
    ///
    // keydown, keypress, keyup DOM event handler that implements accelerators.
    // `warn
    // This function is automatically connected to the DOM keyboard events by the Backdraft framework and should
    // not be called directly.
    // `private
    e= dojo._event_listener._fixEvent(e || window.event);

    //first handle the suspended states; relay on the fact that active is always zero
    if (this.accelState) {
      var state= this.accelState;
      if (state==this.accelStates.suspended) {
        //no-op
      } else if (this.accelState==this.accelStates.suspendedOnce && e.type==="keydown") {
        this.accelState= this.accelStates.suspendedOnceNeedKeyup;
      } else if (this.accelState==this.accelStates.suspendedOnceNeedKeyup && e.type==="keyup") {
        this.accelState= this.accelStates.active;
      }
      return;
    }

    //not suspended...
    var entry, shift, commandId;
    if (e.type==="keydown") {
      entry= this.activeAccelTable[e.keyCode];
      shift= (e.shiftKey ? "S" : "x") + (e.ctrlKey ? "C" : "x") + (e.altKey ? "A" : "x");
    } else if (e.type==="keypress") {
      entry= this.activeAccelTable[e.keyChar];
      shift= "xxx";
    } else {
      return;
    }
    commandId= entry && entry[shift];
    if (commandId) {
      bd.command.dispatchCommand(commandId, null, dijit._activeStack, e);
    }
  }
});

var accelDispatcher= bd.hitch(bd.command, "dispatchAccel");

if (window.addEventListener) {
  //get all keyboard events during capturing thereby getting them at the earliest possible moment and
  //giving the best chance to the accel function to cancel any other handlers
  bd.doc.addEventListener("keydown", accelDispatcher, true);
  bd.doc.addEventListener("keyup", accelDispatcher, true);
  bd.doc.addEventListener("keypress", accelDispatcher, true);
} else if (dojo.isIE) {
  // IE doesn't capture; therefore, each time the focus changes, attachEvent to the focused node.
  // This should have the same effect as above.
  var IEAttachedNode= bd.doc;
  bd.doc.attachEvent("onkeydown", accelDispatcher);
  bd.doc.attachEvent("onkeyup", accelDispatcher);
  bd.doc.attachEvent("onkeypress", accelDispatcher);

  bd.doc.attachEvent("onactivate", function() {
    var node= window.event.srcElement;
    if (node===IEAttachedNode) {
      return;
    }
    if (IEAttachedNode) {
      IEAttachedNode.detachEvent("onkeydown", accelDispatcher);
      IEAttachedNode.detachEvent("onkeyup", accelDispatcher);
      IEAttachedNode.detachEvent("onkeypress", accelDispatcher);
      IEAttachedNode= null;
    }
    if (node) {
      IEAttachedNode= node;
      node.attachEvent("onkeydown", accelDispatcher);
      node.attachEvent("onkeyup", accelDispatcher);
      node.attachEvent("onkeypress", accelDispatcher);
    }
  });
}

return bd.command;

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

