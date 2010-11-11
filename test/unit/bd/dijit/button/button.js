define("button", ["bd", "dijit", "bd/dijit/button", "dijit/Menu", "bd/widget/messageBox"], function(bd, dijit) {
  var descriptor= {
    className:'bd:widget.pane',
    name:'demo',
    title:'Demo',
    children:[{
      className:'bd:widget.staticText',
      text:"TextBox Dojo Widget Demo (bd/dijit/button)",
      "class":"paneHeader"
    }]
  };

  var
    count= 1,
    widgetPosit= function() {
      return {top:(((count++)*5)+5) + "em", left:"20em", height:"3em", width:"10em", position:"absolute"};
    },
    buttonNumber= 1,
    makeButton= function(role, props) {
      var 
        name= "button" + (buttonNumber++),
        result= {
          className:"bd:widget.labeled",
          "class":"showBoxes",
          style:widgetPosit(),
          label:name + " (" + role + "):",
          labelPosit:"tl-tl",
          childPosit:"c-c",
          reflect:false,
          child: {
            name:name,
            id:name,
            className:"bd:dijit.button",
            label:name,
            style:{position:"absolute"},
            onClick: function() {
              console.log(name + " button clicked");
              bd.widget.messageBox("This is the title", "This is the message!<br/> Now is the time for all good men<br/> to come to the aid of the U.S.A.F.!!", ["OK", "Cancel"], function(clicked) {console.log(clicked);});
            }
          }
        };
      bd.mix(result.child, props);
      return result;
    },
    menu = new dijit.Menu();

  menu.addChild(new dijit.MenuItem({label:"Menu Item 1"}));
  menu.addChild(new dijit.MenuItem({label:"Menu Item 2"}));
  menu.addChild(new dijit.MenuItem({label:"Menu Item 3"}));

    
  descriptor.children.push(
    makeButton("normal button", {}),
    makeButton("disabled", {disabled:true}),
    makeButton("!visible", {visible:false}),
    makeButton("normal button", {className:"bd:dijit.toggleButton", iconClass:"dijitCheckBoxIcon"}),
    makeButton("disabled", {className:"bd:dijit.toggleButton", iconClass:"dijitCheckBoxIcon", disabled:true}),
    makeButton("!visible", {className:"bd:dijit.toggleButton", iconClass:"dijitCheckBoxIcon", visible:false}),
    makeButton("normal button", {className:"bd:dijit.dropDownButton", dropDown:menu}),
    makeButton("disabled", {disabled:true, className:"bd:dijit.dropDownButton", dropDown:menu}),
    makeButton("!visible", {visible:false, className:"bd:dijit.dropDownButton", dropDown:menu}),
    makeButton("normal button", {className:"bd:dijit.comboButton", dropDown:menu}),
    makeButton("disabled", {disabled:true, className:"bd:dijit.comboButton", dropDown:menu}),
    makeButton("!visible", {visible:false, className:"bd:dijit.comboButton", dropDown:menu})
//    makeButton("!visible", {className:"bd:dijit.colorPalette"})
  );

  bd.start({topCreateArgs: {
    parent:"root",
    descriptor:descriptor
  }});
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
