define(["dojo", "bd", "bd/descriptor/processor"], function(dojo, bd) {

//#include bd/test/testHelpers

module("The module bd/descriptor/processor", userDemo(function(space) {
  // here's a descriptor with some nested children to play with...
  var descriptor= {
    name:"grandPa",
    children: [{
      name:"pa",
      children:[{
        name:"John-Boy"
      }, {
        name:"Mary-Ellen"
      }]
    }, {
      name:"Carol",
      children:[{
        name:"Marcia"
      }, {
        name:"Jan"
      }, {
        name:"Cindy"
      }]
    }]
  };
  
  bd.descriptor.processor(descriptor, ["autoTabOrder"]);
  the(descriptor.tabOrder).is(undefined);
  the(descriptor.children[0].tabOrder).is(1);
  the(descriptor.children[0].children[0].tabOrder).is(2);
  the(descriptor.children[0].children[1].tabOrder).is(3);
  the(descriptor.children[1].tabOrder).is(4);
  the(descriptor.children[1].children[0].tabOrder).is(5);
  the(descriptor.children[1].children[1].tabOrder).is(6);
  the(descriptor.children[1].children[2].tabOrder).is(7);

  bd.descriptor.processor(descriptor, [["autoTabOrder", 10]]);
  the(descriptor.tabOrder).is(undefined);
  the(descriptor.children[0].tabOrder).is(10);
  the(descriptor.children[0].children[0].tabOrder).is(11);
  the(descriptor.children[0].children[1].tabOrder).is(12);
  the(descriptor.children[1].tabOrder).is(13);
  the(descriptor.children[1].children[0].tabOrder).is(14);
  the(descriptor.children[1].children[1].tabOrder).is(15);
  the(descriptor.children[1].children[2].tabOrder).is(16);

}));

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
