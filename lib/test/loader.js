define("bd/test/loader", [
  "dojo", "bd", "bd/test/namespace"
], function(dojo, bd) {
///
// Defines the Backdraft test framework loader.

bd.test.loader=
  ///namespace
  // Contains the Backdraft test framework loader machinery.
  bd.test.loader || {};

//local lexical variable...
var theLoader= bd.test.loader;

bd.mix(bd.test.loader, {
  version: 
    ///
    // The current version of the cache. See bd.test.loader.text and bd.test.loader.flushCache.
    1,

  asynchLoad: function(
    moduleNameOrNames //(string | array of string) Module name(s) to load.
  ) {
    ///
    // Asynchronously downloads and loads one or many test modules.
    if (!dojo.isArray(moduleNameOrNames)) {
      moduleNameOrNames= [moduleNameOrNames];
    }

    var currentVersion= theLoader.version;
    dojo.forEach(moduleNameOrNames, function(moduleName) {
      dojo.xhrGet({
        url:dojo.url(moduleName),
        load:function(text) {
          var module= bd.test.proc.get(moduleName);
          if (currentVersion<theLoader.version) {
            //the cache was flushed since the preload request; therefore, ignore this resource and get it again...
            theLoader.asynchLoad(moduleName);
          } else if (currentVersion>module.loadedVersion) {
            //the module either hasn't ever been loaded or the load is based on an older resource than we now have; therefore...
            theLoader.text[dojo.url(moduleName)]= text;
            theLoader.load(module);
          }
        }
      });
    });
  },

  text:
    ///
    // A cache of raw test modules.
    ///
    //(map:url(string) --> text(string)) The raw text retrieved from url.
    {},

  getText: function(
    url //(URL) The address from which to download the text.
  ) {
    ///
    // Downloads the text from url and stores it in the cache at bd.test.loader.text.
    if (!theLoader.text[url]) {
      dojo.xhrGet({
        url:url,
        sync:true,
        load:function(text) {
          theLoader.text[url]= text;
        }
      });
    }
    return theLoader.text[url];
  },

  flushCache: function() {
    ///
    // Clears the bd.test.loader.cache and bumps the cache version.
    theLoader.version++;
    theLoader.text= {};
  },

  preprocess: function(
    text,
    moduleName
  ) {
    ///
    // Preprocesses text.
    var 
      metaCommandRegEx= /^(\/\/\#)(\w+)(.*)$/gm,   // "//#<meta-command><args>"
      result;
    while ((result= metaCommandRegEx.exec(text)) != null) {
      text= theLoader.preprocessors[result[2]](text, result, metaCommandRegEx, moduleName);
    }
    return theLoader.preprocessors.firebugId(text, 0, 0, moduleName);
  },

  load: function(
    moduleOrModuleName, //(bd.test.proc.module | string) the module or moduleName to load
    onLoad, //(function, optional) function to execute upon completion of loading module
    onError //(function, optional) function to execute if module fails to load
  ) {
    ///
    // Retrieves and preprocesses the resource associated moduleName iff the load version of that module is less than bd.test.loader.version.

    var moduleName, module;
    if (dojo.isString(moduleOrModuleName)) {
      moduleName= moduleOrModuleName;
      module= bd.test.proc.get(moduleName);
    } else {
      module= moduleOrModuleName;
      moduleName= module.getFullName();
    }
    if (module.loadedVersion>=theLoader.version) {
      return;
    }
    try {
      dojo.eval(theLoader.preprocess(theLoader.getText(module.getUrl()), moduleName));
      module.loadedVersion= theLoader.version;
      onLoad && onLoad(module);
    } catch (e) {
      dojo.onError("failed-to-load-test-module", [e]);
      onError && onError();
    }
  }
});


bd.test.loader.preprocessors=
  ///namespace
  // Contains functions that process raw test modules.
  bd.test.loader.preprocessors || {};

bd.mix(bd.test.loader.preprocessors, {
  commentToString: function(
    text,          //(string) The raw text to transform.
    reResult,      //(regex result) The result of executing the regular expression that found this processor (`//#commentToString`); see bd.loader.preprocess.
    metaCommandRe,
    moduleName
  ) {
    ///
    // Scans source for a multi-line "//" comment sequence preceeded by a keyword; when found, changes the comment sequence to a string. //For example...
    //code
    // describe(//This is a long comment
    //          //here is more
    //          //etc.
    //   demo(...)
    // )
    ///
    // is transfored into
    //code
    // describe("This is a long comment\nhere is more\etc.", demo(...))
    ///
    // Notice the comma was inserted. If the next token after the comment sequence is ")", then the comma is not inserted.
    //
    // If each line is preceeded by some white space, then the number of spaces found on the line
    // with the least about of prefix white space are deleted from every line.
    //
    // For example...
    //code
    //   // This is a comment
    //   // some more
    //   //    this is indented
    //   // that's all
    ///
    // is transformed into
    //code
    // "This is a comment\nsome more\n  this is indented\nthat'sall"
    var
      result= [],
      regex= /^(\s*)(describe|member|argument|demo|todo|note|see)\(\/\/(\s*)(.*)/,
      commentRegEx= /^\s*\/\/(\s*)(.*)/,
      nextTokenIsClosingParen= /^\s*\)/,
      head= text.substring(0, reResult.index);
    text= text.substring(metaCommandRe.lastIndex).split("\n");
    for (var i= 0, end= text.length; i<end; i++) {
      var match= regex.exec(text[i]);
      if (match) {
        var
          j, jEnd, minLeadingWS,
          start= match[1] + match[2] + "(",
          // s is a vector of pairs of (leading white-space, content)
          s= [[match[3], match[4]]];
        i++;
        while (i<end) {
          match= commentRegEx.exec(text[i]);
          if (match) {
            s.push([match[1], match[2]]);
            i++;
          } else {
            break;
          }
        }
        //remove any empty lines from the front of the vector
        while (s.length && !s[0][1]) {
          s.shift();
        }
        //remove any empty lines from the end of the vector
        j= s.length - 1;
        while (s.length && !s[j--][1]) {
          s.pop();
        }
        //find the minimum number of leading spaces all lines contain
        minLeadingWS= s[0][0].length;
        for (j= 1, jEnd= s.length; j<jEnd; j++) {
          minLeadingWS= Math.min(minLeadingWS, s[j][0].length);
        }
        //if all lines contain at least some leading white space, trim it and calculate the new content
        if (minLeadingWS) {
          for (j= 0, jEnd= s.length; j<jEnd; j++) {
            s[j]= s[j][0].substring(minLeadingWS) + s[j][1];
          }
        } else {
          for (j= 0, jEnd= s.length; j<jEnd; j++) {
            s[j]= s[j][0] + s[j][1];
          }
        }
        s= s.join("\n");
        if (nextTokenIsClosingParen.test(text[i])) {
          result.push(start + dojo._escapeString(s));
        } else {
          result.push(start + dojo._escapeString(s) + ",");
        }
        i--;
      } else {
        result.push(text[i]);
      }
    }
    metaCommandRe.lastIndex= head.length;
    return head + "\n" + result.join("\n");
  },

  firebugId:function(
    text,
    notUsed1,
    notUsed2,
    moduleName
  ) {
    ///
    // Appends the string required for Firebug to debug eval'd text.
    ///
    // The name is given as <module name>.<bd.test.loader.version at the time the module was loaded.
    // This allows modules to be reloaded without restarted the application.

    return text + "\n//@ sourceURL=" + moduleName + "." + theLoader.version;
  },

  include: function(
    text,
    reResult,
    metaCommandRe,
    moduleName
  ) {
    ///
    // Includes a resouse inside another resource.
    var
      includeText= theLoader.getText(dojo.url(dojo.trim(reResult[3]), false)),
      temp= text.substring(0, reResult.index) + includeText + "var moduleName= \"" + moduleName + "\";",
      lastIndex= metaCommandRe.lastIndex;
    metaCommandRe.lastIndex= temp.length;
    return temp + text.substring(lastIndex);
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

