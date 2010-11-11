define("checkBox", ["bd", "bd/widget/labeled", "bd/widget/checkBox"], function(bd) {
  var descriptor= {
    className:'bd:widget.pane',
    name:'demo',
    title:'Demo',
    children:[{
      className:'bd:widget.staticText',
      value:"CheckButton Widget Demo (bd/widget/checkBox)",
      "class":"bdPaneHeader"
    }]
  };

  var 
    count= 0,
    widgetPosit= function() {
      var c= count++;
      return {top:((c * 5) + 4) + "em", left:"10em", height:"4em", width:"15em"};
    };

  descriptor.children.push(
    { // all defaults
      className:"bd:widget.checkBox",
      label:"Are you happy or sad?",
      style:widgetPosit()
    }, { // all defaults, multiple-line question
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      style:widgetPosit()
    }, { // button: top-left, question: top-left
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"tl-tl-l-tl-tl",
      style:widgetPosit()
    }, { // etc.
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"tl-tl-l-cl-cl",
      style:widgetPosit()
    }, {
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"cl-cl-l-tl-tl",
      style:widgetPosit()
    }, {
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"cl-cl-l-cl-cl",
      style:widgetPosit()
    }, {
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"bl-bl-l-tl-tl",
      style:widgetPosit()
    }, {
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"bl-bl-l-cl-cl",
      style:widgetPosit()
    }, { // button: top-right, question: top-right
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"tr-tr-r-tr-tr",
      style:widgetPosit()
    }, { // etc.
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"tr-tr-r-cr-cr",
      style:widgetPosit()
    }, {
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"cr-cr-r-tr-tr",
      style:widgetPosit()
    }, {
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"cr-cr-r-cr-cr",
      style:widgetPosit()
    }, {
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"br-br-r-tr-tr",
      style:widgetPosit()
    }, {
      className:"bd:widget.checkBox",
      label:"Are you glad or mad or happy or sad?",
      format:"br-br-r-cr-cr",
      style:widgetPosit()
    }
  );

  bd.start({topCreateArgs: {
    parent:"root",
    descriptor:descriptor
  }});
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
