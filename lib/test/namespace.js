define("bd/test/namespace", ["bd"], function(bd) {
///
// Augments the bd namespace with the bd.test namespace and defines Backdraft test machinery configuration options.
///
//note
// Typically, client programs do not load this module directly, but rather load
// the module bd/test. See module.bd.test.

bd.test=
  ///namespace
  // Contains the Backdraft testing machinery.
  bd.test || {};

var userConfig= bd.config.test || {};
bd.config.test= {
  ///
  // Holds several configuration flags for the Backdraft test framework. //Define this variable with
  // desired switch setting before loading the test framework (this is only required if you desire a
  // switch setting different than the default). For example, by default, the test framework aliases the
  // bd namespace into the global namespace, thereby making it convenient for use in the browser debug console. This
  // feature could be disabled by writing,
  //code
  // // set non-default configuration switches...
  // bd.config.test= {
  //   makeBdGlobal: false;
  // };
  // 
  // // load the test framework
  // dojo.reg("bd/test");
  ///
  makeBdGlobal:
    ///
    // Cause the test framework to alias the bd namespace in the global namespace.
    true
};

//user switches override defaults...
bd.mix(bd.config.test, userConfig);

return bd.test;

});
