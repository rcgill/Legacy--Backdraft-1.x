define(["dojo", "bd", "bd/test"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module(
  describe("the factory bd.test.result.pass(...) creates objects with the following properties",
    demo("pass is true", function() {
      the(bd.test.result.pass().pass).is(true);
      the(bd.test.result.pass(1, 2, 3).pass).is(true);
    }),
    demo('toString() returns "test passed"', function() {
      the(bd.test.result.pass().toString()).is("test passed");
      the(bd.test.result.pass(1, 2, 3).toString()).is("test passed");
    }),
    demo('args holds any passed arguments or undefined in none passed', function() {
      the(bd.test.result.pass().args).is(undefined);
      var test= bd.test.result.pass(1, 2, 3);
      the(test.args.length).is(3);
      the(test.args[0]).is(1);
      the(test.args[1]).is(2);
      the(test.args[2]).is(3);
    }),
    demo("prototype === bd.test.result.base", function() {
      the(bd.test.result.pass()).prototypeIs(bd.test.result.base);
    })
  ),
  describe("the factory bd.test.result.fail(...) creates objects with the following properties",
    demo("pass is false", function() {
      the(bd.test.result.fail().pass).is(false);
      the(bd.test.result.fail(1, 2, 3).pass).is(false);
    }),
    demo('toString() returns "test failed"', function() {
      the(bd.test.result.fail().toString()).is("test failed");
      the(bd.test.result.fail(1, 2, 3).toString()).is("test failed");
    }),
    demo('args holds any passed arguments or undefined in none passed', function() {
      the(bd.test.result.fail().args).is(undefined);
      var test= bd.test.result.fail(1, 2, 3);
      the(test.args.length).is(3);
      the(test.args[0]).is(1);
      the(test.args[1]).is(2);
      the(test.args[2]).is(3);
    }),
    demo("prototype === bd.test.result.base", function() {
      the(bd.test.result.fail()).prototypeIs(bd.test.result.base);
    })
  ),
  describe("the factory bd.test.result.exception(...) creates objects with the following properties",
    demo("pass is false", function() {
      the(bd.test.result.exception().pass).is(false);
      the(bd.test.result.exception(1, 2, 3).pass).is(false);
    }),
    demo('toString() returns "test failed (test threw)"', function() {
      the(bd.test.result.exception().toString()).is("test failed (test threw)");
      the(bd.test.result.exception(1, 2, 3).toString()).is("test failed (test threw)");
    }),
    demo('args holds any passed arguments or undefined in none passed', function() {
      the(bd.test.result.exception().args).is(undefined);
      var test= bd.test.result.exception(1, 2, 3);
      the(test.args.length).is(3);
      the(test.args[0]).is(1);
      the(test.args[1]).is(2);
      the(test.args[2]).is(3);
    }),
    demo("prototype === bd.test.result.base", function() {
      the(bd.test.result.exception()).prototypeIs(bd.test.result.base);
    })
  ),
  describe("the factory bd.test.result.timeout(...) creates objects with the following properties",
    demo("pass is false", function() {
      the(bd.test.result.timeout().pass).is(false);
      the(bd.test.result.timeout(1, 2, 3).pass).is(false);
    }),
    demo('toString() returns "test failed (test timed out)"', function() {
      the(bd.test.result.timeout().toString()).is("test failed (test timed out)");
      the(bd.test.result.timeout(1, 2, 3).toString()).is("test failed (test timed out)");
    }),
    demo('args holds any passed arguments or undefined in none passed', function() {
      the(bd.test.result.timeout().args).is(undefined);
      var test= bd.test.result.timeout(1, 2, 3);
      the(test.args.length).is(3);
      the(test.args[0]).is(1);
      the(test.args[1]).is(2);
      the(test.args[2]).is(3);
    }),
    demo("prototype === bd.test.result.base", function() {
      the(bd.test.result.timeout()).prototypeIs(bd.test.result.base);
    })
  ),
  describe("the factory bd.test.result.todo(...) creates objects with the following properties",
    demo("pass is true", function() {
      the(bd.test.result.todo().pass).is(true);
      the(bd.test.result.todo(1, 2, 3).pass).is(true);
    }),
    demo('toString() returns "TODO: test not implemented"', function() {
      the(bd.test.result.todo().toString()).is("TODO: test not implemented");
      the(bd.test.result.todo(1, 2, 3).toString()).is("TODO: test not implemented");
    }),
    demo('args holds any passed arguments or undefined in none passed', function() {
      the(bd.test.result.todo().args).is(undefined);
      var test= bd.test.result.todo(1, 2, 3);
      the(test.args.length).is(3);
      the(test.args[0]).is(1);
      the(test.args[1]).is(2);
      the(test.args[2]).is(3);
    }),
    demo("prototype === bd.test.result.base", function() {
      the(bd.test.result.todo()).prototypeIs(bd.test.result.base);
    })
  )
);
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
