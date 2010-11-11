define("bd/kernel", [
  "dojo", 
  "dijit", 
  "require"
], function(dojo, dijit, require) {
///
// Creates and minimally initializes the object that holds the bd namespace.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

// patch up dijit/focus
dijit.documentFocused= true;
dijit.getFocusedWidget= function() {
  if (this._activeStack.length) {
    return dijit.byId(this._activeStack[this._activeStack.length-1]);
  } else {
    return null;
  }
};
dijit._prevStack= [];
var dijit_onBlurNode= dijit._onBlurNode;
dijit._onBlurNode= function(node) {
  if (node && node.nodeType==9) {
    dojo.publish("blurDocument");
    dijit.documentFocused= false;
  }
  return dijit_onBlurNode(node);
};
var dijit_onFocusNode= dijit._onFocusNode;
dijit._onFocusNode= function(node) {
  if (!dijit.documentFocused) {
    dijit.documentFocused= true;
    dojo.publish("focusDocument");
  }
  return dijit_onFocusNode(node);
};
var dijit_setStack= dijit._setStack;
dijit._setStack= function(newStack, by) {
  dijit._prevStack= dijit._activeStack;
  return dijit_setStack(newStack, by);
};


var bd= 
  ///namespace
  // The top-level namespace for the Backdraft browser application framework. //The bd namespace
  // is identical to the bd module. All objects defined by Backdraft are decendent properties of bd.
  {};

bd.widget=
  ///namespace
  // Contains the Backdraft widget classes.
  {};

bd.mixDeep= 
  function(
    vargs //(variableArgs, optional) Two or more objects to mix.
  ) {
    ///
    // Deep-mixes arguments into a new object and returns result. //Arguments are
    // mixed left to right (i.e., if two or more object contain the same property, then the right-most
    // object wins).
    ///
    // Deep mixing means that if two objects both define a particular property, and the value
    // of each property is of type Object, then the contents of each value is mixed rather than
    // just overwriting the left value with the right value.
    for (var o, result= arguments[0], i= 1; i<arguments.length; i++) {
      o= arguments[i];
      for (var p in o) {
        if (!(p in result)) {
          result[o]= o[p];
        } else if (result[p].constructor===Object && o[p].constructor===Object) {
          result[p]= bd.mixDeep(result[p], o[p]);
        } else {
          result[p]= o[p];
        }
      }
    }
    return result;
  };

bd.config=
  {
    ///
    // Holds configuration values that control how the framework is initialized and operates.
    ///
    // Configuration properties can be customized in a couple of ways. For properties
    // that affect processing after a certain point (for example, after bd.start is called),
    // client code can can edit the contents of bd.config directly before a particular
    // point in execution.
    // 
    // Alternatively, client code can define the module bd/user/config to define configuration
    // property values before loading the Backdraft framework. If present when the bd/kernel module
    // is loaded, the value of the bd/user/config module will be deep mixed into 
    // bd.config. For example, a particular application could change the className of the root 
    // widget, by writing...
    //code
    // // Customize the value of some configuration properties...
    // define("bd/user/config", function() {
    //   return {
    //     rootCreateArgs: {
    //       descriptor: {
    //         className:"app:my.custom.root"
    //       }
    //     }
    //   };
    // });
    // 
    // // now load the Backdraft framework...
    // require("bd");
    ///
    // Notice carefully in the example above, when the Backdraft framework is loaded, *just* the property
    // bd.config.rootCreateArgs.descriptor.className is changed from it's default value. In particular,
    // (e.g.), bd.config.rootCreateArgs.descriptor.id retains it's default value of "root" because
    // the user configuration properties are *deep mixed*; see bd.mixDeep.
    rootCreateArgs: 
      {
        ///
        // Describes how bd.start should create the root widget.
        //(bd.createWidget.kwargs) The arguments to pass to bd.createWidget.
        ///
        // See bd.start
        descriptor:{
          className:"bd:widget.root",
          id:"root"
        }
      },
  
    topCreateArgs:
        ///
        // Describes how bd.start should create the top widget.
        //(bd.createWidget.kwargs) The arguments to pass to bd.createWidget.
        ///
        // See bd.start
        undefined,
  
    root:
      ///
      // The root widget of the application.
      ///
      // Backdraft models the DOM tree as a tree of widgets; this is the root widget. If not already created independently 
      // by client code, this widget is created when bd.start executes. Backdraft assumes that the DOM node associated with 
      // bd.root is the body element. Note that in this context, "created" means a widget class is attached to the document
      // body element--the DOM node is likely already created.
      undefined,

    breakOnAssert:
      ///
      // Instructs bd.assert to break into the debugger upon assert failure. See bd.assert.
      true
  };

var clientConfig= require("bd/user/config");
clientConfig && bd.mixDeep(bd.config, clientConfig);

// bd references some of dojo base so that the code isn't so tightly coupled to dojo--
// theoretically, the following could be changed to reference another library with
// identical semantics and everything would still work.
bd.eval= dojo.eval;
bd.deprecated= dojo.deprecated;
bd.experimental= dojo.experimental;

//TODO: deal with i18n (locale) and text plugins

bd.docGen=
  function() {
    ///
    // Documentation generator hook.
    ///
    // Facilitates generating documentation for named entities that have no place in normal
    // JavaScriptcode such as keyword arguments and types.
    // 
    // bd.docGen has no actual run-time function; if called it simply execute a no-op. All bd.doc
    // calls are removed by the Backdraft build utility for release versions of the code.  See 
    // the js-proc manual for further details.
  };

bd.assert=
  function(
    condition, //(boolean) The expected condition (truthy implies the assert passed).
    message    //(string, "bd.assert detected a fail condition") The message to write to the console.
  ) {
    ///
    // Logs a message to the error console and optionally break into the debugger iff condition is not truthy. //A
    // break into the debugger is executed iff bd.config.breakOnAssert is true.
    /// 
    // All bd.assert calls are removed by the Backdraft build utility for release verions of the 
    if (!condition) {
      console.log(message || "bd.assert detected a fail condition");
      if (bd.config.breakOnAssert) {
        debugger;
      }
    }
  };

(function() {
  function t() {
    bd.global=
      ///
      // The JavaScript global namespace.
      this;
  }
  t.call(null);
})();

bd.doc=
  ///
  // The browser document
  document;

bd.head=
  ///
  // The head element of the browser document
  dojo.head;

bd.body=
  ///
  // The body element of the browser document
  dojo.body();

var uid= 1;
bd.uid= function() {
  ///
  // Manufactures a JavaScript identifier that is unique within this current process. //The
  // name has the form `_bdUid``counting-number```.
  return "_bdUid" + (uid++); ///(name) Unique, legal JavaScript identifier within the current process.
};

bd.node= function(
  id //(string) The value of the id attribute of the target DOM node.
) {
  ///
  // Returns the DOM node with the id attribute==id.
  ///
  //note
  // This is a synonym for the function dojo.byId.
  bd.docGen("overload",
    function(
      node //(DOM node) A DOM node.
    ) {
      /// Returns node.
    }
  );
};
bd.node= dojo.byId;

bd.defaultValue=
  ///const
  // Unique object with no properties. //Useful for signalling "default values"
  // without stepping on potential real values like nil, 0, false, etc.
  {};

bd.notFound=
  ///const
  // Unique object with no properties. //Useful for signalling "not found"
  // without stepping on potential real values like nil, 0, false, etc.
  {};

bd.nodoc=
  ///const
  // Unique object with no properties. //Interpreted by the documentation generator to say
  // a value must be supplied for particular variable/argument/property. Typically, this is
  // used to indicate a member property value must be supplied to the constructor or is derived
  // during construction (i.e., it can not have a default value).
  {};


bd.failed= 
  ///const
  // Unique object with no properties. //Useful for signalling failure. For a
  // canonical example, see the disabled setter in bd.interactive.
  {};


bd.object=
  ///namespace
  // Holds the Backdraft object machinery.
  {};

bd.object.set=
  function(
    object //(any) Some object with the property `id` (a string that is a page-unique identifier).
  ) {
    ///
    // Adds object associated with id to the object registry.
    ///
    // See bd.object.get, bd.object.byId, bd.object.del.
    dijit.registry.add(object);
  };

bd.object.get=
  function(
    id //(string) A a page-unique identifier that has previously been added to the object registry.
  ) {
    ///
    // Returns the object associated with id previously added by bd.object.set (if any); otherwise, returns undefined.
    ///
    // See bd.object.get, bd.object.byId, bd.object.del.
    return dijit.byId(id);
  };

bd.object.byId=
  function(
    id //(string) A page-unique identifier that has previously been added to the object registry.
  ) {
    ///
    // Returns bd.object.get(id).
    ///
    // Convenience function analogous to dojo.byId and dijit.byId.
    ///
    // See bd.object.set, bd.object.get, bd.object.del.
    bd.docGen("overload",
      function(
        object //(any)
      ) {
        ///
        // Returns object (identity function).
      }
    );
    return bd.isString(id) ? dijit.byId(id) : id;
  };

bd.object.byName= 
  function(
    name
  ) {
    ///
    //TODOC
    var hash= dijit.registry._hash;
      for (var p in hash) {
        if (hash[p].name==name) {
          return hash[p];
        }
      }
    return 0;
  };

bd.object.del=
  function(
    object
  ) {
    ///
    // Remove object from object registry.
    ///
    // See bd.object.set, bd.object.get, bd.object.byId.
    dijit.registry.remove(object.id);
  };


bd.noop=
  function() {
    ///
    // Function that executes no statements and returns undefined. //Useful for
    // required default function argument.
  };

bd.getOptionalProp=
  function(
    src, //(object) The source object.
    prop, //(string) The name of the property to retrieve from source.
    defaultValue //(any) The value to return iff src[prop] does not exist.
  ) {
    ///
    // Return the value of src[prop] iff src[prop] exists; otherwise returns default value.
    ///
    // This function is useful for finding optional values that may be falsy when provided.
    // For example, a common JavaScript idiom is something like:
    //
    //code
    // someObject.someProperty || someDefault
    ///
    // Note that this will *not* work if someObject.someProperty can carry a falsy value: the result
    // will always be someDefault. However, writing:
    //
    //code
    // bd.getOptionalProp(someObject, "someProperty", someDefault)
    ///
    // will return any value stored in someObject["someProperty"], even if that value is falsy.
    if (src.hasOwnProperty(prop)) {
      return src[prop];
    } else {
      return defaultValue;
    }
};

bd.getTime=
  function(
  ) {
    ///
    // Calculates and returns the current time in milliseconds.
    return (new Date()).getTime(); ///(integer) Current time in milliseconds.
  };

bd.docGen("bd", {
  "modulePropertyName":
    ///type
    // A string that implies a property name nested in a module.
    ///
    // The string must be of the form `"``module-name``:``jsName``"` and implies the 
    // property `require(``module-name``).``jsName```. For example, `"acme:widgets.coolbar"` resolves 
    // to `require("acme").widgets.coolbar`.
    //
    // See bd.get.
    0
});

bd.moduleName= 
  function(
    name //(string) Some name that implies a module.
  ) {
    ///
    // Returns the module name implied by name. //Typically, name is a jsName (e.g., "acme.widgets.coolbar")
    // and the default resolver returns the name in the form of a module name (e.g., "acme/widgets/coolbar").
    // However, the result of the name can be affected by one of two methods. First, an explicit transform
    // for name ``name`` can set by providing a value for `bd.moduleName[``name``]`. For example,
    // 
    //code
    // bd.moduleName["acme.widgets.coolbar"]= "acme/widgets";
    ///
    // would cause `bd.moduleName("acme.widgets.coolbar")` to return `"acme/widgets"`
    ///
    // This is termed an explicit transform. More general transforms can be given by adding a function 
    // to `bd.moduleName.resolvers`, an array of functions that take a name and return the module name (if 
    // resolved), or falsy (otherwise). For example
    //code
    // bd.moduleName.resolvers.push(function(name) {
    //   var match= name.match(/^(acme\.widgets)\.\w+/);
    //   return match && "acme/widgets";
    // }
    ///
    // Now bd.moduleName would resolve "acme.widgets.coolbar", "acme.widgets.coolcombo", and so on into "acme/widgets".
    //
    // Naturally, explicit transforms take precedence over general transforms. General transforms are checked starting from the back
    // of the bd.moduleName.resolvers array. Typically, new transforms are pushed into the array resulting in the newer
    // transforms being checked before older transforms.
    bd.docGen("overload",
      function(
        name //(bd.modulePropertyName) Name that implies a module name.
      ) {
        ///
        // Returns the module name implied by name.
      }
    );
    var
      callee= arguments.callee,
      result= callee[name];
    if (result) {
      return result;
    }
    for (var resolvers= callee.resolvers, i= resolvers.length; i--;) {
      if ((result= resolvers[i](name))) {
        return result;
      }
    }
    return name;
  };
bd.moduleName.resolvers= 
  ///variable
  // Holds an array of functions that map names to a module names.
  ///
  // Functions must accept a single argument (the  name to map) and
  // return the module name (if successful) or falsy (otherwise). See bd.moduleName.
  [
    function(name) {
      return name.replace(/\./g, "/").replace(/:/, "/"); 
    }
  ];

return bd;

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
