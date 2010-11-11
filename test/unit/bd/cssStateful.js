define(["dojo", "bd", "bd/cssStateful"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString
    //e.g.

module("The module bd/cssStateful",
  theClass("[bd.cssStateful]", demo("[*]", function() {
    var
      baseClass= dojo.declare([], {
        ltr: true,
        isLeftToRight: function() { return this.ltr; },
        selected: false,
        disabled: false,
        readOnly: false,
        focused: false,
        active: false,
        hover: false,
        state: false,
        foo: false,
    
        get: function(name) {
          return name=="state" ? (this.state ? "state" : "") : this[name];
        },

        watch: 
          //just catch the request, the test code will simulate sending the watch notifications
          bd.noop,

        constructor: function() {
          //a place to sink the class changes
          this.domNode= {className:""};
        },

        // cssStateful is intended to be used with the bd.object framework than includes phased creation; see bd.visual
        postscript: function() {
          this.create("precreateDom");
          this.create("createDom");
          this.create("postcreateDom");
          this.create("finish");
        }
      }),

      testClass= dojo.declare([baseClass, bd.cssStateful], {
        cssStatefulWatch: {rtl:0, state:0, selected:0, focused:0, disabled:0, readOnly:0, active:0, hover:0}
      });

    function same(expected) {
      var s= widget.domNode.className;
      if (expected) {
        expected= expected.split(" ").sort();
      } else {
        //expected was empty...
        the(expected).is(s);
      }
      if (s) {
        s= s.split(" ").sort();
      }
      the(expected).hasValue(s);
    }

      
    var widget;
    widget= new testClass();
    same("");

    //twiddle each attribute on and off one at a time
    var exercise= {
      ltr: "Rtl",
      selected: "Selected",
      disabled: "Disabled",
      readOnly: "ReadOnly",
      focused: "Focused",
      active: "Active",
      hover: "Hover",
      state: "state"
    };
    bd.forEachHash(exercise, function(expected, attribute) {
      widget[attribute]= !widget[attribute];
      widget.cssStatefulSetClass();
      same(expected);
      widget[attribute]= !widget[attribute];
      widget.cssStatefulSetClass();
      same("");
    });

    //do it again, this time start class string with a class that's not a state class
    widget.domNode.className= "myClass";
    bd.forEachHash(exercise, function(expected, attribute) {
      widget[attribute]= !widget[attribute];
      widget.cssStatefulSetClass();
      same("myClass " + expected);
      widget[attribute]= !widget[attribute];
      widget.cssStatefulSetClass();
      same("myClass");
    });

    //twiddle each until all twiddled, and then back again
    widget.domNode.className= "";
    var totalExpected= [];
    bd.forEachHash(exercise, function(expected, attribute) {
      if (attribute=="hover") {
        //don't test this since it interacts with active.
        return;
      }
      totalExpected.push(expected);
      widget[attribute]= !widget[attribute];
      widget.cssStatefulSetClass();
      same(totalExpected.join(" "));
    });
    bd.forEachHash(exercise, function(expected, attribute) {
      if (attribute=="hover") {
        //don't test this since it interacts with active.
        return;
      }
      totalExpected.splice(bd.indexOf(totalExpected, expected), 1);
      widget[attribute]= !widget[attribute];
      widget.cssStatefulSetClass();
      same(totalExpected.join(" "));
    });
    the(widget.domNode.className).is("");

    //test the active/hover interaction
    widget.domNode.className= "";
    widget.hover= true;    
    widget.cssStatefulSetClass();
    same("Hover");
    widget.active= true;    
    widget.cssStatefulSetClass();
    same("Active");
    widget.active= false;    
    widget.cssStatefulSetClass();
    same("Hover");

    //with a non-multiplying base state
    testClass= dojo.declare([baseClass, bd.cssStateful], {
      cssStatefulWatch: {rtl:0, state:0, selected:0, focused:0, disabled:0, readOnly:0, active:0, hover:0},
      cssStatefulBases: {coolbar:0}
    });
    widget= new testClass();
    the(widget.domNode.className).is("coolbar");
    bd.forEachHash(exercise, function(expected, attribute) {
      widget[attribute]= !widget[attribute];
      widget.cssStatefulSetClass();
      same("coolbar " + expected);
      widget[attribute]= !widget[attribute];
      widget.cssStatefulSetClass();
      same("coolbar");
    });

    //test multiplying properties
    testClass= dojo.declare([baseClass, bd.cssStateful], {
      cssStatefulBases: {coolbar:0},
      cssStatefulWatch: {selected:1, readOnly:2, focused:3}
    });
    widget= new testClass();
    the(widget.domNode.className).is("coolbar");
    widget.selected= true;
    widget.cssStatefulSetClass();
    same("coolbar Selected");
    widget.readOnly= true;
    widget.cssStatefulSetClass();
    same("coolbar Selected ReadOnly SelectedReadOnly");
    widget.focused= true;
    widget.cssStatefulSetClass();
    same("coolbar Selected ReadOnly Focused SelectedReadOnly SelectedFocused ReadOnlyFocused SelectedReadOnlyFocused");
    widget.selected= false;
    widget.cssStatefulSetClass();
    same("coolbar ReadOnly Focused ReadOnlyFocused");
    widget.readOnly= false;
    widget.cssStatefulSetClass();
    same("coolbar Focused");
    widget.focused= false;
    widget.cssStatefulSetClass();
    same("coolbar");

    widget.domNode.className= "myClass";
    widget.cssStatefulSetClass();
    the(widget.domNode.className).is("myClass coolbar");
    widget.selected= true;
    widget.cssStatefulSetClass();
    same("myClass coolbar Selected");
    widget.readOnly= true;
    widget.cssStatefulSetClass();
    same("myClass coolbar Selected ReadOnly SelectedReadOnly");
    widget.focused= true;
    widget.cssStatefulSetClass();
    same("myClass coolbar Selected ReadOnly Focused SelectedReadOnly SelectedFocused ReadOnlyFocused SelectedReadOnlyFocused");
    widget.selected= false;
    widget.cssStatefulSetClass();
    same("myClass coolbar ReadOnly Focused ReadOnlyFocused");
    widget.readOnly= false;
    widget.cssStatefulSetClass();
    same("myClass coolbar Focused");
    widget.focused= false;
    widget.cssStatefulSetClass();
    same("myClass coolbar");


    testClass= dojo.declare([baseClass, bd.cssStateful], {
      cssStatefulBases: {coolbar:0},
      cssStatefulWatch: {selected:1, readOnly:2, foo:99},
      cssStatefulGet: function(name, value) {
        //override to take care of foo
        if (name=="foo") {
          return value && "Foo";
        } else {
          return this.inherited(arguments);
        }
      }
    });
    widget= new testClass();
    same("coolbar");
    widget.domNode.className= "myClass";
    widget.cssStatefulSetClass();
    same("myClass coolbar");
    widget.selected= true;
    widget.cssStatefulSetClass();
    same("myClass coolbar Selected");
    widget.readOnly= true;
    widget.cssStatefulSetClass();
    same("myClass coolbar Selected ReadOnly SelectedReadOnly");
    widget.foo= true;
    widget.cssStatefulSetClass();
    same("myClass coolbar Selected ReadOnly Foo SelectedReadOnly SelectedFoo ReadOnlyFoo SelectedReadOnlyFoo");
    widget.selected= false;
    widget.cssStatefulSetClass();
    same("myClass coolbar ReadOnly Foo ReadOnlyFoo");
    widget.readOnly= false;
    widget.cssStatefulSetClass();
    same("myClass coolbar Foo");
    widget.foo= false;
    widget.cssStatefulSetClass();
    same("myClass coolbar");
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
