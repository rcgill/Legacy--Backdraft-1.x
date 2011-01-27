define(["dojo", "bd", "bd/command/accelerators", "bd/widget/messageBox"], function(dojo, bd) {

	// insert six accelerators; 
	// connect each to the same command id as the accelerator key; 
	// connect each command id to a handler that shows a message box telling the user which acclerator was pushed.
	bd.forEach("A.B.C.a.b.c".split("."), function(c) {
		bd.command.insertAccel(c, c);
		bd.command.connect(c, function() {
			bd.widget.messageBox("Command Issued", "You just pressed the \"" + c + "\" key.", ["OK"]);
		});
	});

	// start the app by giving a message telling the user what to do
	bd.start({topCreateArgs:{
		parent: 
			// the parent of the top-level object is always "root" which corresponds to the html body element
			"root",
		descriptor: {
			className:"bd:widget.staticText",
			"class":"message",
			value:"Hello, World!! Press the A, B, or C key (shifted or not)..."
		}
	}});
});
