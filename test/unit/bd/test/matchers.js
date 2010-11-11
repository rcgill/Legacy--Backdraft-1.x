define(["dojo", "bd", "bd/test"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString


function mock(
  matcher,
  arg,
  argsToMatcher,
  expectedResult
) {
  var result= matcher.apply({arg:arg}, argsToMatcher);
  the(result).hasValue(expectedResult);
}

module("the module bd.test.matchers",
  describe("the function bd.test.matchers.is(expected) tests if this.arg===expected",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      dojo.forEach(bd.test.sampleValues, function(item) {
        mock(bd.test.matchers.is, item, [item], bd.test.result.pass(item, item));
      });
    }),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      //clearly, a unique object literal is not identical to any other object
      dojo.forEach(bd.test.sampleValues, function(item) {
        mock(bd.test.matchers.is, item, [{}], bd.test.result.fail(item, {}));
      });
       //for objects, make sure differences in value only are still detected as not identical (not, non-objects with same value are identical)
      var clone= bd.clone(bd.test.sampleValues);
      for (var i= 0; i<clone.length; i++) {
        if (clone[i] instanceof Object) {
          mock(bd.test.matchers.is, bd.test.sampleValues[i], [clone[i]], bd.test.result.fail(bd.test.sampleValues[i], clone[i]));
        }
      }
    })
  ),
  describe("the function bd.test.matchers.isNot(expected) tests if this.arg!==expected",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      //clearly, a unique object literal is not identical to any other object
      dojo.forEach(bd.test.sampleValues, function(item) {
        mock(bd.test.matchers.isNot, item, [{}], bd.test.result.pass(item, {}));
      });
       //for objects, make sure differences in value only are still detected as not identical (not, non-objects with same value are identical)
      var clone= bd.clone(bd.test.sampleValues);
      for (var i= 0; i<clone.length; i++) {
        if (clone[i] instanceof Object) {
          mock(bd.test.matchers.isNot, bd.test.sampleValues[i], [clone[i]], bd.test.result.pass(bd.test.sampleValues[i], clone[i]));
        }
      }
    }),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      dojo.forEach(bd.test.sampleValues, function(item) {
        mock(bd.test.matchers.isNot, item, [item], bd.test.result.fail(item, item));
      });
    })
  ),
  describe("the function bd.test.matchers.hasValue(expected) tests if this.arg is equal to expected by value as defined by the function bd.equal",
    note("see bd.equal for extensive test cases"),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      // indentical objects are always equal by value...
      dojo.forEach(bd.test.sampleValues, function(item) {
        mock(bd.test.matchers.hasValue, item, [item], bd.test.result.pass(item, item));
      });
       // so are objects that occupy different memory but have the same value
      var clone= bd.clone(bd.test.sampleValues);
      for (var i= 0; i<clone.length; i++) {
        mock(bd.test.matchers.hasValue, bd.test.sampleValues[i], [clone[i]], bd.test.result.pass(bd.test.sampleValues[i], clone[i]));
      }
    }),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      dojo.forEach(bd.test.sampleValues, function(item) {
        var expected= item ? item.toString() + "different" : "different";
        mock(bd.test.matchers.hasValue, item, [expected], bd.test.result.fail(item, expected));
      });
    })
  ),
  describe("the function bd.test.matchers.hasDiffValue(expected) tests if this.arg is not equal as defined by the function bd.equal",
    note("see bd.equal for extensive test cases"),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      // indentical objects are never not equal by value...
      dojo.forEach(bd.test.sampleValues, function(item) {
        mock(bd.test.matchers.hasDiffValue, item, [item], bd.test.result.fail(item, item));
      });
        // so are objects that occupy different memory but have the same value
      var clone= bd.clone(bd.test.sampleValues);
      for (var i= 0; i<clone.length; i++) {
        mock(bd.test.matchers.hasDiffValue, bd.test.sampleValues[i], [clone[i]], bd.test.result.fail(bd.test.sampleValues[i], clone[i]));
      }
    }),
     demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      dojo.forEach(bd.test.sampleValues, function(item) {
        var expected= item ? item.toString() + "different" : "different";
        mock(bd.test.matchers.hasDiffValue, item, [expected], bd.test.result.pass(item, expected));
      });
    })
  ),
  describe("the function bd.test.matchers.isString(expected) tests if this.arg is a string",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      var sampleValues= ["", "test", new String("test2")];
      dojo.forEach(sampleValues, function(item) {
        mock(bd.test.matchers.isString, item, [], bd.test.result.pass(item));
      });
      mock(bd.test.matchers.isString, "", [], bd.test.result.pass(""));
    }),
     demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      mock(bd.test.matchers.isString, {}, [], bd.test.result.fail({}));
    })
  ),
  describe("the function bd.test.matchers.isArray(expected) tests if this.arg is an array",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      var sampleValues= [[], [1, 2]];
      dojo.forEach(sampleValues, function(item) {
        mock(bd.test.matchers.isArray, item, [], bd.test.result.pass(item));
      });
    }),
     demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      mock(bd.test.matchers.isArray, {}, [], bd.test.result.fail({}));
    })
  ),
  describe("the function bd.test.matchers.isFunction(expected) tests if this.arg is a function",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      var
        f= function() {},
        sampleValues= [f, function(){}];
      dojo.forEach(sampleValues, function(item) {
        mock(bd.test.matchers.isFunction, item, [], bd.test.result.pass(item));
      });
    }),
     demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      mock(bd.test.matchers.isFunction, {}, [], bd.test.result.fail({}));
    })
  ),
  describe("the function bd.test.matchers.isNotString(expected) tests if this.arg is not a string",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      var sampleValues= ["", "test", new String("test2")];
      dojo.forEach(sampleValues, function(item) {
        mock(bd.test.matchers.isNotString, item, [], bd.test.result.fail(item));
      });
      mock(bd.test.matchers.isNotString, "", [], bd.test.result.fail(""));
    }),
     demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      mock(bd.test.matchers.isNotString, {}, [], bd.test.result.pass({}));
    })
  ),
  describe("the function bd.test.matchers.isNotArray(expected) tests if this.arg is not an array",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      var sampleValues= [[], [1, 2]];
      dojo.forEach(sampleValues, function(item) {
        mock(bd.test.matchers.isNotArray, item, [], bd.test.result.fail(item));
      });
    }),
     demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      mock(bd.test.matchers.isNotArray, {}, [], bd.test.result.pass({}));
    })
  ),
  describe("the function bd.test.matchers.isNotFunction(expected) tests if this.arg is not a function",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      var
        f= function() {},
        sampleValues= [f, function(){}];
      dojo.forEach(sampleValues, function(item) {
        mock(bd.test.matchers.isNotFunction, item, [], bd.test.result.fail(item));
      });
    }),
     demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      mock(bd.test.matchers.isNotFunction, {}, [], bd.test.result.pass({}));
    })
  ),
  describe("the function bd.test.matchers.prototypeIs(expected) tests if this.arg has prototype expected",
    note("bd.test.matchers.prototypeIs is guaranteed to work only on browsers that reveal __proto__"),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      function t() {
      }
      t.prototype= {
        someProperty:"someValue"
      };
      var test= new t();
      mock(bd.test.matchers.prototypeIs, test, [t.prototype], bd.test.result.pass(test, t.prototype));
       var anotherPrototype= {
        someProperty:"someValue"
      };
      test= dojo.delegate(anotherPrototype);
      mock(bd.test.matchers.prototypeIs, test, [anotherPrototype], bd.test.result.pass(test, anotherPrototype));
    }),
     demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      var test= new Date();
      mock(bd.test.matchers.prototypeIs, test, [Array], bd.test.result.fail(test, Array));
    })
  ),
  describe("the function bd.test.matchers.isInstanceOf(expected) tests if (this.arg instanceof expected) is true",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function(space) {
      var test;
      test= {};
      mock(bd.test.matchers.isInstanceOf, test, [Object], bd.test.result.pass(test, Object));
      test= new Date();
      mock(bd.test.matchers.isInstanceOf, test, [Date], bd.test.result.pass(test, Object));
      mock(bd.test.matchers.isInstanceOf, test, [Object], bd.test.result.pass(test, Date));
      var testConstructor= dojo.declare([], {someProperty:"someValue"});
      test= new testConstructor();
      mock(bd.test.matchers.isInstanceOf, test, [testConstructor], bd.test.result.pass(test, testConstructor));
      mock(bd.test.matchers.isInstanceOf, test, [Object], bd.test.result.pass(test, Object));
    }),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      var test= new Date();
      mock(bd.test.matchers.isInstanceOf, test, [Array], bd.test.result.fail(test, Array));
    })
  ),
  describe("the function bd.test.matchers.hasProperties(expected) tests if this.arg contains at least the properties given by expected",
    describe("the argument expected can be given as an array of property names",
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
        var test;
        test= {};
        mock(bd.test.matchers.hasProperties, test, [[]], bd.test.result.pass(test, [[]]));
        test= {a:1};
        mock(bd.test.matchers.hasProperties, test, [[]], bd.test.result.pass(test, [[]]));
        mock(bd.test.matchers.hasProperties, test, [["a"]], bd.test.result.pass(test, [["a"]]));
        test= {a:1, b:2};
        mock(bd.test.matchers.hasProperties, test, [[]], bd.test.result.pass(test, [[]]));
        mock(bd.test.matchers.hasProperties, test, [["a"]], bd.test.result.pass(test, [["a"]]));
        mock(bd.test.matchers.hasProperties, test, [["b"]], bd.test.result.pass(test, [["b"]]));
        mock(bd.test.matchers.hasProperties, test, [["a", "b"]], bd.test.result.pass(test, [["a", "b"]]));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
        var test;
        test= {};
        mock(bd.test.matchers.hasProperties, test, [["a"]], bd.test.result.fail(test, [["a"]]));
        test= {a:1};
        mock(bd.test.matchers.hasProperties, test, [["b"]], bd.test.result.fail(test, [["b"]]));
        test= {b:1};
        mock(bd.test.matchers.hasProperties, test, [["a"]], bd.test.result.fail(test, [["a"]]));
      })
    ),
    describe("the argument expected can be given as an object",
      note("the value of the properties as given in expected has no significance to the test"),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
        var test, expected;
        test= {};
        expected= {};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
        test= {a:1};
        expected= {};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
        expected= {a:0};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
        test= {a:1, b:2};
        expected= {};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
        expected= {a:2};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
        expected= {b:3};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
        expected= {a:4, b:5};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
        var test, expected;
        test= {};
        expected= {a:0};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.fail(test, expected));
        test= {a:1};
        expected= {b:0};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.fail(test, expected));
        test= {b:1};
        expected= {a:0};
        mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.fail(test, expected));
      })
    ),
    demo("the properties can exist anywhere in the prototype chain of either this.arg (or expected, when expected is an object)", function() {
      var test, expected;
      function getObject(delegate, o) {
        if (delegate) {
          return dojo.delegate(o);
        } else {
          return o;
        }
      }
      for (var i= 0; i<2; i++) {
        for (var j= 0; j<2; j++) {
          test= getObject(i, {a:1});
          expected= getObject(j, {});
          mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
          test= getObject(i, {a:1, b:2});
          expected= getObject(j, {});
          mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
          expected= getObject(j, {a:2});
          mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
          expected= getObject(j, {b:3});
          mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
          expected= getObject(j, {a:4, b:5});
          mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.pass(test, expected));
          test= {};
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.fail(test, expected));
          test= getObject(i, {a:1});
          expected= getObject(j, {b:0});
          mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.fail(test, expected));
          test= getObject(i, {b:1});
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasProperties, test, [expected], bd.test.result.fail(test, expected));
        }
      }
    })
  ),
  describe("the function bd.test.matchers.hasOwnProperties(expected) tests if this.arg contains at least its own properties given by expected",
    describe("the argument expected can be given as an array of property names",
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
        var test;
        test= {};
        mock(bd.test.matchers.hasOwnProperties, test, [[]], bd.test.result.pass(test, [[]]));
        test= {a:1};
        mock(bd.test.matchers.hasOwnProperties, test, [[]], bd.test.result.pass(test, [[]]));
        mock(bd.test.matchers.hasOwnProperties, test, [["a"]], bd.test.result.pass(test, [["a"]]));
        test= {a:1, b:2};
        mock(bd.test.matchers.hasOwnProperties, test, [[]], bd.test.result.pass(test, [[]]));
        mock(bd.test.matchers.hasOwnProperties, test, [["a"]], bd.test.result.pass(test, [["a"]]));
        mock(bd.test.matchers.hasOwnProperties, test, [["b"]], bd.test.result.pass(test, [["b"]]));
        mock(bd.test.matchers.hasOwnProperties, test, [["a", "b"]], bd.test.result.pass(test, [["a", "b"]]));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
        var test;
        test= {};
        mock(bd.test.matchers.hasOwnProperties, test, [["a"]], bd.test.result.fail(test, [["a"]]));
        test= {a:1};
        mock(bd.test.matchers.hasOwnProperties, test, [["b"]], bd.test.result.fail(test, [["b"]]));
        test= {b:1};
        mock(bd.test.matchers.hasOwnProperties, test, [["a"]], bd.test.result.fail(test, [["a"]]));
      })
    ),
    describe("the argument expected can be given as an object",
      note("the value of the properties as given in expected has no significance to the test"),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
        var test, expected;
        test= {};
        expected= {};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.pass(test, expected));
        test= {a:1};
        expected= {};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.pass(test, expected));
        expected= {a:0};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.pass(test, expected));
        test= {a:1, b:2};
        expected= {};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.pass(test, expected));
        expected= {a:2};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.pass(test, expected));
        expected= {b:3};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.pass(test, expected));
        expected= {a:4, b:5};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.pass(test, expected));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
        var test, expected;
        test= {};
        expected= {a:0};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.fail(test, expected));
        test= {a:1};
        expected= {b:0};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.fail(test, expected));
        test= {b:1};
        expected= {a:0};
        mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.fail(test, expected));
      })
    ),
    demo("the properties for this.arg must be it's own; when expected is an object, the properties for expected can be anywhere in expected's prototype chain", function() {
      var test, expected;
      function getObject(delegate, o) {
        if (delegate) {
          return dojo.delegate(o);
        } else {
          return o;
        }
      }
      for (var i= 0; i<2; i++) {
        for (var j= 0; j<2; j++) {
          test= getObject(i, {a:1});
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasOwnProperties, test, [expected], (i ? bd.test.result.fail : bd.test.result.pass)(test, expected));
          test= getObject(i, {a:1, b:2});
          expected= getObject(j, {a:2});
          mock(bd.test.matchers.hasOwnProperties, test, [expected], (i ? bd.test.result.fail : bd.test.result.pass)(test, expected));
          expected= getObject(j, {b:3});
          mock(bd.test.matchers.hasOwnProperties, test, [expected], (i ? bd.test.result.fail : bd.test.result.pass)(test, expected));
          expected= getObject(j, {a:4, b:5});
          mock(bd.test.matchers.hasOwnProperties, test, [expected], (i ? bd.test.result.fail : bd.test.result.pass)(test, expected));
          test= {};
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.fail(test, expected));
          test= getObject(i, {a:1});
          expected= getObject(j, {b:0});
          mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.fail(test, expected));
          test= getObject(i, {b:1});
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasOwnProperties, test, [expected], bd.test.result.fail(test, expected));
        }
      }
    })
  ),
  describe("the function bd.test.matchers.hasPropertiesExact(expected) tests if this.arg contains exactly properties given by expected",
    describe("the argument expected can be given as an array of property names",
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
        var test;
        test= {};
        mock(bd.test.matchers.hasPropertiesExact, test, [[]], bd.test.result.pass(test, [[]]));
        test= {a:1};
        mock(bd.test.matchers.hasPropertiesExact, test, [["a"]], bd.test.result.pass(test, [["a"]]));
        test= {a:1, b:2};
        mock(bd.test.matchers.hasPropertiesExact, test, [["a", "b"]], bd.test.result.pass(test, [["a", "b"]]));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
        var test;
        test= {a:1};
        mock(bd.test.matchers.hasPropertiesExact, test, [[]], bd.test.result.fail(test, [[]]));
        test= {a:1, b:2};
        mock(bd.test.matchers.hasPropertiesExact, test, [[]], bd.test.result.fail(test, [[]]));
        mock(bd.test.matchers.hasPropertiesExact, test, [["a"]], bd.test.result.fail(test, [["a"]]));
        mock(bd.test.matchers.hasPropertiesExact, test, [["b"]], bd.test.result.fail(test, [["b"]]));
        test= {};
        mock(bd.test.matchers.hasPropertiesExact, test, [["a"]], bd.test.result.fail(test, [["a"]]));
        test= {a:1};
        mock(bd.test.matchers.hasPropertiesExact, test, [["b"]], bd.test.result.fail(test, [["b"]]));
        test= {b:1};
        mock(bd.test.matchers.hasPropertiesExact, test, [["a"]], bd.test.result.fail(test, [["a"]]));
      })
    ),
    describe("the argument expected can be given as an object",
      note("the value of the properties as given in expected has no significance to the test"),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
        var test, expected;
        test= {};
        expected= {};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.pass(test, expected));
        test= {a:1};
        expected= {a:0};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.pass(test, expected));
        test= {a:1, b:2};
        expected= {a:4, b:5};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.pass(test, expected));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
        var test, expected;
        test= {a:1};
        expected= {};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        test= {a:1, b:2};
        expected= {};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        expected= {a:2};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        expected= {b:3};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        test= {};
        expected= {a:0};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        test= {a:1};
        expected= {b:0};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        test= {b:1};
        expected= {a:0};
        mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
      })
    ),
    demo("the properties can exist anywhere in the prototype chain of either this.arg (or expected, when expected is an object)", function() {
      var test, expected;
      function getObject(delegate, o) {
        if (delegate) {
          return dojo.delegate(o);
        } else {
          return o;
        }
      }
      for (var i= 0; i<2; i++) {
        for (var j= 0; j<2; j++) {
          test= getObject(i, {a:1});
          expected= getObject(j, {});
          mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.pass(test, expected));
          test= getObject(i, {a:1, b:2});
          expected= getObject(j, {});
          mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          expected= getObject(j, {a:2});
          mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          expected= getObject(j, {b:3});
          mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          expected= getObject(j, {a:4, b:5});
          mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.pass(test, expected));
          test= {};
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          test= getObject(i, {a:1});
          expected= getObject(j, {b:0});
          mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          test= getObject(i, {b:1});
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        }
      }
    })
  ),
  describe("the function bd.test.matchers.hasOwnPropertiesExact(expected) tests if this.arg contains exactly its own properties given by expected",
    describe("the argument expected can be given as an array of property names",
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
        var test;
        test= {};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [[]], bd.test.result.pass(test, [[]]));
        test= {a:1};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [["a"]], bd.test.result.pass(test, [["a"]]));
        test= {a:1, b:2};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [["a", "b"]], bd.test.result.pass(test, [["a", "b"]]));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
        var test;
        test= {a:1};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [[]], bd.test.result.fail(test, [[]]));
        test= {a:1, b:2};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [[]], bd.test.result.fail(test, [[]]));
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [["a"]], bd.test.result.fail(test, [["a"]]));
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [["b"]], bd.test.result.fail(test, [["b"]]));
        test= {};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [["a"]], bd.test.result.fail(test, [["a"]]));
        test= {a:1};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [["b"]], bd.test.result.fail(test, [["b"]]));
        test= {b:1};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [["a"]], bd.test.result.fail(test, [["a"]]));
      })
    ),
    describe("the argument expected can be given as an object",
      note("the value of the properties as given in expected has no significance to the test"),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
        var test, expected;
        test= {};
        expected= {};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.pass(test, expected));
        test= {a:1};
        expected= {a:0};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.pass(test, expected));
        test= {a:1, b:2};
        expected= {a:4, b:5};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.pass(test, expected));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
        var test, expected;
        test= {a:1};
        expected= {};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        test= {a:1, b:2};
        expected= {};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        expected= {a:2};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        expected= {b:3};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        test= {};
        expected= {a:0};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        test= {a:1};
        expected= {b:0};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        test= {b:1};
        expected= {a:0};
        mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
      })
    ),
    demo("the properties for this.arg must be it's own; when expected is an object, the properties for expected can be anywhere in expected's prototype chain)", function() {
      var test, expected;
      function getObject(delegate, o) {
        if (delegate) {
          return dojo.delegate(o);
        } else {
          return o;
        }
      }
      for (var i= 0; i<2; i++) {
        for (var j= 0; j<2; j++) {
          test= getObject(i, {a:1});
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], (i ? bd.test.result.fail : bd.test.result.pass)(test, expected));
          test= getObject(i, {a:1, b:2});
          expected= getObject(j, {a:2});
          mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          expected= getObject(j, {b:3});
          mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          expected= getObject(j, {a:4, b:5});
          mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], (i ? bd.test.result.fail : bd.test.result.pass)(test, expected));
          test= {};
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          test= getObject(i, {a:1});
          expected= getObject(j, {b:0});
          mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
          test= getObject(i, {b:1});
          expected= getObject(j, {a:0});
          mock(bd.test.matchers.hasOwnPropertiesExact, test, [expected], bd.test.result.fail(test, expected));
        }
      }
    })
  ),
  describe("the function bd.test.matchers.contains(expected) tests if this.arg contains the substring given by expected",
    describe("expected can be a string",
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
          var test, expected;
          test= "now is the time";
          expected= "now is the time";
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= "now";
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= " ";
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= "is";
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= "time";
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
          var test, expected;
          test= "now is the time";
          expected= "now is the time for";
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.fail(test, expected));
          expected= "right now";
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.fail(test, expected));
          expected= "x";
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.fail(test, expected));
      })
    ),
    describe("expected can be a regular expression",
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
          var test, expected;
          test= "now is the time";
          expected= /now is the time/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= /now/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= / /;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= /is/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= /time/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= /^now/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
          expected= /^n../;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.pass(test, expected));
      }),
      demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
          var test, expected;
          test= "now is the time";
          expected= /now is the time for/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.fail(test, expected));
          expected= /right now/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.fail(test, expected));
          expected= /x/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.fail(test, expected));
          expected= /now$/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.fail(test, expected));
          expected= /^n.\s/;
          mock(bd.test.matchers.contains, test, [expected], bd.test.result.fail(test, expected));
      })
    )
  ),
  describe("the function bd.test.matchers.isEmpty(expected) tests if this.arg contains no properties of its own",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      mock(bd.test.matchers.isEmpty, {}, [], bd.test.result.pass({}));
      mock(bd.test.matchers.isEmpty, dojo.delegate({a:1}), [], bd.test.result.pass(dojo.delegate({a:1})));
    }),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      mock(bd.test.matchers.isEmpty, {a:1}, [], bd.test.result.fail({a:1}));
    })
  ),
  describe("the function bd.test.matchers.inClosedInterval(min, max) tests if (min <= this.arg <= max)",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      mock(bd.test.matchers.inClosedInterval, 1, [1, 3], bd.test.result.pass(1, 1, 3));
      mock(bd.test.matchers.inClosedInterval, 2, [1, 3], bd.test.result.pass(2, 1, 3));
      mock(bd.test.matchers.inClosedInterval, 3, [1, 3], bd.test.result.pass(3, 1, 3));
    }),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      mock(bd.test.matchers.inClosedInterval, 0, [1, 3], bd.test.result.fail(0, 1, 3));
      mock(bd.test.matchers.inClosedInterval, 4, [1, 3], bd.test.result.fail(4, 1, 3));
    }),
    demo("the function bd.test.matchers.inRange is a synonym for bd.test.matchers.inClosedInterval", function() {
      the(bd.test.matchers.inRange).is(bd.test.matchers.inClosedInterval);
    })
  ),
  describe("the function bd.test.matchers.inLeftOpenInterval(min, max) tests if (min < this.arg <= max)",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      mock(bd.test.matchers.inLeftOpenInterval, 2, [1, 3], bd.test.result.pass(2, 1, 3));
      mock(bd.test.matchers.inLeftOpenInterval, 3, [1, 3], bd.test.result.pass(3, 1, 3));
    }),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      mock(bd.test.matchers.inLeftOpenInterval, 1, [1, 3], bd.test.result.fail(1, 1, 3));
      mock(bd.test.matchers.inLeftOpenInterval, 0, [1, 3], bd.test.result.fail(0, 1, 3));
      mock(bd.test.matchers.inLeftOpenInterval, 4, [1, 3], bd.test.result.fail(4, 1, 3));
    }),
    demo("the function bd.test.matchers.inRange is a synonym for bd.test.matchers.inLeftOpenInterval", function() {
      the(bd.test.matchers.inLeftOpen).is(bd.test.matchers.inLeftOpenInterval);
    })
  ),
  describe("the function bd.test.matchers.inRightOpenInterval(min, max) tests if (min <= this.arg < max)",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      mock(bd.test.matchers.inRightOpenInterval, 1, [1, 3], bd.test.result.pass(1, 1, 3));
      mock(bd.test.matchers.inRightOpenInterval, 2, [1, 3], bd.test.result.pass(2, 1, 3));
    }),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      mock(bd.test.matchers.inRightOpenInterval, 0, [1, 3], bd.test.result.fail(0, 1, 3));
      mock(bd.test.matchers.inRightOpenInterval, 4, [1, 3], bd.test.result.fail(4, 1, 3));
      mock(bd.test.matchers.inRightOpenInterval, 3, [1, 3], bd.test.result.fail(3, 1, 3));
    }),
    demo("the function bd.test.matchers.inRange is a synonym for bd.test.matchers.inRightOpenInterval", function() {
      the(bd.test.matchers.inRightOpen).is(bd.test.matchers.inRightOpenInterval);
    })
  ),
  describe("the function bd.test.matchers.inOpenInterval(min, max) tests if (min < this.arg < max)",
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.pass(this.arg, expected) if the test passes", function() {
      mock(bd.test.matchers.inOpenInterval, 2, [1, 3], bd.test.result.pass(2, 1, 3));
    }),
    demo("bd.test.activeSpace.adviseResult is called with bd.test.result.fail(this.arg, expected) if the test fails", function() {
      mock(bd.test.matchers.inOpenInterval, 1, [1, 3], bd.test.result.fail(1, 1, 3));
      mock(bd.test.matchers.inOpenInterval, 3, [1, 3], bd.test.result.fail(3, 1, 3));
      mock(bd.test.matchers.inOpenInterval, 0, [1, 3], bd.test.result.fail(0, 1, 3));
      mock(bd.test.matchers.inOpenInterval, 4, [1, 3], bd.test.result.fail(4, 1, 3));
    }),
    demo("the function bd.test.matchers.inRange is a synonym for bd.test.matchers.inOpenInterval", function() {
      the(bd.test.matchers.inOpen).is(bd.test.matchers.inOpenInterval);
    })
  )
);
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
