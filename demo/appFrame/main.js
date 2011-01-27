define(["dojo", "bd", "i18n!bd/nls/command", "bd/command/accelerators", "bd/widget/menu", "bd/widget/messageBox"], function(dojo, bd, commandBundle) {

// the backdraft command machinery includes "command items" which are localized objects
// that give a commands UI (text, button, accelerator, etc,). Here we add the stock 
// localized command items to the backdraft command cache so we can use them with the menu.
bd.forEachHash(commandBundle, function(item) {
	bd.command.addItem(item);
});

// A large part of writing a backdraft program is describing widget trees that are moved in/out of the
// active UI. Widget trees are described by defining bd.descriptors with are JavaScript objects.
//
// Here we describe the initial widget tree for this application which consists of a
// border container with a menu at the top, a statusbar at the bottom; this leaves the left, center
// and right panes for workspace items. The entire tree could be defined
// in a single descriptor with nested children; however, it's arguably more readable to break
// out the children as we've done below.
var 
	// the backdraft menu widget which is an extension to the dojo menu system that incorporates
	// the backdraft command item machinery
	menu= {
		className:"bd:widget.menubar",

		// this is the main menu hierarchy; all of the [localized] visual aspects of commands
		// were taken care of by the command framework when we loaded the command bundle above
		contents: {
			file:{"new":1, open:1, close:1, exit:1},
			edit:{cut:1, copy:1, paste:1, undo:1, redo:1, clear:1},
			navigate:{back:1, forward:1, next:1, previous:1, recent:1, search:1},
			help:{appHelp:1, appNews:1, fileTicket:1, about:1}
		},

		// onCreate is an optional function that's called after a widget tree has been completely
		// constructed. For this demo, we install a command handler for each menu item to
		// demonstrate the command dispatch machinery works.
		onCreate:function() {
			// here is a trivial handler that just displays a backdraft messagebox
			var catchCommand= function(e) {
				if (e.eventObject) {
					dojo.stopEvent(e.eventObject);
				}
				bd.widget.messageBox("Command Issued",
					"The command " + e.id + " was just issued.<br/><br/>Notice that accelerators are turned off while this message box is displayed",
					["OK"]);
			};

			//hook up all the commands given in the menu, above; this is an example of command routing
			bd.forEachHash(this.contents, function connectCommands(o, name) {
				if (bd.command.getItem(name).role===bd.command.roles.command) {
					//this item is a command, not a [sub]menu; therefore connect it to our handler just defined above
					bd.command.connect(name, catchCommand);
				} else {
					bd.forEachHash(o, connectCommands);
				}
			});
		},

		// by setting insertAccels, all acclerators associated with any command item that's on the menu
		// are automatically installed in the accelerator table
		insertAccels:true,

		// tell the parent (the border container) where this menu should go
		parentSpace:{regionInfo: {region:"top", delegateSize:1, min:0}}
	},

	// describe the status bar--a status bar with two children panels
	statusbar=	{
		className:"bd:widget.statusbar",
		parentSpace:{regionInfo: {region:"bottom", delegateSize:1, min:0}},
		children:[{
			className:"bd:widget.staticText",
			"class":"message",
			value:"ready..."
		},{
			className:"bd:widget.staticText",
			"class":"block",
			onCreate: function(thisPane) {
				// we've included a clock just for fun...
				var
					format= function(n){ return (n < 10) ? "0" + n : n; },
					updateTime= function() {
						var now= new Date();
						thisPane.set("value", format(now.getHours()) + ":" + format(now.getMinutes()) + ":" + format(now.getSeconds()));
					};
				setInterval(updateTime, 500);
			}
	 }]
	},

	// describe the initial state of the application (i.e., the initial widget tree)
	initialWidgetTree= {
		parent: 
			// the parent of the top-level object is always "root" which corresponds to the html body element
			"root",
	
		descriptor:{
			className:"bd:widget.borderContainer",
			name:"main",
			id:"main",
			style:"width:100%; height:100%; position:absolute; top:0; left:0;",
			design:"headline",
			children:[
				// the menu we described above
				menu, 

				// and the status bar
				statusbar,

				// and three place holders to describe the three resizeable panes in the border container
				{
					className:"bd:widget.staticText",
					"class":"message",
					value:"LEFT PANE",
					parentSpace:{regionInfo: {region:"left", size:"20%", min:0, splitter:true}}
				}, {
					className:"bd:widget.staticText",
					"class":"message",
					value:"RIGHT PANE",
					parentSpace:{regionInfo: {region:"right", size:"20%", min:0, splitter:true}}
				}, {
					className:"bd:widget.staticText",
					"class":"message",
					value:"CENTER PANE",
					parentSpace:{regionInfo: {region:"center"}}
				}
			]
	 }
	};

// The bd.start can be thought of as the entry point to the program; it takes control of the
// HTML body element and displays a widget tree
bd.start({topCreateArgs:initialWidgetTree});
});

