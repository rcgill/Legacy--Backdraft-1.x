define(["dojo", "dijit", "bd", "bd/test"], function(dojo, dijit, bd) {

//#include bd/test/testHelpers

module("unit.bd.widget.checkbox",
  demo("clicking within the checkbox toggles the checkbox value", function(space) {
    var checkbox;
    checkbox= bd.widget.getChild(bd.root, "demo/checkbox1");
    the(checkbox.attr("value")).is(0);
    space.play("mouseclick", checkbox);
    the(checkbox.attr("value")).is(1);
    space.play("mouseclick", [bd.root, "child:demo/checkbox1"]);
    space.play("mouseclick", bd.root.getChild("demo").getChild("checkbox2"));
    //space.play("mouseclick", "checkbox3");
    //space.play("keytype", 0, "\t\t\t ");
    //robot.setFocus(dijit.byId("checkbox1"), function() {
    //the(dijit.byId("checkbox1").attr("value")).is("0");
    //robot.click();
    //the(dijit.byId("checkbox1").attr("value")).is("1");
    //robot.click();
    //the(dijit.byId("checkbox1").attr("value")).is("0");
  })/*,
  demo("clicking the first three checkboxed", function(space) {
    var robot= space.robot;
    for (var i= 1; i<4; i++) {
      robot.setFocus(dijit.byId("checkbox"+i), function() {
        //the(dijit.byId("checkbox"+i).attr("value")).is("0");
        robot.click();
        //the(dijit.byId("checkbox"+i).attr("value")).is("1");
      });
    }
  })
*/

);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
