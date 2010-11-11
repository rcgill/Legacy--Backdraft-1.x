define(["dojo", "bd", "bd/test"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

var
  mockWriter= function(text) {
    output+= this.spaces.substring(0, (this.indentValue * this.indentSize)) + text;
  },
  output= "",
  mpo= function(mock) {
    //[m]ake[p]roc[o]bject
    mock.log= function() {
      return this.doc || this.name;
    };
    return mock;
  };

module(
  describe("constructor",
    note("Failing to specify a write function in args causes the publisher's default write function (a no-op) to be invoked."),
    userDemo(function() {
      var publisher;
      //the default constructor...
      publisher= new bd.test.publisher({write:mockWriter});
      the(publisher.indentSize).is(3);
      the(publisher.indentValue).is(0);
      the(publisher.write).is(mockWriter);

      //with the exception of the property "handlers", all create args properties are blindly mixed into the new object...
      publisher= new bd.test.publisher({a:"aValue", b:"bValue", c:"cValue"});
      the(publisher.a).is("aValue");
      the(publisher.b).is("bValue");
      the(publisher.c).is("cValue");
      //of course the other properties were unaffected since args didn't mention them...
      the(publisher.indentSize).is(3);
      the(publisher.indentValue).is(0);
    }
   )
  ),

  describe("publish",
    demo("[1]", function() {
      var publisher= new bd.test.publisher({
        write:mockWriter,
        "some.message": function(message){
          the(this).is(publisher);
        }
        }),
        hold= bd.test.publisher.traverseIn;
       bd.test.publisher.traverseIn= function(message) {
        the(this).is(publisher);
      };
      publisher.publish("some.message");
      publisher.publish("traverseIn");
      bd.test.publisher.traverseIn= hold;
    }),
    demo("[2]", function() {
      var publisher= new bd.test.publisher({write:mockWriter});
      output= "";
      publisher.publish("abort");
      the(output).isNot("");
      publisher.abort= false;
      output= "";
      publisher.publish("abort");
      the(output).is("");
      publisher= new bd.test.publisher({write:mockWriter, abort:false});
      publisher.publish("abort");
      the(output).is("");
    }),
    demo("[3]", function() {
      var publisher= new bd.test.publisher({write:mockWriter});
      output= "";
      publisher.publish("some.nonexistent.message");
      the(output).is("some.nonexistent.message");
    })
  ),

  describe("indent", demo(function() {
    var publisher= new bd.test.publisher({write:mockWriter});
    the(publisher.indentValue).is(0);
    publisher.indent(1);
    the(publisher.indentValue).is(1);
    publisher.indent(5);
    the(publisher.indentValue).is(6);
    publisher.indent(-6);
    the(publisher.indentValue).is(0);
  })),

  describe("writeIndent", demo(function() {
    var publisher= new bd.test.publisher({write:mockWriter});
    function check(indentValue, indentSize) {
      publisher.indentValue= indentValue;
      publisher.indentSize= indentSize;
      output= "";
      publisher.indent(1);
      publisher.write("");
      the(output.length).is((indentValue+1)*indentSize);
      var zeroOrMoreSpaces= /^[ ]*$/;
      the(zeroOrMoreSpaces.test(output)).is(true);
      the(publisher.indentValue).is(indentValue+1);
      the(publisher.indentSize).is(indentSize);
    }
    check(0, 0);
    check(0, 5);
    check(1, 5);
    check(2, 5);
  })),

  describe("handlers",
    demo("traverseIn", function() {
      var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
      output= "";
      the(publisher.indentValue).is(0);
      publisher.publish("traverseIn", mpo({doc:"some doc string"}));
      the(output).is("some doc string\n");
      the(publisher.indentValue).is(1);
      publisher.publish("traverseIn", mpo({name:"name"}));
      the(output).is("some doc string\n     name\n");
      the(publisher.indentValue).is(2);
      publisher.publish("traverseIn", mpo({name:"anotherName", doc:"yet another doc string"}));
      the(publisher.indentValue).is(3);
      the(output).is("some doc string\n     name\n          yet another doc string\n");
    }),

    demo("traverseOut", function() {
      var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
      output= "";
      the(publisher.indentValue).is(0);
      publisher.publish("traverseIn", mpo({doc:"some doc string"}));
      publisher.publish("traverseIn", mpo({name:"name"}));
      publisher.publish("traverseIn", mpo({name:"anotherName", doc:"yet another doc string"}));
      the(publisher.indentValue).is(3);
      the(output).is("some doc string\n     name\n          yet another doc string\n");

      publisher.publish("traverseOut", mpo({doc:"some doc string"}));
      the(publisher.indentValue).is(2);
      the(output).is("some doc string\n     name\n          yet another doc string\n");
      publisher.publish("traverseOut", mpo({name:"name"}));
      the(publisher.indentValue).is(1);
      the(output).is("some doc string\n     name\n          yet another doc string\n");
      publisher.publish("traverseOut", mpo({name:"anotherName", doc:"yet another doc string"}));
      the(publisher.indentValue).is(0);
      the(output).is("some doc string\n     name\n          yet another doc string\n");

    }),

    demo("scaffoldFailed", function() {
      var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
      output= "";
      publisher.indent(2);
      publisher.publish("scaffoldFailed");
      the(output).is ("          SUBTREE ABORTED: scaffolding failed.\n");
    }),

    demo("scaffoldThrew", function() {
      var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
      output= "";
      publisher.indent(2);
      publisher.publish("scaffoldThrew");
      the(output).is ("          SUBTREE ABORTED: scaffolding threw exception.\n");
    }),

    demo("demoThrew", function() {
      var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
      output= "";
      publisher.indent(2);
      publisher.publish("demoThrew");
      the(output).is ("          TEST ABORTED: demonstration threw exception.\n");
    }),

    describe("result",
      demo(//if arg is falsey, then it writes "F"
        function() {
          var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
          output= "";
          publisher.publish("result");
          publisher.publish("result", null);
          publisher.publish("result", false);
          publisher.publish("result", 0);
          publisher.publish("result", "");
          the(output).is("FFFFF");
        }),
      demo(//if arg.todo exists, then it writes "TODO"
        function() {
          var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
          output= "";
          publisher.publish("result", {todo:true});
          publisher.publish("result", {todo:1});
          publisher.publish("result", {todo:"gotta finish this thing!"});
          publisher.publish("result", {todo:null});
          publisher.publish("result", {todo:false});
          publisher.publish("result", {todo:0});
          publisher.publish("result", {todo:""});
          the(output).is("TODOTODOTODOTODOTODOTODOTODO");
        }),
      demo(//if arg.pass is truthy, then it writes "-"
        function() {
          var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
          output= "";
          publisher.publish("result", {pass:true});
          publisher.publish("result", {pass:1});
          publisher.publish("result", {pass:"passed by a hair"});
          the(output).is("---");
        }),
      demo(//if arg.pass is falsey, then it writes "F"
        function() {
          var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
          output= "";
          publisher.publish("result", {pass:null});
          publisher.publish("result", {pass:false});
          publisher.publish("result", {pass:0});
          publisher.publish("result", {pass:""});
          the(output).is("FFFF");
        }),
      demo(//if neither arg.todo nor arg.pass exists, then it writes "F"
        function() {
          var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
          output= "";
          publisher.publish("result", {});
          publisher.publish("result", {someProperty:"someValue"});
          the(output).is("FF");
        })
    ),

    demo("abort", function() {
      var publisher= new bd.test.publisher({write:mockWriter, indentSize:5});
      output= "";
      publisher.publish("abort");
      the(output).is("\n\n*** ABORT ***\n\n");
    })
  )
);
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
