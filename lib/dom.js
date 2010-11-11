define("bd/dom", [
  "dojo", "bd"
], function(dojo, bd) {
///
// Augments the bd namespace with DOM-related convenience functions.

bd.isDomNode= function(
  node //(any) The object to test.
) {
  ///
  // Tests node to see if it is a DOM node. //
  //return
  //(true) node is a DOM node.
  //(false) node is not a DOM node.
  ///
  return !!(node && (node.addEventListener || node.attachEvent));
};

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

