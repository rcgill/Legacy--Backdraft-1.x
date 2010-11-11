define(["dojo", "bd", "bd/test"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module(
  note("bd.test.loader resolves module names to URLs using dojo.url"),
  describe("text",
    demo("Caches the raw text of a module at bd.test.load.text[<the URL for that module>].", function() {
      var module= bd.test.proc.get("bd-unit/test/loaderTest1");
      bd.test.loader.getText(module.getUrl());
      the(bd.test.loader.text[module.getUrl()]).is("//this is test data for unit.bd.test.loader");
      module.destroy();
    })
  ),

  describe("flushCache",
    demo("Resets bd.test.loader.text to {} and increments bd.test.loader.version by 1.", function() {
      the(bd.test.loader.text).hasDiffValue({});
      var version= bd.test.loader.version;
      bd.test.loader.flushCache();
      the(bd.test.loader.text).hasValue({});
      the(bd.test.loader.version).hasValue(version+1);
    })
  ),

  describe("getText", demo(function() {
    var
      module= bd.test.proc.get("bd-unit/test/loaderTest1"),
      url= module.getUrl();
    bd.test.loader.flushCache();
    the(bd.test.loader.text).hasValue({});
    the(bd.test.loader.getText(url)).is("//this is test data for unit.bd.test.loader");
    the(bd.test.loader.text[url]).is("//this is test data for unit.bd.test.loader");
    module.destroy();
  })),

  describe("preprocess", demo(function() {
    var src= [
      '//this is test data for unit.bd.test.loader',
      '//# aFakePreprocessor1',
      '//#aFakePreprocessor2',
      '//#aFakePreprocessor3 some more stuff',
      '//#aFakePreprocessor4 "some more stuff"',
      '//#aFakePreprocessor5"some more stuff"',
      '//#aFakePreprocessor6(some more stuff)',
      '//#aFakePreprocessor7 {someArg1:"d", someArg2:"e", someArg3:"XXXXX"}}',
      '//#aFakePreprocessor8({someArg1:"d", someArg2:"e", someArg3:"XXXXX"}})',
      '//#aFakePreprocessor9={someArg1:"d", someArg2:"e", someArg3:"XXXXX"}}',
      'more...'];

    // With this text, we expect the preprocessor calls: aFakePreprocessor2, ..., aFakePreprocessor9
    // with the following args:
    var expectedArgs= [
      null, //not used
      null, //not used
      '', //aFakePreprocessor2
      ' some more stuff', //aFakePreprocessor3
      ' "some more stuff"', //aFakePreprocessor4
      '"some more stuff"', //aFakePreprocessor5
      "(some more stuff)", //aFakePreprocessor6
      ' {someArg1:"d", someArg2:"e", someArg3:"XXXXX"}}', //aFakePreprocessor7
      '({someArg1:"d", someArg2:"e", someArg3:"XXXXX"}})', //aFakePreprocessor8
      '={someArg1:"d", someArg2:"e", someArg3:"XXXXX"}}' //aFakePreprocessor9
    ];
    // Notice that aFakePreprocessor1 will not be found because of the space after //#

    try {
      var
        expectedText= [
          "//this is test data for unit.bd.test.loader", 
          "//# aFakePreprocessor1", 
          "pp()", 
          "pp(some more stuff)", 
          "pp(\"some more stuff\")", 
          "pp(\"some more stuff\")", 
          "pp((some more stuff))", 
          "pp({someArg1:\"d\", someArg2:\"e\", someArg3:\"XXXXX\"}})", 
          "pp(({someArg1:\"d\", someArg2:\"e\", someArg3:\"XXXXX\"}}))", 
          "pp(={someArg1:\"d\", someArg2:\"e\", someArg3:\"XXXXX\"}})", 
          "more...",
          "//@ sourceURL=a.module.name." + bd.test.loader.version].join("\n"),
        lastCalled= 1,
        makeTestPreprocessorFunction=  function(i) {
          return function(text, reResult, metaCommandRe, moduleName) {
            the(moduleName).is("a.module.name");
            the(lastCalled).is(i-1);
            the(reResult[0]).is(src[i]);
            the(reResult[3]).is(expectedArgs[i]);
            lastCalled= i;
            var 
              temp= text.substring(0, reResult.index) + "pp(" + dojo.trim(reResult[3]||"") + ")",
              lastIndex= metaCommandRe.lastIndex;
              metaCommandRe.lastIndex= temp.length;
            return temp + text.substring(lastIndex);
          };
        };
      for (var i= 2; i<=9; i++) {
        bd.test.loader.preprocessors["aFakePreprocessor" + i]= makeTestPreprocessorFunction(i);
      }
      var result= bd.test.loader.preprocess(src.join("\n"), "a.module.name");
      the(result).is(expectedText);
    } finally {
      for (var i= 2; i<=9; i++) {
        delete bd.test.loader.preprocessors["aFakePreprocessor" + i];
      }
    }
  })),

  describe("preprocessors",
    describe("commentToString",
      todo()
    ),

    describe("firebugId", demo(function() {
      var result= bd.test.loader.preprocessors.firebugId("//This is some module text...\n", 0, 0, "myModuleName");
      the(result).is("//This is some module text...\n\n//@ sourceURL=myModuleName." + bd.test.loader.version);
    }))
  ),

  describe("load", demo(function() {
    var
      loaderModule= bd.test.proc.get("bd-unit/test/loader"),
      clonedLoaderModule= {};

    bd.forEachHash(loaderModule, function(value, name) {
      clonedLoaderModule[name]= value;
    });

    //loading an already-loaded module without first flushing the cache is a no-op...
    loaderModule.reload();
    var currentVersion= bd.test.loader.version;
    the(loaderModule.loadedVersion).is(currentVersion);
    bd.test.loader.load(loaderModule);
    the(loaderModule.loadedVersion).is(currentVersion);
    the(bd.test.proc.get("bd-unit/test/loader")).is(loaderModule);
    the(bd.test.proc.get("bd-unit/test/loader")).hasValue(loaderModule);

    bd.test.loader.load(loaderModule.getFullName());
    the(loaderModule.loadedVersion).is(currentVersion);
    the(bd.test.proc.get("bd-unit/test/loader")).is(loaderModule);
    the(bd.test.proc.get("bd-unit/test/loader")).hasValue(loaderModule);

    //flush the cache and we get a load...
    bd.test.loader.flushCache();
    //clear the children to see something load...
    loaderModule.children= [];
    bd.test.loader.load(loaderModule);
    the(loaderModule.loadedVersion).is(currentVersion+1);
    the(bd.test.proc.get("bd-unit/test/loader")).is(loaderModule);
    the(bd.test.proc.get("bd-unit/test/loader")).hasValue(loaderModule);

    bd.test.loader.flushCache();
    loaderModule.children= [];
    bd.test.loader.load(loaderModule.getFullName());
    the(loaderModule.loadedVersion).is(currentVersion+2);
    the(bd.test.proc.get("bd-unit/test/loader")).is(loaderModule);
    the(bd.test.proc.get("bd-unit/test/loader")).hasValue(loaderModule);
  }))
);
});
