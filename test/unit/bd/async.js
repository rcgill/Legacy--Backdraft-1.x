define(["dojo", "bd", "bd/async"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/async",
  theFunction("[bd.asynch.schedule]",
      demo(//[("last", f)]
        function(space) {
        // here's the function to delay execute...
        var executed= false;
        function f() {
          executed= true;
        }

        // schedule it...
        bd.async.schedule("last", f);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (executed) {
            the(executed).is(true);
            return true;
          } else {
            return false;
          }
        });
      }),

      demo(//[("last", "f", o)]
        function(space) {
        // here's the function to delay execute...
        var executed= false;
        var o= {
          f: function(){
            executed= true;
          }
        };

        // schedule it...
        bd.async.schedule("last", "f", o);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (executed) {
            the(executed).is(true);
            return true;
          } else {
            return false;
          }
        });
      }),

      demo(//[("last", f, o)]
        function(space) {
        // here's the function to delay execute...
        var executed= false;
        var o= {
          f: function(){
            executed= true;
          }
        };

        // schedule it...
        bd.async.schedule("last", o.f, o);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (executed) {
            the(executed).is(true);
            return true;
          } else {
            return false;
          }
        });
      }),

      demo(//[("last", "fName", 0)]
        function(space) {
        // here's the function to delay execute...
        var
          executed= false,
          fName= bd.uid();
        dojo.setObject(fName, function(){
          executed= true;
        });
        // schedule it...
        bd.async.schedule("last", fName, 0);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (executed) {
            the(executed).is(true);
            delete bd.global[fName];
            return true;
          } else {
            return false;
          }
        });
      }),

      demo(//[("last", f, o, <vargs>)]
        function(space) {
        // here's the function to delay execute...
        var
          executed= false,
          o= {};
        function f(space, a, b, c) {
          executed= true;
          bd.test.activeSpace= space;
          the(a).is(1);
          the(b).is("hello");
          the(c).is(o);
        }

        // schedule it...
        bd.async.schedule("last", f, o, space, 1, "hello", o);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (executed) {
            the(executed).is(true);
            return true;
          } else {
            return false;
          }
        });
      }),

      demo(//[("last", "f", o, <vargs>)]
        function(space) {
        // here's the function to delay execute...
        var
          executed= false,
          o= {
            f: function(space, a, b, c) {
              executed= true;
              bd.test.activeSpace= space;
              the(a).is(1);
              the(b).is("hello");
              the(c).is(o);
            }
          };

        // schedule it...
        bd.async.schedule("last", "f", o, space, 1, "hello", o);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (executed) {
            the(executed).is(true);
            return true;
          } else {
            return false;
          }
        });
      }),

      demo(//[("last", o.f o,  <vargs>)]
        function(space) {
        // here's the function to delay execute...
        var
          executed= false,
          o= {
            f: function(space, a, b, c) {
              executed= true;
              bd.test.activeSpace= space;
              the(a).is(1);
              the(b).is("hello");
              the(c).is(o);
            }
          };

        // schedule it...
        bd.async.schedule("last", o.f, o, space, 1, "hello", o);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (executed) {
            the(executed).is(true);
            return true;
          } else {
            return false;
          }
        });
      }),

      demo(//[("last", "fName", 0,  <vargs>)]
        function(space) {
        // here's the function to delay execute...
        var
          executed= false,
          fName= bd.uid(),
          o= {};
        dojo.setObject(fName, function (space, a, b, c) {
          executed= true;
          bd.test.activeSpace= space;
          the(a).is(1);
          the(b).is("hello");
          the(c).is(o);
        });

        // schedule it...
        bd.async.schedule("last", fName, 0, space, 1, "hello", o);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (executed) {
            the(executed).is(true);
            delete bd.global[fName];
            return true;
          } else {
            return false;
          }
        });
      }),

      demo("[default-scheduling] By default, schedule executes functions in the order they are provided.", function(space) {
        // some functions to delay execute...
        var
          fExecuted= false,
          gExecuted= false,
          f= function(space) {
            fExecuted= true;
            bd.test.activeSpace= space;
            the(gExecuted).is(false);
          },
          g= function(space) {
            gExecuted= true;
            bd.test.activeSpace= space;
            the(fExecuted).is(true);
          };

        // schedule it...
        bd.async.schedule("last", f, 0, space);
        bd.async.schedule("last", g, 0, space);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (gExecuted) {
            the(gExecuted).is(true);
            return true;
          } else {
            return false;
          }
        });
      }),

      demo("[default-scheduling-repeat] By default, repeat scheduling of the same function moves it to the back of the queue (it only executes once).", function(space) {
        // some functions to delay execute...
        var
          fExecuted= false,
          gExecuted= false,
          fCount= 0,
          gCount= 0,
          f= function(space) {
            fExecuted= true;
            fCount++;
            bd.test.activeSpace= space;
            the(gExecuted).is(false);
          },
          g= function(space) {
            gExecuted= true;
            gCount++;
            bd.test.activeSpace= space;
            the(fExecuted).is(true);
          };

        // schedule it...
        bd.async.schedule("last", g, 0, space);
        bd.async.schedule("last", g, 0, space);
        bd.async.schedule("last", f, 0, space);
        bd.async.schedule("last", f, 0, space);
        bd.async.schedule("last", g, 0, space);
        bd.async.schedule("last", g, 0, space);
        bd.async.schedule("last", f, 0, space);
        bd.async.schedule("last", f, 0, space);
        bd.async.schedule("last", g, 0, space);
        bd.async.schedule("last", g, 0, space);

        // watch it...
        return space.watch(5, bd.async.delay * 2, function() {
          if (gExecuted) {
            the(fCount==1).is(true);
            the(gCount==1).is(true);
            the(gExecuted).is(true);
            return true;
          } else {
            return false;
          }
        });
      }),

      describe("[last] Providing the flag last causes previously scheduled occurences to be removed; only the last scheduled occurence is executed; this is the same as the default behavior.",
        demo("[homogeneous] last works with multiple attempts to schedule the same function.", function(space) {
          // some functions to delay execute...
          var
            gExecuted= false,
            gCount= 0,
            g= function(space) {
              gCount++;
              gExecuted= true;
              bd.test.activeSpace= space;
            };

          // schedule it...
          bd.async.schedule("last", g);          //g along, null context implied
          bd.async.schedule("last", g, 0);       //is the same as g with context that's the same
          bd.async.schedule("last", g, 0, space);//is the same as g with context that's the same and args

          // watch it...
          return space.watch(5, bd.async.delay * 2, function() {
            if (gExecuted) {
              the(gExecuted).is(true);
              the(gCount===1).is(true);
              return true;
            } else {
              return false;
            }
          });
        }),
        demo("[heterogeneous] last works with multiple attempts to schedule the same function among scheduling of other functions; this is the same as the default behavior.", function(space) {
          // some functions to delay execute...
          var
            fExecuted= false,
            gExecuted= false,
            fCount= 0,
            gCount= 0,
            f= function(space) {
              fCount++;
              fExecuted= true;
              bd.test.activeSpace= space;
              the(gExecuted).is(false);
            },
            g= function(space) {
              gCount++;
              gExecuted= true;
              bd.test.activeSpace= space;
              the(fExecuted).is(true);

            };

          // schedule it...
          bd.async.schedule("last", g, 0, space);
          bd.async.schedule("last", g, 0, space);
          bd.async.schedule("last", f, 0, space);
          bd.async.schedule("last", g, 0, space);
          bd.async.schedule("last", g, 0, space);
          bd.async.schedule("last", g, 0, space);
          bd.async.schedule("last", g, 0, space);
          bd.async.schedule("last", g, 0, space); 

          // watch it...
          return space.watch(5, bd.async.delay * 2, function() {
            if (gExecuted) {
              the(gExecuted).is(true);
              the(fCount===1).is(true);
              the(gCount===1).is(true);
              return true;
            } else {
              return false;
            }
          });
        })
      ),

      describe("[first] Providing the flag first causes subsequently scheduled occurences to be ignored; only the first scheduled occurence is executed.",
        demo("[homogeneous] first works with multiple attempts to schedule the same function.", function(space) {
          // some functions to delay execute...
          var
            gExecuted= false,
            gCount= 0,
            gValue= null,
            g= function(space, value) {
              gCount++;
              gExecuted= true;
              gValue= value;
              bd.test.activeSpace= space;
            };

          // schedule it...
          bd.async.schedule("first", g, 0, space, "OK");
          bd.async.schedule("first", g, 0, space, "NAK");

          // watch it...
          return space.watch(5, bd.async.delay * 2, function() {
            if (gExecuted) {
              the(gExecuted).is(true);
              the(gCount).is(1);
              the(gValue).is("OK");
              return true;
            } else {
              return false;
            }
          });
        }),
        demo("[heterogeneous] first works with multiple attempts to schedule the same function among the scheduling of other functions.", function(space) {
          // some functions to delay execute...
          var
            fExecuted= false,
            gExecuted= false,
            fCount= 0,
            gCount= 0,
            fValue= null,
            f= function(space, value) {
              fExecuted= true;
              fCount++;
              fValue= value;
              bd.test.activeSpace= space;
              the(gExecuted).is(false);
            },
            g= function(space) {
              gExecuted= true;
              gCount++;
              bd.test.activeSpace= space;
              the(fExecuted).is(true);
            };

          // schedule it...
          bd.async.schedule("first", f, 0, space, "OK");
          bd.async.schedule("first", f, 0, space, "NAK");
          bd.async.schedule("first", g, 0, space);
          bd.async.schedule("first", f, 0, space, "NAK");
          bd.async.schedule("first", f, 0, space, "NAK");
          bd.async.schedule("first", f, 0, space, "NAK");

          // watch it...
          return space.watch(5, bd.async.delay * 2, function() {
            if (gExecuted) {
              the(gExecuted).is(true);
              the(fCount).is(1);
              the(fValue).is("OK");
              the(gCount).is(1);
              return true;
            } else {
              return false;
            }
          });
        })
      ),

      demo("[scheduling *] Providing the * flag all causes the scheduled function to be added multiple times.", function(space) {
          // some functions to delay execute...
          var
            done= false,
            result= "",
            f= function(value) {
              result+= ("f" + value);
            },
            g= function(value) {
              if (value===bd.defaultValue) {
                done= true;
              } else {
                result+= ("g" + value);
              }
            };

          // schedule it...
          bd.async.schedule("*", f, 0, 1);
          bd.async.schedule("*", g, 0, 2);
          bd.async.schedule("*", f, 0, 3);
          bd.async.schedule("*", f, 0, 4);
          bd.async.schedule("*", g, 0, 5);
          bd.async.schedule("*", g, 0, 6);
          bd.async.schedule("*", g, 0, 7);
          bd.async.schedule("*", f, 0, 8);
          bd.async.schedule("*", g, 0, bd.defaultValue);

          // watch it...
          return space.watch(5, bd.async.delay * 2, function() {
            if (done) {
              the(result).is("f1g2f3f4g5g6g7f8");
              return true;
            } else {
              return false;
            }
          });
      })

    ),

    describe("[bd.async.delay] Controls the delay in milliseconds.",
      demo("[*] delay is accurate +/-15 when set above 10ms.", function(space) {
        var
          done= false,
          iter= 0,
          start,
          results= [];
        results[10]= 0;
        bd.async.delay= 10;
        function f() {
          results[bd.async.delay]+= (bd.getTime() - start - bd.async.delay);
          if (iter==4) {
            console.log(bd.async.delay, "=", results[bd.async.delay]);
            results[bd.async.delay]/= 5;
            if (bd.async.delay>50) {
              done= true;
            } else {
              iter= 0;
              bd.async.delay+= 5;
              results[bd.async.delay]= 0;
              start= bd.getTime();
              bd.async.schedule("last", f);
            }
          } else {
            iter++;
            start= bd.getTime();
            bd.async.schedule("last", f);
          }
        }
        //the first call
        start= bd.getTime();
        bd.async.schedule("last", f);

        // watch it...
        return space.watch(500, 10000, function() {
          if (done) {
            the(done).is(true);
            var total= 0, count= 0;
            dojo.forEach(results, function(x) {
              if (x) {
                total+= x;
                count++;
              }
            });
            console.log(total/count);
            the(total/count).inRange(-15, 15);
            return true;
          } else {
            return false;
          }
        });
      })
    ),

    describe("the function bd.async.setFocus", todo())
);
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
