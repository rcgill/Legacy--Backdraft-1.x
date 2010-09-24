(function() {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/kernel",
  theFunction("bd.getTime",
    demo("[()] Returns the time in milliseconds.", function() {
      var target= new Date();
      the(Math.abs(bd.getTime()-target.getTime())<=1).is(true);
    })
  ),
  theFunction("bd.eval",
    demo("[*] Is identical to dojo.eval", function() {
      the(bd.eval).is(dojo.eval);
    })
  ),
  theFunction("bd.deprecated",
    demo("[*] Is identical to dojo.deprecated", function() {
      the(bd.deprecated).is(dojo.deprecated);
    })
  ),
  theFunction("bd.experimental",
    demo("[*] Is identical to dojo.experimental", function() {
      the(bd.experimental).is(dojo.experimental);
    })
  ),
  theVar("bd.global",
    demo("[*] Is identical to the JavaScript global namespace.", function() {
      var checkGlobal;
      (function() {
        checkGlobal= this;
      }).call(null);
      the(bd.global).is(checkGlobal);
    })
  ),
  theVar("bd.doc",
    demo("[*] Is identical to the browser document object", function() {
      the(bd.doc).is(window.document);
    })
  ),
  theVar("bd.head",
    demo("[*] Is identical to the head element in the browser document object", function() {
      the(bd.head).is(window.document.getElementsByTagName("head")[0]);
    })
  ),
  theVar("bd.body",
    demo("[*] Is identical to the body element in the browser document object", function() {
      the(bd.body).is(window.document.getElementsByTagName("body")[0]);
    })
  ),
  theFunction("bd.uid",
    demo(// [()] Returns identifiers of the form `_bdUid``counting-number```, counting-number a continuously
         // increasing integer.
      function() {
        var first= bd.uid();
        the(first.substring(0, 6)).is("_bdUid");
        first= Number(first.substring(6));
        the(first).isNot(Number.NaN);
        the(Number(bd.uid().substring(6))).is(first+1);
      }
    )
  ),
  theFunction("bd.node",
    demo("[*] Is identical to dojo.byId", function() {
      the(bd.node).is(dojo.byId);
    })
  ),
  theVar("bd.defaultValue",
    demo("[*] Is an empty, unique object within the bd namespace", function() {
      the(bd.defaultValue).isEmpty();
      for (var p in bd) {
        if (p!="defaultValue") {
          the(bd[p]).isNot(bd.defaultValue);
        }
      }
    })
  ),
  theVar("bd.notFound",
    demo("[*] Is an empty, unique object within the bd namespace", function() {
      the(bd.notFound).isEmpty();
      for (var p in bd) {
        if (p!="notFound") {
          the(bd[p]).isNot(bd.notFound);
        }
      }
    })
  ),
  theVar("bd.noDoc",
    demo("[*] Is an empty, unique object within the bd namespace", function() {
      the(bd.noDoc).isEmpty();
      for (var p in bd) {
        if (p!="noDoc") {
          the(bd[p]).isNot(bd.noDoc);
        }
      }
    })
  ),
  theFunction("bd.nop",
    demo("[()] executes no statements and returns no value", function() {
      the(bd.noop()).is(undefined);
    })
  ),
  theFunction("bd.getOptionalProp",
    describe("[no side effects] Never modifies the source object",
      describe("[exists] When the source property exists.",
        demo(// [(source, property)] Returns the `source.``property```, including cases when the property value is falsy
          function() {
            var test= {x:{}};
            the(bd.getOptionalProp(test, "x")).is(test.x);
            test= {x:false};
            the(bd.getOptionalProp(test, "x")).is(test.x);
            the(test).is(test);
        }),
        demo(// [(source, property, value)] Ignores value and returns the `source.``property```, including cases when the 
             // property value is falsy
          function() {
            var test= {x:{}};
            test= {x:false};
            the(bd.getOptionalProp(test, "x")).is(test.x);
            the(bd.getOptionalProp(test, "x", "junk")).is(test.x);
            the(test).is(test);
        })
      ),
      describe("[undefined] When the source property is undefined",
        demo(//[(source, property)] Returns undefined.
          function() {
            var test= {};
            the(bd.getOptionalProp(test, "x")).is(undefined);
            the(test).is(test);
        }),
        demo(//[(source, property, value)] Returns value, including cases when value is falsy.
          function() {
            var test= {};
            the(bd.getOptionalProp(test, "x", "junk")).is("junk");
            the(bd.getOptionalProp(test, "x", false)).is(false);
        })
      )
    )
  ),
  theFunction("bd.moduleName",
    scaffold(each, (function() {
      var length;
      return [
        function() { 
          length= bd.moduleName.resolvers.length;
          return true;
        },
        function() {
          delete bd.moduleName["some.property.name"];
          delete bd.moduleName["some/module/name:some.property.name"];
          bd.moduleName.resolvers.splice(length); 
          return true;
        }
      ];
    })()),
    demo(// [("some.property.name")] Returns "some/property/name.
      function() {
        the(bd.moduleName("some.property.name")).is("some/property/name");
      }
    ),
    demo(// [("name:some.property.name")] Returns "name/some/module/name.
      function() {
        the(bd.moduleName("name:some.property.name")).is("name/some/property/name");
      }
    ),
    describe("[general transforms]Pushing general transforms takes precedence over existing transforms",
      demo(// [(general transform target)] Returns the result of the transform.
        function() {
          bd.moduleName.resolvers.push(function(name) {
            return name.substring(0, 4)=="some" && "result1";
          });
          the(bd.moduleName("some.property.name")).is("result1");
          the(bd.moduleName("some/module/name:some.property.name")).is("result1");
          bd.moduleName.resolvers.push(function(name) {
            return name.substring(0, 5)=="some/" && "result2";
          });
          the(bd.moduleName("some.property.name")).is("result1");
          the(bd.moduleName("some/module/name:some.property.name")).is("result2");
        }
      )
    ),
    describe("[explicit transforms]Inserting explicit transforms takes first precedence",
      demo(// [(explicit map target)] Returns the target.
        function() {
          bd.moduleName.resolvers.push(function(name) {
            return name.substring(0, 4)=="some" && "result1";
          });
          the(bd.moduleName("some.property.name")).is("result1");
          the(bd.moduleName("some/module/name:some.property.name")).is("result1");
          bd.moduleName["some.property.name"]= "result2";
          bd.moduleName["some/module/name:some.property.name"]= "result3";
          the(bd.moduleName("some.property.name")).is("result2");
          the(bd.moduleName("some/module/name:some.property.name")).is("result3");
        }
      )
    )
  ),
  describe("The object registry.", todo())
);

})();
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
