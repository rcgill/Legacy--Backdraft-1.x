define("bd/command/item", [
  "dojo", "bd",  "bd/command/namespace",
  "bd/namespace"
], function(dojo, bd) {
///
// Augments the bd.command namespace with the Backdraft command item machinery.

var defaultValue= // lexical variable for this module
bd.command.defaultValue=
  ///const
  // Constant value used to signal "use default semantics" for several command item fields. //See bd.command.item.
  -1;

bd.command.roles= {
  ///enum
  // The set of roles a bd.command.item may play.

  invalid:
    ///
    //(0) The command item's role is unknown.
    0,

  command:
    ///
    //(1) The command item is a command.
    1,

  menu:
    ///
    //(2) The command item is a menu or submenu.
    2,

  group:
    ///
    //(3) The command item is a command group (a group of commands on a [sub]menu).
    3
};

bd.command.checked= {
  ///enum
  // The set of checked states of a command item.

  na:
    ///
    //(0) The item does not show a checked/unchecked value.
    0,

  checked:
    ///
    //(1) The item is checked.
    1,

  unchecked:
    ///
    //(2) The item shows a checked value but is currently unchecked.
    2
};

bd.docGen("bd.command", {
  id:
    ///type
    // (string) An identifier for a command.
    bd.nodoc,

  shiftState:
    ///type
    // (string) Gives the shift state required to recognize a keydown event as an accelerator. //Any combination of "shift", 
    // "control", "alt", "s", "c", "a" (case is ignored) to indicate the shift state for the accelerator key; any other characters are ignored.
    //
    // The command machinery automatically transforms this loose definition into a normalized shift state given by /(S|x)(C|x)(A|x)/ for 
    // all internal use. For example, when a command item is created with a shift state of "control-alt", the constructor
    // will normalize the shift state to "xCA".
    bd.nodoc,

  menuTree:
    ///type
    // A tree of hashes that represents a hierarchical menu. //The top-level object holds the top-level menu.
    // 
    // * The keys in the hash are bd.command.id values.
    //  
    // * For each property in the top-level object that is a submenu, the value of that property
    //   holds another hash that represents the contents of that submenu.
    //
    // * For each property in the top-leven object that is a command, the value of that property
    //   is set to truthy.
    //
    // * Submenus are recursively defined just as the top-level menu.
    // 
    // For example,
    //code
    // {
    //   file: {
    //     open:1,
    //     close:1,
    //     save:1,
    //     saveAs:1
    //   },
    //   edit: {
    //     cut:1,
    //     copy:1,
    //     paste:1
    //   }
    // }
    bd.nodoc
});

    // The menu object is a tree of hashes. The top-level object holds the top-level menu.
    //
    // * For each property in the top-level object that is a submenu, the value of that property
    //   holds another hash that represents the contents of that submenu.
    //
    // * For each property in the top-leven object that is a command, the value of that property
    //   is set to true.
    //
    // * Submenus are recursively defined just as the top-level menu.
    //
    // This structure nicely models a menu tree.


bd.command.getShiftStateKey= function(
  shiftStateText //(bd.command.shiftState) The shift state to transform.
) {
  ///
  // Transforms any combination of "shift", "control", "alt", "s", "c", "a" and any other characters in any case into /(S|x)(C|x)(A|x)/.
  if (!dojo.isString(shiftStateText)) {
    return "xxx";
  }
  var temp= shiftStateText.replace(/shift/i, "S").replace(/control/i, "C").replace(/alt/i, "A");
  return (temp.match(/s/i) ? "S" : "x") + (temp.match(/c/i) ? "C" : "x") + (temp.match(/a/i) ? "A" : "x");
};

bd.command.item= bd.declare(
  /// 
  // A container that defines all the visual aspects of a command as well as its enabled/disabled and checked/unchecked state.

  //superclasses
  [],
 
  //members
  {
  id:
    ///(bd.command.id) The identifier for the command.
    "",

  parentMenuId:
    ///(bd.command.id) The menu (in bd.command.itemCache) that contains this command item (if any).
    "",

  groupId:
    ///(bd.command.id) The group (in bd.command.itemCache) the contains this command item.
    bd.command.defaultValue,

  text:
    ///(string) The raw text displayed to the user for this item.
    "",

  role:
    ///(bd.command.roles) The role this command plays.
    bd.command.roles.invalid,

  groupOrder:
    ///(integer) Derived from itemOrder of command item at groupId.
    0,

  itemOrder:
    ///(integer) The order of this item relative to its siblings.
    0,

  accelKey:
    ///
    // The key in combination with accelShift to detect an accelerator. //See bd.command.accelTable.
    ///
    //(integer) The scan code to detect on keydown.
    //(char) The key to detect on keypress.
    0,

  accelShift:
    ///(bd.command.shiftState) The shift state in combination with accelKey to detect an accelerator.
    "",

  accelText:
    ///(string) The text used to inform the user that an accelerator exists.
    bd.command.defaultValue,

  statusText:
    ///(string) The text shown on the status bar for the command.
    bd.command.defaultValue,

  helpUrl:
    ///(string) The help URL for associated with the command.
    bd.command.defaultValue,

  tooltipText:
    ///(string) The tooltip text associated with the command.
    bd.command.defaultValue,

  enabledIcon:
    ///
    // The icon to show for an enabled command. //See bd.command.item.getIcon for algorithm that sets 
    // the HTML class intended to influence the icon presented with a command item.
    ///
    //(string) The icon resource.
    //(truthy) Show the icon, deduce resource from id.
    //(falsy) Don't show an icon.
    false,

  disabledIcon:
    ///
    //(string) The icon resource.
    //(truthy) Show the icon, deduce resource from id.
    //(falsy) Don't show an icon.
    ///
    // The icon to show for a disabled command.
    ///
    // See bd.command.item.getIcon for algorithm that sets the HTML class intended to influence the icon presented with a command item.
    false,

  disabled:
    ///
    // Run-time property that says if this item is disabled.
    ///
    //(bool) Truthy puts the command in the disabled state, and conversely.
    false,

  checked:
    ///
    // Run-time property that says if this item is checked.
    ///
    //(bd.command.checked) The checked state of the command.
    bd.command.checked.na,

  constructor: function(
    args //(kwargs) Properties with which to initialize this object.
  ) {
    /// 
    // Creates a new instance.
    bd.docGen("kwargs", {
      ///
      // Describes the property values used to initialize a bd.command.commantItem instance.

      id:
        //(bd.command.id) The identifier for the command.
        undefined,
    
      parentMenuId:
        //(bd.command.id) The menu that contains this command item (if any).
        "",
    
      groupId:
        //(bd.command.id) The group the contains this command item.
        bd.command.defaultValue,
    
      text:
        //(string) The raw text displayed to the user for this item.
        "",
    
      role:
        //(bd.command.roles) The role this command plays.
        bd.command.roles.invalid,
    
      itemOrder:
        //(integer) The order of this item relative to its siblings.
        Number.MAX_VALUE,
    
      accelKey:
        ///
        // The key in combination with accelShift to detect an accelerator
        //
        //(integer) The scan code to detect on keydown.
        //(char) The key to detect on keypress.
        0,
    
      accelShift:
        //(bd.command.shiftState) The shift state in combination with accelKey to detect an accelerator.
        "",
    
      accelText:
        //(string) The text used to inform the user that an accelerator exists.
        bd.command.defaultValue,
    
      statusText:
        //(string) The text shown on the status bar for the command.
        bd.command.defaultValue,
    
      helpUrl:
        //(string) The help URL for associated with the command.
        bd.command.defaultValue,
    
      tooltipText:
        //(string) The tooltip text associated with the command.
        bd.command.defaultValue,
    
      enabledIcon:
        ///
        // The icon to show for an enabled command. See bd.command.item.getIcon for algorithm that 
        // sets the HTML class intended to influence the icon presented with a command item.
        ///
        //(string) The icon resource.
        //(truthy) Show the icon, deduce resource from id.
        //(falsy) Don't show an icon.
        false,
    
      disabledIcon:
        ///
        // The icon to show for a disabled command. See bd.command.item.getIcon for algorithm that
        // sets the HTML class intended to influence the icon presented with a command item.
        ///
        //(string) The icon resource.
        //(truthy) Show the icon, deduce resource from id.
        //(falsy) Don't show an icon.
        false
    });

    dojo.mixin(this, args);
    this.fixup();
  },

  modify: function(
    args //(hash) Properties to mixin to this object.
  ) {
    /// 
    // Edits one or more properties of the instance. //
    // Deduced properties (e.g. accelText) are recalculated.
    dojo.mixin(this, args);
    this.fixup();
  },

  fixup: function() {
    ///
    // Inspects all properties of a command item and attempts to derive properties not explicitly specified.
    ///
    // The following properties are derived:
    //
    //   * If the value at groupId is identical to bd.defaultValue, then it is set to the value at parentMenuId.
    //
    //   * The value at text is searched for any character preceeded by a backslash. Any such character is assumed to be
    //     a menu hot key.  A backslash is escaped by writing two consecutive backslashes. A backslash is given as a menu hot key by writing three consecutive backslashes.
    //
    //   * The value at htmlText is derived by surrounding any menu hot key (say 'x') with "<span class='hotKey'>x</span>" and
    //     removing the accompanying backslash.
    //
    //   * The value cleanedText is derived by removing any menu hot key backslash characters
    //
    //   * If the value at accelKey is a character and a shift state is given, then the value is converted to a keyCode.
    //
    //   * If no value is given at accelText, then a value is manufactured from accelKey and accelShift if possible.
    //
    //   * If statusText===bd.defaultValue, then a value is manufacture. See source for details.
    //
    //   * If tooltipText===bd.defaultValue, then it is set to the value at statusText
    //
    //   * If helpUrl===bd.defaultValue, then a value is manufactured equivalent to <span class="placeholder">groupId</span>#<span class="placeholder">id</span>
    //

    if (this.groupId===defaultValue) {
      this.groupId= this.parentMenuId;
    }

    // the mnemonic is given by '\' preceeded by a non-'\' followed by a non-'\'
    // the mnemonic literal '\' is given by '\\\'

    // (any non-backslash character or beginning-of-line) followed by (backslash) followed by (any non-backslash character)
    var mnemonic= this.text.match(/([^\\]|^)\\([^\\])/);
    if (mnemonic) {
      this.mnemonic= mnemonic[2].charAt(0).toLowerCase();
    } else {
      // three backslashes preceeded by any character other than backslash or ^ followed by any character other than backslash or $
      this.mnemonic= /([^\\]|^)\\\\\\([^\\]|$)/.test(this.text) ? "\\" : null;
    }

    // htmlText replaces the mnemonic 'x' with "<span class='menuMnemonic'>x</span>"
    // cleanedText removes the mnemonic escape character
    var
      htmlText= this.text,
      cleanedText= htmlText;
    if (htmlText) {
      htmlText= htmlText.replace(
        /([^\\]|^)(\\)([^\\])/, "$1<span class='menuMnemonic'>$3</span>"
      ).replace(
        /([^\\]|^)\\\\\\([^\\]|$)/, "$1<span class='menuMnemonic'>\\</span>$2"
      ).replace(
        /\\\\/g, "\\"
      );
      cleanedText= cleanedText.replace(/(\\)([^\\])/, "$2").replace(/([^\\]|^)\\\\\\([^\\]|$)/, "$1\\$2").replace(/\\\\/g, "\\");
    }
    this.htmlText= htmlText;
    this.cleanedText= cleanedText;

    // set...
    // accelShift::= 0 | /(S|x)(C|x)(A|x)/
    // accelKey::= string resolved by dojo.keys => keyCode | charCode => intercept onkeypress | keyCode => intercept onkeydown
    // accelText::= as given or derive a best guess
    var accelKey;
    if ((accelKey= this.accelKey) && (accelKey= dojo.keys[accelKey])) {
      this.accelKey= accelKey;
    }
    this.accelShift= this.accelShift ? bd.command.getShiftStateKey(this.accelShift) : 0;
    if (this.accelShift || !dojo.isString(this.accelKey)) {
      // intercept at onkeydown and looking for a keyCode, _not_ a charCode
      if (dojo.isString(this.accelKey)) {
        if (this.accelText==defaultValue) {
          var shiftText= "";
          if (this.accelShift.charAt(0)=='S') {
            shiftText+= "shift+";
          }
          if (this.accelShift.charAt(1)=='C') {
            shiftText+= "control+";
          }
          if (this.accelShift.charAt(2)=='A') {
            shiftText+= "alt+";
          }
          this.accelText= shiftText + this.accelKey.toLowerCase().charAt(0);
        }
        this.accelKey= this.accelKey.toUpperCase().charCodeAt(0);
      } else {
        //this.accelKey should be a keyCode and the accelText should be set manually
      }
    } else if (this.accelText==defaultValue) {
      //no shift and the accelKey is a string; therefore intercept at onkeypress and looking for a charCode
      this.accelText= this.accelKey;
    }

    if (this.statusText===defaultValue) {
      if (this.role==bd.command.roles.menu) {
        this.statusText= "click to open the " + this.cleanedText + " menu";
      } else if (this.role==bd.command.roles.command) {
        this.statusText= "click to execute the " + this.cleanedText + " command";
      }
    }

    if (this.helpUrl===defaultValue) {
      this.helpUrl= this.groupId + '#' + this.id;
    }

    if (this.tooltipText===defaultValue) {
      this.tooltipText= this.statusText;
    }
  },

  getIcon: function() {
    ///
    // Derives a HTML class name that gives the icon based on the values of enabledIcon, disabledIcon, and disabled.
    var
      icon= (this.disabled && this.disabledIcon) ? this.disabledIcon : this.enabledIcon,
      prefix= (this.disabled ? "commandIconDisabled " : "commandIcon ");
    if (dojo.isString(icon)) {
      return prefix + icon;
    } else if (icon) {
      return prefix  + this.id;
    } else {
      return "";
    }
  }
});

bd.command.namespace= bd.declare(
  ///
  // bd.namespace-derived class used for the global command item cache (bd.command.itemCache).

  //superclasses
  [bd.namespace], 

  //members
  {
  mxPending:
    // Says if items have been added, but some derivable properties still needs to be computed. \\When true, 
    // bd.command.namespace.process will be called before any items are returned from the namespace via bd.command.namespace.get.
    // `private
    false,

  set: function(
    item //(bd.command.item) The command item to add to the cache.
  ) {
    ///
    // Adds a new command item to the namespace at item.id. //If the command
    // given by item.id already exists in the namespace, then it is replaced.
    this.mxPending= true;
    this._hash[item.id]= item;
    return this;
  },

  get: function(
    id //(bd.command.id) Identifies the command item to retrieve.
  ) {
    ///
    // Returns the command item given by id from the namespace.
    if (this.mxPending) {
      this.process();
    }
    return this._hash[id];
  },

  modify: function(
    id, //(bd.command.id) identifies the command item to retrieve
    props      //(hash) the properties to mixin into the comamnd item
  ) {
    ///
    // Modifies the properties of the command item given by id as given by props.
    this.mxPending= true;
    this._hash[id].modify(props);
  },

  process: function() {
    ///
    // Computes any dependent itemOrder properties, then compute all derived groupOrder properties.
    this.mxPending= false;
    var
      orderCountToCompute= 0, //the number of items whos order must be computed
      currentOrderRecursiveDepth= 0,
      groupHash= {},
      hash= this._hash,
      computeItemOrder= function(item) {
        currentOrderRecursiveDepth++;
        if (currentOrderRecursiveDepth > orderCountToCompute+1) {
          console.warn("cycle in command items order calculation");
          item.itemOrder= Number.MAX_VALUE;
        }
        if (item.itemOrder.reference) {
          //this item not yet computed...
          var referenceItem= hash[item.itemOrder.reference];
          if (!referenceItem) {
            console.warn("item.itemOrder.reference= " + item.itemOrder.reference + " is not defined.");
            item.itemOrder= Number.MAX_VALUE;
          } else {
            var order= computeItemOrder(hash[item.itemOrder.reference]);
            if (item.itemOrder.offset==="after" || !item.itemOrder.offset) {
              item.itemOrder= order + 1;
              dojo.forEach(groupHash[item.groupId], function(i) {
                if (i!==item && !i.itemOrder.reference && i.itemOrder!==0 && i.itemOrder>=item.itemOrder) {
                  i.itemOrder+= 1;
                }
              });
            } else if (item.itemOrder.offset==="before") {
              item.itemOrder= order - 1;
              dojo.forEach(groupHash[item.groupId], function(i) {
                if (i!==item && !i.itemOrder.reference && i.itemOrder!==0 && i.itemOrder<=item.itemOrder) {
                  i.itemOrder-= 1;
                }
              });
            } else {
              item.itemOrder= order + item.itemOrder.offset;
            }
          }
        } else if (item.itemOrder===0) {
          var max= 0;
          dojo.forEach(groupHash[item.groupId], function(i) {
            if (i!==item && !i.itemOrder.reference && i.itemOrder>=max) {
              max= i.itemOrder;
            }
          });
          item.itemOrder= max+1;
        }
        currentOrderRecursiveDepth--;
        return item.itemOrder;
      };

    // calculate the watchdog...
    this.forEach(function(itemId, item) {
      if (item.itemOrder.reference || item.itemOrder===0) {
        orderCountToCompute++;
      }
    });
    if (orderCountToCompute) {
      // initialize the group hash...
      this.forEach(function(itemId, item) {
        (groupHash[item.groupId]= (groupHash[item.groupId] || [])).push(item);
      });
      this.forEach(function(itemId, item) {
        computeItemOrder(item);
      });
    }

    var
      commandRole= bd.command.roles.command,
      menuRole= bd.command.roles.menu;
    this.forEach(function(itemId, item) {
      var
        menuItem= hash[item.parentMenuId],
        groupItem= hash[item.groupId];
      if (groupItem) {
        item.groupOrder= groupItem.itemOrder;
      } else if ((item.role==commandRole || item.role==menuRole) && itemId!="top") {
        //console.warn("group item not found for command item: " + item.id);
      }
    });
  }
});

dojo.mixin(bd.command, {
  itemCache: 
    ///
    // (bd.command.namespace) The global cache of command items.
    new bd.command.namespace(),

  getItem: function(
    id //(bd.command.id) The item to retrieve.
  ) {
    ///
    // Returns the command item given by id from the global command item cache.
    //return
    //(bd.command.item) The command item in the global command cache with id==id.
    return this.itemCache.get(id);
  },

  addItem: function(
    args //(bd.command.item.constructor.kwargs) arguments to provide to the bd.command.item constructor
  ) {
    ///
    // Creates a new bd.command.item and adds it to the global command item cache (bd.command.itemCache).
    //return 
    //(bd.command.namespace) bd.command.itemCache.
    return this.itemCache.set(new bd.command.item(args));
  },

  addItems: function(
    items //(array of bd.command.item.constructor.kwargs) Set of args to provide to the bd.command.item constructor.
  ) {
    ///
    // Adds a set of new bd.command.item objects to the global command item cache (bd.command.itemCache).
    //return
    //(bd.command.namespace) bd.command.itemCache.
    dojo.forEach(items, function(args) {
      this.itemCache.set(new bd.command.item(args));
    }, this);
    return this.itemCache;
  },

  modifyItem: function(
    id, //(bd.command.id) The command item to modify.
    props      //(hash) The properties to mixin into the command item.
  ) {
    ///
    // Modifies the properties of the command item in the global command item cache (bd.command.itemCache)
    // given by id as given by props.
    //return
    //(bd.command.namespace) bd.command.itemCache.
    this.itemCache.modify(id, props);
    return this.itemCache;
  },

  removeItem: function(
    id //(bd.command.id) The command item to remove.
  ) {
    ///
    // Removes the command item given by id from the global cache (bd.command.itemCache).
    //return
    //(bd.command.namespace) bd.command.itemCache.
    return this.itemCache.del(id);
  },

  compare: function(
    lhs, //(bd.command.id) the left-hand-side of the comparison
    rhs  //(bd.command.id) the right-hand-side of the comparison
  ) {
    ///
    // Compares the relative order of (lhs ? rhs). //
    // Command items are ordered most-significant to least significant by (groupOrder, itemOrder, text).
    lhs= bd.command.getItem(lhs);
    rhs= bd.command.getItem(rhs);
    if (!lhs || !rhs) {
      //TODO probably throw
    }
    var result= lhs.groupOrder==rhs.groupOrder ? lhs.itemOrder - rhs.itemOrder : lhs.groupOrder - rhs.groupOrder;
    if (result===0) {
      if (lhs.cleanedText<rhs.cleanedText) {
        return -1; // if lhs < rhs
      } else if (lhs.cleanedText==rhs.cleanedText) {
        return 0; // if lhs == rhs
      } else {
        return 1; // if lhs > rhs
      }
    }
    return result;
  },


  itemIdsInOrder: function(
    menuContents //(hash with keys of bd.command.id) The contents of a menu.
  ) {
    ///
    // Sorts the contents of a menu as given bye bd.command.compare.
    //return
    //(array of bd.command.id) sorted by order as given by bd.command.compare
    var items= [];
    for(var item in menuContents) {
      items.push(item);
    }
    return items.sort(bd.command.compare);
  },

  deduceMenu: function(
    commandSet //(array or id) The commands to form into a menu object.
  ) {
    ///
    // Constructs a bd.command.menuTree that contains exactly the commands given in commandSet.

    //Take a copy of commandSet since this routine destroys it
    commandSet= commandSet.slice(0);

    //get a map of (id --> item) for the command set
    var items= {};
    dojo.forEach(commandSet, function(id) {
      items[id]= bd.command.getItem(id);
    });

    var
      menuRole= bd.command.roles.menu,
      result= {},
      resultMap= {},
      consumedAtLeastOne= true;
    while (consumedAtLeastOne && commandSet.length) {
      consumedAtLeastOne= false;
      for (var i= 0; i<commandSet.length;) {
        var
          itemId= commandSet[i],
          item= items[itemId],
          parentId= item.parentMenuId,
          parentItem= resultMap[parentId];
        if (parentItem) {
          // the parent has been added to the result; add this item as a child of the parent
          resultMap[itemId]= parentItem[itemId]= (item.role===menuRole ? {} : true);
          consumedAtLeastOne= true;
          commandSet.splice(i, 1);
        } else if (!items[parentId]) {
          // the parent is not in the command set; therefore, it's a top-level item...
          result[itemId]= resultMap[itemId]= (item.role===menuRole ? {} : true);
          consumedAtLeastOne= true;
          commandSet.splice(i, 1);
        } else {
          i++;
        }
      }
    }
    return result;
  }
});

return bd.command;

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

