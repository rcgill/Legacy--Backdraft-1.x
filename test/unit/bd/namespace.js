define(["dojo", "bd", "bd/namespace"], function(dojo, bd) {

//#include bd/test/testHelpers

module("The module bd/namespace.",
  describe("instances created with default constructor arguments",
    demo("when given (name, value) arguments to the method add, add the value to the associated array at offset name", function() {
      var namespace= new bd.namespace();
      var o1={}, o2={}, o3={};
      namespace.set("rawld", o1);
      namespace.set("c", o2);
      namespace.set("gill", o3);
      the(namespace.get("rawld")).is(o1);
      the(namespace.get("c")).is(o2);
      the(namespace.get("gill")).is(o3);
    }),
    demo("when given (name, value) arguments where name already exists, value is overwritten", function() {
      var namespace= new bd.namespace();
      var o1={}, o2={};
      namespace.set("rawld", o1);
      the(namespace.get("rawld")).is(o1);
      namespace.set("rawld", o2);
      the(namespace.get("rawld")).is(o2);
    }),
    demo("attempting to get a name that hasn't been added returns undefined", function() {
      var namespace= new bd.namespace();
      var o1={};
      namespace.set("rawld", o1);
      the(namespace.get("rawld")).is(o1);
      the(namespace.get("gill")).is(undefined);
    }),
    demo("delete a previously added (name, value) from the associative array", function() {
      var namespace= new bd.namespace();
      var o1={};
      namespace.set("rawld", o1);
      the(namespace.get("rawld")).is(o1);
      namespace.del("rawld");
      the(namespace.get("rawld")).is(undefined);
    }),
    describe("forEach iterates over the associative array passing (name, value) at each iteration",
      demo("forEach accepts a function", function() {
        var namespace= new bd.namespace();
        namespace.set("rawld", 1);
        namespace.set("c", 2);
        namespace.set("gill", 3);
        namespace.forEach(function(name, value) {
          switch(name) {
            case "rawld": the(value).is(1); return;
            case "c": the(value).is(2); return;
            case "gill": the(value).is(3); return;
            default: the(true).isFalse();
          }
        });
      }),
      demo("forEach accepts a function (a function) and a context", function() {
        var namespace= new bd.namespace();
        namespace.set("rawld", 1);
        namespace.set("c", 2);
        namespace.set("gill", 3);
        var o= {
          someProperty:"someValue",
          f: function(name, value) {
            the(this.someProperty).is("someValue");
            switch(name) {
              case "rawld": the(value).is(1); return;
              case "c": the(value).is(2); return;
              case "gill": the(value).is(3); return;
              default: the(true).isFalse();
            }
          }
        };
        namespace.forEach(o.f, o);
      }),
      demo("forEach accepts a function (a string giving a property name in context) and a context", function() {
        var namespace= new bd.namespace();
        namespace.set("rawld", 1);
        namespace.set("c", 2);
        namespace.set("gill", 3);
        var o= {
          someProperty:"someValue",
          f: function(name, value) {
            the(this.someProperty).is("someValue");
            switch(name) {
              case "rawld": the(value).is(1); return;
              case "c": the(value).is(2); return;
              case "gill": the(value).is(3); return;
              default: the(true).isFalse();
            }
          }
        };
        namespace.forEach("f", o);
      })
    ),
    describe("filter iterates over the associative array passing (name, value) to a filter function (a predicate) at each iteration; a new namespace is returned that contains those items where filter returned true",
      demo("filter accepts a function", function() {
        var namespace= new bd.namespace();
        namespace.set("rawld", 1);
        namespace.set("c", 2);
        namespace.set("gill", 3);
        var newNamespace= namespace.filter(function(name, value) {
          switch(name) {
            case "rawld": the(value).is(1); return true;
            case "c": the(value).is(2); return false;
            case "gill": the(value).is(3); return false;
            default: the(true).isFalse();
          }
          return false;
        });
        var count= 0;
        newNamespace.forEach(function(name, value) {
          count++;
          the(name).is("rawld");
          the(value).is(1);
        });
        the(count).is(1);
      }),
      demo("filter accepts a function (a function) and a context", function() {
        var namespace= new bd.namespace();
        namespace.set("rawld", 1);
        namespace.set("c", 2);
        namespace.set("gill", 3);
        var o= {
          someProperty:"someValue",
          f: function(name, value) {
            the(this.someProperty).is("someValue");
            switch(name) {
              case "rawld": the(value).is(1); return true;
              case "c": the(value).is(2); return false;
              case "gill": the(value).is(3); return false;
              default: the(true).isFalse();
            }
            return false;
          }
        };
        var newNamespace= namespace.filter(o.f, o);
        var count= 0;
        newNamespace.forEach(function(name, value) {
          count++;
          the(name).is("rawld");
          the(value).is(1);
        });
        the(count).is(1);
      }),
      demo("filter accepts a function (a string giving a property name in context) and a context", function() {
        var namespace= new bd.namespace();
        namespace.set("rawld", 1);
        namespace.set("c", 2);
        namespace.set("gill", 3);
        var o= {
          someProperty:"someValue",
          f: function(name, value) {
            the(this.someProperty).is("someValue");
            switch(name) {
              case "rawld": the(value).is(1); return true;
              case "c": the(value).is(2); return false;
              case "gill": the(value).is(3); return false;
              default: the(true).isFalse();
            }
            return false;
          }
        };
        var newNamespace= namespace.filter("f", o);
        var count= 0;
        newNamespace.forEach(function(name, value) {
          count++;
          the(name).is("rawld");
          the(value).is(1);
        });
        the(count).is(1);
      })
    )
  ),
  describe("the constructor accepts a creator function that is used to add new items to the associative array",
    demo("the arguments given to add are passed to the custom creator function", function() {
      var namespace= new bd.namespace(function(name, value, language) {
        var stored= {
          value: value,
          language: language
        };
        this._hash[name]= stored;
        return stored;
      });
      namespace.set("rawld", 1, "lisp");
      namespace.set("gill", 2, "javascript");
      the(namespace.get("rawld").value).is(1);
      the(namespace.get("rawld").language).is("lisp");
      the(namespace.get("gill").value).is(2);
      the(namespace.get("gill").language).is("javascript");
    }),
    demo("the creator function can associate whatever it wants with the name", function() {
      var namespace= new bd.namespace(function(name, value, language) {
        return (this._hash[name]= (language=="javascript" ? "cool" : "nerd"));
      });
      namespace.set("rawld", 1, "lisp");
      namespace.set("gill", 2, "javascript");
      the(namespace.get("rawld")).is("nerd");
      the(namespace.get("gill")).is("cool");
    }),
    demo("if the creator function can create a default value, then the bd.namespace constructor argument autocreate can be set true to cause get to automatically add a new object when the requested object doesn't already exist", function() {
      var namespace= new bd.namespace(function(name, value, language) {
        return (this._hash[name]= (language=="javascript" ? "cool" : "nerd"));
      }, true);
      namespace.set("rawld", 1, "lisp");
      namespace.set("gill", 2, "javascript");
      the(namespace.get("rawld")).is("nerd");
      the(namespace.get("gill")).is("cool");
      the(namespace.get("alex")).is("nerd");
      namespace.set("alex", 3, "javascript");
      the(namespace.get("alex")).is("cool");
    }),
    demo("when the bd.namespace constructor argument autocreate is true, get can be passed extra arguments to help the creator when the requested object doesn't already exist", function() {
      var namespace= new bd.namespace(function(name, value, language) {
        return (this._hash[name]= (language=="javascript" ? "cool" : "nerd"));
      }, true);
      namespace.set("rawld", 1, "lisp");
      namespace.set("gill", 2, "javascript");
      the(namespace.get("rawld")).is("nerd");
      the(namespace.get("gill")).is("cool");
      the(namespace.get("alex", 3, "javascript")).is("cool");
    })
  )
);
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
