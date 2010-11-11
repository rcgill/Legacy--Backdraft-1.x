define(["dojo", "bd", "bd/symbols"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/symbols", userDemo(function() {
  // inspect an undefined symbol...
  var aSymbol= bd.uid();
  the(bd.symbols[aSymbol]).is(undefined);

  // requesting a symbol automatically creates it
  var s= bd.symbol(aSymbol);
  the(s.name).is(aSymbol);

  // requesting a preexisting symbol, returns it
  the(s).is(bd.symbol(aSymbol));

  var 
    o1= {
      type: bd.symbol("type1")
    },
    o2= {
      type: bd.symbol("type1")
    },
    o3= {
      type: bd.symbol("type2")
    };
 
  // notice identity operation "is"
  the(o1.type).is(o2.type);
  the(o1.type).isNot(o3.type);
  
  // we can also use a string...
  the(o1.type).is(bd.symbol("type1"));
  // but, we can do better...
  // probably keep type1 around for reuse
  var type1= bd.symbol("type1"); 
  // fast, no string comparison
  the(o1.type).is(type1);               
  // or...fast, no string comparison
  the(o1.type1).is(bd.symbol.type1);
}));

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
