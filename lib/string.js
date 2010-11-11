define("bd/string", ["bd/kernel", "dojo"], function(bd, dojo) {
///
// Augments the bd namespace with several functions that operate on strings.
// 
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.


// bd references some of dojo base so that the code isn't so tightly coupled to dojo--
// theoretically, the following could be changed to reference another library with
// identical semantics and everything would still work.
bd.replace= 
  ///
  // Alias for dojo.replace.
  dojo.replace;

bd.trim= 
  ///
  // Alias for dojo.trim.
  dojo.trim;

bd.toJson= 
  ///
  // Alias for dojo.toJson.
  dojo.toJson;

bd.toJsonIndentStr=
  ///
  // Alias for dojo.toJsonIndentStr.
  dojo.toJsonIndentStr;

});

