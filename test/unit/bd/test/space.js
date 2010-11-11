define(["dojo", "bd", "bd/test"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString


var publisher= {
  text:"",
  publish: function(
    message,
    arg
  ) {
    arg= arg || {};
    this.text+= message + (arg.doc ? "(" + arg.doc + ")" : "") + " ";
  }
};

module(
  describe("constructor", userDemo(function() {
    var space;
    //the default constructor...
    space= new bd.test.space();
    the(space.debugOnFail).is(false);
    the(space.abortOnFail).is(true);
    the(space.abortOnScaffoldFail).is(true);
    the(space.breakFrequency).is(1000);
    the(bd.test.spaces[space.id]).is(space);
    the(space.name).is("test.spaces." + space.id);
    the(dojo.get(space.name, bd)).is(space);
    the(space.publisher).isInstanceOf(bd.test.publisher);

    //empty args is the same as the default constructor
    space= new bd.test.space({});
    the(space.debugOnFail).is(false);
    the(space.abortOnFail).is(true);
    the(space.abortOnScaffoldFail).is(true);
    the(space.breakFrequency).is(1000);
    the(bd.test.spaces[space.id]).is(space);
    the(space.name).is("test.spaces." + space.id);
    the(dojo.get(space.name, bd)).is(space);
    the(space.publisher).isInstanceOf(bd.test.publisher);

    //setting abortOnScaffoldFail false results in unconditionally setting abortOnFail to false...
    space= new bd.test.space({abortOnFail:true, abortOnScaffoldFail:false});
    the(space.abortOnFail).is(false);
    the(space.abortOnScaffoldFail).is(false);

    //explicitly setting the name property results in not definin the id property and not storing the space in bd.test.spaces...
    space= new bd.test.space({name:"myName"});
    the(space.id).is(undefined);
    the(dojo.getObject(space.name)).isNot(space);

    //otherwise, args is blindly mixed in to the new object
    space= new bd.test.space({someProperty:"someValue"});
    the(space.someProperty).is("someValue");
  })),

  demo("destroy", function() {
    var space;

    space= new bd.test.space();
    the(bd.test.spaces[space.id]).is(space);
    space.destroy();
    the(bd.test.spaces[space.id]).is(undefined);
    //double delete is a no-op
    space.destroy();

    space= new bd.test.space({name:"mySpace"});
    the(space.id).is(undefined);
    //just like a double-delete--a no-op
    space.destroy();

    space= new bd.test.space({name:"mySpace", id:"myId"});
    the(space.id).is("myId");
    //just like a double-delete--a no-op
    space.destroy();
  }),

  describe("execute", see("bd.test.proc.Execution Algoritm")),
  describe("executeAbort", see("bd.test.proc.Execution Algoritm")),
  describe("finishExec", see("bd.test.proc.Execution Algoritm")),
  describe("startDemo", see("bd.test.proc.Execution Algoritm")),
  describe("endDemo", see("bd.test.proc.Execution Algoritm")),
  describe("scaffoldFailed", see("bd.test.proc.Execution Algoritm")),
  describe("demoFailed", see("bd.test.proc.Execution Algoritm")),
  describe("unexpectedException", see("bd.test.proc.Execution Algoritm")),
  describe("adviseResult", see("bd.test.proc.Execution Algoritm")),
  describe("schedulProc", todo()),
  describe("watch", todo())

);
});
// copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
