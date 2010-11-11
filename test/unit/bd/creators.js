(function() {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/creators",

  describe("the function bd.createObject",
    demo(//"given constructor x in module space y, and arguments {a, b, c}, ("y:x", [a, b, c]) returns a new object created by that constructor, passing a, b, and c during construction.
      function() {
      var
        moduleName= dojo.uid(),
        theCtor;
      define(moduleName, [], function() {
        function someClass(a, b, c) {
          this.a= a;
          this.b= b;
          this.c= c;
        }
        someClass.prototype= {
          p:"p-value"
        };
        // remember the constructor for testing below
        theCtor= someClass;
        return {
          someClass:someClass
        };
      });

      var o= bd.createObject(moduleName + ":someClass", [1, 2, 3]);
      the(o.a).is(1);
      the(o.b).is(2);
      the(o.c).is(3);
      the(o.p).is("p-value");
      the(o instanceof theCtor).is(true);
    }),
    demo(//"given constructor x in the global space, and arguments {a, b, c}, ("x", [a, b, c]) returns a new object created by that constructor, passing a, b, and c during construction.
      function() {
        var name= dojo.uid();
        dojo.global[name]= function someClass(a, b, c) {
          this.a= a;
          this.b= b;
          this.c= c;
        };
        dojo.global[name].prototype= {
          p:"p-value"
        };

        var o= bd.createObject(name, [1, 2, 3]);
        the(o.a).is(1);
        the(o.b).is(2);
        the(o.c).is(3);
        the(o.p).is("p-value");
        the(o instanceof dojo.global[name]).is(true);
    }),
    demo(//"given constructor x.y.z, x in the global space, and arguments {a, b, c}, ("x", [a, b, c]) returns a new object created by that constructor, passing a, b, and c during construction.
      function() {
        var name= dojo.uid();
        dojo.global[name]= {y:{z:function someClass(a, b, c) {
          this.a= a;
          this.b= b;
          this.c= c;
        }}};
        dojo.global[name].y.z.prototype= {
          p:"p-value"
        };

        var o= bd.createObject(name+".y.z", [1, 2, 3]);
        the(o.a).is(1);
        the(o.b).is(2);
        the(o.c).is(3);
        the(o.p).is("p-value");
        the(o instanceof dojo.global[name].y.z).is(true);
    }) 
  ),

  describe("the function bd.binarySearch",
    demo("always returns bd.notFound on an empty array", function() {
      the(bd.binarySearch([], function(test){ return test - 2; })).is(bd.notFound);
    }),
    demo("finds a target item in a sorted array; target given by comp (array must be sorted by same semantics as comp)", function() {
      var theArray= [];
      for(var i= 1; i<=10; i++) {
        theArray.push(i);
        for (var j= 1; j<=i; j++) {
          the(bd.binarySearch(theArray, function(test){ return test - j; })).is(j-1);
        }
      }
    })
  )
);

})();
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
