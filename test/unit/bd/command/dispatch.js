define(["bd", "bd/command/dispatch"], function(bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/command/dispatch",
  theFunction("[bd.command.connect]", 
    demo("handlers are executed in the sequence they are connected", function() {
      var sequence= 1;
      var h1= bd.command.connect("someCommand", function() {
        the(sequence).is(1);
        sequence++;
      });
      var h2= bd.command.connect("someCommand", function() {
        the(sequence).is(2);
        sequence++;
      });
      var dijit= dojo.module("dijit");
      bd.command.dispatchCommand("someCommand", null, dijit._activeStack, null);
      the(sequence).is(3);
      h1.disconnect();
      h2.disconnect();
    }),
    demo("handlers are passed a backdraft command event object", function () {
      var
        fired= false,
        h= bd.command.connect("someCommand", function(e) {
          fired= true;
          the(e.id).is("someCommand");
        }),
        dijit= dojo.module("dijit");
      bd.command.dispatchCommand("someCommand", null, dijit._activeStack, null);
      the(fired).is(true);
      h.disconnect();
    }),
    demo("the command event object source property gives the object that caused the event", function () {
      var
        fired, expect,
        h= bd.command.connect("someCommand", function(e) {
          fired= true;
          the(e.source).is(expect);
        }),
        dijit= dojo.module("dijit");
      fired= false;
      expect= null;
      bd.command.dispatchCommand("someCommand", expect, dijit._activeStack, null);
      the(fired).is(true);
      fired= false;
      expect= {};
      bd.command.dispatchCommand("someCommand", expect, dijit._activeStack, null);
      the(fired).is(true);
      h.disconnect();
    }),
    demo("the command event object activeStack property gives dijit._activeStack at the time of the event", function () {
      var
        fired= false,
        h= bd.command.connect("someCommand", function(e) {
          fired= true;
          the(e.activeStack).is(dijit._activeStack);
        }),
        dijit= dojo.module("dijit");
      bd.command.dispatchCommand("someCommand", null, dijit._activeStack, null);
      the(fired).is(true);
      h.disconnect();
    }),
    demo("the command event object eventObject property gives the DOM event object associated with the event", function () {
      var
        fired= false, expect= {},
        h= bd.command.connect("someCommand", function(e) {
          fired= true;
          the(e.eventObject).is(expect);
          e.stopEvent= false; //this isn't a real event object, so it can't be stopped
        }),
        dijit= dojo.module("dijit");
      bd.command.dispatchCommand("someCommand", null, dijit._activeStack, expect);
      the(fired).is(true);
      h.disconnect();
    }),
    describe("the command event object stopEvent property causes the command dispatcher to execute dojo.stopEvent on the DOM event object associated with the command event", todo())
  ),

  theFunction("[bd.command.createEvent]", 
    demo("by default, the id property is null", function() {
      the(bd.command.createEvent().id).is(null);
    }),
    demo("by default, the source property is null", function() {
      the(bd.command.createEvent().source).is(null);
    }),
    demo("by default, the activeStack property is the current dijit._activeStack", function() {
      the(bd.command.createEvent().activeStack).is(dijit._activeStack);
    }),
    demo("by default, the eventObject property is null", function() {
      the(bd.command.createEvent().eventObject).is(null);
    }),
    demo("by default, the stopEvent property is true", function() {
      the(bd.command.createEvent().stopEvent).is(true);
    }),
    demo("any/all of the properties can be set by passing in a hash with the desired values", function() {
      var
        src= {
          id:"someCommandId",
          source:{},
          activeStack:[],
          eventObject:{},
          stopEvent:{}
        },
        e= bd.command.createEvent(src);
      the(e.id).is(src.id);
      the(e.source).is(src.source);
      the(e.activeStack).is(src.activeStack);
      the(e.eventObject).is(src.eventObject);
      the(e.stopEvent).is(src.stopEvent);
    })
  ),

  theFunction("[bd.command.scheduleCommand]", 
    demo("commands are dispatched in the order they are scheduled", function(space) {
      var sequence= 1;
      var h1= bd.command.connect("someCommand1", function() {
        bd.test.activeSpace= space;
        the(sequence).is(1);
        sequence++;
      });
      var h2= bd.command.connect("someCommand2", function() {
        bd.test.activeSpace= space;
        the(sequence).is(2);
        sequence++;
      });
      bd.command.scheduleCommand("someCommand1");
      bd.command.scheduleCommand("someCommand2");
      the(sequence).is(1);
      var start= bd.getTime();

      return space.watch(5, bd.async.delay * 200, function() {
        if (sequence===3) {
          console.log("total time= " + (bd.getTime() - start));
          the(sequence).is(3);
          h1.disconnect();
          h2.disconnect();
          return true;
        } else {
          return false;
        }
      });
    }),
    demo("a command scheduled during an asynchronous handler won't happen until the next asynchronous event", function(space) {
      var
        sequence= 1,
        h1= bd.command.connect("someCommand1", function() {
          bd.test.activeSpace= space;
          the(sequence).is(1);
          sequence++;
          bd.command.scheduleCommand("someCommand2");
        }),
        h2= bd.command.connect("someCommand2", function() {
          bd.test.activeSpace= space;
          the(sequence).is(2);
          sequence++;
        }),
        count= 0,
        h3= bd.connect(bd.command, "asynchDispatcher", function() {
          count++;
        });

      bd.command.scheduleCommand("someCommand1");
      the(sequence).is(1);

      return space.watch(5, bd.async.delay * 20, function() {
        if (sequence===3) {
          the(sequence).is(3);
          the(count).is(2);
          h1.disconnect();
          h2.disconnect();
          h3.disconnect();
          return true;
        } else {
          return false;
        }
      });
    })
  )
);
});
