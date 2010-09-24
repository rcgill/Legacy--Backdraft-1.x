(function() {

//#include bd/test/testHelpers

module("dijit-widgets", dojo.map([
  ["form.Button","button"],
  ["form.Checkbox","checkbox"],
  ["form.ComboBox","combobox"]], function(name) {
  return bd.test.userDemo({
    name:"dijit." + name[0],
    doc:"demonstration and test of " + name[1] + " (dijit." + name[0] + ")",
    traits:{extern:true}
  }, function(space) {
    return space.sandbox("bd-unit/dijit/demo.html?widget=" + name[1], "unit/bd/dijit/common");
  });
}));

})();
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
