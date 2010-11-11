(function() {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/lang",
  theFunction("bd.hitch",
    demo("[*] Is identical to dojo.hitch", function() {
      the(bd.hitch).is(dojo.hitch);
    })
  ),
  theFunction("bd.Deferred",
    demo("[*] Is identical to dojo.Deferred", function() {
      the(bd.Deferred).is(dojo.Deferred);
    })
  ),
  theFunction("bd.safeMixin",
    demo("[*] Is identical to dojo.safeMixin", function() {
      the(bd.safeMixin).is(dojo.safeMixin);
    })
  ),
  theFunction("bd.isString",
    demo(//[(test)] returns true iff test is a string object of string literal.
      function() {
        //null, undedefined
        the(bd.isString(null)).is(false);
        the(bd.isString(undefined)).is(false);  

        //boolean
        the(bd.isString(true)).is(false);  
        the(bd.isString(false)).is(false);  

        //numbers
        the(bd.isString(12)).is(false);  
        the(bd.isString(1.2)).is(false);  
        the(bd.isString(new Number(1.2))).is(false);

        //strings
        the(bd.isString("hello")).is(true);  
        the(bd.isString('hello')).is(true);  
        the(bd.isString(new String("hello"))).is(true);  
        the(bd.isString(12 + "")).is(true);  
     
        //objects
        the(bd.isString({})).is(false);  
        the(bd.isString(new Object())).is(false);  

        //arrays
        the(bd.isString([])).is(false);  
        the(bd.isString([1, 2, 3])).is(false);  
        the(bd.isString(new Array(1, 2, 3))).is(false);  

        //functions
        the(bd.isString(function(){})).is(false);  
        the(bd.isString(new Function("x", "y", "return x+y;"))).is(false);  
        function f() {};
        the(bd.isString(f)).is(false);  

        //regex
        the(bd.isString(/hello/)).is(false);  
        the(bd.isString(new RegExp("hello"))).is(false);  

        //Date
        the(bd.isString(new Date())).is(false);  
      }
    )
  ),
  theFunction("bd.isArray",
    demo(//[(test)] returns true iff test is a string object of string literal.
      function() {
        //null, undedefined
        the(bd.isArray(null)).is(false);
        the(bd.isArray(undefined)).is(false);  

        //boolean
        the(bd.isArray(true)).is(false);  
        the(bd.isArray(false)).is(false);  

        //numbers
        the(bd.isArray(12)).is(false);  
        the(bd.isArray(1.2)).is(false);  
        the(bd.isArray(new Number(1.2))).is(false);

        //strings
        the(bd.isArray("hello")).is(false);  
        the(bd.isArray('hello')).is(false);  
        the(bd.isArray(new String("hello"))).is(false);  
        the(bd.isArray(12 + "")).is(false);  
     
        //objects
        the(bd.isArray({})).is(false);  
        the(bd.isArray(new Object())).is(false);  

        //arrays
        the(bd.isArray([])).is(true);  
        the(bd.isArray([1, 2, 3])).is(true);  
        the(bd.isArray(new Array(1, 2, 3))).is(true);  

        //functions
        the(bd.isArray(function(){})).is(false);  
        the(bd.isArray(new Function("x", "y", "return x+y;"))).is(false);  
        function f() {};
        the(bd.isArray(f)).is(false);  

        //regex
        the(bd.isArray(/hello/)).is(false);  
        the(bd.isArray(new RegExp("hello"))).is(false);  

        //Date
        the(bd.isArray(new Date())).is(false);  
      }
    )
  ),
  theFunction("bd.isFunction",
    demo(//[(test)] returns true iff test is a string object of string literal.
      function() {
        //null, undedefined
        the(bd.isFunction(null)).is(false);
        the(bd.isFunction(undefined)).is(false);  

        //boolean
        the(bd.isFunction(true)).is(false);  
        the(bd.isFunction(false)).is(false);  

        //numbers
        the(bd.isFunction(12)).is(false);  
        the(bd.isFunction(1.2)).is(false);  
        the(bd.isFunction(new Number(1.2))).is(false);

        //strings
        the(bd.isFunction("hello")).is(false);  
        the(bd.isFunction('hello')).is(false);  
        the(bd.isFunction(new String("hello"))).is(false);  
        the(bd.isFunction(12 + "")).is(false);  
     
        //objects
        the(bd.isFunction({})).is(false);  
        the(bd.isFunction(new Object())).is(false);  

        //arrays
        the(bd.isFunction([])).is(false);  
        the(bd.isFunction([1, 2, 3])).is(false);  
        the(bd.isFunction(new Array(1, 2, 3))).is(false);  

        //functions
        the(bd.isFunction(function(){})).is(true);  
        the(bd.isFunction(new Function("x", "y", "return x+y;"))).is(true);  
        function f() {};
        the(bd.isFunction(f)).is(true);  

        //regex
        the(bd.isFunction(/hello/)).is(false);  
        the(bd.isFunction(new RegExp("hello"))).is(false);  

        //Date
        the(bd.isFunction(new Date())).is(false);  
      }
    )
  ),
  theFunction("bd.isObject",
    demo(//[(test)] returns true iff test is a string object of string literal.
      function() {
        //null, undedefined
        the(bd.isObject(null)).is(false);
        the(bd.isObject(undefined)).is(false);  

        //boolean
        the(bd.isObject(true)).is(false);  
        the(bd.isObject(false)).is(false);  

        //numbers
        the(bd.isObject(12)).is(false);  
        the(bd.isObject(1.2)).is(false);
        the(bd.isObject(new Number(1.2))).is(true);

        //strings
        the(bd.isObject("hello")).is(false);  
        the(bd.isObject('hello')).is(false);  
        the(bd.isObject(new String("hello"))).is(true);  
        the(bd.isObject(12 + "")).is(false);  
     
        //objects
        the(bd.isObject({})).is(true);  
        the(bd.isObject(new Object())).is(true);  

        //arrays
        the(bd.isObject([])).is(true);  
        the(bd.isObject([1, 2, 3])).is(true);  
        the(bd.isObject(new Array(1, 2, 3))).is(true);  

        //functions
        the(bd.isObject(function(){})).is(true);  
        the(bd.isObject(new Function("x", "y", "return x+y;"))).is(true);  
        function f() {};
        the(bd.isObject(f)).is(true);  

        //regex
        the(bd.isObject(/hello/)).is(true);  
        the(bd.isObject(new RegExp("hello"))).is(true);  

        //Date
        the(bd.isObject(new Date())).is(true);

        //user-defined constructor
        function ctor(){};
        the(bd.isObject(new ctor())).is(true);  
      }
    )
  ),
  theFunction("bd.partial",
    demo(//[*] Returns a function equivalent to `function() { proc.apply(bd.global, bd.array(arguments, 0, args)); }`
      function() {
        var log;
        function test1() {
          the(this).is(bd.global); 
          log= "test1()"; 
        }
        function test2(x) {
          the(this).is(bd.global); 
          log= "test2(" + x + ")"; 
        }
        function test3(x, y) {
          the(this).is(bd.global); 
          log= "test3(" + x + ", " + y + ")"; 
        }
        var p1= bd.partial(test1);
        var p2= bd.partial(test2);
        var p2a= bd.partial(test2, "a");
        var p3= bd.partial(test3);
        var p3a= bd.partial(test3, "a");
        var p3ab= bd.partial(test3, "a", "b");

        p1(); the(log).is("test1()");

        p2("x"); the(log).is("test2(x)");
        p2a(); the(log).is("test2(a)");

        p3("x", "y"); the(log).is("test3(x, y)");
        p3a("x"); the(log).is("test3(a, x)");
        p3ab(); the(log).is("test3(a, b)");
      }
    )
  ),
  theFunction("bd.array", 
    demo(//[(arguments)] returns the arguments in arguments as an array
      function() {
        var result;
        function shim(a, b, c) {
          result= bd.array(arguments);
        }
        
        shim(); the(result).hasValue([]);
        shim(1); the(result).hasValue([1]);
        shim(1, 2); the(result).hasValue([1, 2]);
        shim(1, 2, 3); the(result).hasValue([1, 2, 3]);
        shim(1, 2, 3, 4); the(result).hasValue([1, 2, 3, 4]);
        shim(1, 2, 3, 4, 5); the(result).hasValue([1, 2, 3, 4, 5]);
      }
    ),
    demo(//[(arguments, 1)] returns the 2nd through last argument in arguments as an array
      function() {
        var result;
        function shim(a, b, c) {
          result= bd.array(arguments, 1);
        }
        
        shim(); the(result).hasValue([]);
        shim(1); the(result).hasValue([]);
        shim(1, 2); the(result).hasValue([2]);
        shim(1, 2, 3); the(result).hasValue([2, 3]);
        shim(1, 2, 3, 4); the(result).hasValue([2, 3, 4]);
        shim(1, 2, 3, 4, 5); the(result).hasValue([2, 3, 4, 5]);
      }
    ),
    demo(//[(arguments, 0, [100, 200])] returns [100, 200] concatenated with the arguments in arguments as an array
      function() {
        var result;
        function shim(a, b, c) {
          result= bd.array(arguments, 0, [100, 200]);
        }
        
        shim(); the(result).hasValue([100, 200]);
        shim(1); the(result).hasValue([100, 200, 1]);
        shim(1, 2); the(result).hasValue([100, 200, 1, 2]);
        shim(1, 2, 3); the(result).hasValue([100, 200, 1, 2, 3]);
        shim(1, 2, 3, 4); the(result).hasValue([100, 200, 1, 2, 3, 4]);
        shim(1, 2, 3, 4, 5); the(result).hasValue([100, 200, 1, 2, 3, 4, 5]);
      }
    ),
    demo(//[(arguments, 1, [100, 200])] returns [100, 200] concatenated with the 2nd through last argument in arguments as an array
      function() {
        var result;
        function shim(a, b, c) {
          result= bd.array(arguments, 1, [100, 200]);
        }
        
        shim(); the(result).hasValue([100, 200]);
        shim(1); the(result).hasValue([100, 200]);
        shim(1, 2); the(result).hasValue([100, 200, 2]);
        shim(1, 2, 3); the(result).hasValue([100, 200, 2, 3]);
        shim(1, 2, 3, 4); the(result).hasValue([100, 200, 2, 3, 4]);
        shim(1, 2, 3, 4, 5); the(result).hasValue([100, 200, 2, 3, 4, 5]);
      }
    )
  ),
  theFunction("bd.delegate",
    demo(//[*] Creates a new object with given prototype and properties.
      function() {
        var test1= {x:{}, y:{}};
        var test2= {a:{}, b:{}};

        var temp= bd.delegate(test1);
        the(temp).hasPropertiesExact(["x", "y"]);
        the(temp).hasOwnPropertiesExact([]);
        the(temp.x).is(test1.x);
        the(temp.y).is(test1.y);

        temp= bd.delegate(test1, test2);
        the(temp).hasPropertiesExact(["a", "b", "x", "y"]);
        the(temp).hasOwnPropertiesExact(["a", "b"]);
        the(temp.a).is(test2.a);
        the(temp.b).is(test2.b);
        the(temp.x).is(test1.x);
        the(temp.y).is(test1.y);
      }
    )
  ),
  theFunction("bd.mix",
    demo("[(undefined, {a:1})] Returns {a:1}", function() {
      var x;
      the(bd.mix(x, {a:1})).hasValue({a:1});
    }),
    demo("[(0, {a: 1}))] Returns {a: 1}", function() {
      the(bd.mix(0, {a: 1})).hasValue({a: 1});
    }),
    demo("[(false, {a: 1}))] Returns {a: 1}", function() {
      the(bd.mix(false, {a: 1})).hasValue({a: 1});
    }),
    demo("[({a: 1}, {b: 2}))] Returns {a: 1, b: 2}", function() {
      the(bd.mix({a: 1}, {b: 2})).hasValue({a: 1, b: 2});
    }),
    demo("[({a: 1}, {a: 2}))] Returns {a: 2}", function() {
      the(bd.mix({a: 1}, {a: 2})).hasValue({a: 2});
    }),
    demo("[({a: 1}, {a: 2}, true))] Returns {a: 2}", function() {
      the(bd.mix({a: 1}, {a: 2}, true)).hasValue({a: 2});
    }),
    demo("[({a: 1}, {a: 2}, 1))] Returns {a: 2}", function() {
      the(bd.mix({a: 1}, {a: 2}, 1)).hasValue({a: 2});
    }),
    demo("[({a: 0}, {a: 1}, {a: 2}))] Returns {a: 2}", function() {
      the(bd.mix({a: 0}, {a: 1}, {a: 2})).hasValue({a: 2});
    }),
    demo("[({x: 0}, {a: 1}, {a: 2}))] Returns {x: 0, a: 2}", function() {
      the(bd.mix({x: 0}, {a: 1}, {a: 2})).hasValue({x: 0, a: 2});
    }),
    demo("[({x: 0}, {y: 1}, {a: 2}))] Returns {x: 0, y:1, a: 2}", function() {
      the(bd.mix({x: 0}, {y: 1}, {a: 2})).hasValue({x: 0, y:1, a: 2});
    }),
    demo("[({a: 0}, {a: 1}, {a: 2}, false))] Returns {a: 0}", function() {
      the(bd.mix({a: 0}, {a: 1}, {a: 2}, false)).hasValue({a: 0});
    }),
    demo("[({x: 0}, {a: 1}, {a: 2}, false))] Returns {x: 0, a: 1}", function() {
      the(bd.mix({x: 0}, {a: 1}, {a: 2}, false)).hasValue({x: 0, a: 1});
    }),
    demo("[({x: 0}, {y: 1}, {a: 2}, false))] Returns {x: 0, y:1, a: 2}", function() {
      the(bd.mix({x: 0}, {y: 1}, {a: 2}, false)).hasValue({x: 0, y:1, a: 2});
    })
  ),
  theFunction("bd.extend",
    demo("[*] Mixes src objects into ctor.prototype with bd.mix.", function() {
      function ctor() {
      };
      var test= {x:{}};
      ctor.prototype= test;
      the(ctor.prototype).is(test);
      var testExtend= {y:{}};
      bd.extend(ctor, testExtend);
      the(ctor.prototype).is(test);
      the(ctor.prototype.y).is(testExtend.y);
      the(ctor.prototype).hasPropertiesExact(["x", "y"]);
    })
  ),
  theFunction("bd.get",
    describe("[name-context-default] The signature (name, context, default), name a jsName.",
      describe("[exists] When the target exists.",
        demo(// [("rawld")] retrieves the value of the global variable rawld
          function() {
            var check= {};
            window.rawld= check;
            the(bd.get("rawld")).is(check);
          }
        ),
        demo(// [("rawld.x")] retrieves the value of the property x in the global variable rawld
          function() {
            var check= {x: {}};
            window.rawld= check;
            the(bd.get("rawld.x")).is(check.x);
            //clean up
            delete window.rawld;
          }
        ),
        demo(//[("rawld.x.y")] retrieves the value of the property y of the property x in the global variable rawld
          function() {
            var check= {x: {y: {}}};
            window.rawld= check;
            the(bd.get("rawld.x.y")).is(check.x.y);
            //clean up
            delete window.rawld;
          }
        ),
        demo(//[("x", rawld)] retrieves the value of the property x in the object rawld
          function() {
            var rawld= {x: {}};
            the(bd.get("x", rawld)).is(rawld.x);
          }
        ),
        demo(//[("x.y", rawld)] retrieves the value of the property y of the property x in the object rawld
          function() {
            var rawld= {x: {y: {}}};
            the(bd.get("x.y", rawld)).is(rawld.x.y);
          }
        )
      ),
      describe("[undefined] When the target is undefined.",
        demo(//[("rawld")] returns undefined
          function() {
            delete window.rawld;
            the(bd.get("rawld")).is(undefined);
          }
        ),
        demo(//[("rawld.x")] returns undefined
          function() {
            delete window.rawld;
            the(bd.get("rawld.x")).is(undefined);
          }
        ),
        demo(//[("rawld.x.y")] returns undefined
          function() {
            delete window.rawld;
            the(bd.get("rawld.x.y")).is(undefined);
          }
        ),
        demo(//[("x", rawld)] returns undefined
          function() {
            the(bd.get("x", rawld)).is(undefined);
            delete window.rawld;
            var rawld= {};
            the(bd.get("x", rawld)).is(undefined);
          }
        ),
        demo(//[("x.y", rawld)] returns undefined
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
          demo(//[("rawld", test)] sets the value of the window.rawld to test
            function() {
              delete window.rawld;
              var test= {};
              the(bd.get("rawld", 0, test)).is(test);
              the(window.rawld).is(test);
              //clean up
              delete window.rawld;
            }
          ),
          demo(//[("rawld.x", test)] sets the value of window.rawld.x to test
            function() {
              delete window.rawld;
              var test= {};
              the(bd.get("rawld.x", 0, test)).is(test);
              the(window.rawld.x).is(test);
              the(window.rawld).hasValue({x:test});
              delete window.rawld;
            }
          ),
          demo(//[("rawld.x.y", test)] sets the value of window.rawld.x.y to test
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
          demo(//[("x", rawld, test)] sets the value of rawld.x to the default value and returns it to test
            function() {
              var test= {};
              var rawld= {};
              the(bd.get("x", rawld, test)).is(test);
              the(rawld.x).is(test);
              the(rawld).hasValue({x:test});
            }
          ),
          demo(//[("x.y", rawld, test)] sets the value of rawld.x.y to the default value and returns it to test
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
      demo(//[("rawld", 0, test)] does not change the value of the global variable rawld
        function() {
          var test1= {}, test2= {};
          window.rawld= test1;
          the(bd.get("rawld", 0, test2)).is(test1);
          the(window.rawld).is(test1);
          //clean up
          delete window.rawld;
        }
      ),
      demo(//[("rawld.x", test)] does not change the value of the global variable rawld.x
        function() {
          var test1= {x:{}}, test2= {};
          window.rawld= test1;
          the(bd.get("rawld.x", 0, test2)).is(test1.x);
          the(window.rawld).is(test1);
          //clean up
          delete window.rawld;
        }
      ),
      demo(//[("rawld.x.y", test)] does not change the value of the global variable rawld.x.y
        function() {
          var test1= {x:{y:{}}}, test2= {};
          window.rawld= test1;
          the(bd.get("rawld.x.y", 0, test2)).is(test1.x.y);
          the(window.rawld).is(test1);
          //clean up
          delete window.rawld;
        }
      ),
      demo(//[("x", rawld, test)] does not change the value of the variable rawld.x
        function() {
          var test1= {x:{}}, test2= {}, rawld= test1;
          the(bd.get("x", rawld, test2)).is(test1.x);
          the(rawld).is(test1);
        }
      ),
      demo(//[("x.y", rawld, test)] does not change the value of the variable rawld.y
        function() {
          var test1= {x:{y:{}}}, test2= {}, rawld= test1;
          the(bd.get("x.y", rawld, test2)).is(test1.x.y);
          the(rawld).is(test1);
        }
      )
    ),
    describe("[name, default] The signature (name, default), name a bd.modulePropertyName",
      describe("[exists] When the target exists",
        demo(//[("rawld:x")] retrieves the value of the property x in the module variable rawld
          function() {
            var check= {x: {}};
            define("rawld", [], check);
            the(bd.get("rawld:x")).is(check.x);
            //clean up
            dojo.undef("rawld");
          }
        ),
        demo(//[("rawld:x.y")] retrieves the value of the property y of the property x in the global variable rawld
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
        demo(//[("rawld:x", test)] sets the value of the property x in the module rawld to test
          function() {
            define("rawld", [], {});
            var test= {};
            the(bd.get("rawld:x", test)).is(test);
            the(dojo.module("rawld")).hasValue({x:test});
            //clean up
            dojo.undef("rawld");             
          }
        ),
        demo(//[("rawld:x.y", test)] sets the value of the property x in the module rawld to test
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
        demo(//[("rawld:x", test)] does not change the value of rawld:x
          function() {
            var test1= {x:{y:{}}}, test2= {};
            define("rawld", [], test1);
            the(bd.get("rawld:x", test2)).is(test1.x);
            the(dojo.module("rawld")).is(test1);
            //clean up
            dojo.undef("rawld");             
          }
        ),
        demo(//[("rawld:x.y", test)] does not change the value of rawld:x.y
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
  ),
  theFunction("bd.exists",
    demo(//[("rawld")] Returns true iff the global variable rawld exists.
      function() {
        delete rawld;
        the(bd.exists("rawld")).is(false);
        bd.global.rawld= "junk";
        the(bd.exists("rawld")).is(true);
      }
    ),
    demo(//[("rawld.x")] Returns true iff the property x exists in the global variable rawld exists.
      function() {
        delete rawld;
        the(bd.exists("rawld.x")).is(false);
        bd.global.rawld= {};
        the(bd.exists("rawld.x")).is(false);
        bd.global.rawld= {x:{}};
        the(bd.exists("rawld.x")).is(true);
      }
    ),
    demo(//[("x", rawld)] Returns true iff the property x exists in the object rawld
      function() {
        var rawld;
        the(bd.exists("x", rawld)).is(false);
        rawld= {};
        the(bd.exists("x", rawld)).is(false);
        rawld= {x:{}};
        the(bd.exists("x", rawld)).is(true);
      }
    ),
    demo(//[("x.y", rawld)] Returns true iff the property x exists in the property y in the object rawld
      function() {
        var rawld;
        the(bd.exists("x.y", rawld)).is(false);
        rawld= {};
        the(bd.exists("x.y", rawld)).is(false);
        rawld= {x:{}};
        the(bd.exists("x.y", rawld)).is(false);
        rawld= {x:{y:{}}};
        the(bd.exists("x.y", rawld)).is(true);
      }
    ),
    demo(//[("x", "rawld")] Returns true iff the property x exists in the module rawld.
      function() {
        dojo.undef("rawld");
        the(bd.exists("x", "rawld")).is(false);
        define("rawld", [], {});
        the(bd.exists("x", "rawld")).is(false);
        dojo.module("rawld").x= {};
        the(bd.exists("x", "rawld")).is(true);
        dojo.undef("rawld");
      }
    ),
    demo(//[("x.y", "rawld")] Returns true iff the property x exists in the property y in the module rawld.
      function() {
        dojo.undef("rawld");
        the(bd.exists("x.y", "rawld")).is(false);
        define("rawld", [], {});
        the(bd.exists("x.y", "rawld")).is(false);
        dojo.module("rawld").x= {};
        the(bd.exists("x.y", "rawld")).is(false);
        dojo.module("rawld").x.y= {};
        the(bd.exists("x.y", "rawld")).is(true);
        dojo.undef("rawld");
      }
    ),
    demo(//[("rawld:x")] Returns true iff the property x exists in the module rawld.
      function() {
        dojo.undef("rawld");
        the(bd.exists("x", "rawld")).is(false);
        define("rawld", [], {});
        the(bd.exists("x", "rawld")).is(false);
        dojo.module("rawld").x= {};
        the(bd.exists("x", "rawld")).is(true);
        dojo.undef("rawld");
      }
    ),
    demo(//[("rawld:x.y")] Returns true iff the property x exists in the property y in the module rawld.
      function() {
        dojo.undef("rawld");
        the(bd.exists("x.y", "rawld")).is(false);
        define("rawld", [], {});
        the(bd.exists("x.y", "rawld")).is(false);
        dojo.module("rawld").x= {};
        the(bd.exists("x.y", "rawld")).is(false);
        dojo.module("rawld").x.y= {};
        the(bd.exists("x.y", "rawld")).is(true);
        dojo.undef("rawld");
      }
    )
  ),
  theFunction("bd.set",
    describe("[target undefined] When the target is undefined",
      describe("[context-undefined] When context is undefined, a new global variable is created",
        demo(//[("rawld", test)] sets the value of the window.rawld to test
          function() {
            delete window.rawld;
            var test= {};
            the(bd.set("rawld", 0, test)).is(test);
            the(window.rawld).is(test);
            //clean up
            delete window.rawld;
          }
        ),
        demo(//[("rawld.x", test)] sets the value of window.rawld.x to test
          function() {
            delete window.rawld;
            var test= {};
            the(bd.set("rawld.x", 0, test)).is(test);
            the(window.rawld.x).is(test);
            the(window.rawld).hasValue({x:test});
            delete window.rawld;
          }
        ),
        demo(//[("rawld.x.y", test)] sets the value of window.rawld.x.y to test
          function() {
            delete window.rawld;
            var test= {};
            the(bd.set("rawld.x.y", 0, test)).is(test);
            the(window.rawld.x.y).is(test);
            the(window.rawld).hasValue({x:{y:test}});
            //clean up
            delete window.rawld;
          }
        )
      ),
      describe("[context-defined] When context is defined, a new property nested within context is created",
        demo(//[("x", rawld, test)] sets the value of rawld.x to the default value and returns it to test
          function() {
            var test= {};
            var rawld= {};
            the(bd.set("x", rawld, test)).is(test);
            the(rawld.x).is(test);
            the(rawld).hasValue({x:test});
          }
        ),
        demo(//[("x.y", rawld, test)] sets the value of rawld.x.y to the default value and returns it to test
          function() {
            var test= {};
            var rawld= {};
            the(bd.set("x.y", rawld, test)).is(test);
            the(rawld).hasValue({x:{y:test}});
            rawld= {x:{}};
            the(bd.set("x.y", rawld, test)).is(test);
            the(rawld).hasValue({x:{y:test}});
          }
        )
      )
    ),
    describe("[defined-default] When the target is defined and a default value is given",
      demo(//[("rawld", 0, test)] changes the value of the global variable rawld
        function() {
          var test1= {}, test2= {};
          window.rawld= test1;
          the(bd.set("rawld", 0, test2)).is(test2);
          the(window.rawld).is(test2);
          //clean up
          delete window.rawld;
        }
      ),
      demo(//[("rawld.x", test)] changes the value of the global variable rawld.x
        function() {
          var test1= {x:{}}, test2= {};
          window.rawld= test1;
          the(bd.set("rawld.x", 0, test2)).is(test2);
          the(window.rawld.x).is(test2);
          //clean up
          delete window.rawld;
        }
      ),
      demo(//[("rawld.x.y", test)] changes the value of the global variable rawld.x.y
        function() {
          var test1= {x:{y:{}}}, test2= {};
          window.rawld= test1;
          the(bd.set("rawld.x.y", 0, test2)).is(test2);
          the(window.rawld.x.y).is(test2);
          //clean up
          delete window.rawld;
        }
      ),
      demo(//[("x", rawld, test)] changes the value of the variable rawld.x
        function() {
          var test1= {x:{}}, test2= {}, rawld= test1;
          the(bd.set("x", rawld, test2)).is(test2);
          the(rawld.x).is(test2);
        }
      ),
      demo(//[("x.y", rawld, test)] changes the value of the variable rawld.y
        function() {
          var test1= {x:{y:{}}}, test2= {}, rawld= test1;
          the(bd.set("x.y", rawld, test2)).is(test2);
          the(rawld.x.y).is(test2);
        }
      )
    ),
    describe("[name, default] The signature (name, default), name a bd.modulePropertyName",
      describe("[undefined-default] When the target is undefined a new property is created",
        demo(//[("rawld:x", test)] sets the value of the property x in the module rawld to test
          function() {
            define("rawld", [], {});
            var test= {};
            the(bd.set("rawld:x", test)).is(test);
            the(dojo.module("rawld")).hasValue({x:test});
            //clean up
            dojo.undef("rawld");             
          }
        ),
        demo(//[("rawld:x.y", test)] sets the value of the property x in the module rawld to test
          function() {
            define("rawld", [], {});
            var test= {};
            the(bd.set("rawld:x.y", test)).is(test);
            the(dojo.module("rawld")).hasValue({x:{y:test}});
            //clean up
            dojo.undef("rawld");             
          }
        )
      ),
      describe("[defined-default] When the target is defined and a default value is given",
        demo(//[("rawld:x", test)] changes the value of rawld:x
          function() {
            var test1= {x:{y:{}}}, test2= {};
            define("rawld", [], test1);
            the(bd.set("rawld:x", test2)).is(test2);
            the(dojo.module("rawld").x).is(test2);
            //clean up
            dojo.undef("rawld");             
          }
        ),
        demo(//[("rawld:x.y", test)] changes the value of rawld:x.y
          function() {
            var test1= {x:{y:{}}}, test2= {};
            define("rawld", [], test1);
            var test= {};
            the(bd.set("rawld:x.y", test2)).is(test2);
            the(dojo.module("rawld").x.y).is(test2);
            //clean up
            dojo.undef("rawld");             
          }
        )
      )
    )
  ),
  theFunction("bd.clone",
    demo("[atomic-types] Rreturns the value for undefined, null, booleans, numbers, and strings", function() {
      the(bd.clone(undefined)).is(undefined);
      the(bd.clone(null)).is(null);
      the(bd.clone(true)).is(true);
      the(bd.clone(false)).is(false);
      the(bd.clone(0)).is(0);
      the(bd.clone(123)).is(123);
      the(bd.clone("")).is("");
      the(bd.clone("test")).is("test");
    }),
    demo("[simple-objects] Returns a deep copy of simple objects", function() {
      var o= {p1:null, p2:true, p3:false, p4:0, p5:123, p6:"test", p7:[], p8:[1,2,3], p9:new Date, p10:new Error("test"), p11:/test/};
      the(bd.clone(o)).hasValue(o);
      the(bd.clone(o)).isNot(o);
       for(var i= 1; i<8; i++) {
        o= {nest:o};
        the(bd.clone(o)).hasValue(o);
        the(bd.clone(o)).isNot(o);
      }
    }),
    demo("[standard-nesting-level] An object can be nested 9 levels by default", function () {
      var o= {};
      for(var i= 1; i<9; i++) {
        o= {nest:o};
        the(bd.clone(o)).hasValue(o);
        the(bd.clone(o)).isNot(o);
      }
    }),
    demo("[setting-nesting-level] The nesting level can be made deeper or shallower by setting the watchdog", function () {
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
    demo(//[exeeding-nesting-level] If the nesting level is exceeded, then Error("bd.clone: cycle detected") is thrown.
      function () {
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
      }
    ),
    demo("[source.clone] Delgates to source.clone, if available", function(space) {
      var ctor=  dojo.declare([], {
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
    demo("[clone-factories] Adding an item to  bd.clone.factories is utilized when source.constructor===<the added constructor> and source.clone doesn't exist", function(space) {
      var ctor= dojo.declare([], {
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
       //at this point o1.clone does note exist, but a matching function in bd.clone.factories does exist and should be used
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
  ),

  theFunction("[bd.hijack]",
    todo(),
    note("This function has been used in several tests.")
  )
);

})();
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
