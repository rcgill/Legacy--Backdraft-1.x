define(["dojo", "bd", "bd/clone"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/clone",
  theFunction("[bd.back]",
    demo("returns the value for undefined, null, booleans, numbers, and strings", function() {
      the(bd.clone(undefined)).is(undefined);
      the(bd.clone(null)).is(null);
      the(bd.clone(true)).is(true);
      the(bd.clone(false)).is(false);
      the(bd.clone(0)).is(0);
      the(bd.clone(123)).is(123);
      the(bd.clone("")).is("");
      the(bd.clone("test")).is("test");
    }),
    demo("returns a deep copy of simple objects", function() {
      var o= {p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:new Date, p10:new Error("test"), p11:/test/};
      the(bd.clone(o)).hasValue(o);
      the(bd.clone(o)).isNot(o);
       for(var i= 1; i<8; i++) {
        o= {nest:o};
        the(bd.clone(o)).hasValue(o);
        the(bd.clone(o)).isNot(o);
      }
    }),
    demo("an object can be nested 9 levels by default", function () {
      var o= {};
      for(var i= 1; i<9; i++) {
        o= {nest:o};
        the(bd.clone(o)).hasValue(o);
        the(bd.clone(o)).isNot(o);
      }
    }),
    demo("the nesting level can be made deeper or shallower by setting the watchdog", function () {
      var o= {};
      for(var i= 1; i<4; i++) {
        o= {nest:o};
        the(bd.clone(o, 5)).hasValue(o);
        the(bd.clone(o, 5)).isNot(o);
      }
      o= {};
      for(i= 1; i<14; i++) {
        o= {nest:o};
        the(bd.clone(o, 15)).hasValue(o);
        the(bd.clone(o, 15)).isNot(o);
      }
    }),
    demo('if the nesting level is exceeded, then Error("bd.clone: cycle detected") is thrown', function () {
      var o= {};
      for(var i= 1; i<11; i++) {
        o= {nest:o};
      }
      the(function(){bd.clone(o);}).raises(Error("bd.clone: cycle detected"));
       o= {};
      for(i= 1; i<6; i++) {
        o= {nest:o};
      }
      the(function(){bd.clone(o, 5);}).raises(Error("bd.clone: cycle detected"));
       o= {};
      for(i= 1; i<16; i++) {
        o= {nest:o};
      }
      the(function(){bd.clone(o, 15);}).raises(Error("bd.clone: cycle detected"));
    }),
    demo("delgates to source.clone, if available", function(space) {
      var ctor= dojo.declare(null, {
        constructor: function(a, b) {
          this.a= a;
          this.b= b;
        },
        p1:"p1-value",
        p2:function() {
            return 1;
        },
        clone:function() {
          var result= new this.constructor();
          //usually, clone would make the new object look like this object
          //for testing, we'll set a property to check
          result.cloned= true;
          return result;
        }
      });
      var
        o1= new ctor(123, "some-Value"),
        o2= bd.clone(o1);
      the(o2).hasDiffValue(o1);
      the(o2.cloned).is(true);
    }),
    demo("adding an item to bd.clone.factories is utilized when source.constructor===<the added constructor> and source.clone doesn't exist", function(space) {
      var ctor= dojo.declare(null, {
        constructor: function(a, b) {
          this.a= a;
          this.b= b;
        },
        p1:"p1-value",
        p2:function() {
          return 1;
        }
      });
       var testMock= {};
      bd.clone.factories.set(ctor, function(){return testMock;});
       //at this point o1.clone does not exist, but a matching function in bd.clone.factories does exist and should be used
      var
        o1= new ctor(123, "some-Value"),
        o2= bd.clone(o1);
      the(o2).hasDiffValue(o1);
      the(o2).is(testMock);
      o1.clone= function() {
        var result= new this.constructor();
        //usually, clone would make the new object look like this object
        //for testing, we'll set a property to check
        result.cloned= true;
        return result;
      };
      //now o1.clone should be used...
      o2= bd.clone(o1);
      the(o2).hasDiffValue(o1);
      the(o2.cloned).is(true);
    })
  )
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
