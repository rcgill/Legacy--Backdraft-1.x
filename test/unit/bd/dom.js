define(["dojo", "bd", "bd/dom"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/dom",
  theFunction("[bd.isDomNode]",
    demo("[*]", function() {
      the(bd.isDomNode(undefined)).is(false);
      the(bd.isDomNode(null)).is(false);
      the(bd.isDomNode(0)).is(false);
      the(bd.isDomNode("")).is(false);
      the(bd.isDomNode(1)).is(false);
      the(bd.isDomNode("someNode")).is(false);
      the(bd.isDomNode(bd.body)).is(true);
      the(bd.isDomNode(bd.body.firstChild)).is(true);
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
