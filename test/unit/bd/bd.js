(function() {

//#include bd/test/testHelpers
//#commentToString

module("The bd namespace",
  describe("[module bd] The bd module",
    describe("[dojo-bd intersection] bd references several dojo functions",
      demo(// [demo] The dojo objects 
           // uid.delegate, eval, every, exists, extend, filter, hitch, indexOf, isAlien, isArray, isArrayLike,  
           // isFunction, isObject, isString, lastIndexOf, locale, mix, partial, replace, safeMixin, set, some, trim, 
           // toJson, toJsonIndentStr, trim, global, doc, head, deprecated, experimental are available as direct properties of the module bd.
        function() {
          for (var props= (
            "uid.delegate.eval.every.exists.filter.hitch.indexOf.isAlien.isArray.isArrayLike.isFunction.isObject.isString.lastIndexOf.locale.mix.partial.replace.safeMixin.set.some.trim." +
            "toJson.toJsonIndentStr.trim.global.doc.head.deprecated.experimental").split("."), i= props.length; i--;) {
            the(bd[props[i]]).is(dojo[props[i]]);
          }
        }
      ),
  
      note("[list] dojo and bd contain the following identical objects: " + (function() {
        var identicalList= [];
        for (var p in dojo) {
          if (bd[p]===dojo[p]) {
            identicalList.push(p);
          }
        }
        identicalList.sort();
        return identicalList.join(",");
      })()),
  
      demo("[extend] dijit connects to dojo.extend which makes it different", function() {
        the(bd.extend).isNot(dojo.extend);
      }),
  
      demo("[!==] The bd objects clone, map, isEmpty, get, and forEach although similar are not identical to the dojo counterports.",
        function() {
          for (var props= "clone.map.isEmpty.get.forEach".split("."), i= props.length; i--;) {
            the(bd[props[i]]).isNot(dojo[props[i]]);
          }
        }
      )
    ),
    theFunction("bd.get",
      describe("[name-context-default] The signature (name, context, default), name a jsName.",
        describe("[exists] When the target exists.",
          demo(//("rawld") retrieves the value of the global variable rawld
            function() {
              var check= {};
              window.rawld= check;
              the(bd.get("rawld")).is(check);
            }
          ),
          demo(//("rawld.x") retrieves the value of the property x in the global variable rawld
            function() {
              var check= {x: {}};
              window.rawld= check;
              the(bd.get("rawld.x")).is(check.x);
              //clean up
              delete window.rawld;
            }
          ),
          demo(//("rawld.x.y") retrieves the value of the property y of the property x in the global variable rawld
            function() {
              var check= {x: {y: {}}};
              window.rawld= check;
              the(bd.get("rawld.x.y")).is(check.x.y);
              //clean up
              delete window.rawld;
            }
          ),
          demo(//("x", rawld) retrieves the value of the property x in the object rawld
            function() {
              var rawld= {x: {}};
              the(bd.get("x", rawld)).is(rawld.x);
            }
          ),
          demo(//("x.y", rawld) retrieves the value of the property y of the property x in the object rawld
            function() {
              var rawld= {x: {y: {}}};
              the(bd.get("x.y", rawld)).is(rawld.x.y);
            }
          )
        ),
        describe("[undefined] When the target is undefined.",
          demo(//("rawld") returns undefined
            function() {
              delete window.rawld;
              the(bd.get("rawld")).is(undefined);
              //clean up
              delete window.rawld;
            }
          ),
          demo(//("rawld.x") returns undefined
            function() {
              delete window.rawld;
              the(bd.get("rawld.x")).is(undefined);
              //clean up
              delete window.rawld;
            }
          ),
          demo(//("rawld.x.y") returns undefined
            function() {
              delete window.rawld;
              the(bd.get("rawld.x.y")).is(undefined);
            }
          ),
          demo(//("x", rawld) returns undefined
            function() {
              the(bd.get("x", rawld)).is(undefined);
              //clean up
              delete window.rawld;
              var rawld= {};
              the(bd.get("x", rawld)).is(undefined);
            }
          ),
          demo(//("x.y", rawld) returns undefined
            function() {
              the(bd.get("x.y", rawld)).is(undefined);
              //clean up
              delete window.rawld;
              var rawld= {};
              the(bd.get("x.y", rawld)).is(undefined);
              rawld= {x:{}};
              the(bd.get("x.y", rawld)).is(undefined);
            }
          )
        ),
        describe("[undefined-default] When the target is undefined and a default value is given",
          describe("[context-undefined] When context is undefined, a new global variable is created",
            demo(//("rawld", test) sets the value of the window.rawld to test
              function() {
                delete window.rawld;
                var test= {};
                the(bd.get("rawld", 0, test)).is(test);
                the(window.rawld).is(test);
                //clean up
                delete window.rawld;
              }
            ),
            demo(//("rawld.x", test) sets the value of window.rawld.x to test
              function() {
                delete window.rawld;
                var test= {};
                the(bd.get("rawld.x", 0, test)).is(test);
                the(window.rawld.x).is(test);
                the(window.rawld).hasValue({x:test});
                delete window.rawld;
              }
            ),
            demo(//("rawld.x.y", test) sets the value of window.rawld.x.y to test
              function() {
                delete window.rawld;
                var test= {};
                the(bd.get("rawld.x.y", 0, test)).is(test);
                the(window.rawld.x.y).is(test);
                the(window.rawld).hasValue({x:{y:test}});
                //clean up
                delete window.rawld;
              }
            )
          ),
          describe("[context-defined] When context is defined, a new property nested within context is created",
            demo(//("x", rawld, test) sets the value of rawld.x to the default value and returns it to test
              function() {
                var test= {};
                var rawld= {};
                the(bd.get("x", rawld, test)).is(test);
                the(rawld.x).is(test);
                the(rawld).hasValue({x:test});
              }
            ),
            demo(//("x.y", rawld, test) sets the value of rawld.x.y to the default value and returns it to test
              function() {
                var test= {};
                var rawld= {};
                the(bd.get("x.y", rawld, test)).is(test);
                the(rawld).hasValue({x:{y:test}});
                rawld= {x:{}};
                the(bd.get("x.y", rawld, test)).is(test);
                the(rawld).hasValue({x:{y:test}});
              }
            )
          )
        )
      ),
      describe("[defined-default] When the target is defined and a default value is given",
        demo(//("rawld", 0, test) does not change the value of the global variable rawld
          function() {
            delete window.rawld;
            var test1= {}, test2= {};
            window.rawld= test1;
            the(bd.get("rawld", 0, test2)).is(test1);
            the(window.rawld).is(test1);
            //clean up
            delete window.rawld;
          }
        ),
        demo(//("rawld.x", test) does not change the value of the global variable rawld.x
          function() {
            delete window.rawld;
            var test1= {x:{}}, test2= {};
            window.rawld= test1;
            the(bd.get("rawld.x", 0, test2)).is(test1.x);
            the(window.rawld).is(test1);
            //clean up
            delete window.rawld;
          }
        ),
        demo(//("rawld.x.y", test) does not change the value of the global variable rawld.x.y
          function() {
            delete window.rawld;
            var test1= {x:{y:{}}}, test2= {};
            window.rawld= test1;
            the(bd.get("rawld.x.y", 0, test2)).is(test1.x.y);
            the(window.rawld).is(test1);
            //clean up
            delete window.rawld;
          }
        ),
        demo(//("x", rawld, test) does not change the value of the variable rawld.x
          function() {
            var test1= {x:{}}, test2= {}, rawld= test1;
            the(bd.get("x", rawld, test2)).is(test1.x);
            the(rawld).is(test1);
          }
        ),
        demo(//("x.y", rawld, test) does not change the value of the variable rawld.y
          function() {
            var test1= {x:{y:{}}}, test2= {}, rawld= test1;
            the(bd.get("x.y", rawld, test2)).is(test1.x.y);
            the(rawld).is(test1);
          }
        )
      ),
      describe("[name, default] The signature (name, default), name a bd.modulePropertyName",
        describe("[exists] When the target exists",
          demo(//("rawld:x") retrieves the value of the property x in the module variable rawld
            function() {
              var check= {x: {}};
              define("rawld", [], check);
              the(bd.get("rawld:x")).is(check.x);
              //clean up
              dojo.undef("rawld");
            }
          ),
          demo(//("rawld:x.y") retrieves the value of the property y of the property x in the global variable rawld
            function() {
              var check= {x: {y: {}}};
              define("rawld", [], check);
              the(bd.get("rawld:x.y")).is(check.x.y);
              //clean up
              dojo.undef("rawld");
            }
          )
        ),
        demo("[undefined] When the target is undefined", function() {
          //no module rawld...
          the(bd.get("rawld:x")).is(undefined);

          //module rawld, but no x in rawld
          define("rawld", [], {});
          the(bd.get("rawld:x")).is(undefined);
          //clean up
          dojo.undef("rawld");

          //module rawld with x, but no y in x
          define("rawld", [], {x:{}});
          the(bd.get("rawld:x.y")).is(undefined);
          //clean up
          dojo.undef("rawld");
        }),
        describe("[undefined-default] When the target is undefined and a default value is given",
          demo(//("rawld:x", test) sets the value of the property x in the module rawld to test
            function() {
              define("rawld", [], {});
              var test= {};
              the(bd.get("rawld:x", test)).is(test);
              the(dojo.module("rawld")).hasValue({x:test});
              //clean up
              dojo.undef("rawld");             
            }
          ),
          demo(//("rawld:x.y", test) sets the value of the property x in the module rawld to test
            function() {
              define("rawld", [], {});
              var test= {};
              the(bd.get("rawld:x.y", test)).is(test);
              the(dojo.module("rawld")).hasValue({x:{y:test}});
              //clean up
              dojo.undef("rawld");             
            }
          )
        ),
        describe("[defined-default] When the target is defined and a default value is given",
          demo(//("rawld:x", test) does not change the value of rawld:x
            function() {
              var test1= {x:{y:{}}}, test2= {};
              define("rawld", [], test1);
              the(bd.get("rawld:x", test2)).is(test1.x);
              the(dojo.module("rawld")).is(test1);
              //clean up
              dojo.undef("rawld");             
            }
          ),
          demo(//("rawld:x.y", test) does not change the value of rawld:x.y
            function() {
              var test1= {x:{y:{}}}, test2= {};
              define("rawld", [], test1);
              var test= {};
              the(bd.get("rawld:x.y", test2)).is(test1.x.y);
              the(dojo.module("rawld")).is(test1);
              //clean up
              dojo.undef("rawld");             
            }
          )
        )

      )
    )
  ),

// note: bd has its own versions of get, clone, map, forEach, and isEmpty.


  theFunction("bd.back",
    demo('[s1]() test28 returns undefined', function() {
      the(bd.back([])).is(undefined);
    }),
    demo('[s2](x) returns the last element of x if x is a non-empty array', function() {
      var someObject= {};
      the(bd.back([someObject])).is(someObject);
      the(bd.back([1, someObject])).is(someObject);
      the(bd.back([1, 2, someObject])).is(someObject);
      the(bd.back([1, 2, 3, someObject])).is(someObject);
    }),
    demo('[s3](x) returns undefined if x is not an array', function() {
      the(bd.back({})).is(undefined);
    })
  ),
  describe("the function bd.forEach",
    describe("(collection, proc), collection a non-empty array",
      demo("calls proc(item, index, collection) for each item at offset index in collection", function() {
        var
          theArray= ["a", 1, {someProp:"someValue"}],
          i= 0;
        bd.forEach(theArray, function(item, index, a) {
          the(item).is(theArray[index]);
          the(index).is(i++);
          the(a).is(theArray);
        });
      })
    ),
    describe("(collection, proc, context), collection a non-empty array, proc and context valid arguments for dojo.hitch",
      demo("calls dojo.hitch(context, proc)(item, index, collection) for each item at offset index in collection", function() {
        var
          testerObject= {
            testerFunction: function(item, index, a) {
              the(this).is(expectedContext);
              the(item).is(theArray[index]);
              the(index).is(i++);
              the(a).is(theArray);
            }
          },
          theArray= ["a", 1, {someProp:"someValue"}],
          expectedContext= testerObject,
          i= 0;
        bd.forEach(theArray, "testerFunction", expectedContext);
        i= 0;
        bd.forEach(theArray, testerObject.testerFunction, expectedContext);
        i= 0;
        expectedContext= {};
        bd.forEach(theArray, testerObject.testerFunction, expectedContext);
      })
    ),
    describe("(hash, proc), collection a simple hash",
      demo("calls proc(item, name, hash) for each item at property name in hash", function() {
        var
          theHash= {p1:"a", p2:1, p3:{someProp:"someValue"}},
          propertyNames= [];
        bd.forEach(theHash, function(item, name, o) {
          propertyNames.push(name);
          the(item).is(theHash[name]);
          the(o).is(theHash);
        });
        the(propertyNames.sort().join(".")).is("p1.p2.p3");
      })
    ),
    describe("(hash, proc, context), collection a simple hash, proc and context valid arguments for dojo.hitch",
      demo("calls dojo.hitch(context, proc)(item, name, hash) for each item at property name in hash", function() {
        var
          testerObject= {
            testerFunction: function(item, name, o) {
              the(this).is(expectedContext);
              propertyNames.push(name);
              the(item).is(theHash[name]);
              the(o).is(theHash);
            }
          },
          theHash= {p1:"a", p2:1, p3:{someProp:"someValue"}},
          expectedContext= testerObject,
          propertyNames;
        propertyNames= [];
        bd.forEach(theHash, "testerFunction", expectedContext);
        the(propertyNames.sort().join(".")).is("p1.p2.p3");
        propertyNames= [];
        bd.forEach(theHash, testerObject.testerFunction, expectedContext);
        the(propertyNames.sort().join(".")).is("p1.p2.p3");
        propertyNames= [];
        expectedContext= {};
        bd.forEach(theHash, testerObject.testerFunction, expectedContext);
        the(propertyNames.sort().join(".")).is("p1.p2.p3");
      })
    ),
    demo("(x), x a class instance with prototype properties, does not iterate over properties in the prototype", function(space) {
      var someClass= function() {
          this.x= 1;
      };
      someClass.prototype.y= 2;
      var theObject= new someClass();
      theObject.z= 3;
      the(theObject.x).is(1);
      the(theObject.y).is(2);
      the(theObject.z).is(3);
      var propertyNames= [];
      bd.forEach(theObject, function(item, name, o) {
        propertyNames.push(name);
        the(item).is(theObject[name]);
        the(o).is(theObject);
      });
      the(bd.findFirst(propertyNames, "x")).isNot(bd.notFound);
      the(bd.findFirst(propertyNames, "y")).is(bd.notFound);
      the(bd.findFirst(propertyNames, "z")).isNot(bd.notFound);
    }),
    demo("(x), x and instance of object, and Object's prototype extended with new properties, does not iterate over properties in Object's prototype", function() {
      Object.prototype.anUnwiseAugmentationOfObject= 1234;
      var
        theHash= {p1:"a", p2:1, p3:{someProp:"someValue"}},
        propertyNames= [];
      the(theHash.anUnwiseAugmentationOfObject).is(1234);
      bd.forEach(theHash, function(item, name, o) {
        propertyNames.push(name);
        the(item).is(theHash[name]);
        the(o).is(theHash);
      });
      the(propertyNames.sort().join(".")).is("p1.p2.p3");
      delete Object.prototype.anUnwiseAugmentationOfObject;
    })
  ),
  demo("the function bd.getTime returns the time in milliseconds", function() {
    var target= new Date();
    the(Math.abs(bd.getTime()-target.getTime())<=1).is(true);
  }),
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
  describe("the function bd.lookupFunctionHash",
    demo("bd.lookupFunctionHash(func, hash) returns hash[i][1] iff hash[i][0]===func, in in [0..hash.length); otherwise it returns false", function() {
      var
        f= function() {},
        g= function() {},
        target= {};
      the(bd.lookupFunctionHash(f, [])).is(false);
      the(bd.lookupFunctionHash(f, [[g, target]])).is(false);
      the(bd.lookupFunctionHash(f, [[f, target]])).is(target);
      the(bd.lookupFunctionHash(f, [[1,2], [f, target], [3, 4]])).is(target);
      the(bd.lookupFunctionHash(f, [[f, target], [1,2], [3, 4]])).is(target);
      the(bd.lookupFunctionHash(f, [[1,2], [3, 4], [f, target]])).is(target);
    })
  ),
  describe("the function bd.metric",
    demo('given value, a number, the number is converted to a string, "px" is appended and the result returned', function() {
      the(bd.css.metric(123)).is("123px");
    }),
    demo('given value, a string of dijits, "px" is appended and the result returned', function() {
      the(bd.css.metric("123")).is("123px");
    }),
    demo("given value, not a number and not a string of dijits, value is returned unchanged", function() {
      the(bd.css.metric("123em")).is("123em");
    })
  ),
  describe("the function bd.css.emBox",
    demo('given a css.abbreviatedBox, the implied CSS style string is returned; units are ems', function() {
      the(bd.css.emBox({t:1, b:2, l:3, r:4, h:5, w:6})).is("top:1em;bottom:2em;left:3em;right:4em;height:5em;width:6em;");
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
  ),
  describe("the function bd.isDomNode", todo()),
  describe("the function bd.clearPositioning", todo()),
  describe("the function bd.clearSizing", todo()),
  describe("the function bd.clearPositoiningAndSizing", todo()),
  describe("the function bd.createWidget", todo()),
  describe("the function bd.getQueryArgs", todo()),
  describe("the function bd.getParamArgs", todo()),
  describe("the function bd.start", todo())
);
})();
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
