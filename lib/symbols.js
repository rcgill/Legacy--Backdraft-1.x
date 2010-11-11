define("bd/symbols", [
  "dojo", "bd",
  "bd/collections"
], function(dojo, bd) {
///
// Augments the bd namespace with the Backdraft symbol machinery.

bd.symbols= 
  ///
  // Holds the backdraft symbol table.
  ///
  // The backdraft symbol table provides a mapping from any string (the
  // symbol name) to an object that is guaranteed to have
  // the property name that holds a string with the symbol name. Symbols are
  // added with the function bd.symbol. For example:
  //code
  // var s= bd.symbol("mySymbol"); //creates the symbol, iff required
  // s.name=="mySymbol";           //true
  // s===bd.symbol("mySymbol");    //true, bd.symbol simply returns an existing symbol
  ///
  // Symbols can be used for many different purposes. For example, a symbol can be
  // used to generate a type field without having to rely on a string:
  //code
  // var 
  //   o1= {
  //     type: bd.symbol("type1")
  //   },
  //   o2= {
  //     type: bd.symbol("type1")
  //   },
  //   o3= {
  //     type: bd.symbol("type2")
  //   };
  // 
  // o1.type===o2.type; //true; note identity operator, no string comparison required!
  // o1.type===o3.type; //false
  // 
  // o1.type===bd.symbol("type1");  //true; note identity operator, but we used a string; we can do better...
  // var type1= bd.symbol("type1"); //probably keep type1 around for reuse
  // o1.type===type1;               //true, fast, no string comparison
  // //or...
  // o1.type1===bd.symbol.type1;    //true, fast, no string comparison
  // 
  ///
  // Of course the logic above could be spread widely within a large program and the
  // symbol properties are guaranteed.
  // 
  // There are many other interesting ways to use symbols. 
  // 
  //warn
  // Do not add properties to bd.symbols directly; use bd.symbol.
  //note
  // It is OK to access bd.symbol directly (e.g. bd.symbol.coolOp) so long
  // as program logic can guarantee that the symbol has already been created.
  {};

bd.symbol= function(
  name //(string) The target name.
) {
  ///
  // Returns the symbol object given by name. //The symbol is automatically
  // created if it does not already exist.
  return bd.symbols[name] || (bd.symbols[name]= {name:name});///(object) bd.symbols[name]
};

bd.createSymbols= function(
  symbols //(array of string) The set of names to ensure exist as symbols.
) {
  ///
  // Ensures that each name given in symbols has generated a symbol in bd.symbols.
  bd.forEach(symbols, function(symbol){ bd.symbol(symbol); });
};

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

