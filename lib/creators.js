define("bd/creators", [
  "require",
  "bd/kernel",
  "dojo",
  "bd/collections",
  "bd/lang"
], function(require, bd, dojo) {
///
// Augments the bd namespace with several creator functions.
///
//note
// Typically, client programs do not load this module directly, but rather load the module bd. See module.bd.

bd.createObject=
  function(
    ctorName,//(bd.namespacedName or jsname) Constructor function name.
    args,    //(array, optional, []) Arguments passed to constructor.
    callback //(function(newObject), optional, undefined) Function to call after new object has been created.
  ){
    ///
    // Creates a new object given a constructor name.
    ///
    // The constructor given by `bd.get(ctorName)` is loaded (if required) and executed to instantiate a new object.
    // `args`, if any, are provided to the constructor. After construction, if given, `callback` is applied to the
    // new object. A bd.Deferred instance is used to control the possibly-asynchronous loading
    // of the contructor and the callback if the constructor needs to be loaded.
    //warn
    // Since it is *not* assumed that the constructor has been previously loaded
    // it is possible that the module that holds the constructor must be loaded before the new object
    // can be created. Since Backdraft assumes an asynchronous loader, the object may not
    // be created upon return from this function.
    // 
    //return
    //(any, as given by `ctorName`) The newly created object.
    //> The constructor did not need to be loaded.
    //(bd.Deferred) A bd.Deferred instance that asynchronously loads the constructor, creates the object,
    // and optionally calls callback. The result of the deferred is the newly created object.
    //> The module that defines the constructor needed to be loaded.

    //argument juggling
    if (!bd.isArray(args)) {
      callback= args;
      args= [];
    }

    var 
      doCreate= function() {
        var
          ctor= bd.get(ctorName),
          result= bd.delegate(ctor.prototype);
        ctor.apply(result, args);
        return result;
      },
      callbackHelper= function(object) {
        var cbResult= callback(object);
        if (cbResult instanceof bd.Deferred) {
          cbResult.addCallback(function() {
            return object;
          });
          return cbResult;
        }
        return object;
      };

    if (bd.get(ctorName)) {
      var newObject= doCreate();
      callback && callbackHelper(newObject);
      return newObject;
    } else {
      var deferred= new bd.Deferred();
      deferred.addCallback(doCreate);
      callback && deferred.addCallback(callbackHelper);
      require([bd.moduleName(ctorName)], function() { 
        deferred.callback(true); 
      });
      return deferred;
    }
  };

var traverse= function(descriptor) {
  if (descriptor.className && !bd.get(descriptor.className)) {
    require(bd.moduleName(descriptor.className));
  }
  bd.forEach(descriptor.children, traverse);
};

bd.createWidget=
  function(
    args,     //(kwargs) Describes how to create the widget.
    callback, //(function(newWidget), optional) Function to call after new widget tree has been created.
    onCreates //(private) Array of functions to call after hierarchy completely created. Built up
              // as this function traverses the hierarchy; this argument should *never* be provided for 
              // top-level (i.e., non-recursive) applications of this function.
  ){
    ///
    // Creates a new widget hierarchy as given by args.
    ///
    // Creates a new widget hierarchy as given by args (including all the decendent children, grandchildren, etc.).
    // The hierarchy is created depth-first. Adds the top-level widget to the parent (if any) after the entire 
    // hierarchy is created, and then calls any onCreate functions found in widget heirarchy in the reverse order they were 
    // encountered during the creation traversal.
    //
    // Since it is *not* assumed that demanded widget classes have been previously loaded,
    // one or more modules may need to be loaded before some widgets
    // can be created. Further, since Backdraft assumes an asynchronous loader, the hierarchy may not
    // be created upon return from this function. Therefore, in the event modules must be loaded in order to complete
    // the creation of the hierarch, this function returns a bd.Deferred object that controls the asynchronous
    // creation. On the other hand, if all required constructors were available upon entry, then the result of callback applied to the
    // root of the hierarchy (when callback is provided) or the root (otherwise) is returned immediately.
    //note
    // This function is, perhaps, the foundational function of the Backdraft framework. It allows hierarchies of powerful widgets to be
    // easily created *without markup or a parser* in an asynchronous  environment using a deterministic, effecient algorithm.
    bd.docGen("kwargs", {
      ///
      // Describes a how to create, bind, and place a new bd widget.
    
      parent:
        //(bd.containerWidget) The parent into which to place the widget.
        //(string) The parent as resolved by bd.object.byId into which to place the widget.
        //(falsy) The widget is left an orphan.
        null,
    
      descriptor:
        //(bd.descriptor) Describes how to create the widget.
        bd.noDefault,
    
      key:
        //(bd.key) Describes how to restrict data to bind to widget.
        {},
    
      data:
        //(bd.data) Data to bind to widget. Typically, working set of single rows,
        // each row a member of some rowset, that are used to bind data; but may be anything meaninful to the widget class.
        {}
    });

    //traverse the descriptor and request any required modules that aren't already loaded
    var topLevel= false;
    if (onCreates===undefined) {
      topLevel= true;
      traverse(args.descriptor);
      onCreates= [];
    }

    var
      key= args.key || {},
      data= args.data || {},
      parent= bd.isString(args.parent) ? bd.object.byId(args.parent) : args.parent,
      finish= function(widget) {
        var 
          // any service request can return a bd.Deferred; once we slip
          // into deferred execution, this process starts adding functions
          // to the first deferred result's callback queue and will return 
          // the deferred as the result. This variable will hold the first
          // deferred if/when we get it.
          controllingDeferred= 0;

        if (args.descriptor.onCreate) {
          onCreates.push(bd.hitch(widget, args.descriptor.onCreate, widget));
        }
      
        // create the widget's children (if any)
        if (widget.loadChildren) {
          ((controllingDeferred= widget.loadChildren(onCreates)) instanceof bd.Deferred) || (controllingDeferred= 0);
        } else {
          var
            childrenDescriptors= widget.getChildrenDescriptors && widget.getChildrenDescriptors(),
            childrenKeyset= widget.childrenKeys || [key];
          if (childrenDescriptors && childrenKeyset) {
            //create a set of children for each key in the keyset
            bd.forEach(childrenKeyset, function(key){
              var augmentedData= bd.mix({}, data);
              widget.calcData && widget.calcData(key, augmentedData);
              bd.forEach(childrenDescriptors, function(descriptor) {
                var result= bd.createWidget({
                  parent:widget, 
                  descriptor:descriptor, 
                  key:key, 
                  data:augmentedData}, 0, onCreates);
                if (result instanceof bd.Deferred) {
                  if (controllingDeferred) {
                    //add a function to the controlling deferred callback queue that will wait for this child
                    controllingDeferred.addCallback((function(result) { return function() { return result; }; })(result));
                  } else {
                    //this is the first deferred result; therefore, it becomes the controlling deferred
                    controllingDeferred= result;
                  }
                }
              });
            });
          }
        }
        // at this point the children are all created (if any) or controllingDeferred holds a bd.Deferred that's controlling
        // the asynchronous creation of the children.

        // NOTICE: we assume that addChild never returns a bd.Deferred
        if (controllingDeferred) {
          controllingDeferred.addCallback(function(){ 
            if (widget.parent && widget.parent.addChild) {
              widget.parent.addChild(widget);
            }
          });
        } else if (widget.parent && widget.parent.addChild) {
          widget.parent.addChild(widget);
        }

        // if this is the top level, then run the on-load queue      
        if (topLevel) {
          while (!controllingDeferred && onCreates.length) {
            ((controllingDeferred= onCreates.pop().call(null)) instanceof bd.Deferred) || (controllingDeferred= 0);
          }
          if (controllingDeferred) {
            controllingDeferred.addCallback(function() {
              while (onCreates.length) (onCreates.pop())();
            });
          }
        }

        // make the callback (if any)
        if (callback) {
          if (controllingDeferred) {
            // the callback is expecting the widget; make sure it gets it...
            controllingDeferred.addCallback(function() {
              return widget;
            });
            controllingDeferred.addCallback(callback);
          } else {
            ((controllingDeferred= callback(widget)) instanceof bd.Deferred) || (controllingDeferred= 0);
          }
        }
     
        // return the newly manufactured widget instance with all of its decendents
        if (controllingDeferred) {
          // the caller is expecting the widget; make sure it gets it...
          controllingDeferred.addCallback(function() { 
            return widget; 
          });
          return controllingDeferred;
        }
        return widget;
      };
    return bd.createObject(args.descriptor.className, [{parent:parent, descriptor:args.descriptor, key:key, data:data}], finish);
  };

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
