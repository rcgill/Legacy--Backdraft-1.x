define("borderContainer", ["bd"], function(bd) {
  var descriptor= {
    className:'bd:widget.pane',
    name:'demo',
    title:'Demo',
    children:[{
      className:'bd:widget.staticText',
      text:"Border Container Widget Demo (bd/widget/labeled)",
      "class":"paneHeader"
    }]
  };

  var 
    count= 0,
    widgetPosit= function() {
      return {top:(((count++)*320)+60) + "px", left:"10px", height:"300px", width:"300px", border:"1px solid purple", position:"absolute"};
    };

  //all combinations of children X (headline, design) X (no-splitters, splitters)
  var splitter= false;
  function getChild(region) {
    return {
      className:"bd:widget.staticText",
      "class":region,
      text:region,
      textPosit:"c-c",
      parentSpace: {
        regionInfo: {
          region:region,
          size:"25%",
          splitter:splitter
        }
      }
    };
  }

  var design= "headline";
  function add(combo) {
    descriptor.children.push({
      className:"bd:widget.borderContainer",
      design:design,
      style:widgetPosit(),
      children:combo
    });
  }

  function getCombos(list) {
    if (list.length==0) return [];
    var 
      restResult= getCombos(list.slice(1)),
      thisChild= getChild(list[0]),
      append= [[thisChild]];
    add([thisChild]);
    bd.forEach(restResult, function(item) {
      var combo= item.concat(thisChild);
      add(combo);
      append.push(combo);
    });
    return append.concat(restResult);
  }
  
  splitter= true;
  add([getChild("top"), getChild("left"), getChild("bottom"), getChild("right"), getChild("center")]);

 /*
  getCombos(["top", "bottom", "left", "right", "center"]);
  design= "sidebar";
  getCombos(["top", "bottom", "left", "right", "center"]);
  splitter= true;
  design= "headline";
  getCombos(["top", "bottom", "left", "right", "center"]);
  design= "sidebar";
  getCombos(["top", "bottom", "left", "right", "center"]);
*/

  bd.start({topCreateArgs: {
    parent:"root",
    descriptor:descriptor
  }});
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
