define("labeled", ["bd"], function(bd) {
  var descriptor= {
    className:'bd:widget.pane',
    name:'demo',
    title:'Demo',
    children:[{
      className:'bd:widget.staticText',
      value:"Labeled Widget Demo (bd/widget/labeled)",
      "class":"bdPaneHeader"
    }]
  };

  var 
    count= 0,
    widgetPosit= function() {
      var c= count++;
      return {top:((Math.floor(c / 3)*6)+4) + "em", left:(((c % 3)*20)+10) +"em", height:"3em", width:"15em"};
    },
    singlePosits= "tl.tc.tr.cl.cc.cr.bl.bc.br".split("."),
    posits= [];

  bd.forEach(singlePosits, function(targetPosit) { 
    bd.forEach(singlePosits, function(referencePosit) {
      posits.push(targetPosit + "-" + referencePosit); 
    });
  });

  // put a short label at each position, no child
  bd.forEach(posits, function(posit) {
    descriptor.children.push({
      className:"bd:widget.labeled",
      name:posit,
      "class":"showBoxes",
      style:widgetPosit(),
      label:posit,
      labelPosit:posit,
      labelClass:"showLabelBox"
    });
  });

  // this time, no label, but a child widget...
  bd.forEach(posits, function(posit) {
    descriptor.children.push({
      className:"bd:widget.labeled",
      name:posit,
      "class":"showBoxes",
      style:widgetPosit(),
      childPosit:posit,
      child: {
        className:"bd:widget.staticText",
        value:posit,
        "class":"showChildBox"
      }
    });
  });

  bd.start({topCreateArgs: {
    parent:"root",
    descriptor:descriptor
  }});
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
