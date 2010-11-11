define("dialog", ["bd", "bd/widget/dialog"], function(bd) {
  var descriptor= {
    className:'bd:widget.pane',
    name:'demo',
    title:'Demo',
    children:[{
      className:'bd:widget.staticText',
      text:"Dialog Widget Demo (bd/widget/dialog)",
      "class":"paneHeader"
    }]
  };

  function showDialog() {
    bd.createWidget({descriptor:{
      className:"bd:widget.dialog",
      frameSize: {height:"10em", width:"30em"},
      sizeable: false,
      layout: function() {
        var mb= dojo.marginBox(this.containerNode);
        dojo.marginBox(this.children[0].domNode, {h:mb.h, w:mb.w});
        this.children[0].layout();
      },
      children: [{
        className:"bd:widget.staticText",
        text:"Now is the time for all good",
        textPosit:"c-c",
        style:{position:"relative"}
      }]
    }}, function(dialog){ dialog.show(); });
  }

  bd.start({topCreateArgs: {
    parent:"root",
    descriptor:descriptor
  }}, showDialog);
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
