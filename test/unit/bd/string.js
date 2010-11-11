define(["dojo", "bd", "bd/dom"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/string",
  theFunction("bd.replace",
    demo("[*] Is identical to dojo.replace", function() {
      the(bd.replace).is(dojo.replace);
    })
  ),
  theFunction("bd.trim",
    demo("[*] Is identical to dojo.trim", function() {
      the(bd.trim).is(dojo.trim);
    })
  ),
  theFunction("bd.toJson",
    demo("[*] Is identical to dojo.toJson", function() {
      the(bd.toJson).is(dojo.toJson);
    })
  ),
  theFunction("bd.toJsonIndentStr",
    demo("[*] Is identical to dojo.toJsonIndentStr", function() {
      the(bd.toJsonIndentStr).is(dojo.toJsonIndentStr);
    })
  )
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
