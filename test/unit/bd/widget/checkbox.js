(function() {

//#include bd/test/testHelpers

module("the widget class bd.widget.checkbox",
  userDemo("demonstration and test application", function(space) {
    space.sandbox("bd-unit/widget/checkbox/checkbox.html", function(frameDojo) {
      frameDojo.module("bd").test.run("checkbox-test");
    });
    //space.sandbox("url:http://localhost:4242/bd/test/bd-unit/widget/checkbox/checkbox.html");
    //space.sandbox("url:http://localhost:4242/smoke-dev/smoke1.html");
  })
);

})();
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
