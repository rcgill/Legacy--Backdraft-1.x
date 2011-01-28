define("bd/widget/menu", [
  "bd", "dojo", "dijit",
  "bd/command/item",
  "bd/command/dispatch",
  "bd/command/accelerators",
  "bd/stateful",
  "bd/containable",
  "bd/dijit/compat",
  "dijit/CheckedMenuItem",
  "dijit/Menu",
  "dijit/MenuBar",
  "dijit/MenuBarItem",
  "dijit/MenuSeparator",
  "dijit/PopupMenuBarItem",
  "dijit/PopupMenuItem"
], function(bd, dojo, dijit) {
///
// Defines the Backdraft extensions to the dojo menu machinery.

dijit._MenuBase.extend({
  _checkMnemonic: function(evt) {
    for (var targetChar= evt.keyChar.toLowerCase(), children= this.getChildren(), i= children.length; i--;) {
      if (targetChar===children[i].mnemonic) {
        this.onItemClick(children[i], evt);
        return;
      }
    }
  },

	onClose: function(){
		// summary:
		//		Callback when this menu is closed.
		//		This is called by the popup manager as notification that the menu
		//		was closed.
		// tags:
		//		private

		this._stopFocusTimer();
		this._markInactive();
		this.isShowingNow = false;
		this.parentMenu = null;

    //ALTOVISO
    this.focusedChild= null;
    this._hoveredChild= null;
	}
});

dijit.Menu.extend({
	_onKeyPress: function(/*Event*/ evt){
		// summary:
		//		Handle keyboard based menu navigation.
		// tags:
		//		protected

		if(evt.ctrlKey || evt.altKey){ return; }

		switch(evt.charOrCode){
			case this._openSubMenuKey:
				this._moveToPopup(evt);
				dojo.stopEvent(evt);
				break;
			case this._closeSubMenuKey:
				if(this.parentMenu){
					if(this.parentMenu._isMenuBar){
						this.parentMenu.focusPrev();
					}else{
						this.onCancel(false);
					}
				}else{
					dojo.stopEvent(evt);
				}
				break;
      //ALTOVISO
      default:
        this._checkMnemonic(evt);
        dojo.stopEvent(evt);
        break;
		}
	}
});


var
populateMenu= function(
  rootMenu,
  menu,
  itemType,
  submenuItemType,
  separatorType
) {
  var group= false;
  dojo.forEach(bd.command.itemIdsInOrder(menu.contents), function(item) {
    var commandItem= bd.command.itemCache.get(item);
    if (group===false) {
      group= commandItem.groupId;
    }
    if (commandItem.groupId!=group && separatorType) {
      menu.addChild(new separatorType());
      group= commandItem.groupId;
    }
    if (commandItem.role==bd.command.roles.command) {
      menu.addChild(new itemType(rootMenu, commandItem));
    } else if (commandItem.role==bd.command.roles.menu) {
      var
        popupMenu= new bd.widget.popupMenu(rootMenu, menu, item, menu.contents[item]),
        popupItem= new submenuItemType(item, popupMenu);
      menu.addChild(popupItem);
    }
  });
},

resolveCommandItem= function(
  item // either a command item identfier or a command item
) {
  if (dojo.isString(item)) {
    return bd.command.itemCache.get(item);
  } else {
    return item;
  }
},

makePostscriptParams= function(
  commandItem,
  popup
) {
  commandItem= resolveCommandItem(commandItem);
  var result= {
    label:commandItem.htmlText,
    iconClass:commandItem.getIcon(),
    disabled:commandItem.disabled,
    mnemonic:commandItem.mnemonic};
  if (commandItem.accelText && commandItem.accelText.length) {
    result.accelKey= commandItem.accelText;
  }
  if (popup) {
    result.popup= popup;
  }
  return [result];
};

bd.widget.menuItem= bd.declare(
  ///
  // Wrapper around dijit.MenuItem that allows construction based on a bd.command.item and 
  // causes item selection to be sent to the root menu.

  //superclasses
  [dijit.MenuItem], 

  //members
  {
  constructor: function(
    rootMenu,   //(bd.widget.toplevelMenu) Gives the target menu to which to send item selection notifications.
    commandItem //(bd.command.item) Gives all menu item properties (text, accelerator, etc.) required to create the item.
  ) {
    ///
    // Creates a new instance.
  },

  postscript: function(
    rootMenu,   //(bd.widget.toplevelMenu) Gives the target menu to which to send item selection notifications.
    commandItem //(bd.command.item) Gives all menu item properties (text, accelerator, etc.) required to create the item.
  ) {
    this.rootMenu= rootMenu;
    this.commandId= dojo.isString(commandItem) ? commandItem : commandItem.id;
    this.inherited(arguments, makePostscriptParams(commandItem));
  },

  onClick: function() {
    this.inherited(arguments);
    this.rootMenu.onBafExec(this.commandId);
  }
});

bd.widget.menubarItem= bd.declare(
  ///
  // Wrapper around dijit.MenuBarItem that allows construction based on a bd.command.item and 
  // causes item selection to be sent to the root menu.
  
  //superclasses
  [dijit.MenuItem], 
  
  //members
  {
	templateString: 
    '<div class="dijitReset dijitInline dijitMenuItem dijitMenuItemLabel" dojoAttachPoint="focusNode" waiRole="menuitem" tabIndex="-1" dojoAttachEvent="onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick">' +
      '<img src="${_blankGif}" alt="" class="dijitMenuItemIcon" dojoAttachPoint="iconNode"></img>' +
    	'<span dojoAttachPoint="containerNode"></span>' +
    '</div>',

  constructor: function(
    rootMenu,   //(bd.widget.toplevelMenu) Gives the target menu to which to send item selection notifications.
    commandItem //(bd.command.item) Gives all menu item properties (text, accelerator, etc.) required to create the item.
  ) {
    ///
    // Creates a new instance.
  },

  postscript: function(
    rootMenu,   //(bd.widget.toplevelMenu) Gives the target menu to which to send item selection notifications.
    commandItem //(bd.command.item) Gives all menu item properties (text, accelerator, etc.) required to create the item.
  ) {
    this.rootMenu= rootMenu;
    this.commandId= dojo.isString(commandItem) ? commandItem : commandItem.id;
    this.inherited(arguments, makePostscriptParams(commandItem));
  },

  setAccelKeyAttr:function(){
    //override; don't show accelerator key info on menu bar items
  },

  onClick: function() {
    this.inherited(arguments);
    this.rootMenu.onBafExec(this.commandId);
  }
});

bd.widget.menuPopupItem= bd.declare(
  ///
  // Wrapper around dijit.PopupMenuItem that allows construction based on a bd.command.item and 
  // causes the root menu to be propagated to submenu items.
  
  //superclasses
  [dijit.PopupMenuItem], 

  //members
  {
  constructor: function(
    commandItem, //(bd.command.item) Gives all menu item properties (text, accelerator, etc.) required to create the item.
    popupMenu    //(bd.widget.popupMenu) The containing menu.
  ) {
    ///
    // Creates a new instance.
  },

  postscript: function(
    commandItem, //(bd.command.item) Gives all menu item properties (text, accelerator, etc.) required to create the item.
    popupMenu    //(bd.widget.popupMenu) The containing menu.
  ) {
    this.inherited(arguments, makePostscriptParams(commandItem, popupMenu));
  }
});

bd.widget.menubarPopupItem= bd.declare(
  ///
  // Wrapper around dijit.PopupMenuBarItem that allows construction based on a bd.command.item and 
  // causes the root menu to be propagated to submenu items.

  //superclasses
  [dijit.PopupMenuBarItem], 
  
  //members
  {
  constructor: function(
    commandItem, //(bd.command.item) Gives all menu item properties (text, accelerator, etc.) required to create the item.
    popupMenu    //(bd.widget.popupMenu) The containing menu.
  ) {
    ///
    // Creates a new instance.
  },

  postscript: function(
    commandItem, //(bd.command.item) Gives all menu item properties (text, accelerator, etc.) required to create the item.
    popupMenu    //(bd.widget.popupMenu) The containing menu.
  ) {
    this.inherited(arguments, makePostscriptParams(commandItem, popupMenu));
  }
});

bd.widget.popupMenu= bd.declare(
  ///
  // A wrapper around dijit.Menu that adds the ability to dynamically define the 
  // contents of the menu when it is opened. //The subclass also includes machinery
  // to accept a non-standard constructor signature that provides the following:
  // 
  // * the root menu: required for bd.widget.toplevelMenu
  // * the parent menu: required for dijit.Menu,
  // * the menu identifier: required to retrieve bd.command.item properties for this menu
  // * the contents: a bd.command.menuTree that (describes the contents of the menu.
  //
  // See bd.widget.popupMenu.constructor.
  
  //superclasses
  [dijit.Menu], 

  //members
  bd.attr(
    ///
    // A bd.command.menuTree that gives the contents of the menu. //A bd.command.item must exist 
    // in the bd.command.cache for each bd.command.id mentioned in the tree.
    ///
    // (bd.command.menuTree, optional, {}) Gives the contents of the menu.
   
    "contents",

    {}
  ),

  {
  constructor: function(
    rootMenu, //(bd.widget.toplevelMenu) The top-most menu in the menu hierarchy of which this menu is a part.
    parent,   //(dijit.Menu or null) The parent menu, if any.
    menuId,   //(bd.command.id) The bd.command.id of this menu.
    contents  //(bd.command.menuTree) The contents of this menu.
  ) {
    ///
    // Creates a new instance.
  },

  popupDelay: 0,

  postscript: function(
    rootMenu, //(bd.widget.toplevelMenu) The top-most menu in the menu hierarchy of which this menu is a part.
    parent,   //(dijit.Menu or null) The parent menu, if any.
    menuId,   //(bd.command.id) The bd.command.id of this menu.
    contents  //(bd.command.menuTree) The contents of this menu.
  ) {
    //remember initialization parameters and create the dijit menu
    dojo.mixin(this, {rootMenu:rootMenu, menuId:menuId, contents:contents});
    this.inherited(arguments, [{parentMenu:parent}]);
  },

  onOpen: function() {
    ///
    // Nontrivial connection point that's called when this menu is opened. //Publishes the topic "bdOpenMenu"
    // with the argument `this` which allows subscribers to set or modify the contents of the menu. Then
    // populates the menu as given by the `contents` attribute.
    dojo.publish("bdOpenMenu", [this]);

    //protect against shaman's rituals executed on menu items that take an owning menu as 
    //a ctor argument and that owning menu has a preamble
    this.preamble= 0;

    populateMenu(this.rootMenu, this, bd.widget.menuItem, bd.widget.menuPopupItem, dijit.MenuSeparator);
  },

  onBafExec: function(
    commandId
  ) {
    bd.command.scheduleCommand(commandId);
  },

  onClose: function() {
    this.inherited(arguments);
    this.destroyDescendants();
  }
});


bd.widget.toplevelMenu= bd.declare(
  ///
  // A mixin class that adds minor features to dijit-derived menus. //The following features are included:
  // 
  // * The ability restore the focus to the item that had the focus before a menu was navigated.
  // * The ability to dispatch a menu command asynchronously through the Backdraft command dispatcher (bd.command.scheduleCommand).
  // * The ability to cancel menu navigation by pressing the escape key.
  // * The ability to automatically suspend and resume Backdraft accelerators during menu navigation.

  //superclasses
  [],

  //members
  {
  focus: function() {
    ///
    // Remembers the current focus and sets the focus to this menu.
    this.restore= {
      focusNode: dijit.getFocus(this),
      stack: dijit._activeStack.slice(0)
    };
    (this.focusNode || this.domNode).focus();
  },

  onBafExec: function(
    commandId //(bd.command.id) The command id to execute.
  ) {
    // Schedules commandId for asynchronous execution via bd.command.scheduleCommand and restores the previously saved focus (if required).
    bd.command.scheduleCommand(commandId);
    this._restore();
  },

  _onFocus: function() {
    ///
    // Suspends accelerators and remembers the item that had the focus previous to this menu. //This
    // method is called automatically by the dijit focus manager.
    // `private
    bd.command.suspendAccels();
    if (!this.restore) {
      // here if activated by a click on a visible item
      this.restore= {
        focusNode: dijit.getFocus(this),
        stack: dijit._prevStack
      };
    }
    this.inherited(arguments);
  },

  _onBlur: function() {
    // Resumes the accelerators and restores the previously saved focus (if required). //This
    // method is called automatically by the dijit focus manager.
    // `private
    this.inherited(arguments);
    bd.command.resumeAccels();
    this._restore();
  },

  _onKeyPress: function(
    e //(DOM event object) DOM event object consequent to keypress event.
  ){
    ///
    // Detects pressing the escape key, and, if detected, cancels menu navigation. //This method is called
    // automatically by th dijit menu DOM event handler wiring.
    // `private
    if (e.charOrCode==dojo.keys.ESCAPE) {
      this._restore();
    } else {
      this.inherited(arguments);
    }
  },

  _restore: function() {
    ///
    // Sets the focus to the saved focus (if any).
    if (this.restore) {
      var temp= this.restore;
      this.restore= null;
      if (temp.focusNode) {
        dijit.focus(temp.focusNode);
      }
      if (temp.stack) {
        dijit._setStack(temp.stack);
      }
    }
    this.restore= null;
  }

});

bd.widget.verticalMenubar= bd.declare(
  ///
  // A wrapper around dijit.Menu includes a Backdraft-compatible constructor and population
  // leveraging the Backdraft command framework.
  /// 
  // The class includes necessary machinery to subclass dijit.Menubar while accepting a bd.createWidget.kwargs
  // argument during construction. After construction, the menu is populated as given by the `contents` attribute. All  attributes (text,
  // accelerator, icon, etc.) of individual menu items are taken from the bd.command.cache.

  //superclasses
  [dijit.Menu, bd.containable, bd.widget.toplevelMenu], 

  //members
  bd.attr(
    ///
    // A bd.command.menuTree that gives the contents of the menu. //A bd.command.item must exist 
    // in the bd.command.cache for each bd.command.id mentioned in the tree.
    ///
    // (bd.command.menuTree, optional, {}) Gives the contents of the menu.
   
    "contents",

    {}
  ),

  {
  constructor: function(
    kwargs //(bd.createWidget.kwargs) Describes how to create an instance.
  ) {
    ///
    // Creates a new instance.
  },

  preamble: function(
    kwargs //(bd.createWidget.kwargs) Describes how to create an instance.
  ) {
    this.kwargs= kwargs || {};
    bd.mix(this, this.kwargs);
    bd.mix(this, this.kwargs.descriptor || {});
    return [kwargs.descriptor];
  },

  postscript: function(
    kwargs //(bd.createWidget.kwargs) Describes how to create an instance.
  ) {
    this.create(kwargs.descriptor);
    this.parent= kwargs.parent;
  },

  postCreate: function(){
    //protect against shaman's rituals executed on menu items that take an owning menu as 
    //a ctor argument and that owning menu has a preamble
    this.preamble= 0;

    populateMenu(this, this, bd.widget.menuItem, bd.widget.menuPopupItem, dijit.MenuSeparator);
    this.inherited(arguments);
  }
});

bd.widget.menubar= bd.declare(
  ///
  // A wrapper around dijit.MenuBar includes a Backdraft-compatible constructor and population
  // leveraging the Backdraft command framework.
  /// 
  // The class includes necessary machinery to subclass dijit.Menubar while accepting a bd.createWidget.kwargs
  // argument during construction. After construction, the menu is populated as given by the `contents` attribute. All  attributes (text,
  // accelerator, icon, etc.) of individual menu items are taken from the bd.command.cache.

  //superclasses
  [dijit.MenuBar, bd.containable, bd.widget.toplevelMenu], 

  //members
  bd.attr(
    ///
    // A bd.command.menuTree that gives the contents of the menu. //A bd.command.item must exist 
    // in the bd.command.cache for each bd.command.id mentioned in the tree.
    ///
    // (bd.command.menuTree, optional, {}) Gives the contents of the menu.
   
    "contents",

    {}
  ),

  {
  constructor: function(
    kwargs //(bd.createWidget.kwargs) Describes how to create an instance.
  ) {
    ///
    // Creates a new instance.
  },

  preamble: function(
    kwargs //(bd.createWidget.kwargs) Describes how to create an instance.
  ) {
    this.kwargs= kwargs || {};
    bd.mix(this, this.kwargs);
    bd.mix(this, this.kwargs.descriptor || {});
    return [kwargs.descriptor];
  },

  postscript: function(
    kwargs //(bd.createWidget.kwargs) Describes how to create an instance.
  ) {
    this.create(kwargs.descriptor);
    this.parent= kwargs.parent;
  },

  postCreate: function() {
    //protect against shaman's rituals executed on menu items that take an owning menu as 
    //a ctor argument and that owning menu has a preamble
    this.preamble= 0;

    populateMenu(this, this, bd.widget.menubarItem, bd.widget.menubarPopupItem, null);
    this.inherited(arguments);
    this.insertAccels && bd.command.insertMenuAccels(this.contents);
  }
});

//TODO: construct a widget.MenuSeparator for menubar

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
