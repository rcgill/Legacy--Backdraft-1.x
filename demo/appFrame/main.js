require.def("appFrame/main", [
  "dojo", 
  "dijit", 
  "bd", 
  "bd/command/accelerators",
  "bd/widget/menu",
  "i18n!bd/nls/command",
  "bd/widget/messageBox"
], function(dojo, dijit, bd) {

// add the stock localized command items to the backdraft command cache
bd.forEachHash(require.module("i18n!bd/nls/command"), function(item) {
  bd.command.addItem(item);
});

// Here we describe the initial widget tree. It consists of a border container
// with a menu at the top, a statusbar at the bottom; this leave the left, center
// and right panes for workspace items

// Widget trees are described by defining bd.descriptors. The entire tree could be defined
// in a single descriptor with nested children; however, it's arguably more readable to break
// out the children as we've done below.

var 
  menu= {
    className:"bd:widget.menubar",
    contents: {
      file:{"new":1, open:1, close:1, exit:1},
      edit:{cut:1, copy:1, paste:1, undo:1, redo:1, clear:1},
      navigate:{back:1, forward:1, next:1, previous:1, recent:1, search:1},
      help:{appHelp:1, appNews:1, fileTicket:1, about:1}
    },
    onCreate:function() {
      // install a command handler for each menu item to demonstrate the command dispatch machinery works
     
      // here is a trivial little handler that just displays a Backdraft messagebox...
      var catchCommand= function(e) {
        if (e.eventObject) {
          dojo.stopEvent(e.eventObject);
        }
        bd.widget.messageBox("Command Issued",
          "The command " + e.id + " was just issued.<br/><br/>Notice that accelerators are turned off while this message box is displayed",
          ["OK"]);
      };

      //hook up all the commands given in the menu, above...
      bd.forEachHash(this.contents, function connectCommands(o, name) {
        if (bd.command.getItem(name).role===bd.command.roles.command) {
          //this item is a command, not a [sub]menu; therefore connect it to our little handler just defined above...
          bd.command.connect(name, catchCommand);
        } else {
          bd.forEachHash(o, connectCommands);
        }
      });
    },
    insertAccels:true,
    parentSpace:{
      regionInfo: {
        region:"top",
        delegateSize:1,
        min:0
      }
    }
  },

  statusbar=  {
    className:"bd:widget.statusbar",
    parentSpace:{
      regionInfo: {
        region:"bottom",
        delegateSize:1,
        min:0
      }
    },
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

  initialWidgetTree= {
    parent: 
      // the parent of the top-level object is always "root" which corresponds to the html body element
      "root",
  
    descriptor:{
      className:"bd:widget.borderContainer",
      name:"main",
      id:"main",
      style:"width:100%; height:100%; position:absolute; top:0; left:0; z-index:-5;",
      design:"headline",
      children:[menu, statusbar,
        {
          // a placeholder for the left pane
          className:"bd:widget.staticText",
          "class":"message",
          value:"LEFT PANE",
          parentSpace:{
            regionInfo: {
              region:"left",
              size:"20%",
              min:0,
              splitter:true
            }
          }
        }, {
          // and the right pane
          className:"bd:widget.staticText",
          "class":"message",
          value:"RIGHT PANE",
          parentSpace:{
            regionInfo: {
              region:"right",
              size:"20%",
              min:0,
              splitter:true
            }
          }
        }, {
          // and the center
          className:"bd:widget.staticText",
          "class":"message",
          value:"CENTER PANE",
          parentSpace:{
            regionInfo: {
              region:"center"
            }
          }
        }
      ]
   }
  };

//
// STARTUP ROUTINE
//
// The bd.start can be thought of as the entry point to the program (i.e., one can think of it as
// being analogous to "main" in a c/c++ program). See bd.start for details.
//
bd.start({topCreateArgs:initialWidgetTree}, function() {
  //TODO put a message box up...
});

});
// Copyright (c) 2009-2010, ALTOVISO LLC (www.altoviso.com). Use, modification, and distribution subject to terms of license.

