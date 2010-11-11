define(["dojo", "bd", "bd/test"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

  function makeScaffold(execType, before, after, defer) {
    // all the scaffolding objects and data will be put in s
    var s= {};
  
    // name::= position role
    // position::= t | m | l | r  //(t)op, (m)iddle, (l)eft, (r)ight
    // role::= b | a | d  //(b)efore scaffold, (a)fter scaffold, (d)emo
    dojo.forEach("td.md.lld.lrd.rld.rrd".split("."), function(name) {
      s[name]= function(space) {
        if (s[name].defer) {
          var d= new dojo.Deferred();
          d.addCallback(function() {
            if (s[name].causeThrow) {
              throw Error(name + "-forced throw");
            }
            bd.test.pushActiveSpace(space);
            the(s[name].pass).is(true);
            bd.test.popActiveSpace();
          });
          setTimeout(function() { d.callback(true); }, 10);
          return d;
        } else {
          if (s[name].causeThrow) {
            throw Error(name + "-forced throw");
          }
          the(s[name].pass).is(true);
          return undefined;
        }
      };
      s[name].name= name;
    });
  
    dojo.forEach("tb.ta.mb.ma.lb.la.rb.ra".split("."), function(name) {
      s[name]= function(space) {
        if (s[name].defer) {
          var d= new dojo.Deferred();
          d.addCallback(function() {
            if (s[name].causeThrow) {
              throw Error(name + "-forced throw");
            }
            if (!s[name].pass) {
              return bd.test.proc.failed;
            }
            space.publisher.messageBuffer+= "S(" + name + ") ";
            return undefined;
          });
          setTimeout(function() { d.callback(true); }, 10);
          return d;
        } else {
          if (s[name].causeThrow) {
            throw Error(name + "-forced throw");
          }
          if (!s[name].pass) {
            return bd.test.proc.failed;
          }
          space.publisher.messageBuffer+= "S(" + name + ") ";
          return undefined;
        }
      };
      s[name].name= name;
    });
  
    // create the tree: (top (middle (left right))); each description has a demo; none have a scaffold...yet
  
    s.top= new bd.test.proc.description("top");
    s.topDemo= new bd.test.proc.demo({name:"topDemo", parent:s.top}, s.td);
  
    s.middle= new bd.test.proc.description({name:"middle", parent:s.top});
    s.middleDemo= new bd.test.proc.demo({name:"middleDemo", parent:s.middle}, s.md);
  
    s.left= new bd.test.proc.description({name:"left", parent:s.middle});
    s.llDemo= new bd.test.proc.demo({name:"LLD", parent:s.left}, s.lld);
    s.lrDemo= new bd.test.proc.demo({name:"LRD", parent:s.left}, s.lrd);
  
    s.right= new bd.test.proc.description({name:"right", parent:s.middle});
    s.rlDemo= new bd.test.proc.demo({name:"RLD", parent:s.right}, s.rld);
    s.rrDemo= new bd.test.proc.demo({name:"RRD", parent:s.right}, s.rrd);
  
    s.publisher= {
      messageBuffer: "",
  
      publish: function(
        message
      ) {
        this[message].apply(this, arguments);
      },
  
      "bd.test.traverseIn":function(
        message,
        description
      ) {
        this.messageBuffer+= "in(" + description.name + ") ";
      },
  
      "bd.test.traverseOut":function(
        message,
        description
      ) {
        this.messageBuffer+= "out(" + description.name + ") ";
      },
  
      "bd.test.scaffoldFailed":function(
        message,
        proc,
        travserseIn
      ) {
        this.messageBuffer+= "scaffoldFailed(" + proc.name + ")" + (travserseIn ? "T " : "F ");
      },
  
      "bd.test.scaffoldThrew":function(
        message,
        proc,
        traverseIn
      ) {
        this.messageBuffer+= "scaffoldThrew(" + proc.name + ")" + (traverseIn ? "T " : "F ");
      },
  
      "bd.test.startDemo": function(
        message,
        demo
      ) {
        this.messageBuffer+= "{" + demo.name + " ";
      },
  
      "bd.test.endDemo": function(
        message,
        demo
      ) {
        this.messageBuffer+= demo.name + "} ";
      },
  
      "bd.test.demoThrew":function(
        message,
        demo
      ) {
        this.messageBuffer+= "demoThrew(" + demo.name + ") ";
      },
  
      "bd.test.result":function(
        message,
        arg
      ) {
        this.messageBuffer+= (arg.pass ? "P" : "F") + (arg.threw ? "T" : "") + " ";
      },
  
      "bd.test.abort":function() {
        this.messageBuffer+= "abort ";
      }
    };
  
    dojo.forEach("tb.ta.td.mb.ma.md.lb.la.lld.lrd.rb.ra.rld.rrd".split("."), function(name) {
      s[name].causeThrow= false;
      s[name].pass= true;
      s[name].defer= defer;
    });
    s.top.scaffold= {};
    s.middle.scaffold= {};
    s.left.scaffold= {};
    s.right.scaffold= {};
    if (execType) {
      s.top.scaffold= new bd.test.proc.scaffold(execType, before && s.tb, after && s.ta);
      s.middle.scaffold= new bd.test.proc.scaffold(execType, before && s.mb, after && s.ma);
      s.left.scaffold= new bd.test.proc.scaffold(execType, before && s.lb, after && s.la);
      s.right.scaffold= new bd.test.proc.scaffold(execType, before && s.rb, after && s.ra);
  
      //this helps the testing routines tweek the scaffold...
      s.tb.parent= s.ta.parent= s.top;
      s.mb.parent= s.ma.parent= s.middle;
      s.lb.parent= s.la.parent= s.left;
      s.rb.parent= s.ra.parent= s.right;
    }
    return s;
  }

var testExec= describe({name:"Execution Algorithm"},
//
// The scaffold for this series of tests  includes the function makeScaffold that creates a unique scaffold for each of the individual tests.
// The scaffold is a tree of bd.test.proc objects. The interior of the tree is comprised of bd.test.description nodes, and includes a
// root node ("top"), with one child ("middle"), itself with two children ("left" and "right").  Each
//
  demo("Trivial demo (one demo, no scaffolds, no errors) for debugging/watching basic algorithm.", function(space) {
    var
      s= makeScaffold(0, 0, 0, 0),
      fakeSpace= new bd.test.space({publisher:s.publisher});
    fakeSpace.execute(s.topDemo, function() {
      bd.test.pushActiveSpace(space);
      the(fakeSpace.publisher.messageBuffer).is("in(top) in(topDemo) {topDemo P topDemo} out(topDemo) out(top) ");
      bd.test.popActiveSpace();
    });
  }),

  demo("Trivial demo (one demo, one pair of once scaffolds around the demo, no errors) for debugging/watching basic algorithm.", function(space) {
    var
      s= makeScaffold(once, true, true, false),
      fakeSpace= new bd.test.space({publisher:s.publisher});
    fakeSpace.execute(s.topDemo, function() {
      bd.test.pushActiveSpace(space);
      the(fakeSpace.publisher.messageBuffer).is("in(top) S(tb) in(topDemo) {topDemo P topDemo} out(topDemo) S(ta) out(top) ");
      bd.test.popActiveSpace();
    });
  }),

  demo("Trivial demo (one demo, one pair of each scaffolds around the demo, no errors) for debugging/watching basic algorithm.", function(space) {
    var
      s= makeScaffold(each, true, true, false),
      fakeSpace= new bd.test.space({publisher:s.publisher});
    fakeSpace.execute(s.middleDemo, function() {
      bd.test.pushActiveSpace(space);
      the(fakeSpace.publisher.messageBuffer).is("in(top) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo P middleDemo} S(ma) S(ta) out(middleDemo) out(middle) out(top) ");
      bd.test.popActiveSpace();
    });
  }),

  demo("Cover test: exercise test tree at each node with no scaffolds, nothing throws, nothing fails.", function(space) {
    var expected= {
      top:"in(top) in(topDemo) {topDemo P topDemo} out(topDemo) in(middle) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) in(left) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) out(left) in(right) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) out(right) out(middle) out(top) ",
      topDemo:"in(top) in(topDemo) {topDemo P topDemo} out(topDemo) out(top) ",
      middle:"in(top) in(middle) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) in(left) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) out(left) in(right) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) out(right) out(middle) out(top) ",
      middleDemo:"in(top) in(middle) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) out(middle) out(top) ",
      left:"in(top) in(middle) in(left) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) out(left) out(middle) out(top) ",
      llDemo:"in(top) in(middle) in(left) in(LLD) {LLD P LLD} out(LLD) out(left) out(middle) out(top) ",
      lrDemo:"in(top) in(middle) in(left) in(LRD) {LRD P LRD} out(LRD) out(left) out(middle) out(top) ",
      right:"in(top) in(middle) in(right) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) out(right) out(middle) out(top) ",
      rlDemo:"in(top) in(middle) in(right) in(RLD) {RLD P RLD} out(RLD) out(right) out(middle) out(top) ",
      rrDemo:"in(top) in(middle) in(right) in(RRD) {RRD P RRD} out(RRD) out(right) out(middle) out(top) "
    };
    var running= 0;
    dojo.forEach([false, true], function(defer) {
      dojo.forEach("top.topDemo.middle.middleDemo.left.llDemo.lrDemo.right.rlDemo.rrDemo".split("."), function(item) {
        running++;
        var
          s= makeScaffold(0, 0, 0, defer),
          fakeSpace= new bd.test.space({publisher:s.publisher});
        fakeSpace.execute(s[item], function() {
          bd.test.pushActiveSpace(space);
          the(fakeSpace.publisher.messageBuffer).is(expected[item]);

          bd.test.popActiveSpace();
          running--;
        });
      });
    });
    return space.watch(50, 2000, function() { return running==0; });
  }),

  demo("Cover test: exercise test tree at each node with before and after once scaffolds at every description, nothing throws, nothing fails.", function(space) {
    var expected= {
      top:"in(top) S(tb) in(topDemo) {topDemo P topDemo} out(topDemo) in(middle) S(mb) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      topDemo:"in(top) S(tb) in(topDemo) {topDemo P topDemo} out(topDemo) S(ta) out(top) ",
      middle:"in(top) S(tb) in(middle) S(mb) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      middleDemo:"in(top) S(tb) in(middle) S(mb) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) S(ma) out(middle) S(ta) out(top) ",
      left:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) S(ma) out(middle) S(ta) out(top) ",
      llDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) S(la) out(left) S(ma) out(middle) S(ta) out(top) ",
      lrDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) S(ma) out(middle) S(ta) out(top) ",
      right:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      rlDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      rrDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) "
    };

    var running= 0;
    dojo.forEach([false, true], function(defer) {
      dojo.forEach("top.topDemo.middle.middleDemo.left.llDemo.lrDemo.right.rlDemo.rrDemo".split("."), function(item) {
        running++;
        var
          s= makeScaffold(once, true, true, defer),
          fakeSpace= new bd.test.space({publisher:s.publisher});
        fakeSpace.execute(s[item], function() {
          bd.test.pushActiveSpace(space);
          the(fakeSpace.publisher.messageBuffer).is(expected[item]);
          bd.test.popActiveSpace();
          running--;
        });
      });
    });
    return space.watch(50, 2000, function() { return running==0; });
  }),

  demo("Cover test: exercise test tree with before and after each scaffolds at every description, nothing throws, nothing fails.", function(space) {
    var expected= {
      top:"in(top) in(topDemo) S(tb) {topDemo P topDemo} S(ta) out(topDemo) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo P middleDemo} S(ma) S(ta) out(middleDemo) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) S(ma) S(ta) out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) S(ma) S(ta) out(LRD) out(left) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) S(ma) S(ta) out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      topDemo:"in(top) in(topDemo) S(tb) {topDemo P topDemo} S(ta) out(topDemo) out(top) ",
      middle:"in(top) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo P middleDemo} S(ma) S(ta) out(middleDemo) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) S(ma) S(ta) out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) S(ma) S(ta) out(LRD) out(left) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) S(ma) S(ta) out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      middleDemo:"in(top) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo P middleDemo} S(ma) S(ta) out(middleDemo) out(middle) out(top) ",
      left:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) S(ma) S(ta) out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      llDemo:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) S(ma) S(ta) out(LLD) out(left) out(middle) out(top) ",
      lrDemo:"in(top) in(middle) in(left) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      right:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) S(ma) S(ta) out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      rlDemo:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) S(ma) S(ta) out(RLD) out(right) out(middle) out(top) ",
      rrDemo:"in(top) in(middle) in(right) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) "
    };
    var running= 0;
    dojo.forEach([false, true], function(defer) {
      dojo.forEach("top.topDemo.middle.middleDemo.left.llDemo.lrDemo.right.rlDemo.rrDemo".split("."), function(item) {
        running++;
        var
          s= makeScaffold(each, true, true, defer),
          fakeSpace= new bd.test.space({publisher:s.publisher});
        fakeSpace.execute(s[item], function() {
          bd.test.pushActiveSpace(space);
          the(fakeSpace.publisher.messageBuffer).is(expected[item]);
          bd.test.popActiveSpace();
          running--;
        });
      });
    });
    return space.watch(50, 1000, function() { return running==0; });
  }),

  note(
    "space.abortOnScaffoldFail is ignored unless space.abortOnFail must be set to false."
  ),

  demo("Cover test: exercise test tree with failing scaffolds.",
//
// Cases:
// space.abortOnScaffoldFail set false X
// scaffold type in ["once", "each"] X
// [failure by return value, failure by throw] X
// scaffold functions execute [synchronously, asynchronously] X
// exercise at each node of test tree
//
  function(space) {
    var expected= {
      tb_once_top:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      tb_once_topDemo:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      tb_once_middle:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      tb_once_middleDemo:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      tb_once_left:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      tb_once_llDemo:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      tb_once_lrDemo:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      tb_once_right:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      tb_once_rlDemo:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      tb_once_rrDemo:"in(top) F scaffoldFailed(top)T S(ta) out(top) ",
      ta_once_top:"in(top) S(tb) in(topDemo) {topDemo P topDemo} out(topDemo) in(middle) S(mb) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) S(ma) out(middle) F scaffoldFailed(top)F out(top) ",
      ta_once_topDemo:"in(top) S(tb) in(topDemo) {topDemo P topDemo} out(topDemo) F scaffoldFailed(top)F out(top) ",
      ta_once_middle:"in(top) S(tb) in(middle) S(mb) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) S(ma) out(middle) F scaffoldFailed(top)F out(top) ",
      ta_once_middleDemo:"in(top) S(tb) in(middle) S(mb) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) S(ma) out(middle) F scaffoldFailed(top)F out(top) ",
      ta_once_left:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) S(ma) out(middle) F scaffoldFailed(top)F out(top) ",
      ta_once_llDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) S(la) out(left) S(ma) out(middle) F scaffoldFailed(top)F out(top) ",
      ta_once_lrDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) S(ma) out(middle) F scaffoldFailed(top)F out(top) ",
      ta_once_right:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) S(ma) out(middle) F scaffoldFailed(top)F out(top) ",
      ta_once_rlDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) S(ra) out(right) S(ma) out(middle) F scaffoldFailed(top)F out(top) ",
      ta_once_rrDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) S(ma) out(middle) F scaffoldFailed(top)F out(top) ",
      mb_once_middle:"in(top) S(tb) in(middle) F scaffoldFailed(middle)T S(ma) out(middle) S(ta) out(top) ",
      mb_once_middleDemo:"in(top) S(tb) in(middle) F scaffoldFailed(middle)T S(ma) out(middle) S(ta) out(top) ",
      mb_once_left:"in(top) S(tb) in(middle) F scaffoldFailed(middle)T S(ma) out(middle) S(ta) out(top) ",
      mb_once_llDemo:"in(top) S(tb) in(middle) F scaffoldFailed(middle)T S(ma) out(middle) S(ta) out(top) ",
      mb_once_lrDemo:"in(top) S(tb) in(middle) F scaffoldFailed(middle)T S(ma) out(middle) S(ta) out(top) ",
      mb_once_right:"in(top) S(tb) in(middle) F scaffoldFailed(middle)T S(ma) out(middle) S(ta) out(top) ",
      mb_once_rlDemo:"in(top) S(tb) in(middle) F scaffoldFailed(middle)T S(ma) out(middle) S(ta) out(top) ",
      mb_once_rrDemo:"in(top) S(tb) in(middle) F scaffoldFailed(middle)T S(ma) out(middle) S(ta) out(top) ",
      ma_once_middle:"in(top) S(tb) in(middle) S(mb) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) F scaffoldFailed(middle)F out(middle) S(ta) out(top) ",
      ma_once_middleDemo:"in(top) S(tb) in(middle) S(mb) in(middleDemo) {middleDemo P middleDemo} out(middleDemo) F scaffoldFailed(middle)F out(middle) S(ta) out(top) ",
      ma_once_left:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) F scaffoldFailed(middle)F out(middle) S(ta) out(top) ",
      ma_once_llDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) S(la) out(left) F scaffoldFailed(middle)F out(middle) S(ta) out(top) ",
      ma_once_lrDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LRD) {LRD P LRD} out(LRD) S(la) out(left) F scaffoldFailed(middle)F out(middle) S(ta) out(top) ",
      ma_once_right:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) F scaffoldFailed(middle)F out(middle) S(ta) out(top) ",
      ma_once_rlDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) S(ra) out(right) F scaffoldFailed(middle)F out(middle) S(ta) out(top) ",
      ma_once_rrDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RRD) {RRD P RRD} out(RRD) S(ra) out(right) F scaffoldFailed(middle)F out(middle) S(ta) out(top) ",
      lb_once_left:"in(top) S(tb) in(middle) S(mb) in(left) F scaffoldFailed(left)T S(la) out(left) S(ma) out(middle) S(ta) out(top) ",
      lb_once_llDemo:"in(top) S(tb) in(middle) S(mb) in(left) F scaffoldFailed(left)T S(la) out(left) S(ma) out(middle) S(ta) out(top) ",
      lb_once_lrDemo:"in(top) S(tb) in(middle) S(mb) in(left) F scaffoldFailed(left)T S(la) out(left) S(ma) out(middle) S(ta) out(top) ",
      la_once_left:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) in(LRD) {LRD P LRD} out(LRD) F scaffoldFailed(left)F out(left) S(ma) out(middle) S(ta) out(top) ",
      la_once_llDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD P LLD} out(LLD) F scaffoldFailed(left)F out(left) S(ma) out(middle) S(ta) out(top) ",
      la_once_lrDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LRD) {LRD P LRD} out(LRD) F scaffoldFailed(left)F out(left) S(ma) out(middle) S(ta) out(top) ",
      rb_once_right:"in(top) S(tb) in(middle) S(mb) in(right) F scaffoldFailed(right)T S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      rb_once_rlDemo:"in(top) S(tb) in(middle) S(mb) in(right) F scaffoldFailed(right)T S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      rb_once_rrDemo:"in(top) S(tb) in(middle) S(mb) in(right) F scaffoldFailed(right)T S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      ra_once_right:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) in(RRD) {RRD P RRD} out(RRD) F scaffoldFailed(right)F out(right) S(ma) out(middle) S(ta) out(top) ",
      ra_once_rlDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD P RLD} out(RLD) F scaffoldFailed(right)F out(right) S(ma) out(middle) S(ta) out(top) ",
      ra_once_rrDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RRD) {RRD P RRD} out(RRD) F scaffoldFailed(right)F out(right) S(ma) out(middle) S(ta) out(top) ",
      tb_each_top:"in(top) in(topDemo) F scaffoldFailed(top)T S(ta) out(topDemo) in(middle) in(middleDemo) F scaffoldFailed(top)T S(ta) out(middleDemo) in(left) in(LLD) F scaffoldFailed(top)T S(ta) out(LLD) in(LRD) F scaffoldFailed(top)T S(ta) out(LRD) out(left) in(right) in(RLD) F scaffoldFailed(top)T S(ta) out(RLD) in(RRD) F scaffoldFailed(top)T S(ta) out(RRD) out(right) out(middle) out(top) ",
      tb_each_topDemo:"in(top) in(topDemo) F scaffoldFailed(top)T S(ta) out(topDemo) out(top) ",
      tb_each_middle:"in(top) in(middle) in(middleDemo) F scaffoldFailed(top)T S(ta) out(middleDemo) in(left) in(LLD) F scaffoldFailed(top)T S(ta) out(LLD) in(LRD) F scaffoldFailed(top)T S(ta) out(LRD) out(left) in(right) in(RLD) F scaffoldFailed(top)T S(ta) out(RLD) in(RRD) F scaffoldFailed(top)T S(ta) out(RRD) out(right) out(middle) out(top) ",
      tb_each_middleDemo:"in(top) in(middle) in(middleDemo) F scaffoldFailed(top)T S(ta) out(middleDemo) out(middle) out(top) ",
      tb_each_left:"in(top) in(middle) in(left) in(LLD) F scaffoldFailed(top)T S(ta) out(LLD) in(LRD) F scaffoldFailed(top)T S(ta) out(LRD) out(left) out(middle) out(top) ",
      tb_each_llDemo:"in(top) in(middle) in(left) in(LLD) F scaffoldFailed(top)T S(ta) out(LLD) out(left) out(middle) out(top) ",
      tb_each_lrDemo:"in(top) in(middle) in(left) in(LRD) F scaffoldFailed(top)T S(ta) out(LRD) out(left) out(middle) out(top) ",
      tb_each_right:"in(top) in(middle) in(right) in(RLD) F scaffoldFailed(top)T S(ta) out(RLD) in(RRD) F scaffoldFailed(top)T S(ta) out(RRD) out(right) out(middle) out(top) ",
      tb_each_rlDemo:"in(top) in(middle) in(right) in(RLD) F scaffoldFailed(top)T S(ta) out(RLD) out(right) out(middle) out(top) ",
      tb_each_rrDemo:"in(top) in(middle) in(right) in(RRD) F scaffoldFailed(top)T S(ta) out(RRD) out(right) out(middle) out(top) ",
      ta_each_top:"in(top) in(topDemo) S(tb) {topDemo P topDemo} F scaffoldFailed(top)F out(topDemo) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo P middleDemo} S(ma) F scaffoldFailed(top)F out(middleDemo) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) S(ma) F scaffoldFailed(top)F out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) S(ma) F scaffoldFailed(top)F out(LRD) out(left) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) S(ma) F scaffoldFailed(top)F out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) S(ma) F scaffoldFailed(top)F out(RRD) out(right) out(middle) out(top) ",
      ta_each_topDemo:"in(top) in(topDemo) S(tb) {topDemo P topDemo} F scaffoldFailed(top)F out(topDemo) out(top) ",
      ta_each_middle:"in(top) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo P middleDemo} S(ma) F scaffoldFailed(top)F out(middleDemo) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) S(ma) F scaffoldFailed(top)F out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) S(ma) F scaffoldFailed(top)F out(LRD) out(left) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) S(ma) F scaffoldFailed(top)F out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) S(ma) F scaffoldFailed(top)F out(RRD) out(right) out(middle) out(top) ",
      ta_each_middleDemo:"in(top) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo P middleDemo} S(ma) F scaffoldFailed(top)F out(middleDemo) out(middle) out(top) ",
      ta_each_left:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) S(ma) F scaffoldFailed(top)F out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) S(ma) F scaffoldFailed(top)F out(LRD) out(left) out(middle) out(top) ",
      ta_each_llDemo:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) S(ma) F scaffoldFailed(top)F out(LLD) out(left) out(middle) out(top) ",
      ta_each_lrDemo:"in(top) in(middle) in(left) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) S(ma) F scaffoldFailed(top)F out(LRD) out(left) out(middle) out(top) ",
      ta_each_right:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) S(ma) F scaffoldFailed(top)F out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) S(ma) F scaffoldFailed(top)F out(RRD) out(right) out(middle) out(top) ",
      ta_each_rlDemo:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) S(ma) F scaffoldFailed(top)F out(RLD) out(right) out(middle) out(top) ",
      ta_each_rrDemo:"in(top) in(middle) in(right) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) S(ma) F scaffoldFailed(top)F out(RRD) out(right) out(middle) out(top) ",
      mb_each_middle:"in(top) in(middle) in(middleDemo) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(middleDemo) in(left) in(LLD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(LLD) in(LRD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(LRD) out(left) in(right) in(RLD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(RLD) in(RRD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      mb_each_middleDemo:"in(top) in(middle) in(middleDemo) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(middleDemo) out(middle) out(top) ",
      mb_each_left:"in(top) in(middle) in(left) in(LLD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(LLD) in(LRD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      mb_each_llDemo:"in(top) in(middle) in(left) in(LLD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(LLD) out(left) out(middle) out(top) ",
      mb_each_lrDemo:"in(top) in(middle) in(left) in(LRD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      mb_each_right:"in(top) in(middle) in(right) in(RLD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(RLD) in(RRD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      mb_each_rlDemo:"in(top) in(middle) in(right) in(RLD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(RLD) out(right) out(middle) out(top) ",
      mb_each_rrDemo:"in(top) in(middle) in(right) in(RRD) S(tb) F scaffoldFailed(middle)T S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      ma_each_middle:"in(top) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo P middleDemo} F scaffoldFailed(middle)F S(ta) out(middleDemo) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) F scaffoldFailed(middle)F S(ta) out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) F scaffoldFailed(middle)F S(ta) out(LRD) out(left) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) F scaffoldFailed(middle)F S(ta) out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) F scaffoldFailed(middle)F S(ta) out(RRD) out(right) out(middle) out(top) ",
      ma_each_middleDemo:"in(top) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo P middleDemo} F scaffoldFailed(middle)F S(ta) out(middleDemo) out(middle) out(top) ",
      ma_each_left:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) F scaffoldFailed(middle)F S(ta) out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) F scaffoldFailed(middle)F S(ta) out(LRD) out(left) out(middle) out(top) ",
      ma_each_llDemo:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} S(la) F scaffoldFailed(middle)F S(ta) out(LLD) out(left) out(middle) out(top) ",
      ma_each_lrDemo:"in(top) in(middle) in(left) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} S(la) F scaffoldFailed(middle)F S(ta) out(LRD) out(left) out(middle) out(top) ",
      ma_each_right:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) F scaffoldFailed(middle)F S(ta) out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) F scaffoldFailed(middle)F S(ta) out(RRD) out(right) out(middle) out(top) ",
      ma_each_rlDemo:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} S(ra) F scaffoldFailed(middle)F S(ta) out(RLD) out(right) out(middle) out(top) ",
      ma_each_rrDemo:"in(top) in(middle) in(right) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} S(ra) F scaffoldFailed(middle)F S(ta) out(RRD) out(right) out(middle) out(top) ",
      lb_each_left:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) F scaffoldFailed(left)T S(la) S(ma) S(ta) out(LLD) in(LRD) S(tb) S(mb) F scaffoldFailed(left)T S(la) S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      lb_each_llDemo:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) F scaffoldFailed(left)T S(la) S(ma) S(ta) out(LLD) out(left) out(middle) out(top) ",
      lb_each_lrDemo:"in(top) in(middle) in(left) in(LRD) S(tb) S(mb) F scaffoldFailed(left)T S(la) S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      la_each_left:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} F scaffoldFailed(left)F S(ma) S(ta) out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} F scaffoldFailed(left)F S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      la_each_llDemo:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD P LLD} F scaffoldFailed(left)F S(ma) S(ta) out(LLD) out(left) out(middle) out(top) ",
      la_each_lrDemo:"in(top) in(middle) in(left) in(LRD) S(tb) S(mb) S(lb) {LRD P LRD} F scaffoldFailed(left)F S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      rb_each_right:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) F scaffoldFailed(right)T S(ra) S(ma) S(ta) out(RLD) in(RRD) S(tb) S(mb) F scaffoldFailed(right)T S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      rb_each_rlDemo:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) F scaffoldFailed(right)T S(ra) S(ma) S(ta) out(RLD) out(right) out(middle) out(top) ",
      rb_each_rrDemo:"in(top) in(middle) in(right) in(RRD) S(tb) S(mb) F scaffoldFailed(right)T S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      ra_each_right:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} F scaffoldFailed(right)F S(ma) S(ta) out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} F scaffoldFailed(right)F S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      ra_each_rlDemo:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD P RLD} F scaffoldFailed(right)F S(ma) S(ta) out(RLD) out(right) out(middle) out(top) ",
      ra_each_rrDemo:"in(top) in(middle) in(right) in(RRD) S(tb) S(mb) S(rb) {RRD P RRD} F scaffoldFailed(right)F S(ma) S(ta) out(RRD) out(right) out(middle) out(top) "
    };

    var running= 0;
    dojo.forEach(["once", "each"], function(execType) {
      dojo.forEach([false, true], function(defer) {//for deffered and non-deffered execution
        dojo.forEach("tb.ta.mb.ma.lb.la.rb.ra".split("."), function(scaffold) {//for each scaffold location...
          dojo.forEach([true, false], function(fail) {//for failing and throwing scaffolds
            dojo.forEach("top.topDemo.middle.middleDemo.left.llDemo.lrDemo.right.rlDemo.rrDemo".split("."), function(item) {//try it at each node...
              var
                s= makeScaffold(execType, true, true, defer),
                fakeSpace= new bd.test.space({publisher:s.publisher, abortOnScaffoldFail:false, abortOnFail:false}),
                infectedNode= s[scaffold].parent,
                p= s[item];
              while (p && p!=infectedNode) p= p.parent;
              if (!p) {
                //item is not affected by the infection; therefore, no reason to test
                return;
              }
              s[scaffold].causeThrow= (!fail);
              s[scaffold].pass= (!fail);
              running++;
              fakeSpace.execute(s[item], function() {
                bd.test.pushActiveSpace(space);
                var check= expected[scaffold + "_" + execType + "_"  + item];
                if (!fail) {
                  check= check.replace(/scaffoldFailed/g, "scaffoldThrew").replace(/ F /g, " FT ");
                }
if (fakeSpace.publisher.messageBuffer!=check) {
  console.log(fakeSpace.publisher.messageBuffer, check);
}
                the(fakeSpace.publisher.messageBuffer).is(check);
                bd.test.popActiveSpace();
                running--;
              });
           });
          });
        });
      });
    });
    return space.watch(50, 3600000, function() { return running==0; });
  }),

  demo("Cover test: exercise test tree with failing demos.", function(space) {
    var expected= {
      once_top:"in(top) S(tb) in(topDemo) {topDemo FT demoThrew(topDemo) topDemo} out(topDemo) in(middle) S(mb) in(middleDemo) {middleDemo FT demoThrew(middleDemo) middleDemo} out(middleDemo) in(left) S(lb) in(LLD) {LLD FT demoThrew(LLD) LLD} out(LLD) in(LRD) {LRD FT demoThrew(LRD) LRD} out(LRD) S(la) out(left) in(right) S(rb) in(RLD) {RLD FT demoThrew(RLD) RLD} out(RLD) in(RRD) {RRD FT demoThrew(RRD) RRD} out(RRD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      once_topDemo:"in(top) S(tb) in(topDemo) {topDemo FT demoThrew(topDemo) topDemo} out(topDemo) S(ta) out(top) ",
      once_middle:"in(top) S(tb) in(middle) S(mb) in(middleDemo) {middleDemo FT demoThrew(middleDemo) middleDemo} out(middleDemo) in(left) S(lb) in(LLD) {LLD FT demoThrew(LLD) LLD} out(LLD) in(LRD) {LRD FT demoThrew(LRD) LRD} out(LRD) S(la) out(left) in(right) S(rb) in(RLD) {RLD FT demoThrew(RLD) RLD} out(RLD) in(RRD) {RRD FT demoThrew(RRD) RRD} out(RRD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      once_middleDemo:"in(top) S(tb) in(middle) S(mb) in(middleDemo) {middleDemo FT demoThrew(middleDemo) middleDemo} out(middleDemo) S(ma) out(middle) S(ta) out(top) ",
      once_left:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD FT demoThrew(LLD) LLD} out(LLD) in(LRD) {LRD FT demoThrew(LRD) LRD} out(LRD) S(la) out(left) S(ma) out(middle) S(ta) out(top) ",
      once_llDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LLD) {LLD FT demoThrew(LLD) LLD} out(LLD) S(la) out(left) S(ma) out(middle) S(ta) out(top) ",
      once_lrDemo:"in(top) S(tb) in(middle) S(mb) in(left) S(lb) in(LRD) {LRD FT demoThrew(LRD) LRD} out(LRD) S(la) out(left) S(ma) out(middle) S(ta) out(top) ",
      once_right:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD FT demoThrew(RLD) RLD} out(RLD) in(RRD) {RRD FT demoThrew(RRD) RRD} out(RRD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      once_rlDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RLD) {RLD FT demoThrew(RLD) RLD} out(RLD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      once_rrDemo:"in(top) S(tb) in(middle) S(mb) in(right) S(rb) in(RRD) {RRD FT demoThrew(RRD) RRD} out(RRD) S(ra) out(right) S(ma) out(middle) S(ta) out(top) ",
      each_top:"in(top) in(topDemo) S(tb) {topDemo FT demoThrew(topDemo) topDemo} S(ta) out(topDemo) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo FT demoThrew(middleDemo) middleDemo} S(ma) S(ta) out(middleDemo) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD FT demoThrew(LLD) LLD} S(la) S(ma) S(ta) out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD FT demoThrew(LRD) LRD} S(la) S(ma) S(ta) out(LRD) out(left) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD FT demoThrew(RLD) RLD} S(ra) S(ma) S(ta) out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD FT demoThrew(RRD) RRD} S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      each_topDemo:"in(top) in(topDemo) S(tb) {topDemo FT demoThrew(topDemo) topDemo} S(ta) out(topDemo) out(top) ",
      each_middle:"in(top) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo FT demoThrew(middleDemo) middleDemo} S(ma) S(ta) out(middleDemo) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD FT demoThrew(LLD) LLD} S(la) S(ma) S(ta) out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD FT demoThrew(LRD) LRD} S(la) S(ma) S(ta) out(LRD) out(left) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD FT demoThrew(RLD) RLD} S(ra) S(ma) S(ta) out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD FT demoThrew(RRD) RRD} S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      each_middleDemo:"in(top) in(middle) in(middleDemo) S(tb) S(mb) {middleDemo FT demoThrew(middleDemo) middleDemo} S(ma) S(ta) out(middleDemo) out(middle) out(top) ",
      each_left:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD FT demoThrew(LLD) LLD} S(la) S(ma) S(ta) out(LLD) in(LRD) S(tb) S(mb) S(lb) {LRD FT demoThrew(LRD) LRD} S(la) S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      each_llDemo:"in(top) in(middle) in(left) in(LLD) S(tb) S(mb) S(lb) {LLD FT demoThrew(LLD) LLD} S(la) S(ma) S(ta) out(LLD) out(left) out(middle) out(top) ",
      each_lrDemo:"in(top) in(middle) in(left) in(LRD) S(tb) S(mb) S(lb) {LRD FT demoThrew(LRD) LRD} S(la) S(ma) S(ta) out(LRD) out(left) out(middle) out(top) ",
      each_right:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD FT demoThrew(RLD) RLD} S(ra) S(ma) S(ta) out(RLD) in(RRD) S(tb) S(mb) S(rb) {RRD FT demoThrew(RRD) RRD} S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) ",
      each_rlDemo:"in(top) in(middle) in(right) in(RLD) S(tb) S(mb) S(rb) {RLD FT demoThrew(RLD) RLD} S(ra) S(ma) S(ta) out(RLD) out(right) out(middle) out(top) ",
      each_rrDemo:"in(top) in(middle) in(right) in(RRD) S(tb) S(mb) S(rb) {RRD FT demoThrew(RRD) RRD} S(ra) S(ma) S(ta) out(RRD) out(right) out(middle) out(top) "
    };
    var running= 0;
    dojo.forEach(["once", "each"], function(execType) {
      dojo.forEach([false, true], function(defer) {//for deffered and non-deffered execution
          dojo.forEach([true, false], function(fail) {//for failing and throwing demos
            dojo.forEach("top.topDemo.middle.middleDemo.left.llDemo.lrDemo.right.rlDemo.rrDemo".split("."), function(item) {//try it at each node...
              var
                s= makeScaffold(execType, true, true, defer),
                fakeSpace= new bd.test.space({publisher:s.publisher, abortOnScaffoldFail:false, abortOnFail:false});
              dojo.forEach("td.md.lld.lrd.rld.rrd".split("."), function(name) {
                s[name].pass= (!fail);
                s[name].causeThrow= (!fail);
              });
              running++;
              fakeSpace.execute(s[item], function() {
                bd.test.pushActiveSpace(space);
                var check= expected[execType + "_"  + item];
                if (fail) {
                  check= check.replace(/FT demoThrew\(\w+\)/g, "F");
                }
                the(fakeSpace.publisher.messageBuffer).is(check);
                bd.test.popActiveSpace();
                running--;
              });
           });
          });
      });
    });
    return space.watch(50, 3600000, function() { return running==0; });
  })
);

module(
  userDemo(function() {
    //create a new proc object...
    var proc= new bd.test.proc();

    //the new object is a dojo.declare'd class
    the(proc).isDojoDeclared();

    //the default (name, doc, parent, children) property values are ("", "", null, [])
    the(proc.name).is("");
    the(proc.doc).is("");
    the(proc.parent).is(null);
    the(proc.children).hasValue([]);

    //the object is referenced in bd.test.proc.map such that bd.test.proc.map[proc.id]===proc
    the(bd.test.proc.map[proc.id]).is(proc);

    //the name, doc, parent, children, and other, user-specified properties can be set by passing createArgs to the constructor
    //with the exception of the parent and id properties, no checking is done to see that these values are meaningful
    var parent= new bd.test.proc();
    proc= new bd.test.proc({name:"myProc", doc:"myDoc", parent:parent, children:["this", "is", "nonsense"], someProperty:"someValue"});
    the(proc.name).is("myProc");
    the(proc.doc).is("myDoc");
    the(proc.parent).is(parent);
    the(proc.children).hasValue(["this", "is", "nonsense"]);
    the(proc.someProperty).is("someValue");

    //a non-null parent must be a proc object since the constructor inserts the new object in the parent's children collection
    the(function() {
      var proc= new bd.test.proc({parent:"nonsense"});
    }).raises();

    //an attempt to explicitly set id is ignored
    proc= new bd.test.proc({id:123});
    the(proc.id).isNot(123);
    the(bd.test.proc.map[123]).isNot(proc);
    the(bd.test.proc.map[proc.id]).is(proc);

    //the constructor can take a single string object; if the string has no spaces it's interpretted as a name; otherwise, it's interpretted as a doc
    proc= new bd.test.proc("a.b.c");
    the(proc.name).is("a.b.c");
    the(proc.doc).is("");
    proc= new bd.test.proc("this is a test");
    the(proc.name).is("");
    the(proc.doc).is("this is a test");

    //like all JavaScript objects, properties can be edited directly
    proc.name= "myName";
    the(proc.name).is("myName");
    //any property can be manipulated like this; including id, which is a very bad idea...
    the(bd.test.proc.map[proc.id]).is(proc);
    var hold= proc.id;
    proc.id= 123;
    the(bd.test.proc.map[proc.id]).isNot(proc);
    //restore this so the other tests work
    proc.id= hold;
  }),

  theMember("name", see("bd.test.proc.Demonstration")),

  theMember("parent",
    see("bd.test.proc.Demonstration"),
    see("bd.test.proc.setParentOfChildren")
  ),

  theMember("children",
    see("bd.test.proc.Demonstration"),
    see("bd.test.proc.setParentOfChildren"),
    demo("Inserting an object into the children collection does not set the object's parent property", function() {
      //create parent and child objects to play with...
      var
        parent= new bd.test.proc(),
        child= new bd.test.proc();
      the(parent.children).isEmpty();
      the(child.parent).is(null);

      //add the child to the parent's children collection...
      parent.children.push(child);

      //see that it's there, but the child doesn't know about the parent...
      the(parent.children.length).is(1);
      the(parent.children[0]).is(child);
      the(child.parent).is(null);

      //use setParentOfChildren to fix this...
      parent.setParentOfChildren();

      //now, everything is consistent
      the(parent.children.length).is(1);
      the(parent.children[0]).is(child);
      the(child.parent).is(parent);
    })
  ),

  theMember("id", see("bd.test.proc.Demonstration")),

  theMember("constructor", see("bd.test.proc.Demonstration")),

  theMember("setParentOfChildren",
    note(// Parents of children are not automatically set because the property children is a JavaScript Array.
         // Ensuring parents were set requires a subclass of array that overrides push, shift, and splice to
         // also set the parent. Unfortunately, subclassing Array properly is impossible in JavaScript.
    ),
    demo("After any number of children (with any values contained in their parent property) are added through various array editing functions, setParentOfChildren ensures all added children have their parent property reference the parent.", function() {
      var
        parent= new bd.test.proc(),
        child= new bd.test.proc(),
        bunchOKids= [new bd.test.proc(), new bd.test.proc(), new bd.test.proc()];
      parent.children.push(child);
      parent.children= parent.children.concat(bunchOKids);
      parent.setParentOfChildren();
      dojo.forEach(parent.children, function(child) {
        the(child.parent).is(parent);
      });
    })
  ),

  theMember("traverse", see("Execution Algorithm")),
  theMember("traverseIn", see("Execution Algorithm")),
  theMember("traverseOut", see("Execution Algorithm")),
  theMember("exec", see("Execution Algorithm")),
  theMember("unexec", see("Execution Algorithm")),

  describe("map", demo(function() {
    var proc;

    proc= new bd.test.proc("some proc");
    the(bd.test.proc.map[proc.id]).is(proc);

    proc= new bd.test.proc.module("some module");
    the(bd.test.proc.map[proc.id]).is(proc);

    proc= new bd.test.proc.description("some description");
    the(bd.test.proc.map[proc.id]).is(proc);

    proc= new bd.test.proc.demo("some demo");
    the(bd.test.proc.map[proc.id]).is(proc);

    var fail= false;
    for (var i= 1, end= bd.test.proc.map.length; i<end; i++) {
      //bd.test.proc.map[i] can be null if the associated proc object was bd.test.proc.destroy()'d
      if (bd.test.proc.map[i] && bd.test.proc.map[i].id != i) {
        fail= true;
      }
    }
    the(fail).is(false);
  })),

  describe("root", demo(function() {
    the(bd.test.proc.root).isInstanceOf(bd.test.proc);
    the(bd.test.proc.root.parent).is(null);
    var
      name= bd.uid(),
      module= bd.test.proc.get(name + "/A/B/C");
    the(module.parent).is(bd.test.proc.get(name + "/A/B"));
    the(module.parent.parent).is(bd.test.proc.get(name + "/A"));
    the(module.parent.parent.parent).is(bd.test.proc.get(name));
    the(module.parent.parent.parent.parent).is(bd.test.proc.root);
    the(module.parent.parent.parent.parent.parent).is(null);
    bd.findFirst(bd.test.proc.root.children, module, function(item, collection, i) {
      collection.splice(i, 1);
    });
  })),

  describe("scaffold",
    userDemo(function() {
      //bd.test.scaffold is a dojo.declare'd class
      var s= new bd.test.scaffold();
      the(s).isDojoDeclared();

      //the execType argument should be "once" or "each", but whatever is provided is pressed into the execType slot...
      s= new bd.test.scaffold("before");
      the(s.execType).is("before");
      s= new bd.test.scaffold("after");
      the(s.execType).is("after");
      s= new bd.test.scaffold("nonsense");
      the(s.execType).is("nonsense");

      //the before and after arguments must be functions; otherwise, they are ignored...
      var
        f= function(){},
        g= function(){};
      s= new bd.test.scaffold("once", f, g);
      the(s.before).is(f);
      the(s.after).is(g);

      //not providing functions results in not defining before and after...
      s= new bd.test.scaffold("once");
      the(s.before).is(undefined);
      the(s.after).is(undefined);

      //providing non-functions results in not defining before and after...
      s= new bd.test.scaffold("once", 1, 2, "buckle my shoe");
      the(s.before).is(undefined);
      the(s.after).is(undefined);

      //providing a non-function for before and a function for after is how you define an after without a before
      //typically, null, false, or 0 is used...
      s= new bd.test.scaffold("once", null, f);
      the(s.before).is(undefined);
      the(s.after).is(f);

      s= new bd.test.scaffold("once", false, f);
      the(s.before).is(undefined);
      the(s.after).is(f);

      s= new bd.test.scaffold("once", 0, f);
      the(s.before).is(undefined);
      the(s.after).is(f);
    }),
    theMember("exec", see("bd.test.proc.scaffold.Demonstration")),
    theMember("before", see("bd.test.proc.scaffold.Demonstration")),
    theMember("after", see("bd.test.proc.scaffold.Demonstration")),
    theMember("constructor", see("bd.test.proc.scaffold.Demonstration"))
  ),

  describe("module",
    userDemo(function() {
      //bd.test.proc.module is a dojo.declare'd class
      var m= new bd.test.proc.module("myModule");
      the(m).isDojoDeclared();

      //it is a subclass of bd.test.proc
      the(m).isInstanceOf(bd.test.proc);

      //doc, parent, children, and id work just like bd.test.proc
      //if name is not given, it is initialized to the string value of the id slot
      //the slot loadedVersion is initialized to zero

      //the default (name, doc, parent, children) property values are ("", "", null, [])
      m= new bd.test.proc.module();
      the(m.name).is("");
      the(m.doc).is("");
      the(m.parent).is(null);
      the(m.children).hasValue([]);
      the(m.loadedVersion).is(0);

      //the object is referenced in bd.test.proc.map such that bd.test.proc.map[proc.id]===proc
      the(bd.test.proc.map[m.id]).is(m);

      //the name, doc, parent, children, and other, user-specified properties can be set by passing createArgs to the constructor
      //with the exception of the parent and id properties, no checking is done to see that these values are meaningful
      var parent= new bd.test.proc.module();
      m= new bd.test.proc.module({name:"myModule", doc:"myDoc", parent:parent, children:["this", "is", "nonsense"], someProperty:"someValue"});
      the(m.name).is("myModule");
      the(m.doc).is("myDoc");
      the(m.parent).is(parent);
      the(m.children).hasValue(["this", "is", "nonsense"]);
      the(m.someProperty).is("someValue");
      the(m.loadedVersion).is(0);

      //a non-null parent must be a proc object since the constructor inserts the new object in the parent's children collection
      the(function() {
        var m= new bd.test.proc.module({parent:"nonsense"});
      }).raises();

      //an attempt to explicitly set id is ignored
      m= new bd.test.proc.module({id:123});
      the(m.id).isNot(123);
      the(bd.test.proc.map[123]).isNot(m);
      the(bd.test.proc.map[m.id]).is(m);

      //the constructor args argument can also be a single string object; if the string has no spaces it's interpretted as a name; otherwise, it's interpretted as a doc
      m= new bd.test.proc.module("a.b.c");
      the(m.name).is("a.b.c");
      the(m.doc).is("");
      m= new bd.test.proc.module("this is a test");
      the(m.name).is("");
      the(m.doc).is("this is a test");

      //like all JavaScript objects, properties can be edited directly
      m.name= "myName";
      the(m.name).is("myName");
      //any property can be manipulated like this; including id, which is a very bad idea...
      the(bd.test.proc.map[m.id]).is(m);
      var hold= m.id;
      m.id= 123;
      the(bd.test.proc.map[m.id]).isNot(m);
      //restore this so the other tests work
      m.id= hold;

      //after the constructor args argument (either a createArgs or a string), zero to many additional arguments (non-arrays or arrays) can be given;
      //these are pushed into the children collection of the new module object; the parent property of these objects is also set
      //notice that the actual type of these objects is not inspected--they are blindly inserted into the child collection
      var a= {}, b= {}, c= {};
      m= new bd.test.proc.module("myModule", a);
      the(m.children.length).is(1);
      the(m.children[0]).is(a);
      the(a.parent).is(m);

      m= new bd.test.proc.module("myModule", a, b);
      the(m.children.length).is(2);
      the(m.children[0]).is(a);
      the(m.children[1]).is(b);
      the(a.parent).is(m);
      the(b.parent).is(m);

      m= new bd.test.proc.module("myModule", [a, b], c);
      the(m.children.length).is(3);
      the(m.children[0]).is(a);
      the(m.children[1]).is(b);
      the(m.children[2]).is(c);
      the(a.parent).is(m);
      the(b.parent).is(m);
      the(c.parent).is(m);
    }),

    theMember("name",
      see("bd.test.proc.name"),
      note(// The name slot must be non-empty and the full name as calculated by the member function
           // getFullName() must give a module name that can be resolved to a URL by dojo.moduleUrl()
           // in order for the default load/reload functionality to work.
      )
    ),

    theMember("parent", see("bd.test.proc.name")),

    theMember("children", see("bd.test.proc.children")),

    theMember("id", see("bd.test.proc.id")),

    theMember("constructor",
      see("bd.test.proc.module.Demonstration"),
      argument("children", demo(function() {
        var a= {}, b= {}, c= {}, y= {}, z= {}, m;

        m= new bd.test.proc.module("myModule", a);
        the(m.children.length).is(1);
        the(m.children[0]).is(a);
        m= new bd.test.proc.module("myModule", a, b);
        the(m.children.length).is(2);
        the(m.children[0]).is(a);
        the(m.children[1]).is(b);
        m= new bd.test.proc.module("myModule", a, b, c);
        the(m.children.length).is(3);
        the(m.children[0]).is(a);
        the(m.children[1]).is(b);
        the(m.children[2]).is(c);

        m= new bd.test.proc.module("myModule", []);
        the(m.children.length).is(0);
        m= new bd.test.proc.module("myModule", [a]);
        the(m.children.length).is(1);
        the(m.children[0]).is(a);
        m= new bd.test.proc.module("myModule", [a, b]);
        the(m.children.length).is(2);
        the(m.children[0]).is(a);
        the(m.children[1]).is(b);
        m= new bd.test.proc.module("myModule", [a, b, c]);
        the(m.children.length).is(3);
        the(m.children[0]).is(a);
        the(m.children[1]).is(b);
        the(m.children[2]).is(c);

        m= new bd.test.proc.module("myModule", y, [], z);
        the(m.children.length).is(2);
        the(m.children[0]).is(y);
        the(m.children[1]).is(z);
        m= new bd.test.proc.module("myModule", y, [a], z);
        the(m.children.length).is(3);
        the(m.children[0]).is(y);
        the(m.children[1]).is(a);
        the(m.children[2]).is(z);

        m= new bd.test.proc.module("myModule", [a], b, [c]);
        the(m.children.length).is(3);
        the(m.children[0]).is(a);
        the(m.children[1]).is(b);
        the(m.children[2]).is(c);
      }))
    ),

    theMember("setParentOfChildren", see("bd.test.proc.setParentOfChildren")),

    theMember("loadedVersion", see("bd.test.proc.module.load")),

    theMember("getFullName", demo(function() {
      var
        a= new bd.test.proc.module({name:"a", parent:null}),
        b= new bd.test.proc.module({name:"b", parent:a}),
        c= new bd.test.proc.module({name:"c", parent:b});

      the(a.getFullName()).is("a");
      the(b.getFullName()).is("a/b");
      the(c.getFullName()).is("a/b/c");

      bd.test.proc.root.children.push(a);
      bd.test.proc.root.setParentOfChildren();

      the(a.getFullName()).is("a");
      the(b.getFullName()).is("a/b");
      the(c.getFullName()).is("a/b/c");

      bd.findFirst(bd.test.proc.root.children, a, function(item, i, collection) {
        collection.splice(i, 1);
      });
    })),

    describe("load",
      demo("Basic operation.", function() {
        //run the demonstration with the real unit.bd.test.result module; remember the children and doc string
        var
          module= bd.test.proc.get("bd-unit/test/result"),
          children= module.children,
          doc= module.doc;

        //make the module look like it hasn't been loaded...
        module.loadedVersion= 0;
        module.children= [];

        //load it
        module.load();
        the(module.children.length).is(children.length);
        the(module.loadedVersion).is(bd.test.loader.version);
      }),

      demo("Test: preserves any module children; deletes any non-module children before setting the children consequent to reloading the JavaScript resource associated with the module.", function() {
        function childExists(parent, child) {
          return bd.findFirst(parent.children, child, function(){ return true; });
        }
        //run the demonstration with the real unit.bd.test.result module; remember the children and doc string
        var
          module= bd.test.proc.get("bd-unit/test/result"),
          loadedVersion= module.loadedVersion,
          children= module.children,
          doc= module.doc;

        //make the module look like it hasn't been loaded; add a fake child module and child non-module
        var
          someModule= new bd.test.proc.module("someModule"),
          someChild= new bd.test.proc.description("someDescription");
        module.loadedVersion= 0;
        module.children= [someModule, someChild];
        module.doc= "result";

        //prove the fakes...
        the(childExists(module, someModule)).is(true);
        the(childExists(module, someChild)).is(true);

        //load it
        module.load();

        //the module child is still there; the non-module child is not...
        the(childExists(module, someModule)).is(true);
        the(childExists(module, someChild)).is(bd.notFound);

        //restore the real module...
        module.doc= doc;
        module.children= children;
        module.loadedVersion= loadedVersion;
      })
    ),

    describe("reload",
      demo("Test: flushes the bd.test.loader cache and then calls load on the instance.", function() {
        var
          version= bd.test.loader.version,
          loadCalled= false,
          module= bd.test.proc.get("bd-unit/test/result"),
          handle= dojo.connect(module, "load", function() {
            loadCalled= true;
          });

        module.reload();
        the(loadCalled).is(true);
        the(bd.test.loader.version).is(version+1);
        dojo.disconnect(handle);
      })
    ),

    describe("set",
      demo("Preserves all module children and deletes all non-module children.", function() {
        var
          module= new bd.test.proc.module("myModule"),
          someModule= new bd.test.proc.module("someModule"),
          someChild= new bd.test.proc.description("someDescription");
        module.children= [someModule, someChild];
        module.set();
        the(module.children).hasValue([someModule]);
      }),
      demo(//("some doc string") sets the doc property to "some doc string".
        function() {
          var module= new bd.test.proc.module("myModule");
          module.set("some doc string");
          the(module.doc).hasValue("some doc string");
      }),
      demo(//("some doc string", a, b), a and b some bd.test.proc-like objects sets the doc property to "some doc string" and pushes a and b into the children property.
        function() {
          var
            module= new bd.test.proc.module("myModule"),
            someModule= new bd.test.proc.module("someModule"),
            someChild= new bd.test.proc.description("someDescription");
          module.set("some doc string", someModule, someChild);
          the(module.doc).hasValue("some doc string");
          the(module.children).hasValue([someModule, someChild]);
      }),
      demo(//("some doc string", [a, b]), a and b some bd.test.proc-like objects sets the doc property to "some doc string" and pushes a and b into the children property.
        function() {
          var
            module= new bd.test.proc.module("myModule"),
            someModule= new bd.test.proc.module("someModule"),
            someChild= new bd.test.proc.description("someDescription");
          module.set("some doc string", [someModule, someChild]);
          the(module.doc).hasValue("some doc string");
          the(module.children).hasValue([someModule, someChild]);
      }),
      demo(//(a, b), a and b some bd.test.proc-like objects pushes a and b into the children property.
        function() {
          var
            module= new bd.test.proc.module("myModule"),
            someModule= new bd.test.proc.module("someModule"),
            someChild= new bd.test.proc.description("someDescription");
          module.set([someModule, someChild]);
          the(module.children).hasValue([someModule, someChild]);
      }),
      demo(//([a, b]), a and b some bd.test.proc-like objects pushes a and b into the children property.
        function() {
          var
            module= new bd.test.proc.module("myModule"),
            someModule= new bd.test.proc.module("someModule"),
            someChild= new bd.test.proc.description("someDescription");
          module.set([someModule, someChild]);
          the(module.children).hasValue([someModule, someChild]);
      }),
      demo(//The children arguments can be any number of single objects and/or arrays of objects.
        function() {
          var
            module= new bd.test.proc.module("myModule"),
            a= new bd.test.proc.description("a"),
            b= new bd.test.proc.description("b"),
            c= new bd.test.proc.description("c"),
            d= new bd.test.proc.description("d");
          module.children= [];
          module.set("some doc string", a, b, c, d);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", [a], b, c, d);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", a, [b], c, d);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", a, b, [c], d);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", a, b, c, [d]);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", [a, b], c, d);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", a, [b, c], d);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", a, b, [c, d]);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", [a, b, c], d);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", a, [b, c, d]);
          the(module.children).hasValue([a, b, c, d]);
          module.children= [];
          module.set("some doc string", [a, b, c, d]);
          the(module.children).hasValue([a, b, c, d]);
      })
    ),

    describe("get",
      demo("() return bd.test.proc.root", function() {
        the(bd.test.proc.get()).is(bd.test.proc.root);
      }),
      demo(//("a0.a1. ... .an-1.an") returns the module named "an" with parent "an-1" with parent ... with parent "a1" with parent "a0"
        function() {
          function traverse(module) {
            if (!(module instanceof bd.test.proc.module)) {
              return;
            }
            the(module).is(bd.test.proc.get(module.getFullName()));
            for (var i= 0, end= module.children.length; i<end; i++) {
              traverse(module.children[i]);
            }
          }
          traverse(bd.test.proc.root);
        }
      ),
      demo(//("a0.a1. ... .an-1.an") automatically creates the portion of the path that does not exist
        function() {
          var
            name= bd.uid(),
            module= bd.test.proc.get(name + "/A/B/C");
          the(module.parent).is(bd.test.proc.get(name + "/A/B"));
          the(module.parent.parent).is(bd.test.proc.get(name + "/A"));
          the(module.parent.parent.parent).is(bd.test.proc.get(name));
          the(module.parent.parent.parent.parent).is(bd.test.proc.root);
          the(module.parent.parent.parent.parent.parent).is(null);
          bd.findFirst(bd.test.proc.root.children, bd.test.proc.get(name), function(item, i, collection) {
            collection.splice(i, 1);
          });
      })
    ),
    theMember("traverseIn", see("Execution Algorithm")),
    theMember("traverseOut", see("Execution Algorithm")),
    theMember("exec", see("Execution Algorithm")),
    theMember("unexec", see("Execution Algorithm"))
  ),

  describe("description",
    userDemo(function() {
      //bd.test.proc.description is a dojo.declare'd class
      var test= new bd.test.proc.description("myDescription");
      the(test).isDojoDeclared();

      //it is a subclass of bd.test.proc
      the(test).isInstanceOf(bd.test.proc);

      //doc, parent, children, and id work just like bd.test.proc
      //if name is not given, it is initialized to the string value of the id slot

      //the default (name, doc, parent, children) property values are ("", "", null, [])
      test= new bd.test.proc.description();
      the(test.name).is("");
      the(test.doc).is("");
      the(test.parent).is(null);
      the(test.children).hasValue([]);

      //the object is referenced in bd.test.proc.map such that bd.test.proc.map[proc.id]===proc
      the(bd.test.proc.map[test.id]).is(test);

      //the name, doc, parent, children, and other, user-specified properties can be set by passing createArgs to the constructor
      //with the exception of the parent and id properties, no checking is done to see that these values are meaningful
      var parent= new bd.test.proc.description();
      test= new bd.test.proc.description({name:"myDescription", doc:"myDoc", parent:parent, children:["this", "is", "nonsense"], someProperty:"someValue"});
      the(test.name).is("myDescription");
      the(test.doc).is("myDoc");
      the(test.parent).is(parent);
      the(test.children).hasValue(["this", "is", "nonsense"]);
      the(test.someProperty).is("someValue");

      //a non-null parent must be a proc object since the constructor inserts the new object in the parent's children collection
      the(function() {
        var test= new bd.test.proc.description({parent:"nonsense"});
      }).raises();

      //an attempt to explicitly set id is ignored
      test= new bd.test.proc.description({id:123});
      the(test.id).isNot(123);
      the(bd.test.proc.map[123]).isNot(test);
      the(bd.test.proc.map[test.id]).is(test);

      //the constructor args argument can also be a single string object; if the string has no spaces it's interpretted as a name; otherwise, it's interpretted as a doc
      test= new bd.test.proc.description("a/b/c");
      the(test.name).is("a/b/c");
      the(test.doc).is("");
      test= new bd.test.proc.description("this is a test");
      the(test.name).is("");
      the(test.doc).is("this is a test");

      //like all JavaScript objects, properties can be edited directly
      test.name= "myName";
      the(test.name).is("myName");
      //any property can be manipulated like this; including id, which is a very bad idea...
      the(bd.test.proc.map[test.id]).is(test);
      var hold= test.id;
      test.id= 123;
      the(bd.test.proc.map[test.id]).isNot(test);
      //restore this so the other tests work
      test.id= hold;

      //after the constructor args argument (either a createArgs or a string), zero to many additional arguments (non-arrays or arrays) can be given;
      //these are pushed into the children collection of the new module object; the parent property of these objects is also set
      //notice that the actual type of these objects is not inspected--they are blindly inserted into the child collection
      var a= {}, b= {}, c= {};
      test= new bd.test.proc.description("myDescription", a);
      the(test.children.length).is(1);
      the(test.children[0]).is(a);
      the(a.parent).is(test);

      test= new bd.test.proc.description("myDescription", a, b);
      the(test.children.length).is(2);
      the(test.children[0]).is(a);
      the(test.children[1]).is(b);
      the(a.parent).is(test);
      the(b.parent).is(test);

      test= new bd.test.proc.description("myDescription", [a, b], c);
      the(test.children.length).is(3);
      the(test.children[0]).is(a);
      the(test.children[1]).is(b);
      the(test.children[2]).is(c);
      the(a.parent).is(test);
      the(b.parent).is(test);
      the(c.parent).is(test);
    }),

    theMember("constructor",
      see("bd.test.proc.description.Demonstration"),
      demo(// (<createArgs | string>, [...]), [...] any combination of any number of bd.test.proc-like objects or arrays of bd.test.proc-like objects
           // creates an object with children==[...] flattened into an single, non-nested array, scaffold initialized to {}, and all other properties
           // initialized as given by <createArgs | string>. The parent of all children is set to the new object.
        function() {
          var
            description,
            a= new bd.test.proc.description("a"),
            b= new bd.test.proc.description("b"),
            c= new bd.test.proc.description("c"),
            d= new bd.test.proc.description("d");

          function test1() {
            the(description.doc).hasValue("some doc string");
            the(description.children).hasValue([a, b, c, d]);
            the(description.scaffold).hasValue({});
            a.parent= description;
            b.parent= description;
            c.parent= description;
            d.parent= description;
            a.parent= 0;
            b.parent= 0;
            c.parent= 0;
            d.parent= 0;
          }

          description= new bd.test.proc.description("some doc string", a, b, c, d);
          test1();

          description= new bd.test.proc.description("some doc string", [a], b, c, d);
          test1();

          description= new bd.test.proc.description("some doc string", a, [b], c, d);
          test1();

          description= new bd.test.proc.description("some doc string", a, b, [c], d);
          test1();

          description= new bd.test.proc.description("some doc string", a, b, c, [d]);
          test1();

          description= new bd.test.proc.description("some doc string", [a, b], c, d);
          test1();

          description= new bd.test.proc.description("some doc string", a, [b, c], d);
          test1();

          description= new bd.test.proc.description("some doc string", a, b, [c, d]);
          test1();

          description= new bd.test.proc.description("some doc string", [a, b, c], d);
          test1();

          description= new bd.test.proc.description("some doc string", a, [b, c, d]);
          test1();

          description= new bd.test.proc.description("some doc string", [a, b, c, d]);
          test1();


          function test2() {
            the(description.name).hasValue("myDescription");
            the(description.doc).hasValue("some doc string");
            the(description.scaffold).hasValue({});
            the(description.children).hasValue([a, b, c, d]);
            a.parent= description;
            b.parent= description;
            c.parent= description;
            d.parent= description;
            a.parent= 0;
            b.parent= 0;
            c.parent= 0;
            d.parent= 0;
          }

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, a, b, c, d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, [a], b, c, d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, a, [b], c, d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, a, b, [c], d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, a, b, c, [d]);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, [a, b], c, d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, a, [b, c], d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, a, b, [c, d]);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, [a, b, c], d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, a, [b, c, d]);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, [a, b, c, d]);
          test2();
      }),

      demo(// (<createArgs | string>, s, [...]), s a scaffold, [...] any combination of any number of bd.test.proc-like objects or arrays of bd.test.proc-like objects
           // creates an object with children==[...] flattened into an single, non-nested array, scaffold initialized to s, and all other properties
           // initialized as given by <createArgs | string>. The parent of all children is set to the new object.
        function() {
          var
            description,
            s= new bd.test.proc.scaffold("once", function(){}, null),
            a= new bd.test.proc.description("a"),
            b= new bd.test.proc.description("b"),
            c= new bd.test.proc.description("c"),
            d= new bd.test.proc.description("d");

          function test1() {
            the(description.doc).hasValue("some doc string");
            the(description.scaffold).is(s);
            the(description.children).hasValue([a, b, c, d]);
            a.parent= description;
            b.parent= description;
            c.parent= description;
            d.parent= description;
            a.parent= 0;
            b.parent= 0;
            c.parent= 0;
            d.parent= 0;
          }

          description= new bd.test.proc.description("some doc string", s, a, b, c, d);
          test1();

          description= new bd.test.proc.description("some doc string", s, [a], b, c, d);
          test1();

          description= new bd.test.proc.description("some doc string", s, a, [b], c, d);
          test1();

          description= new bd.test.proc.description("some doc string", s, a, b, [c], d);
          test1();

          description= new bd.test.proc.description("some doc string", s, a, b, c, [d]);
          test1();

          description= new bd.test.proc.description("some doc string", s, [a, b], c, d);
          test1();

          description= new bd.test.proc.description("some doc string", s, a, [b, c], d);
          test1();

          description= new bd.test.proc.description("some doc string", s, a, b, [c, d]);
          test1();

          description= new bd.test.proc.description("some doc string", s, [a, b, c], d);
          test1();

          description= new bd.test.proc.description("some doc string", s, a, [b, c, d]);
          test1();

          description= new bd.test.proc.description("some doc string", s, [a, b, c, d]);
          test1();


          function test2() {
            the(description.name).hasValue("myDescription");
            the(description.doc).hasValue("some doc string");
            the(description.scaffold).is(s);
            the(description.children).hasValue([a, b, c, d]);
            a.parent= description;
            b.parent= description;
            c.parent= description;
            d.parent= description;
            a.parent= 0;
            b.parent= 0;
            c.parent= 0;
            d.parent= 0;
          }

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, a, b, c, d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, [a], b, c, d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, a, [b], c, d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, a, b, [c], d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, a, b, c, [d]);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, [a, b], c, d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, a, [b, c], d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, a, b, [c, d]);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, [a, b, c], d);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, a, [b, c, d]);
          test2();

          description= new bd.test.proc.description({name:"myDescription", doc:"some doc string"}, s, [a, b, c, d]);
          test2();
      })
    ),
    theMember("traverseIn", see("Execution Algorithm")),
    theMember("traverseOut", see("Execution Algorithm")),
    theMember("exec", see("Execution Algorithm")),
    theMember("unexec", see("Execution Algorithm"))
  ),

  describe("demo",
    userDemo(function() {
      //bd.test.proc.demo is a dojo.declare'd class
      var
        program= function(space) {
          //this the function that executes the tests associated with the demo object...
        },
        test= new bd.test.proc.demo("myDemo", program);
      the(test).isDojoDeclared();

      //it is a subclass of bd.test.proc
      the(test).isInstanceOf(bd.test.proc);

      //doc, parent, children, and id work just like bd.test.proc
      //if name is not given, it is initialized to the string value of the id slot

      //the default (name, doc, parent, children) property values are (bd.test.proc.demo.defaultName, "", null, [])
      test= new bd.test.proc.demo();
      the(test.name).is(bd.test.proc.demo.defaultName);
      the(test.doc).is("");
      the(test.parent).is(null);
      the(test.children).hasValue([]);

      //if just a program is given, then the defaults are used for the other properties...
      test= new bd.test.proc.demo(program);
      //just last the default constructor for these properties...
      the(test.name).is(bd.test.proc.demo.defaultName);
      the(test.doc).is("");
      the(test.parent).is(null);
      the(test.children).hasValue([]);
      //but now we have a program...
      the(test.program).is(program);


      //the object is referenced in bd.test.proc.map such that bd.test.proc.map[proc.id]===proc
      the(bd.test.proc.map[test.id]).is(test);

      //the name, doc, parent, and other, user-specified properties can be set by passing createArgs to the constructor
      //with the exception of the parent and id properties, no checking is done to see that these values are meaningful
      var parent= new bd.test.proc.demo();
      test= new bd.test.proc.demo({name:"myDemo", doc:"myDoc", parent:parent, someProperty:"someValue"}, program);
      the(test.name).is("myDemo");
      the(test.doc).is("myDoc");
      the(test.parent).is(parent);
      the(test.someProperty).is("someValue");
      the(test.program).is(program);


      //a non-null parent must be a proc object since the constructor inserts the new object in the parent's children collection
      the(function() {
        var test= new bd.test.proc.demo({parent:"nonsense"}, program);
      }).raises();

      //an attempt to explicitly set id is ignored
      test= new bd.test.proc.demo({id:123}, program);
      the(test.id).isNot(123);
      the(bd.test.proc.map[123]).isNot(test);
      the(bd.test.proc.map[test.id]).is(test);

      //the constructor args argument can also be a single string object; if the string has no spaces it's interpretted as a name; otherwise, it's interpretted as a doc
      test= new bd.test.proc.demo("a/b/c", program);
      the(test.name).is("a/b/c");
      the(test.doc).is("");
      test= new bd.test.proc.demo("this is a test", program);
      the(test.name).is("");
      the(test.doc).is("this is a test");

      //like all JavaScript objects, properties can be edited directly
      test.name= "myName";
      the(test.name).is("myName");
      //any property can be manipulated like this; including id, which is a very bad idea...
      the(bd.test.proc.map[test.id]).is(test);
      var hold= test.id;
      test.id= 123;
      the(bd.test.proc.map[test.id]).isNot(test);
      //restore this so the other tests work
      test.id= hold;
    }),
    theMember("traverseIn", see("Execution Algorithm")),
    theMember("traverseOut", see("Execution Algorithm")),
    theMember("exec", see("Execution Algorithm")),
    theMember("unexec", see("Execution Algorithm"))
  ),

  testExec
);
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
