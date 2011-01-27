define("bd/test", [
  "dojo", "bd",
  "bd/test/namespace",
  "bd/collections",
  "bd/test/proc",
  "bd/test/publisher",
  "bd/test/space",
  "bd/test/result",
  "bd/test/matchers",
  "bd/test/loader",
  "require"
], function(dojo, bd) {
///
// Augments the bd namespace with the entire backdraft test framework.

if (bd.config.test.makeBdGlobal) {
  bd.global.bd= bd;
  bd.global.byName= bd.object.byName;
  bd.global.dijit= require("dijit");
}

var
  bumpToDoCount= function(
    space //(bd.test.space) The space upon which to bump the to do count.
  ) {
    ///
    // Increments the toDoCount counter in space.
    space.toDoCount++;
  },
  logVariable= function() {
    return "[" + this.name + "]Variable " + this.name;
  },
  logConst= function() {
    return "[" + this.name + "]Constant " + this.name;
  },
  logEnum= function() {
    return "[" + this.name + "]Enumeration " + this.name;
  },
  logFunction= function() {
    return "[" + this.name + "]Function " + this.name;
  },
  logArgument= function() {
    return "[" + this.name + "]Argument " + this.name;
  },
  logClass= function() {
    return "[" + this.name + "]Class " + this.name;
  },
  logMember= function() {
    return "[" + this.name + "]Member " + this.name;
  },
  logNote= function() {
    return (this.name ? "[" + this.name + "]" : "") + "Note: " + this.doc;
  },
  logRef= function() {
    return (this.name ? "[" + this.name + "]" : "") + "Reference: " + this.doc;
  },
  logToDo= function() {
    return "[" + this.name + "]TODO: " + this.doc;
  };

bd.mix(bd.test, {
  describe: function(
    args,     //(*bd.test.proc.description.constructor.args)
    scaffold, //(*bd.test.proc.description.constructor.scaffold)
    children  //(*bd.test.proc.description.constructor.children)
  ){
    ///
    // Creates and returns a bd.test.proc.description object. //Syntactic
    // sugar (see source below).
    return bd.test.proc.description.create.apply(null, arguments);
  },

  describeVariable: function(
    args,     //(*bd.test.proc.description.constructor.args)
    scaffold, //(*bd.test.proc.description.constructor.scaffold)
    children  //(*bd.test.proc.description.constructor.children)
  ){
    ///
    // Creates and returns a bd.test.proc.description that contains a member trait. //Syntactic
    // sugar (see source below).
    var result= bd.test.proc.description.create.apply(null, arguments);
    result.log= logVariable;
    return result;
  },

  describeFunction: function(
    args,     //(*bd.test.proc.description.constructor.args)
    scaffold, //(*bd.test.proc.description.constructor.scaffold)
    children  //(*bd.test.proc.description.constructor.children)
  ){
    ///
    // Creates and returns a bd.test.proc.description that contains a member trait. //Syntactic
    // sugar (see source below).
    var result= bd.test.proc.description.create.apply(null, arguments);
    result.log= logFunction;
    return result;
  },

  describeClass: function(
    args,     //(*bd.test.proc.description.constructor.args)
    scaffold, //(*bd.test.proc.description.constructor.scaffold)
    children  //(*bd.test.proc.description.constructor.children)
  ){
    ///
    // Creates and returns a bd.test.proc.description that contains a member trait. //Syntactic
    // sugar (see source below).
    var result= bd.test.proc.description.create.apply(null, arguments);
    result.log= logClass;
    return result;
  },

  describeMember: function(
    args,     //(*bd.test.proc.description.constructor.args)
    scaffold, //(*bd.test.proc.description.constructor.scaffold)
    children  //(*bd.test.proc.description.constructor.children)
  ){
    ///
    // Creates and returns a bd.test.proc.description that contains a member trait. //Syntactic
    // sugar (see source below).
    var result= bd.test.proc.description.create.apply(null, arguments);
    result.log= logMember;
    return result;
  },

  describeArgument: function(
    args,     //(*bd.test.proc.description.constructor.args)
    scaffold, //(*bd.test.proc.description.constructor.scaffold)
    children  //(*bd.test.proc.description.constructor.children)
  ){
    ///
    // Creates and returns a bd.test.proc.description that contains an argument trait. //Syntactic
    // sugar (see source below).
    var result= bd.test.proc.description.create.apply(null, arguments);
    result.log= logArgument;
    return result;
  },

  scaffold: function(
    execType, //(*bd.test.proc.scaffold.constructor.execType)
    before,   //(*bd.test.proc.scaffold.before.execType)
    after     //(*bd.test.proc.scaffold.after.execType)
  ) {
    ///
    // Creates and returns a bd.test.proc.scaffold object. //Syntactic
    // sugar (see source below).
    return new bd.test.proc.scaffold(execType, before, after);
  },

  demo: function(
    args,   //(*bd.test.proc.demo.constructor.args) 
    program //(*bd.test.proc.demo.constructor.program) 
  ) {
    ///
    // Creates and returns a bd.test.proc.demo object. //Syntactic
    // sugar (see source below).
    return new bd.test.proc.demo(args, program);
  },

  userDemo: function(
    args,   //(*bd.test.proc.demo.constructor.args) 
    program //(*bd.test.proc.demo.constructor.program) 
  ){
    ///
    // Creates and returns a bd.test.proc.demo object with the automatic addition of the userDemo trait. //Syntactic
    // sugar (see source below).
    var result= new bd.test.proc.demo(args, program);
    result.userDemo= true;
    return result;
  },

  todo: function(
    args //(string) The to do message.
  ) {
    ///
    // Creates and returns a bd.test.proc.demo object that increments the space toDoCount and contains a todo trait. //Syntactic
    // sugar (see source below).
    var result= new bd.test.proc.demo(args, bumpToDoCount);
    result.log= logToDo;
    return result;
  },

  note: function(
    args //(string) The note message.
  ) {
    ///
    // Creates and returns a bd.test.proc.demo object that executes a no-op and contains a note trait. //Syntactic
    // sugar (see source below).
    var result= new bd.test.proc.demo(args, bd.noop);
    result.log= logNote;
    return result;
  },

  see: function(
    args //(name) The reference message.
  ) {
    ///
    // Creates and returns a bd.test.proc.demo object that executes a no-op and contains a reference trait. //Syntactic
    // sugar (see source below).
    var result= new bd.test.proc.demo(args, bd.noop);
    result.log= logRef;
    return result;
  },

  the: function (
    arg //(any) Arguments to mixin to the new object.
  ){
    ///
    // Creates and returns a new object delegated to bd.test.theBase that contains any passed arguments.//
    // If a single argument is passed then it is referenced at property arg; if multiple arguments are 
    // passed then the arguments object is referenced at property args.
    return dojo.delegate(bd.test.theBase, arguments.length==1 ? {arg:arg} : {args:arguments});
  },

  pass: function() {
    ///
    // Advise the active space of a pass result.
    bd.test.activeSpace.adviseResult(bd.test.result.pass());
  },

  fail: function() {
    ///
    // Advise the active space of a fail result.
    bd.test.activeSpace.adviseResult(bd.test.result.fail());
  },

  run: function(
    name,     //(string) The name of the test to run.
    publisher //(bd.test.publisher, optional, 0) The publisher to use for the test results.
  ) {
    ///
    // Runs the test given by name.
    var 
      test= this.proc.module.find(name),
      space= new bd.test.space({publisher:publisher||0});
    space.execute(test);
  }
});

bd.test.theBase=
  ///
  // The prototype for objects created with bd.test.the.
  //
  // This object is initialized to contain functions named after the functions contained in bd.test.matchers.
  // These functions call the same-named bd.test.matchers function and then advise the result to the current active test space.
  (function() {
     var result= {};
     bd.forEachHash(bd.test.matchers, function(item, name) {
       result[name]= function() {
         bd.test.activeSpace.adviseResult(item.apply(this, arguments));
       };
     });
     return result;
   })();


bd.test.wait= function(
  time //(positive integer) Number of milliseconds to wait.
) {
  ///
  // Wait for a number of milliseconds. //This function is useful for simulating synchronous processes.
  //
  //Note
  // This is not like a real sleep function that will yeild to other threads. bd.wait
  // literally spins in a tight loop and will not return or allow any other processing until the time has expired.

  var start= bd.getTime();
  while (bd.getTime()-start<time) {}
};

bd.test.sampleValues= 
  ///
  // sample values that are convenient to have around for testing
  [
    undefined,
    null,
    false,
    true,
    0,
    1,
    22/7,
    new Number("123"),
    "",
    "a non-empty string",
    new String("another non-empty string"),
    [],
    [1, 2, 3],
    {},
    {someProperty:"someValue"},
    {someProperty:"someValue", nest1:{someProperty:"someValue"}},
    {someProperty:"someValue", nest1:{someProperty:"someValue", nest2:{somePropety:"someValue"}}},
    new Date(),
    /test/,
    new Error("some error message"),
    new bd.test.proc.scaffold("once", function(){}, function(){}) // a bd.declare'd class
  ];

//TODO is this REALLY used?
bd.test.runSampleValues= function(
  proc
){
  dojo.forEach(bd.test.sampleValues, proc);
};


bd.test.makeConsolePublisher= function() {
  ///
  // Creates a new bd.test.publisher that publishes to the debug console.
  //return
  //(bd.test.publisher) A publisher that publishes to the debug console.
  var buffer= "";
  return new bd.test.publisher({
    write: function(text) {
      var lines= text.split("\n");
      if (lines.length>1) {
        console.log(buffer+lines[0]);
        for (var i= 1; i<lines.length-1; i++) {
          console.log(lines[i]);
        } 
        buffer= lines[lines.length-1];
      } else if (lines.length==1) {
        buffer+= text;
      }
    }
  });
};

bd.test.exec= function(
  testName,  //(string) The full name of the test to execute.
  publisher, //(bd.test.publisher) The destination of results.
             //(falsy) Use a publisher given by bd.test.makeConsolePublisher.
  spaceArgs  //(hash) Arguments to use when creating the space.
) {
  ///
  // Execute a single test. //This is useful for executing a quick test from the console.
  var test= bd.test.proc.find(testName);
  if (test) {
    publisher= publisher || bd.test.makeConsolePublisher();
    var space= new bd.test.space(dojo.mixin({publisher:publisher, abortOnFail:false}, spaceArgs||{}));
    space.execute(test, function() {
      space.publisher.write("\nPassed: " + space.passCount + "\nFailed: " + space.failCount + "\nTo Do:: " + space.toDoCount + "\n");
    });
  } else {
    console.error("In bd.test.exec, " + testName + " is not a valid test name.");
  }
};

return bd.test;

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
