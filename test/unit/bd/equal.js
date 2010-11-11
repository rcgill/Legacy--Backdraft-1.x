define(["dojo", "bd", "bd/dom"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/equal",
  describe("the function bd.equal",
    demo("bd.equal(undefined, rhs) returns true if rhs===undefined; false otherwise", function() {
      the(bd.equal(undefined, undefined)).is(true);
      the(bd.equal(undefined, null)).is(false);
      the(bd.equal(undefined, false)).is(false);
      the(bd.equal(undefined, 0)).is(false);
    }),
    demo("bd.equal(null, rhs) returns true if rhs===null; false otherwise", function() {
      the(bd.equal(null, null)).is(true);
      the(bd.equal(null, false)).is(false);
      the(bd.equal(null, undefined)).is(false);
      the(bd.equal(null, 0)).is(false);
    }),
    demo("bd.equal(false, rhs) returns true if rhs===false; false otherwise", function() {
      the(bd.equal(false, false)).is(true);
      the(bd.equal(false, !true)).is(true);
      the(bd.equal(false, null)).is(false);
      the(bd.equal(false, undefined)).is(false);
      the(bd.equal(false, 0)).is(false);
    }),
    demo("bd.equal(true, rhs) returns true if rhs===true; false otherwise", function() {
      the(bd.equal(true, true)).is(true);
      the(bd.equal(true, !false)).is(true);
      the(bd.equal(true, "true")).is(false);
      the(bd.equal(true, 1)).is(false);
    }),
    demo("bd.equal(<number>, rhs) returns true if rhs===<number>; false otherwise", function() {
      the(bd.equal(0, 0)).is(true);
      the(bd.equal(123, 123)).is(true);
      the(bd.equal(0, "0")).is(false);
      the(bd.equal(123, "123")).is(false);
    }),
    demo("bd.equal(<string>, rhs) returns true if rhs===<string>; false otherwise", function() {
      the(bd.equal("", "")).is(true);
      the(bd.equal("t", "t")).is(true);
      the(bd.equal("test", "test")).is(true);
      var x= "test";
      the(bd.equal("test", x)).is(true);
      the(bd.equal("1", 1)).is(false);
    }),
    demo("bd.equal(<array>, rhs) returns true if rhs is an Array with the same contents as <array>; false otherwise", function() {
      the(bd.equal([], [])).is(true);
      the(bd.equal([123], [123])).is(true);
      the(bd.equal([1, 2, 3], [1, 2, 3])).is(true);
      the(bd.equal([], false)).is(false);
      the(bd.equal([123], true)).is(false);
    }),
    demo("bd.equal(<date>, rhs) returns true if rhs is a Date with the same value as <date>; false otherwise", function() {
      var d1= new Date();
      the(bd.equal(d1, d1)).is(true);
      the(bd.equal(d1, true)).is(false);
      bd.test.wait(5);
      var d2= new Date();
      the(bd.equal(d1, d2)).is(false);
      d2= new Date(d1.getTime());
      the(bd.equal(d1, d2)).is(true);
    }),
    demo("bd.equal(<error>, rhs) returns true if rhs is an Error with the same message as <error>; false otherwise", function() {
      var e1= new Error("this is a test");
      the(bd.equal(e1, e1)).is(true);
      var e2= new Error("this is a test");
      the(bd.equal(e1, e2)).is(true);
      var e3= new Error("this is a rhset another test");
      the(bd.equal(e1, e3)).is(false);
    }),
    demo("bd.equal(<regex>, rhs) returns true if rhs is an RegExp with the same contents and <regexp>; false otherwise", function() {
      var re1= /test/;
      the(bd.equal(re1, re1)).is(true);
      var re2= /test/;
      the(bd.equal(re1, re2)).is(true);
      re1= /test/i;
      re2= /test/i;
      the(bd.equal(re1, re2)).is(true);
      re1= /test/g;
      re2= /test/g;
      the(bd.equal(re1, re2)).is(true);
      re1= /test/m;
      re2= /test/m;
      the(bd.equal(re1, re2)).is(true);
      re1= /test/igm;
      re2= /test/igm;
      the(bd.equal(re1, re2)).is(true);
    }),
    demo("bd.equal(<simple hash>, rhs) returns true if rhs is a simple hash with the same contents (by value) as <simple hash>; false otherwise", function() {
      var h1= {};
      the(bd.equal(h1, h1)).is(true);
       var h2= {};
      the(bd.equal(h1, h2)).is(true);
       var date1= new Date, date2= new Date(date1.getTime());
      h1= {p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date1, p10:new Error("test"), p11:/test/};
      h2= {p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/};
      the(bd.equal(h1, h2)).is(true);
       h2= {p1:0, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/};
      the(bd.equal(h1, h2)).is(false);
      h2= {p1:null, p2:1, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/};
      the(bd.equal(h1, h2)).is(false);
      h2= {p1:null, p2:true, p3:0, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/};
      the(bd.equal(h1, h2)).is(false);
      h2= {p1:null, p2:true, p3:false, p4:1, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/};
      the(bd.equal(h1, h2)).is(false);
      h2= {p1:null, p2:true, p3:false, p4:0, p5:1234, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/};
      the(bd.equal(h1, h2)).is(false);
      h2= {p1:null, p2:true, p3:false, p4:0, p5:123, p6:"testing", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/};
      the(bd.equal(h1, h2)).is(false);
      h2= {p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[1], p8:[1,2,3,4], p9:date2, p10:new Error("test"), p11:/test/};
      the(bd.equal(h1, h2)).is(false);
      h2= {p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:new Date, p10:new Error("test"), p11:/test/};
      the(bd.equal(h1, h2)).is(false);
      h2= {p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("testing"), p11:/test/};
      the(bd.equal(h1, h2)).is(false);
      h2= {p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/testing/};
      the(bd.equal(h1, h2)).is(false);
    }),
    demo("bd.equal(<object with nested object>, rhs) returns true if rhs is a object with nested object with the same contents (by value) as <object with nested object>; false otherwise", function() {
      var h1= {nest:{}};
      the(bd.equal(h1, h1)).is(true);
       var h2= {nest:{}};
      the(bd.equal(h1, h2)).is(true);
       var date1= new Date, date2= new Date(date1.getTime());
      h1= {nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date1, p10:new Error("test"), p11:/test/}};
      h2= {nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}};
      the(bd.equal(h1, h2)).is(true);
       h2= {nest:{p1:0, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{p1:null, p2:1, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{p1:null, p2:true, p3:0, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{p1:null, p2:true, p3:false, p4:1, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{p1:null, p2:true, p3:false, p4:0, p5:1234, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"testing", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[1], p8:[1,2,3,4], p9:date2, p10:new Error("test"), p11:/test/}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:new Date, p10:new Error("test"), p11:/test/}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("testing"), p11:/test/}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/testing/}};
      the(bd.equal(h1, h2)).is(false);
       h1= {nest:{nest:{}}};
      the(bd.equal(h1, h1)).is(true);
       h2= {nest:{nest:{}}};
      the(bd.equal(h1, h2)).is(true);
       h1= {nest:{nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date1, p10:new Error("test"), p11:/test/}}};
      h2= {nest:{nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(true);
       h2= {nest:{nest:{p1:0, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{nest:{p1:null, p2:1, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{nest:{p1:null, p2:true, p3:0, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{nest:{p1:null, p2:true, p3:false, p4:1, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{nest:{p1:null, p2:true, p3:false, p4:0, p5:1234, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"testing", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[1], p8:[1,2,3,4], p9:date2, p10:new Error("test"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:new Date, p10:new Error("test"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("testing"), p11:/test/}}};
      the(bd.equal(h1, h2)).is(false);
      h2= {nest:{nest:{p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:date2, p10:new Error("test"), p11:/testing/}}};
      the(bd.equal(h1, h2)).is(false);
    }),
    demo("bd.equal(<object with circular reference>, <equivalent object (by value)>) returns true", function() {
      var o1= {}, o2= {};
      o1.p1= o1;
      o2.p1= o2;
      the(bd.equal(o1, o2)).is(true);
      //twisted!!
      o1.p1= o2;
      o2.p1= o1;
      the(bd.equal(o1, o2)).is(true);
    }),
    demo("bd.equal(<lhs= dojo.declare'd class instance>, rhs>) returns true if rhs has the same constructor as lhs with the same property values; false otherwise", function(space) {
      var superCtor= dojo.declare([], {
        constructor: function(a, b) {
          this.aSuper= a;
          this.bSuper= b;
        },
        p1:"p1-value",
        p2:function() {
            return 1;
        }
      });
      var subCtor= dojo.declare([superCtor], {
        constructor: function(a, b) {
          this.aSub= a;
          this.bSub= b;
        },
        p3:"p1-value",
        p4:function() {
            return 1;
        }
      });
      var o1= new superCtor(1, "test");
      the(bd.equal(o1, o1)).is(true);
      var o2= new superCtor(1, "test");
      the(bd.equal(o1, o2)).is(true);
      o2= new superCtor(2, "test");
      the(bd.equal(o1, o2)).is(false);
      o1= new subCtor(1, "test");
      the(bd.equal(o1, o1)).is(true);
      o2= new subCtor(1, "test");
      the(bd.equal(o1, o2)).is(true);
      yo2= new subCtor(2, "test");
      the(bd.equal(o1, o2)).is(false);
    }),
    demo("adding an item to bd.equal.comparators is utilized when lhs.constructor===<the added constructor>; however === is used if lhs===rhs", function(space) {
      var ctor= dojo.declare([], {
        constructor: function(a, b) {
          this.aSuper= a;
          this.bSuper= b;
        },
        p1:"p1-value",
        p2:function() {
            return 1;
        }
      });
       //normally, the object contents is inspected...
      var o1= new ctor(1, "test");
      the(bd.equal(o1, o1)).is(true);
       var o2= new ctor(1, "test");
      the(bd.equal(o1, o2)).is(true);
       var o3= new ctor(2, "test");
      the(bd.equal(o1, o3)).is(false);
       //install a custom compare that returns the value of compareResult...
      var customCompareWasCalled, compareResult, expectedLhs, expectedRhs;
      bd.equal.comparators.set(
        ctor,
        function(lhs, rhs) {
          the(lhs).is(expectedLhs);
          the(rhs).is(expectedRhs);
          customCompareWasCalled= true;
          return compareResult;
        }
      );
       compareResult= true;
      customCompareWasCalled= false;
      expectedLhs= expectedRhs= o1;
      the(bd.equal(o1, o1)).is(true);
      //notice the custom compare was NOT called when lhs===rhs
      the(customCompareWasCalled).is(false);
       customCompareWasCalled= false;
      expectedRhs= o2;
      the(bd.equal(o1, o2)).is(true);
      the(customCompareWasCalled).is(true);
       customCompareWasCalled= false;
      expectedRhs= o3;
      the(bd.equal(o1, o3)).is(true);
      the(customCompareWasCalled).is(true);
       //a custom compare can return any type...
      compareResult= {};
      customCompareWasCalled= false;
      expectedLhs= expectedRhs= o1;
      the(bd.equal(o1, o1)).is(true);
      //notice the custom compare was NOT called when lhs===rhs
      the(customCompareWasCalled).is(false);
       customCompareWasCalled= false;
      expectedRhs= o2;
      the(bd.equal(o1, o2)).is(compareResult);
      the(customCompareWasCalled).is(true);
       customCompareWasCalled= false;
      expectedRhs= o3;
      the(bd.equal(o1, o3)).is(compareResult);
      the(customCompareWasCalled).is(true);
    })
  )
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
