define("textBox", ["bd", "bd/dijit/textBox"], function(bd) {
  var descriptor= {
    className:'bd:widget.pane',
    name:'demo',
    title:'Demo',
    children:[{
      className:'bd:widget.staticText',
      text:"TextBox Dojo Widget Demo (bd/dijit/textBox)",
      "class":"paneHeader"
    }]
  };

  descriptor.children.push({
    className:"bd:dijit.textBox"
  });

  bd.start({topCreateArgs: {
    parent:"root",
    descriptor:descriptor
  }});
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
