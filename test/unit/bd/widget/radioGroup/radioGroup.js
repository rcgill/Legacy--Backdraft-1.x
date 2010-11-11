define("radioGroup", ["bd"], function(bd) {
  var descriptor= {
    className:'bd:widget.pane',
    name:'demo',
    title:'Demo',
    children:[{
      className:'bd:widget.staticText',
      value:"Radio Group Widget Demo (bd/widget/labeled)",
      "class":"bdPaneHeader"
    }]
  };

  var 
    count= 1,
    widgetPosit= function() {
      return {top:((count++)*13) + "em", left:"20em", height:"6em", width:"16em"};
    };

  descriptor.children.push({
    className:"bd:widget.radioGroup",
    style:widgetPosit(),
    label:"What were you thinking?",
    labelPosit:"tl-tl",
    format:"b-column",
    buttons: [
      [1, "Yes"],
      [2, "No"],
      [3, "Maybe so"]
    ]
  });
  bd.start({topCreateArgs: {
    parent:"root",
    descriptor:descriptor
  }});
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
