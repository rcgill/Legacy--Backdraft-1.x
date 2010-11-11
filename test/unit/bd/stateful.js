define(["dojo", "bd", "bd/stateful"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/stateful",
  theClass("[bd.stateful]", demo("[*]", function() {
    var
      watchers= {},
      watcherResults= {},
      makeWatcher= function(name) {
        if (name=="*") {
          return watchers.star= function(name, newValue, oldValue) {
            watcherResults.star= [name, newValue, oldValue];
          };
        } else {
          return watchers[name]= function(newValue, oldValue) {
            watcherResults[name]= [newValue, oldValue];
          };
        }
      },
      myClass= bd.declare([bd.stateful],
        bd.attr("x", 0),
        bd.attr("y", 0),
        bd.attr("color", "blue")
      ),
      o;

    o= new myClass();
    the(o.x).is(0);
    the(o.xGet()).is(0);
    the(o.get("x")).is(0);
    the(o.xSet(1)).is(0);
    the(o.get("x")).is(1);
    the(o.set("x", 2)).is(1);
    the(o.get("x")).is(2);

    the(o.y).is(0);
    the(o.yGet()).is(0);
    the(o.get("y")).is(0);
    the(o.ySet(1)).is(0);
    the(o.get("y")).is(1);
    the(o.set("y", 2)).is(1);
    the(o.get("y")).is(2);

    the(o.color).is("blue");
    the(o.colorGet()).is("blue");
    the(o.get("color")).is("blue");
    the(o.colorSet("red")).is("blue");
    the(o.get("color")).is("red");
    the(o.set("color", "green")).is("red");
    the(o.get("color")).is("green");

    var h1= o.watch("x", makeWatcher("x"));
    var h2= o.watch("*", makeWatcher("*"));
    watcherResults= {};
    o.set("x", 3);
    the(watcherResults.x).hasValue([3, 2]);
    the(watcherResults.star).hasValue(["x", 3, 2]);
    watcherResults= {};
    o.set("y", 4);
    the(watcherResults.x).hasValue(undefined);
    the(watcherResults.star).hasValue(["y", 4, 2]);
    h1.disconnect();
    watcherResults= {};
    o.set("x", 5);
    the(o.get("x")).is(5);
    the(watcherResults.x).is(undefined);
    the(watcherResults.star).hasValue(["x", 5, 3]);
    h2.disconnect();
    watcherResults= {};
    o.set("x", 6);
    the(o.get("x")).is(6);
    the(watcherResults.x).is(undefined);
    the(watcherResults.star).is(undefined);
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
