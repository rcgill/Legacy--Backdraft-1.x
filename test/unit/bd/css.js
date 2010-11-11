define(["dojo", "bd", "bd/css"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module css",
  theFunction("[bd.css.metric]", demo("[*]", function() {
      the(bd.css.metric(123)).is("123px");
      the(bd.css.metric("123")).is("123px");
      the(bd.css.metric("123px")).is("123px");
      the(bd.css.metric("123em")).is("123em");
      the(bd.css.metric("123%")).is("123%");
  })),
  theFunction("[bd.css.emBox]", demo("[*]", function() {
      the(bd.css.emBox({t:1})).hasValue({top:"1em"});
      the(bd.css.emBox({b:2})).hasValue({bottom:"2em"});
      the(bd.css.emBox({l:3})).hasValue({left:"3em"});
      the(bd.css.emBox({r:4})).hasValue({right:"4em"});
      the(bd.css.emBox({h:5})).hasValue({height:"5em"});
      the(bd.css.emBox({w:6})).hasValue({width:"6em"});
      the(bd.css.emBox({t:1, b:2, l:3, r:4, h:5, w:6})).hasValue({top:"1em",bottom:"2em",left:"3em",right:"4em",height:"5em",width:"6em"});
  })),
  theFunction("[bd.css.box]", demo("[*]", function() {
      the(bd.css.box({t:1})).hasValue({top:"1px"});
      the(bd.css.box({b:2})).hasValue({bottom:"2px"});
      the(bd.css.box({l:3})).hasValue({left:"3px"});
      the(bd.css.box({r:4})).hasValue({right:"4px"});
      the(bd.css.box({h:5})).hasValue({height:"5px"});
      the(bd.css.box({w:6})).hasValue({width:"6px"});
      the(bd.css.box({t:1, b:2, l:3, r:4, h:5, w:6})).hasValue({top:"1px",bottom:"2px",left:"3px",right:"4px",height:"5px",width:"6px"});
  })),
  theFunction("[bd.css.clearPosit]", 
    bd.test.reflectorScaffold(each, dojo, "style", function(node) {
      var args= bd.array(arguments);
      dojo.style.args= args;
      if (!node.mock) {
        return dojo.style.original.apply(dojo, args);
      }
      return 0;
    }),
    demo("[*]", function() {
      var node= {mock:1};
      bd.css.clearPosit(node);
      var result= dojo.style.args;
      the(result[0]).is(node);
      the(result[1]).hasValue({top:"", bottom:"", left:"", right:""});
    })
  ),
  theFunction("[bd.css.clearSize]",
    bd.test.reflectorScaffold(each, dojo, "style", function(node) {
      var args= bd.array(arguments);
      dojo.style.args= args;
      if (!node.mock) {
        return dojo.style.original.apply(dojo, args);
      }
      return 0;
    }),
    demo("[*]", function() {
      var node= {mock:1};
      bd.css.clearSize(node);
      var result= dojo.style.args;
      the(result[0]).is(node);
      the(result[1]).hasValue({width:"", height:""});
    })
  ),
  theFunction("[bd.css.clearPositAndSize]",
    bd.test.reflectorScaffold(each, dojo, "style", function(node) {
      var args= bd.array(arguments);
      dojo.style.args= args;
      if (!node.mock) {
        return dojo.style.original.apply(dojo, args);
      }
      return 0;
    }),
    demo("[*]", function() {
      var node= {mock:1};
      bd.css.clearPositAndSize(node);
      var result= dojo.style.args;
      the(result[0]).is(node);
      the(result[1]).hasValue({top:"", bottom:"", left:"", right:"", width:"", height:""});
    })
  ),
  describe("[bd.css.cornerCalculators] Positioning Calculators", demo("[*]", function() {
    var target, reference;
 
    // both (t, l) at (0, 0)
    target= {t:0, l:0, h:10, w:20},
    reference= {t:0, l:0, h:100, w:200};
    the(bd.css.cornerCalculators.getTop("tl-tl", target, reference)).is(0);
    the(bd.css.cornerCalculators.getTop("tl-cl", target, reference)).is(50);
    the(bd.css.cornerCalculators.getTop("tl-bl", target, reference)).is(100);
    the(bd.css.cornerCalculators.getTop("cl-tl", target, reference)).is(-5);
    the(bd.css.cornerCalculators.getTop("cl-cl", target, reference)).is(45);
    the(bd.css.cornerCalculators.getTop("cl-bl", target, reference)).is(95);
    the(bd.css.cornerCalculators.getTop("bl-tl", target, reference)).is(-10);
    the(bd.css.cornerCalculators.getTop("bl-cl", target, reference)).is(40);
    the(bd.css.cornerCalculators.getTop("bl-bl", target, reference)).is(90);

    the(bd.css.cornerCalculators.getLeft("tl-tl", target, reference)).is(0);
    the(bd.css.cornerCalculators.getLeft("tl-tc", target, reference)).is(100);
    the(bd.css.cornerCalculators.getLeft("tl-tr", target, reference)).is(200);
    the(bd.css.cornerCalculators.getLeft("tc-tl", target, reference)).is(-10);
    the(bd.css.cornerCalculators.getLeft("tc-tc", target, reference)).is(90);
    the(bd.css.cornerCalculators.getLeft("tc-tr", target, reference)).is(190);
    the(bd.css.cornerCalculators.getLeft("tr-tl", target, reference)).is(-20);
    the(bd.css.cornerCalculators.getLeft("tr-tc", target, reference)).is(80);
    the(bd.css.cornerCalculators.getLeft("tr-tr", target, reference)).is(180);

    // reference (t, l)==(0, 0), target is offset, but this has not affect on calculation
    target= {t:35, l:45, h:10, w:20},
    reference= {t:0, l:0, h:100, w:200};
    the(bd.css.cornerCalculators.getTop("tl-tl", target, reference)).is(0);
    the(bd.css.cornerCalculators.getTop("tl-cl", target, reference)).is(50);
    the(bd.css.cornerCalculators.getTop("tl-bl", target, reference)).is(100);
    the(bd.css.cornerCalculators.getTop("cl-tl", target, reference)).is(-5);
    the(bd.css.cornerCalculators.getTop("cl-cl", target, reference)).is(45);
    the(bd.css.cornerCalculators.getTop("cl-bl", target, reference)).is(95);
    the(bd.css.cornerCalculators.getTop("bl-tl", target, reference)).is(-10);
    the(bd.css.cornerCalculators.getTop("bl-cl", target, reference)).is(40);
    the(bd.css.cornerCalculators.getTop("bl-bl", target, reference)).is(90);

    the(bd.css.cornerCalculators.getLeft("tl-tl", target, reference)).is(0);
    the(bd.css.cornerCalculators.getLeft("tl-tc", target, reference)).is(100);
    the(bd.css.cornerCalculators.getLeft("tl-tr", target, reference)).is(200);
    the(bd.css.cornerCalculators.getLeft("tc-tl", target, reference)).is(-10);
    the(bd.css.cornerCalculators.getLeft("tc-tc", target, reference)).is(90);
    the(bd.css.cornerCalculators.getLeft("tc-tr", target, reference)).is(190);
    the(bd.css.cornerCalculators.getLeft("tr-tl", target, reference)).is(-20);
    the(bd.css.cornerCalculators.getLeft("tr-tc", target, reference)).is(80);
    the(bd.css.cornerCalculators.getLeft("tr-tr", target, reference)).is(180);

    // reference is offset, this *does* affect calculation
    target= {t:35, l:45, h:10, w:20},
    reference= {t:20, l:40, h:100, w:200};
    the(bd.css.cornerCalculators.getTop("tl-tl", target, reference)).is(20);
    the(bd.css.cornerCalculators.getTop("tl-cl", target, reference)).is(70);
    the(bd.css.cornerCalculators.getTop("tl-bl", target, reference)).is(120);
    the(bd.css.cornerCalculators.getTop("cl-tl", target, reference)).is(15);
    the(bd.css.cornerCalculators.getTop("cl-cl", target, reference)).is(65);
    the(bd.css.cornerCalculators.getTop("cl-bl", target, reference)).is(115);
    the(bd.css.cornerCalculators.getTop("bl-tl", target, reference)).is(10);
    the(bd.css.cornerCalculators.getTop("bl-cl", target, reference)).is(60);
    the(bd.css.cornerCalculators.getTop("bl-bl", target, reference)).is(110);

    the(bd.css.cornerCalculators.getLeft("tl-tl", target, reference)).is(40);
    the(bd.css.cornerCalculators.getLeft("tl-tc", target, reference)).is(140);
    the(bd.css.cornerCalculators.getLeft("tl-tr", target, reference)).is(240);
    the(bd.css.cornerCalculators.getLeft("tc-tl", target, reference)).is(30);
    the(bd.css.cornerCalculators.getLeft("tc-tc", target, reference)).is(130);
    the(bd.css.cornerCalculators.getLeft("tc-tr", target, reference)).is(230);
    the(bd.css.cornerCalculators.getLeft("tr-tl", target, reference)).is(20);
    the(bd.css.cornerCalculators.getLeft("tr-tc", target, reference)).is(120);
    the(bd.css.cornerCalculators.getLeft("tr-tr", target, reference)).is(220);
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
