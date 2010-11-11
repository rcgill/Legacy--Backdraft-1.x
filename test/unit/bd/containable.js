define(["bd", "bd/containable"], function(bd) {

//#include bd/test/testHelpers

module("The module bd/containable", theClass("[bd.containable]", userDemo("[*]", function(space) {
  //bd.declare a new class that has the attribute "color" with the accessors "getColor" and "setColor"...
  //...and mixes bd.containable (in this case it's a direct superclass; we'll do a "mixin" in a moment
  var myClass= bd.declare([bd.containable], {
    color: "red",
    getColor: function() {
      return this.color;
    },
    setColor: function(
      value
    ){
      this.color= value;
      return this;
    }
  });

  //so far as it's own color attribute is concerned, everthing works as expected...
  var o= new myClass();
  the(o.color).is("red");
  the(o.getColor()).is("red");
  o.setColor("blue");
  the(o.color).is("blue");

  //now, some other object wants to store a color attribute in o...
  //bd.containable allows this without stepping on o's own color...

  //if not set and no default given, then the initial value is bd.notFound...
  the(o.getParentProp("color")).is(bd.notFound);

  //a default can be given; but it is ignored after the first access (like the one above)
  the(o.getParentProp("color", "purple")).isNot("purple");
  the(o.getParentProp("color", "purple")).is(bd.notFound);

  //here is an example of setting the value on first access..
  o= new myClass();
  the(o.getParentProp("color", "purple")).is("purple");

  //after the first access, the property is accessed by (get/set)ParentProp...
  o.setParentProp("color", "yellow");
  the(o.getParentProp("color")).is("yellow");

  //of course the object's own color property is left untouched (remember we created another o, so its color is still red)
  the(o.color).is("red");
  the(o.getParentProp("color")).is("yellow");
  o.setColor("purple");
  the(o.color).is("purple");
  the(o.getParentProp("color")).is("yellow");
  o.setParentProp("color", "black");
  the(o.color).is("purple");
  the(o.getParentProp("color")).is("black");

  //client code need not "get" before "set"...
  o= new myClass();
  o.setParentProp("color", "green");
  the(o.getParentProp("color")).is("green");

  // if you want to override the default behavior, ensure the functions
  // <property-name>(Get|Set)PP are defined;
  //(get|set)ParentProp delegate to these functions if they exist...
  o.colorGetPP= function() {
    return "brown";
  };
  var test= "";
  o.colorSetPP= function() {
    test= "These functions can do whatever you want";
  };
  the(o.getParentProp("color")).is("brown");

  //overrides can do anything, but setParentProp will _always_ return the object...
  the(o.setParentProp("color", "white")).is(o);
  the(test).is("These functions can do whatever you want");

  //that's enough of that nonsense, lets reset o
  o= new myClass();

  //several properties can be set at once by providing a hash
  o.setParentProp({firstName:"Rawld", lastName:"Gill"});
  the(o.getParentProp("firstName")).is("Rawld");
  the(o.getParentProp("lastName")).is("Gill");

  //if the object has a descriptor with the property "parentSpace", and the target property is
  //the descriptor.parentSpace object, then that value is used for initialization and is
  //preferred over a provided default
  o= new myClass();
  o.descriptor= {parentSpace:{color:"grey"}};
  the(o.getParentProp("color", "red")).is("grey");

  //of course this all works for a "regular" mixin...
  var myBaseClass= bd.declare([], {});
  myClass= bd.declare([myBaseClass, bd.containable], {
    color: "red",
    getColor: function() {
      return this.color;
    },
    setColor: function(
      value
    ){
      this.color= value;
      return this;
    }
  });

  o= new myClass();
  the(o.color).is("red");
  the(o.getParentProp("color", "purple")).is("purple");
  the(o.getParentProp("color")).is("purple");
  the(o.setParentProp("color", "green")).is(o);
  the(o.getParentProp("color")).is("green");
})));

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
