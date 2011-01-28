define("bd/test/publisher", [
  "dojo", "bd", "bd/test/namespace"
], function(dojo, bd) {
///
// Defines the Backdraft test framework publishing machinery.

var spaces= "          ";
for (var i= 0; i<20; i++) {
  spaces+= " ";
}

bd.test.publisher= bd.declare(
  ///
  // Publishes test messages. //The implementation publishes the messages to the debug console. Further, handlers for
  // all of  messages published by the Backdraft test framework are defined. These default behaviors can be
  // modified by deriving a subclass from bd.test.publisher. Since the class machinery is an extremely simple and
  // superclass methods are rarely applied from overrides, default behavior can also be modified by providing overrides
  // to the constructor.

  //superclasses
  [],

  //members
  {
  indentSize:
    ///
    // The number of spaces to indent for each indent unit as given by the property `bd.test.publisher.indentValue`.
    5,

  indentValue:
    ///
    // The number of indents to write before outputing the next message.
    0,

  spaces:
    ///
    // A string of 200 spaces; convenient for formatting indents.
    spaces,

  constructor: function(
    args
  ) {
    ///
    // Creates a new object.  //Mixes args into the new instance. This is a convenient technique to install
    // customized message handlers.

    dojo.mixin(this,  args);
  },

  indent: function(
    delta
  ) {
    ///
    // Adjusts this.indentValue by delta (delta can be negative).
    this.indentValue+= delta;
  },

  write: function(
    messageText
  ) {
    ///
    // Writes messageText. Default implementation writes to console; override or connect to do something interesting.
    console.log(spaces.substring(0, (this.indentValue * this.indentSize)) + messageText);
  },

  publish: function(
    message,
    vargs
  ) {
    ///
    // Publishes message. //The message is published as follows:
    //
    // 1. Delegates to this[message] iff this[message] is truthy (it must be a function if it is truthy).
    // 2. Otherwise, no-op if this[message] is not undefined.
    // 3. Otherwise, calls this.write(message).

    if (this[message]===false) {
      // explicitly do _not_ publish a message...
      return;
    } else if (this[message]) {
      // a handler exists for this message...
      this[message].apply(this, arguments);
    } else {
      // this[message]===undefined...
      this.write(message);
    }
  },

  traverseIn: function(
    message,
    proc
  ) {
    ///
    // If proc.doc or proc.name exist then write it (prefer proc.doc) at the current indent level. Then unconditionally delta indent by 1.
    proc && this.write(proc.log() + "\n");
    this.indent(1);
    if (proc && proc.program) {
      this.write(proc.program.toString() + "\n");
    }
  },

  traverseOut: function(
    message,
    proc
  ) {
    ///
    // Delta indent by -1.
    this.indent(-1);
  },

  scaffoldFailed: function() {
    ///
    // Write "SUBTREE ABORTED: scaffolding failed.\n" at the current indent level.
    this.write("SUBTREE ABORTED: scaffolding failed.\n");
  },

  scaffoldThrew: function() {
    ///
    // Write "SUBTREE ABORTED: scaffolding threw exception.\n" at the current indent level.
    this.write("SUBTREE ABORTED: scaffolding threw exception.\n");
  },

  startDemo: function(
    message,
    proc
  ) {
    ///
    // Delta indent by 1 and then write the current indent level without a new-line.
    if (proc && proc.traits && proc.traits.extern) {
      this.write("external test follows...\n");
      this.indent(1);
    } else {
      this.indent(1);
    }
  },

  endDemo: function(
    message,
    proc
  ) {
    ///
    // Close the current line with a newline and delta indent by -1.
    if (proc && proc.traits && proc.traits.extern) {
      this.indent(-1);
      this.write("end of external test.\n");
    } else {
      // Write a new-line and delta indent by -1.
      this.write("\n");
      this.indent(-1);
    }
  },

  demoThrew: function(
    message,
    proc
  ) {
    ///
    // Write "TEST ABORTED: demonstration threw exception.\n" at the current indent level.
    this.write("TEST ABORTED: demonstration threw exception.\n");
  },

  result: function(
    message,
    arg
  ) {
    ///
    // Write the arg, interpretted as a test result. //Typically arg is something from bd.test.result:
    //
    // 1. Iff arg is falsey, write "F";
    // 2. Otherwise, iff arg.todo exists, write "TODO";
    // 3. Otherwise, iff arg.pass, write "-";
    // 4. Otherwise, write "F"
    //
    if (arg) {
      if (arg.todo!==undefined) {
        this.write("TODO");
      } else if (arg.pass) {
        this.write("-");
      } else {
        this.write("F");
      }
    } else {
      this.write("F");
    }
  },

  abort: function() {
    ///
    // Write "\n\n*** ABORT ***\n\n"
    this.write("\n\n*** ABORT ***\n\n");
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

