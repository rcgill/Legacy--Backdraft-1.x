define(["dojo", "bd", "bd/id", "bd/stateful"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/id",
  theClass("[bd.id]", demo("[*]", function() {
    var 
      myClass1= bd.declare([bd.id], {}),
      myClass2= bd.declare([bd.id, bd.stateful], {}),
      o1, o2;
    o1= new myClass1();
    the(o1.id).isString();
    the(o1.idGet()).isString();
    the(o1.id).isString(o1.idGet());
    the(function() { o1.idSet(); }).raises();

    o2= new myClass1();
    the(o1.id).isNot(o2.id);

    o2= new myClass2();
    the(o2.get("id")).is(o2.id);
    the(o2.get("id")).isNot(o1.id);
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
