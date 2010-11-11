define("stateButton", ["bd", "bd/css"], function(bd) {
  var 
    count= 0,
    posit= function() {
      return bd.mix({position:"absolute"}, bd.css.emBox({t:((count++)*3)+2, l:2}));
    },
    descriptor= {
      className:'bd:widget.pane',
      name:'demo',
      title:'Demo',
      children:[{
        className:'bd:widget.staticText',
        value:"State Button Widget Demo (bd/widget/stateButton)",
        "class":"bdPaneHeader"
      },{
        className: "bd:widget.stateButton",
        style: bd.mix(posit(), {fontSize:"300%", width:"1em", height:"1em"})
      },{
        className: "bd:widget.stateButton",
        sequence:[["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"]],
        style: bd.mix(posit(), {fontSize:"300%", width:"1em", height:"1em"})
      }]
    };

  bd.start({topCreateArgs: {
    parent:"root",
    descriptor:descriptor
  }});
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
