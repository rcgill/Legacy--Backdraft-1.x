define("bd/start", [
  "require", "dojo", "dijit", "bd/kernel",
  "bd/collections"
], function(require, dojo, dijit, bd) {
///
// Augments the bd namespace with startup machinery.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

bd.queryArgs= 
  ///const
  // Parse the URL query argument and return it as a hash. //
  //
  // For example, 
  //code
  // http://somehost.com/main.htm?run=someApp.test.tests.run001&someParam=someValue
  ///
  // would return
  //code
  // {
  //   run: "someApp.test.tests.run001",
  //   someParam: "someValue"
  // }
  //
  (function() {
		var
      args= {},
      decode= decodeURIComponent;
    dojo.forEach(location.search.slice(1).split("&"), function(item) {
      var result= item.match(/(\w+)=(.+)/);
      if (result) {
        var
          prop= decode(result[1]),
          value= decode(result[2]);
        if (args[prop]===undefined) {
          args[prop]= value;
        } else {
          dojo.isArray(args[prop]) ? args[prop].push(value) : (args[prop]= [args[prop], value]);
        }
      }
    });
    return args;
  })();


bd.parameterArgs=
  ///const
  // Parse the URL parameters argument and return it as a hash. //
  //
  // For example, 
  //code
  // TODO
  ///
  // would return
  //code
  // {
  //   TODO
  // }
  ///
  // `warn NOT IMPLEMENTED
  {};

bd.start= function(
  args,    //(bd.start.kwargs, optional) Controls application startup and operation.
  callback //(function(), optional) Function to apply after everything has been created.
) {
  ///
  // Starts the application.
  // 
  // 1. Trys to create the root widget (bd.root) if it's not already created as given by args.rootCreateArgs or 
  //    bd.config.rootCreateArgs (if either); if created, stores the result in bd.root.
  // 
  // 2. Trys to create the top widget as given by args.topCreateArgs or bd.config.topCreateArgs (if any); if created
  //    stores the result in bd.top.
  // 
  // 3. Publishes a function to require.addOnLoad that accomplishes the following:
  //
  //      1. Removes any loading message via bd.root.destroyLoadingMessage.
  //      2. Removes any CSS zIndex on the bd.top widget (if any) to ensure this widget is on top. This
  //         allows the widget to be created behind a "curtain" that's removed by the previous step if desired.
  //      3. Sets up machinery to manage the focus as focus shifts into and out of the program.
  //      4. Loads the module given by args.run (if any).
  //      5. Calls callback (if any).
  //

  args= args || {};
  var
    rootCreateArgs= args.rootCreateArgs || bd.config.rootCreateArgs,
    topCreateArgs= args.topCreateArgs || bd.config.topCreateArgs,
    createTop= function(root) {
      bd.root= root;
      if (topCreateArgs && !bd.top) {
        bd.createWidget(topCreateArgs, finish);
      } else {
        finish(bd.top);
      }
    },
    finish= function(top) {
      bd.top= top;
      dojo.addOnLoad(function() {
        // remove and destroy the loading messaging; show the top window
        bd.root.destroyLoadingMessage && bd.root.destroyLoadingMessage();
        bd.top && dojo.style(bd.top.domNode, {zIndex:""});
    
        // bd programs tend to handle all tab navigation. Here we hook up to the
        // document blur/focus events to remember/set the focus to the proper element
        // when focus shifts from/to our application
        //
        // Note: this code depends on our modifications to dijit/focus.js
        var lastFocused= null;
        dojo.subscribe("focusDocument", function() {
          if (lastFocused) {
            lastFocused.focus();
          } else {
            (bd.top && bd.top.focus && bd.top.focus()) || document.body.focus();
          }
        });
        dojo.subscribe("blurDocument", function() {
          lastFocused= dijit._prevFocus;
        });
    
        args.run && require(args.run);
        setTimeout(function() {
          callback && dojo.addOnLoad(callback);
          if (!dijit.curFocus) {
            document.body.focus();
          }
        }, 0);
      });
    };
  dojo.addOnLoad(function() {
    var root= bd.root || dijit.byId("root");
    if (!root && rootCreateArgs) {
      bd.createWidget(rootCreateArgs, createTop);
    } else {
      createTop(root);
    }
  });
};

bd.start.kwargs= {
  ///
  // Controls how bd.start starts the application.
  rootCreateArgs:
    ///
    // Create the root widget.
    // 
    //(falsy) Use bd.config.rootCreateArgs.
    //(bd.createWidget.kwargs) Describes how to create the root widget.
    undefined,

  topCreateArgs:
    ///
    // Create a top widget.
    // 
    //(falsy) Do not attempt to create a top widget.
    //(bd.createWidget.kwargs) Create a widget via bd.createWidget; reference the result in bd.top.
    undefined
};

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

