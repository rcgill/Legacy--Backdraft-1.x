define(["dojo", "bd", "bd/test"], function(dojo, bd) {

//#include bd/test/testHelpers

module(
  describe("Convenience Functions",
    demo("describe", function() {
      function check() {
        var fail= false;
        for (var i= 1, end= bd.test.proc.map.length; i<end; i++) {
          //bd.tet.proc.map[i] can be null if the bd.test.proc object was bd.test.proc.destroy()'d
          if (bd.test.proc.map[i] && bd.test.proc.map[i].id != i) {
            fail= true;
          }
        }
        the(fail).is(false);
      }

      check();

      var
        f= function(){},
        g= function(){},
        a= [
          new bd.test.proc.description("some description"),
          new bd.test.proc.description("some description", scaffold("once", f, g)),
          new bd.test.proc.description("some description", new bd.test.proc.description("some other description"))
        ],
        b= [
          bd.test.describe("some description"),
          bd.test.describe("some description", scaffold("once", f, g)),
          bd.test.describe("some description", bd.test.describe("some other description"))
        ],
        ids= [b[0].id, b[1].id, b[2].id, b[2].children[0].id];

      check();

      b[0].id= a[0].id;
      b[1].id= a[1].id;
      b[2].id= a[2].id;
      b[2].children[0].id= a[2].children[0].id;
      for (var i= 0; i<a.length; i++) {
        var x= a[i], y= b[i];
        the(x).hasValue(y);
        the(x).isInstanceOf(bd.test.proc.description);
        the(y).isInstanceOf(bd.test.proc.description);
        the(x).prototypeIs(bd.test.proc.description.prototype);
        the(y).prototypeIs(bd.test.proc.description.prototype);
      }
      //restore the real ids so the bd.test.proc.map will be consistent...
      b[0].id= ids[0];
      b[1].id= ids[1];
      b[2].id= ids[2];
      b[2].children[0].id= ids[3];
    }),

    demo("member", function() {
      var test= bd.test.describeMember("some.member");
      the(test.traits).hasValue({member:true});
    }),

    demo("argument", function() {
      var test= bd.test.describeArgument("some.argument");
      the(test.traits).hasValue({argument:true});
    }),

    demo("scaffold", function() {
      var
        f= function(){},
        g= function(){},
        a= [
          new bd.test.proc.scaffold("once", f, g),
          new bd.test.proc.scaffold("each", f, g)
        ],
        b= [
          bd.test.scaffold("once", f, g),
          bd.test.scaffold("each", f, g)
        ];
      for (var i= 0; i<a.length; i++) {
        var x= a[i], y= b[i];
        the(x).hasValue(y);
        the(x).isInstanceOf(bd.test.proc.scaffold);
        the(y).isInstanceOf(bd.test.proc.scaffold);
        the(x).prototypeIs(bd.test.proc.scaffold.prototype);
        the(y).prototypeIs(bd.test.proc.scaffold.prototype);
      }
    }),

    demo("demo",  function() {
      var
        f= function(){},
        a= new bd.test.proc.demo("some demo", f),
        b= bd.test.demo("some demo", f),
        idHold= b.id;

      b.id= a.id;
      the(a).hasValue(b);
      the(a).isInstanceOf(bd.test.proc.demo);
      the(b).isInstanceOf(bd.test.proc.demo);
      the(a).prototypeIs(bd.test.proc.demo.prototype);
      the(b).prototypeIs(bd.test.proc.demo.prototype);
      b.id=idHold;
    }),

    demo("userDemo",  function() {
      var
        f= function(){},
        a= new bd.test.proc.demo("some demo", f),
        b= bd.test.userDemo("some demo", f);

      the(a.name).is(b.name);
      the(a.doc).is(b.doc);
      the(a.program).is(b.program);
      the(a.traits).is(undefined);
      the(b.traits).hasValue({userDemo:true});
      the(a).isInstanceOf(bd.test.proc.demo);
      the(b).isInstanceOf(bd.test.proc.demo);
      the(a).prototypeIs(bd.test.proc.demo.prototype);
      the(b).prototypeIs(bd.test.proc.demo.prototype);
    }),

    demo("note",  function() {
      var test= bd.test.note("some note");
      the(test).isInstanceOf(bd.test.proc.demo);
      the(test.name).is("");
      the(test.doc).is("some note");
      the(test.program).is(bd.noop);
      the(test.traits).hasValue({note:true});
    }),

    demo("todo",  function(space) {
      var test= [];
      //with a doc...
      test[0]= bd.test.todo("some todo note");
      the(test[0].name).is("");
      the(test[0].doc).is("TODO: some todo note");

      //without a doc...
      test[1]= bd.test.todo();
      the(test[1].name).is("");
      the(test[1].doc).is("TODO");

      //other behavior is the indepentent of the message...
      for (var i= 0; i<2; i++) {
        the(test[i]).isInstanceOf(bd.test.proc.demo);
        var spaceToDoCount= space.toDoCount;
        test[i].program(space);
        the(space.toDoCount).is(spaceToDoCount+1);
        //restore the
        space.toDoCount= spaceToDoCount;
        the(test[i].traits).hasValue({todo:true});
      }
    }),

    demo("see",  function() {
      var test= bd.test.see("a.b.c");
      the(test).isInstanceOf(bd.test.proc.demo);
      the(test.name).is("a.b.c");
      the(test.doc).is("See a.b.c.");
      the(test.program).is(bd.noop);
      the(test.traits).hasValue({reference:true});
    }),

    describe("the",
      scaffold(once, function() {
        // Note: the demos below assume that the===bd.test.the in the current lexical scope;
        // this is the case when a test module is preprocessed with //#wrapper bd.test.moduleWrapper.
      }),

      demo(function() {
        var x;

        //check that two values are identical: "the(x).is(y)" passes iff x===y
        x= 5;
        the(x).is(5);
        x= "hello, world";
        the(x).is("hello, world");

        //this works with falsey values...
        x= false;
        the(x).is(false);
        x= undefined;
        the(x).is(undefined);
        x= null;
        the(x).is(null);

        //references must be identical...
        x= {};
        the(x).is(x);
        the(x).isNot({});
        x= [];
        the(x).is(x);
        the(x).isNot([]);

        //check that two values are equal by value: "the(x).hasValue(y)" passes iff bd.equal(x, y)
        //value arguments work just like "is""
        x= 5;
        the(x).hasValue(5);
        x= "hello, world";
        the(x).hasValue("hello, world");
        x= false;
        the(x).hasValue(false);
        x= undefined;
        the(x).hasValue(undefined);
        x= null;
        the(x).hasValue(null);
        //but references are compared by value...
        x= {};
        the(x).hasValue({});
        the(x).isNot({});
        x= {a:1, b:2, c:{d:3, e:4}};
        the(x).hasValue({a:1, b:2, c:{d:3, e:4}});
        the(x).isNot({a:1, b:2, c:{d:3, e:4}});
        x= [];
        the(x).hasValue([]);
        the(x).isNot([]);
        x= [1, 2, [3, 4]];
        the(x).hasValue([1, 2, [3, 4]]);
        the(x).isNot([1, 2, [3, 4]]);

        //by default, all matchers in bd.test.matchers are available; see bd.test.matchers
      }),

      demo("bd.test.the(x) creates {arg:x}.", function() {
        bd.test.runSampleValues(function(item) {
          the(the(item).arg).is(item);
        });
      }),

      demo("bd.test.the(a1, a2, ..., an) creates {args:[a1, a2, ..., an]}; each ai in args is a reference to the passed argument.", function() {
        var test= bd.test.the.apply(bd.test.the, bd.test.sampleValues);
        for (var i= 0, end= bd.test.sampleValues.length; i<end; i++) {
          the(test.args[i]).is(bd.test.sampleValues[i]);
        }
      }),

      demo("bd.test.wait(x) blocks for x milliseconds", function() {
        //todo remove the next return.
        return;
        var target= bd.getTime() + 20;
        bd.wait(20);
        the(Math.abs(target - bd.getTime()) <= 1).is(true);
        target= bd.getTime() + 200;
        bd.wait(200);
         the(Math.abs(target - bd.getTime()) <= 1).is(true);
        target= bd.getTime() + 2000;
        bd.wait(2000);
        the(Math.abs(target - bd.getTime()) <= 1).is(true);
      }),


      describe("Created objects contain functions with the same names as those in bd.test.matchers.",
        demo(function () {
          var test= the(0);
          bd.forEachHash(bd.test.matchers, function(func, name) { the(test[name]).isFunction(); });
        }),
        demo("These functions call the matcher functions in the context of the created object and pass the result to bd.test.activeSpace.adviseResult.", function() {
          //simple smoke test...
          the(0).is(0);
          the({}).isNot({});
          the(0).hasValue(0);
          the({}).hasValue({});
          the(0).hasDiffValue({});
        }),
        note("See unit.bd.test.matchers for extensive matcher testing.")
      ),

      describe("Created objects' prototype === bd.test.the.base",
        demo(function() {
          the(the(0)).prototypeIs(bd.test.the.base);
        }),
        demo("Inserting/deleting properties in bd.test.the.base causes new objects to contain/not contain the inserted/deleted properties", function() {
          //insert a unique, known property...
          var
            prop= bd.uid(),
            value= {};
          bd.test.the.base[prop]= value;
           //henceforth, objects created with the(...) have the new property...
          var test= the(0);
          the(test[prop]).is(value);
           //delete a property
          delete  bd.test.the.base[prop];
           //henceforth, objects created with the(...) do not have the deleted property...
          test= the(0);
          the(test[prop]).is(undefined);
        })
      )
    )
  )
);

// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
});
