define("bd", [
  "bd/kernel", 
  "bd/lang",
  "bd/declare",
  "bd/hash",
  "bd/clone",
  "bd/equal",
  "bd/connect",
  "bd/collections",
  "bd/string",
  "bd/creators",
  "bd/start",
  "bd/buildTools"
], function(bd) {
///
// Creates, initializes, and holds to the bd namespace.
///
// Creates the bd namespace and several foundational constants, variables, and functions. Use this module
// to gain access to the bd namespace. For example,
//
//code
// define("my/module", ["bd"], function(bd) {
//   //get the current time...
//   bd.getTime();
// });
/// 
// The actual work of creating and initializing the bd object is delegated to the module bd/kernel, and several other modules (bd/lang,
// etc.) add foundational content the the bd object. It is an easy matter to redefine the bd namespace to hold more or less than this default
// definition. For example, if you a building several applications that all require the Backdraft command
// machinery, then you could define your own bd module as...
//code
//  define("bd", [
//    "bd/kernel", 
//    "bd/lang",
//    "bd/declare",
//    "bd/hash",
//    "bd/clone",
//    "bd/equal",
//    "bd/connect",
//    "bd/collections",
//    "bd/string",
//    "bd/creators",
//    "bd/start"
//    "bd/command/accelerators",
//    "bd/command/dispatch",
//    "bd/command/item"
//  ], function(bd) {
//    return bd;
//  });
///
// By loading this module (instead of the default bd module), the command framework would
// be included without having to explicitly load it.
//warn
// Refrain from modifying the bd module resource directly. Instead, create a new resource located 
// outside the Backdraft tree and adjust dojo.urlMap to resolve the module bd to
// the selected location.
  return bd;
});
// Copyright (c) 2008-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
