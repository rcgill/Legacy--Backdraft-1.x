define("bd/test/proc", [
  "dojo", "bd", "bd/test/namespace"
], function(dojo, bd) {
///
// Defines the Backdraft test framework's test procedure class hierarchy.

var getNameAndDoc= function(s) {
  var match= /^\[(.+)\](.*)/.exec(s);
  if (match) {
    return {name:match[1], doc:match[2]};
  } else if (/ /.test(s)) {
    //the string has a space; assume its a doc string
    return {doc:s};
  } else {
    return {name:s};
  }
};

bd.test.proc= bd.declare(
  ///
  // The base class for test procedure classes. //Defines the minimum interface for
  // test procedure subclasses.

  //superclasses
  [],
 
  //members
  {
  constructor: function(
    args //(kwargs)
         //(string with no spaces) The value to initialize the name property.
         //(string with spaces) The value to initialize the rdoc property.
  ) {
    ///
    // Creates a new instance.
    ///
    // The new object is initialized with the following property values:
    //code
    // {
    //   name:""
    //   doc:"", 
    //   parent:null, 
    //   children:[]
    // }
    ///
    // If createArgs is not a string, it is mixed into the new instance possibly changing these initial values.
    // If parent is given, then the new object is added to the children of the given parent.
    //
    // The new instance, o, has the property bd.test.proc.map[o.id]===o (if createArgs gives a value of id, it is ignored).
    bd.docGen("kwargs", {
      ///
      // Describes how to initialize a bd.test.proc instance.
      doc: 
        ///(string) The documentation for the procedure.
        undefined,
      name:
        ///(string) The name of the procedure.
        undefined,
      parent:
        ///(bd.test.proc) The parent of the procedure.
        undefined,
      children: 
        ///(array or bd.test.proc) The children of this procedure.
        undefined
    });

    if (dojo.isString(args)) {
      args= getNameAndDoc(args);
    }
    dojo.mixin(this, {
      name:"",
      doc:"",
      parent:null,
      children:[]
    }, args || {});
    if (!this.name) {
      this.name= dojo.uid();
    }
    if (this.parent) {
      this.parent.children.push(this);
    }
    this.id= bd.test.proc.map.length;
    bd.test.proc.map.push(this);
  },

  destroy: function() {
    ///
    // Destroy this instance. //Recursively destroy all children, and remove this
    // object from its parent and the bd.test.proc.map. Since these are the only 
    // references the test framework keeps of this instance, it should be garbage
    // collected.
    for (var children= this.children, i= 0, end= children.length; i<end; i++) {
      children[i].parent= null;
      children[i].destroy();
    }
    this.children= [];
    if (this.parent) {
      this.parent.removeChild(this);
    }
    bd.test.proc.map[this.id]= null;
  },

  getPath: function() {
    var 
      result= [],
      p= this;
    while (p) {
      result.push(p.id);
      p= p.parent;
    }
    result.reverse();
    return result;
  },

  getFullName: function() {
    ///
    // Get the full path and name of this module.
    //return
    //(string) Concatentation of all parents, starting from the root; each name is separated by a "/".
    var
      names= [],
      p= this;
    while (p!==bd.test.proc.root) {
      names.unshift(p.name);
      p= p.parent;
    }
    return names.join("/");
  },

  log: function() {
    return "[" + (this.name.charAt(0)=="_" ? "" : this.name) + "]" + this.doc;
  },

  setParentOfChildren: function() {
    ///
    // Set the parent of all of this instance's children to this instance.
    for (var children= this.children, i= 0, end= children.length; i<end; i++) {
      children[i].parent= this;
    }
  },

  removeChild: function(
    child //(bd.test.proc) A child of this instance.
  ) {
    ///
    // Remove child from this instance's children.
    //warn
    // The child's parent is not edited; use caution to ensure that this pointer
    // is deallocated correctly.
    for (var children= this.children, i= 0, end= children.length; i<end; i++) {
      if (children[i]===child) {
        children.splice(i, 1);
        return;
      }
    }
  },

  traverse: function(
    stream, //(bd.test.space.stream) The stream to which to write the traversal.
    root    //(boolean) If true, this is the root object of the traversal, and conversely.
  ) {
    ///
    // Traverses this subtree while preparing a script to execute.
    if (root) {
      var
        stack= [],
        p= this.parent;
      while (p && p!==bd.test.proc.root) {
        stack.push(p);
        p= p.parent;
      }
      for (var i= stack.length-1; i>=0; i--) {
        stream.push(stack[i], true);
      }
    }
    stream.push(this, true);
    for (var children= this.children, i= 0, end= children.length; i<end; i++) {
      children[i].traverse(stream, false);
    }
    stream.push(this, false);
    if (root) {
      for (i= 0, end= stack.length; i<end; i++) {
        stream.push(stack[i], false);
      }
    }
  },

  traverseIn: function(
    space //(bd.test.space) The space controlling this traversal.
  ) {
    ///
    // Execute any one-time preparations required for all tests under this node.
  },

  traverseOut: function(
    space //(bd.test.space) The space controlling this traversal.
  ) {
    ///
    // Execute any cleanup required after one-time preparations accomplished under traverseIn.
  },

  exec: function(
    space //(bd.test.space) The space controlling this traversal.
  ) {
    ///
    // Execute any each-time preparations required to execute a demonstration under this node. //If this
    // node is actually a demonstration, then execute the demonstration.
  },

  unexec: function(
    space //(bd.test.space) The space controlling this traversal.
  ) {
    ///
    // Reverse any each-time preparations accompished under exec
  }
});
dojo.mixin(bd.test.proc, {
  failed:
    ///const
    // Object returned by scaffolds and/or demos to say that the procedure failed
    {},

  map:
    ///
    // Map from bd.test.proc.id to bd.test.proc instance. //The machinery guarantees that
    // bd.test.proc.map[proc.id]===proc for some bd.test.proc instance proc.
    [null], // don't use id===0

  get: function(
    moduleName //(*bd.test.proc.get_.moduleName)
  ) {
    ///
    // Find the module given be moduleName in the test procedure tree. //If 
    // the module does not exist, then create a new module.
    // 
    //return
    //(bd.test.proc.module) The module which is identified by the full name moduleName.
    return bd.test.proc.get_(moduleName, true);
  },

  find: function(
    moduleName //(*bd.test.proc.get_.moduleName)
  ) {
    ///
    // Find the module given be moduleName in the test procedure tree.
    // 
    //return
    //(bd.test.proc.module) The module which is identified by the full name moduleName.
    //> A module with the full name moduleName exists.
    //(null)
    //> No module with the full name moduleName exists.
    return bd.test.proc.get_(moduleName, false);
  },

  get_: function(
    moduleName, //(string) The full name (i.e., the name that is returned by 
                //bd.test.proc.getFullName) of the module to lookup.
    create      //(bool) Create the module if it does not already exist (or not).
  ) {
    // Find the module given be moduleName in the test procedure tree.
    // 
    //return
    //(bd.test.proc.module) The module which is identified by the full name moduleName.
    //> The module with the full name moduleName.
    //(null)
    //> No module with the full name moduleName exists and create was false.

    if (!moduleName) {
      return bd.test.proc.root;
    }
    var
      names= moduleName.split("/"),
      parent= bd.test.proc.root,
      i= 0,
      end= names.length;
    while (i<end) {
      var
        name= names[i++],
        nextParent= null;
      for (var children= parent.children, j= 0, jEnd= children.length; j<jEnd; j++) {
        if (children[j].name===name) {
          nextParent= children[j];
          break;
        }
      }
      if (!nextParent) {
        if (create) {
          nextParent= new bd.test.proc.module({name:name, parent:parent});
          dojo.publish("bd/test/proc/childrenChanged", [parent]);
        } else {
          return null; //<null
                       //>The module does not exist and create was falsy.
        }
      } 
      parent= nextParent;
    }
    return parent; //<(bd.test.proc.module) The module instance with the name given by moduleName.
                   //>The module either existed on entry or was created.
  }
});

//can't do this in the mixin above because the ctor needs bd.test.proc.map...
bd.test.proc.root=
  ///
  // Synthetic root: the mother of all test procedures.
  new bd.test.proc({name:"__root__"});

bd.test.proc.description= bd.declare(
  ///
  // A tree of test descriptions and demonstrations. //Any tree
  // represented by a bd.test.proc.description instance will be a
  // subtree within a bd.test.proc.module instance.

  //superclasses
  [bd.test.proc], 

  //members
  {
  constructor: function(
    args,     //(bd.test.proc.constructor.kwargs) Describes properties to mixin to new instance.
    scaffold, //(bd.test.proc.scaffold, optional, {}) The scaffold required for the children of this description.
    children  //(*bd.test.proc.constructor.module)
  ) {
    ///
    // Create a new instance.
    var i;
    if (scaffold && scaffold instanceof bd.test.proc.scaffold) {
      this.scaffold= scaffold;
      i= 2;
    } else {
      this.scaffold= {};
      i= 1;
    }
    for (var end= arguments.length; i<end; i++) {
      if (dojo.isArray(arguments[i])) {
        this.children= this.children.concat(arguments[i]);
      } else if (arguments[i]) {
        this.children.push(arguments[i]);
      }
    }
    this.setParentOfChildren();
  },

  traverseIn: function(
    space
  ) {
    ///see-super
    if (this.scaffold.before && this.scaffold.execType==="once") {
      return this.scaffold.before(space);
    } else {
      return true;
    }
  },

  traverseOut: function(
    space
  ) {
    ///see-super
    if (this.scaffold.after && this.scaffold.execType==="once") {
      return this.scaffold.after(space);
    } else {
      return true;
    }
  },

  exec: function(
    space
  ) {
    ///see-super
    if (this.scaffold.before && this.scaffold.execType==="each") {
      return this.scaffold.before(space);
    } else {
      return true;
    }
  },

  unexec: function(
    space
  ) {
    ///see-super
    if (this.scaffold.after && this.scaffold.execType==="each") {
      return this.scaffold.after(space);
    } else {
      return true;
    }
  }
});

bd.test.proc.module= bd.declare(
  ///
  // A tree of test descriptions and demonstrations contained within a single
  // resource. //Individual instances may be loaded on demand and/or reloaded. 
  // This facilitates interative development of tests without having to
  // reload the page on each interaction.

  //superclasses
  [bd.test.proc.description], 

  //members
  {
  loadedVersion:
    ///
    // The bd.test.proc.loader.version at the time when this module was loaded. //
    // Zero indicates the module has not been loaded
    0,

  constructor: function(
    args,    //(bd.test.proc.constructor.kwargs) Describes properties to mixin to new instance.
    scaffold, //(bd.test.proc.scaffold, optional, {}) The scaffold required for the children of this description.
    children //(bd.test.testProc) The single non-module child of this module (additional 
             // children may be added after construction).
             //(array of bd.test.proc) The non-module children of this module.
  ) {
    ///
    // Create a new instance.
    this.loadedVersion= 0;
  },

  getUrl: function() {
    ///
    // Get the URL for this module.
    //return
    //(string) The URL at which the resouce that defines the module resides.
    if (this.url) {
      return url;
    } else {
      return dojo.url(this.getFullName());
    }
  },

  load: function() {
    ///
    // Retrieve and process the JavaScript resource associated with this module.
    bd.test.loader.load(this);
  },

  reload: function() {
    ///
    // Retreive and process the JavaScript resource associated with this module;
    // force reloading the resource if it has already been loaded
    bd.test.loader.flushCache();
    this.load();
  },

  set: function(
    args,     //(bd.test.proc.constructor.kwargs) Describes properties to mixin to new instance.
    scaffold, //(bd.test.proc.scaffold, optional, {}) The scaffold required for the children of this description.
    children  //(bd.test.testProc) The single non-module child of this module.
              //(array of bd.test.proc) The non-module children of this module.
  ) {
    ///
    // Set the nonmodule children for this module. //Previous children that are not modules are discarded

    //erase all the non-module children...
    var clean= [];
    dojo.forEach(this.children, function(child) {
      if (child instanceof bd.test.proc.module) {
        clean.push(child);
      }
    });
    this.children= clean;

    if (dojo.isString(args)) {
      dojo.mixin(this, getNameAndDoc(args));
    } else {
      dojo.mixin(this, args);
    }

    var i;
    if (scaffold && scaffold instanceof bd.test.proc.scaffold) {
      this.scaffold= scaffold;
      i= 2;
    } else {
      this.scaffold= {};
      i= 1;
    }
    for (var end= arguments.length; i<end; i++) {
      if (dojo.isArray(arguments[i])) {
        this.children= this.children.concat(arguments[i]);
      } else if (arguments[i]) {
        this.children.push(arguments[i]);
      }
    }
    this.setParentOfChildren();
    dojo.publish("bd/test/proc/childrenChanged", [this]);
  }
});

bd.test.proc.scaffold= bd.declare(
  ///
  // Trivial class that holds scaffold functions.

  //superclasses
  [], 

  //members
  {
  constructor: function(
    execType, //("once") Execute this scaffold once for the subtree.
              //("each") execute this scaffold once for each demonstration while traversing the subtree.
    before,   //(bd.test.scaffoldFunction) The function to execute while traversing in.
    after     //(bd.test.scaffoldFunction) The function to execute while traversing out.
  ) {
    ///
    // Create a new instance.
    bd.docGen("overload",
      function(
        execType,
        procs //(array of bd.test.scaffoldFunction) The functions to execute while traversing in (procs[0]) and out (procs[1])
      ) {
        ///
        // Creates a new instance with the before property given by `procs[0]` and the after property given bye `procs[1]`.
      }
    );
    this.execType= execType;
    if (bd.isArray(before)) {
      this.before= before[0];
      this.after= before[1];
    } else {
      if (dojo.isFunction(before)) {
        this.before= before;
      }
      if (dojo.isFunction(after)) {
        this.after= after;
      }
    }
  }
});

bd.test.reflectorScaffold= function(
    execType,        //(*test.proc.scaffold.constructor.execType)
    context,         //(*bd.hijack.context)
    functionName,    //(*bd.hijack.functionName, optional)
    hijacker,        //(function, optional, undefined) The replacement function.
    hijackerContext, //(object, optional, bd.global) The context in which to call hijacker; falsy implies bd.global
    chain            //(boolean, optional, false) Call the original function automatically after the hijacker finishes.
  ) {
    ///
    // Creates and returns a scaffold that hijacks/restores a function.
    ///
    // The scaffold's execType is set as given. The scaffold's before function hijacks context[functionName] with the
    // provided hijacker (if any), or a default hijacker as follows:
    //code
    // function() {
    //   arguments.callee.args= bd.array(arguments);
    // }
    ///
    // This allows test code to inspect what arguments where actually sent to a hijacked function without executing
    // that function (assuming chain is falsy).
    // 
    // The scaffold's after function restores the original function.
    // 
    // For example, dojo.style could be hijacked to see what styles are applied consequent to some exercise on a widget
    // that is in fact a mock and therefore doesn't have a dom node as follows:
    //code
    // var bd.test.describe(
    //   "Exercise the method turnPsychodelic and check correct styling is applied via dojo.style",
    //   test.reflectorScaffold(all, dojo, "style", function(node) {
    //     var args= bd.array(arguments);
    //     //stuff the arugments where we can get at them
    //     dojo.style.args= args;
    //     if (!node.mock) {
    //       return dojo.style.original.apply(dojo, args);
    //     }
    //     return 0;
    //   }),
    //   bd.test.demo(function() {
    //     myMockWidget.turnPsychodelic();
    //     the(dojo.style.args).hasValue(expected);
    //   })
    // );
    ///
    // When the description instance is executed, the before scaffold will hijack the dojo.style function. The demo
    // instance uses the hijacked function to check to see what actually happened when turnPsychodelic was called. Finally,
    // the after scaffold returns dojo.style to its original functionality.
    // 
    // Also notice in that this example chooses to forward some calls (namely, nodes that aren't mocks) to the 
    // actual dojo.style call. In this particular example (taken from a real test), the call 
    // `the(dojo.style.args).hasValue(expected)` might cause other code to execute that needs the real dojo.style service.
    var 
      result= 0,
      defaultHijacker= function() {
        arguments.callee.args= bd.array(arguments);          
      },
      before= function() {
        result= bd.hijack(context, functionName, hijacker||defaultHijacker, hijackerContext, chain);
      },
      after= function() {
        bd.hijack(result);
      };
    return new bd.test.proc.scaffold(execType, before, after);
  };

bd.test.proc.demo= bd.declare(
  ///
  // A single demonstraction of functionality (test). //A bd.test.proc.demo
  // controls the execution of a function that runs some code, checks results,
  // and reports findings. A bd.test.proc.demo is a leaf node in the test tree.

  //superclasses
  [bd.test.proc],

  //members
  {
  preamble:function(args, program) {
    if (arguments.length==1) {
      //args is missing...
      return [{}, args];
    } else {
      return [args, program];
    }
  },

  constructor: function(
    args,    //(bd.test.proc.constructor.kwargs) Describes properties to mixin to new instance.
    program //(bd.test.demoFunction) The function that implements the demonstration
  ) {
    ///
    // Creates a new instance. //If neither name nor doc is given, then name is set to bd.test.proc.demo.defaultName.
    if (!this.name && !this.doc) {
      this.name= bd.test.proc.demo.defaultName;
    }
    //if program is missing, assume that args was missing and args is actually program
    this.program= program || args;
  },

  traverseIn: function(
    space //(bd.test.space) The space controlling this traversal.
  ) {
    ///
    // Execute the test function as given by the program property.
    var
      executer= bd.test.proc.demo.createExecuter(this, space),
      p= this.parent;
    while (p && p!==bd.test.proc.root) {
      executer.push(p);
      p= p.parent;
    }
    return executer.execute();
  },

  traverseOut: function(
    space //(bd.test.space) The space controlling this traversal.
  ){
    ///
    // No-op for this class.
  },

  exec: function(
    space
  ) {
    ///see-super
    space.startDemo(this);
    return this.program(space);
  },

  unexec: function(
    space
  ) {
    ///see-super
    space.endDemo(this);
  }
});
dojo.mixin(bd.test.proc.demo, {
  defaultName: 
    ///
    // The default name for a bd.test.proc.demo instance.
    "Demonstration",

  executer: {
    // An object that controls the execution of a single bd.test.proc.demo program.

    push: function(
      proc
    ) {
      this.buffer.unshift({proc:proc, traverseIn:true});
      this.buffer.push({proc:proc, traverseIn:false});
    },

    exhausted: function() {
      return this.current>=this.buffer.length;
    },

    get: function() {
      return this.buffer[this.current++];
    },

    skip: function() {
      var item= this.buffer[this.current-1];
      if (item && item.traverseIn) {
        var target= item.proc;
        while (this.buffer[this.current].proc!=target) {
          this.current++;
        }
      }
    },

    execute: function() {
      var
        space= this.space,
        result= true,
        next;
      bd.test.pushActiveSpace(space);
      while(!this.exhausted()) {
        next= this.get();
        try {
          if (next.traverseIn) {
            result= next.proc.exec(space);
          } else {
            result= next.proc.unexec(space);
          }
        } catch (e) {
          //unexpected exception...
          space.unexpectedException(e, next.proc, next.proc===this.demoProc, "executing", next.traverseIn);
          this.skip();
          //the error has been handled; therefore...
          result= true;
        }
        if (result instanceof dojo.Deferred) {
          result.addCallbacks(
            dojo.hitch(this, function(result) {
              if (result===bd.test.proc.failed) {
                if (next.proc===this.demoProc) {
                  space.demoFailed(next.proc);
                } else {
                  space.scaffoldFailed(next.proc, next.traverseIn);
                }
                this.skip();
              }
              return this.execute();
            }),
            dojo.hitch(this, function(e) {
              space.unexpectedException(e, next.proc, next.proc===this.demoProc, "executing", next.traverseIn);
              this.skip();
              return this.execute();
            })
          );
          break;
        } else if (result===bd.test.proc.failed) {
          if (next.proc===this.demoProc) {
            space.demoFailed(next.proc);
          } else {
            space.scaffoldFailed(next.proc, next.traverseIn);
          }
          this.skip();
          //the error has been handled; therefore...
          result= true;
        }
      }
      bd.test.popActiveSpace();
      //the error have already been processed...
      return result;
    }
  },

  createExecuter: function(
    proc,
    space
  ) {
    return dojo.delegate(bd.test.proc.demo.executer, {buffer:[{proc:proc, traverseIn:true}, {proc:proc, traverseIn:false}], current:0, space:space, demoProc:proc});
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

