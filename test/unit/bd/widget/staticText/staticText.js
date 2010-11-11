define("staticText", ["bd", "bd/css"], function(bd) {
  bd.start();  
  var descriptor= {
    className:'bd:widget.pane',
    name:'demo',
    title:'Demo',
    onLoad:function() {
      var pane= this;
      bd.connect(this.domNode, "click", function() {
        var now= bd.getTime();
        bd.forEach(pane.children, function(child) {child.layout();});
        console.log("total time:" + (bd.getTime() - now));
      });
    },
    children:[{
      className:'bd:widget.staticText',
      text:"Static Text Widget Demo (bd/widget/staticText)",
      "class":"paneHeader"
    }]
  };

  var 
    count= 3,
    widgetPosit= function() {
      return {top:((count++)*6) + "em", left:"20em", height:"3em", width:"15em"};
    },
    posits= "tl-tl.tl-tr.tl-bl.tl-br.tc-t.tc-b.tr-tl.tr-tr.tr-bl.tr-br.cl-l.cl-r.c-c.cr-l.cr-r.bl-tl.bl-tr.bl-bl.bl-br.bc-t.bc-b.br-tl.br-tr.br-bl.br-br".split(".");

  bd.forEach(posits, function(posit) {
    descriptor.children.push({
      className:"bd:widget.staticText",
      name:posit,
      "class":"showBoxes",
      text:"posit= " + posit,
      textPosit:posit,
      style:widgetPosit()
    });
  });
  bd.forEach(posits, function(posit) {
    descriptor.children.push({
      className:"bd:widget.staticText",
      name:posit,
      "class":"showBoxes",
      text:"posit= " + posit + "; Now is the time for all good men",
      textPosit:posit,
      style:widgetPosit()
    });
  });
  bd.createWidget({
    parent:"root",
    descriptor:descriptor
  });
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
