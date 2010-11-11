define(["dojo", "bd", "bd/connect"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/declare",
  theFunction("[bd.declare]", demo("[*]", function() {
    var o, result;

    //no className given...
    var result1= bd.declare(null, {x:1});
    o= new result1();
    the(o.x).is(1);

    result= bd.declare([], {x:3});
    o= new result();
    the(o.x).is(3);

    result= bd.declare([result1], {y:4});
    o= new result();
    the(o.x).is(1);
    the(o.y).is(4);

    //className not a bd.moduleName; therefore context must be given

    //context an object
    var mySpace= {};
    result= bd.declare("classes.c2", mySpace, null, {x:6});
    o= new result();
    the(mySpace.classes.c2).is(result);
    the(o.x).is(6);
    the(o.constructor.declaredClass).is("classes.c2");

    result= bd.declare("classes.c3", mySpace, [], {x:7});
    o= new result();
    the(mySpace.classes.c3).is(result);
    the(o.x).is(7);
    the(o.constructor.declaredClass).is("classes.c3");

    result= bd.declare("classes.c4", mySpace, [result1], {y:8});
    o= new result();
    the(mySpace.classes.c4).is(result);
    the(o.x).is(1);
    the(o.y).is(8);
    the(o.constructor.declaredClass).is("classes.c4");

    //context a module name
    dojo.undef("myModule");
    define("myModule", [], function() { return {}; });
    result= bd.declare("classes.c6", "myModule", null, {x:10});
    o= new result();
    the(dojo.module("myModule").classes.c6).is(result);
    the(o.x).is(10);
    the(o.constructor.declaredClass).is("classes.c6");

    result= bd.declare("classes.c7", "myModule", [], {x:11});
    o= new result();
    the(dojo.module("myModule").classes.c7).is(result);
    the(o.x).is(11);
    the(o.constructor.declaredClass).is("classes.c7");

    result= bd.declare("classes.c8", "myModule", [result1], {y:12});
    o= new result();
    the(dojo.module("myModule").classes.c8).is(result);
    the(o.x).is(1);
    the(o.y).is(12);
    the(o.constructor.declaredClass).is("classes.c8");

    //classname is a bd.moduleName
    result= bd.declare("myModule:classes.c10", null, {x:14});
    o= new result();
    the(dojo.module("myModule").classes.c10).is(result);
    the(o.x).is(14);
    the(o.constructor.declaredClass).is("myModule:classes.c10");

    result= bd.declare("myModule:classes.c11", [], {x:15});
    o= new result();
    the(dojo.module("myModule").classes.c11).is(result);
    the(o.x).is(15);
    the(o.constructor.declaredClass).is("myModule:classes.c11");

    result= bd.declare("myModule:classes.c12", [result1], {y:16});
    o= new result();
    the(dojo.module("myModule").classes.c12).is(result);
    the(o.x).is(1);
    the(o.y).is(16);
    the(o.constructor.declaredClass).is("myModule:classes.c12");    
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
