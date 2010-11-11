define("bd/buildTools", ["bd/kernel"], function(bd) {

  bd.devTools=
    ///namespace
    // Contains machinery that aids various development tasks.
    bd.devTools || {};

  bd.global.bd= bd;
  
  bd.devTools.logModules= function(
    reset //(bool) Reset the watch list to empty
  ) {
    ///
    // Remembers and dumps the list of modules loaded by the loader.
    // 
    // Each time a module is loaded, the module name is added to a private watch list. This
    // funnction dumps the set of modules that have been loaded since the last time the watch list
    // was reset (by passing a truthy value) or since the page was first requested (if 
    // the watch list has never been reset). This can be useful when composing build layers
  };

  bd.devTools.logBuildScript= function() {
    ///
    // Dump a build script based upon the currently executing page.
    //
    // TODOC: details
  };

  bd.devTools.dumpBuildScript= function() {
    bd.forEach(document.getElementsByTagName("head")[0].childNodes, function(n) {
      if (n.nodeName=="SCRIPT") {
        console.log(n.src);
      }
    });
    bd.forEachHash(require.modules, function(value, url) {
      if (/^text/.test(url)) {
        console.log(url);
      }
    });

  };
});
