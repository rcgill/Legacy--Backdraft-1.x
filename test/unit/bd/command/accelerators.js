define(["bd", "bd/command/accelerators"], function(bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/command/accelerators",
  theFunction("[bd.command.insertMenuAccels]", demo("[*]",
    function() {
      var 
        mockCommandIds= [],
        addMockCommand= function(id, parentId, role) {
          bd.command.addItem({id:"_"+id, parentMenuId:"_"+parentId, role:role, accelKey:id, accelShift:"SCA"});
          mockCommandIds.push(id+"");
        };
      addMockCommand(1000, 0, bd.command.roles.menu);
      addMockCommand(1001, 1000, bd.command.roles.menu);
      addMockCommand(1002, 1001, bd.command.roles.command);
      addMockCommand(1003, 1001, bd.command.roles.command);
      addMockCommand(1004, 1000, bd.command.roles.menu);
      addMockCommand(1005, 1004, bd.command.roles.command);
      addMockCommand(1006, 1004, bd.command.roles.command);

      bd.command.pushAccels();
      bd.command.insertMenuAccels({
        _1000: {
          _1001: {
            _1002:1,
            _1003:1
          },
         _1004: {
            _1005:1,
            _1006:1
          }
        }
      });

      the(bd.command.activeAccelTable[1000]["SCA"]).is("_1000");
      the(bd.command.activeAccelTable[1001]["SCA"]).is("_1001");
      the(bd.command.activeAccelTable[1002]["SCA"]).is("_1002");
      the(bd.command.activeAccelTable[1003]["SCA"]).is("_1003");
      the(bd.command.activeAccelTable[1004]["SCA"]).is("_1004");
      the(bd.command.activeAccelTable[1005]["SCA"]).is("_1005");
      the(bd.command.activeAccelTable[1006]["SCA"]).is("_1006");
      bd.command.popAccels();
  })),

  theFunction("[bd.command.insertAccel]",
    describe("Ommitting the last argumnet (a table) results in inserting into the current active.",
      demo("Providing a key code and shift state causes the given arguments to be inserted into the table.", function() {
        bd.command.pushAccels();
        bd.command.insertAccel("someCommandId"+100, 100, "shift");
        bd.command.insertAccel("someCommandId"+101, 101, "control");
        bd.command.insertAccel("someCommandId"+102, 102, "alt");
        bd.command.insertAccel("someCommandId"+103, 103, "s");
        bd.command.insertAccel("someCommandId"+104, 104, "c");
        bd.command.insertAccel("someCommandId"+105, 105, "a");
        bd.command.insertAccel("someCommandId"+106, 106, "control+alt+shift");
        bd.command.insertAccel("someCommandId"+107, 107, "asc");
        bd.command.insertAccel("someCommandId"+108, 108);
        var table= bd.command.activeAccelTable;
        the(table[100].Sxx).is("someCommandId"+100);
        the(table[101].xCx).is("someCommandId"+101);
        the(table[102].xxA).is("someCommandId"+102);
        the(table[103].Sxx).is("someCommandId"+103);
        the(table[104].xCx).is("someCommandId"+104);
        the(table[105].xxA).is("someCommandId"+105);
        the(table[106].SCA).is("someCommandId"+106);
        the(table[107].SCA).is("someCommandId"+107);
        the(table[108].xxx).is("someCommandId"+108);
        bd.command.popAccels();
      }),
      demo("Providing a character and shift state causes the character to be converted to an upper-case char code and then the given arguments to be inserted into the table.", function() {
        bd.command.pushAccels();
        bd.command.insertAccel("someCommandId"+100, "a", "shift");
        bd.command.insertAccel("someCommandId"+101, "b", "control");
        bd.command.insertAccel("someCommandId"+102, "c", "alt");
        bd.command.insertAccel("someCommandId"+103, "d", "s");
        bd.command.insertAccel("someCommandId"+104, "e", "c");
        bd.command.insertAccel("someCommandId"+105, "f", "a");
        bd.command.insertAccel("someCommandId"+106, "g", "control+alt+shift");
        bd.command.insertAccel("someCommandId"+107, "h", "asc");
        var table= bd.command.activeAccelTable;
        the(table[65].Sxx).is("someCommandId"+100);
        the(table[66].xCx).is("someCommandId"+101);
        the(table[67].xxA).is("someCommandId"+102);
        the(table[68].Sxx).is("someCommandId"+103);
        the(table[69].xCx).is("someCommandId"+104);
        the(table[70].xxA).is("someCommandId"+105);
        the(table[71].SCA).is("someCommandId"+106);
        the(table[72].SCA).is("someCommandId"+107);
        bd.command.popAccels();
      }),
      demo("Providing a character and no shift state causes the character to be used for the key code", function() {
        bd.command.pushAccels();
        bd.command.insertAccel("someCommandId"+108, "i");
        var table= bd.command.activeAccelTable;
        the(table.i.xxx).is("someCommandId"+108);
        bd.command.popAccels();
      }),
      demo("Providing a bd.command.id only causes the accelKey/accelShift given by the implied command item in bd.command.itemCache to be used.", function() {
        bd.command.pushAccels();
        var commandId= bd.uid();
        var commandItem= bd.command.addItem({id:commandId, accelKey:100, accelShift:"SCA"});
        bd.command.insertAccel(commandId);
        var table= bd.command.activeAccelTable;
        the(table[100].SCA).is(commandId);
        bd.command.removeItem(commandId);
        bd.command.popAccels();
      })
    ),

    describe("Providing a table results in inserting into a specific table.",
      demo("Providing a key code and shift state causes the given arguments to be inserted into the table.", function() {
        var table= {};
        bd.command.insertAccel("someCommandId"+100, 100, "shift", table);
        bd.command.insertAccel("someCommandId"+101, 101, "control", table);
        bd.command.insertAccel("someCommandId"+102, 102, "alt", table);
        bd.command.insertAccel("someCommandId"+103, 103, "s", table);
        bd.command.insertAccel("someCommandId"+104, 104, "c", table);
        bd.command.insertAccel("someCommandId"+105, 105, "a", table);
        bd.command.insertAccel("someCommandId"+106, 106, "control+alt+shift", table);
        bd.command.insertAccel("someCommandId"+107, 107, "asc", table);
        bd.command.insertAccel("someCommandId"+108, 108, table);
        the(table[100].Sxx).is("someCommandId"+100);
        the(table[101].xCx).is("someCommandId"+101);
        the(table[102].xxA).is("someCommandId"+102);
        the(table[103].Sxx).is("someCommandId"+103);
        the(table[104].xCx).is("someCommandId"+104);
        the(table[105].xxA).is("someCommandId"+105);
        the(table[106].SCA).is("someCommandId"+106);
        the(table[107].SCA).is("someCommandId"+107);
        the(table[108].xxx).is("someCommandId"+108);
      }),
      demo("Providing a character and shift state causes the character to be converted to an upper-case char code and then the given arguments to be inserted into the table.", function() {
        var table= {};
        bd.command.insertAccel("someCommandId"+100, "a", "shift", table);
        bd.command.insertAccel("someCommandId"+101, "b", "control", table);
        bd.command.insertAccel("someCommandId"+102, "c", "alt", table);
        bd.command.insertAccel("someCommandId"+103, "d", "s", table);
        bd.command.insertAccel("someCommandId"+104, "e", "c", table);
        bd.command.insertAccel("someCommandId"+105, "f", "a", table);
        bd.command.insertAccel("someCommandId"+106, "g", "control+alt+shift", table);
        bd.command.insertAccel("someCommandId"+107, "h", "asc", table);
        the(table[65].Sxx).is("someCommandId"+100);
        the(table[66].xCx).is("someCommandId"+101);
        the(table[67].xxA).is("someCommandId"+102);
        the(table[68].Sxx).is("someCommandId"+103);
        the(table[69].xCx).is("someCommandId"+104);
        the(table[70].xxA).is("someCommandId"+105);
        the(table[71].SCA).is("someCommandId"+106);
        the(table[72].SCA).is("someCommandId"+107);
      }),
      demo("Providing a character and no shift state causes the character to be used for the key code.", function() {
        var table= {};
        bd.command.insertAccel("someCommandId"+108, "i", table);
        the(table.i.xxx).is("someCommandId"+108);
      }),
      demo("Providing a bd.command.id only causes the accelKey/accelShift given by the implied command item in bd.command.itemCache to be used.", function() {
        var table= {};
        var commandId= bd.uid();
        var commandItem= bd.command.addItem({id:commandId, accelKey:100, accelShift:"SCA"});
        bd.command.insertAccel(commandId, table);
        the(table[100].SCA).is(commandId);
        bd.command.removeItem(commandId);
      })
    )
  ),

  theFunction("[bd.command.removeAccel]",
    demo("providing a table results in removing a specific table", function() {
      var table= {};
      bd.command.insertAccel("someCommandId"+100, 100, "shift", table);
      bd.command.insertAccel("someCommandId"+101, "A", table);
      bd.command.insertAccel("someCommandId"+102, "b", table);
      the(table[100].Sxx).is("someCommandId"+100);
      the(table.A.xxx).is("someCommandId"+101);
      the(table.b.xxx).is("someCommandId"+102);
      bd.command.removeAccel(100, "shift", table);
      bd.command.removeAccel("A", "", table);
      bd.command.removeAccel("b", table);
      the(table[100].Sxx).is(0);
      the(table.A.xxx).is(0);
      the(table.b.xxx).is(0);
    }),
    demo("not providing a table results in removing from the current active table given by bd.command.activeAccleratorTable", function() {
      bd.command.pushAccels();
      bd.command.insertAccel("someCommandId"+100, 100, "shift");
      bd.command.insertAccel("someCommandId"+101, "A");
      bd.command.insertAccel("someCommandId"+102, "b");
      var table= bd.command.activeAccelTable;
      the(table[100].Sxx).is("someCommandId"+100);
      the(table.A.xxx).is("someCommandId"+101);
      the(table.b.xxx).is("someCommandId"+102);
      bd.command.removeAccel(100, "shift");
      bd.command.removeAccel("A", "");
      bd.command.removeAccel("b");
      the(table[100].Sxx).is(0);
      the(table.A.xxx).is(0);
      the(table.b.xxx).is(0);
      bd.command.popAccels();
    })
  ),

  theFunction("[bd.command.dispatchAccel]",
    demo("accelerators given with key codes and shift states are dispatched on the key down event", function() {
      bd.command.pushAccels();

      var
        fakeCommandIds= [],
        connectionHandles= [],
        handlerCatches= 0;
      bd.forEach(["S", "x"], function(shift) {
        bd.forEach(["C", "x"], function(control) {
          bd.forEach(["A", "x"], function(alt) {
            var commandId= bd.uid();
            fakeCommandIds.push(commandId);
            bd.command.addItem({id:commandId, accelKey:65, accelShift:shift+control+alt});
            bd.command.insertAccel(commandId);
            connectionHandles.push(bd.command.connect(commandId, function(e) {
              handlerCatches++;
              the(e.id).is(commandId);
              the(e.eventObject.keyCode).is(65);
              the(e.eventObject.type).is("keydown");
              the(e.eventObject.shiftKey).is(shift==="S");
              the(e.eventObject.ctrlKey).is(control==="C");
              the(e.eventObject.altKey).is(alt==="A");
            }));
          });
        });
      });

      function fireEvents() {
        bd.forEach(["S", "x"], function(shift) {
          bd.forEach(["C", "x"], function(control) {
            bd.forEach(["A", "x"], function(alt) {
              //fake a keydown event
              bd.command.dispatchAccel({
                type:"keydown",
                keyCode:65,
                shiftKey:shift==="S",
                ctrlKey:control==="C",
                altKey:alt==="A"
              });

              //fake a keypres event
              bd.command.dispatchAccel({
                type:"keypress",
                keyChar:"A",
                shiftKey:shift==="S",
                ctrlKey:control==="C",
                altKey:alt==="A"
              });

              //fake a keyup event
              bd.command.dispatchAccel({
                type:"keyup",
                keyCode:65,
                shiftKey:shift==="S",
                ctrlKey:control==="C",
                altKey:alt==="A"
              });
            });
          });
        });
        the(handlerCatches).is(8);
      }

      //prevent bd.stopEvent from being called on the fake object since it doesn't actually have stopPropagation and preventDefault methods
      var h= bd.subscribe("bdExecCommandEnd", function(commandEventObject) {
        commandEventObject.stopEvent= false;
      });
      fireEvents();
      h.disconnect();

      bd.forEach(connectionHandles, function(handle) {
        handle.disconnect();
      });
      bd.forEach(fakeCommandIds, function(id) {
        bd.command.removeItem(id);
      });
      bd.command.popAccels();
    }),

    demo("accelerators given with char codes work for only non-shifted shift states and are dispatched on the key press event", function() {
      bd.command.pushAccels();

      var
        fakeCommandIds= [],
        connectionHandles= [],
        handlerCatches= 0;
      bd.forEach(["B", "b", "2"], function(c) {
        var commandId= bd.uid();
        fakeCommandIds.push(commandId);
        bd.command.addItem({id:commandId, accelKey:c});
        bd.command.insertAccel(commandId);
        connectionHandles.push(bd.command.connect(commandId, function(e) {
          handlerCatches++;
          the(e.id).is(commandId);
          the(e.eventObject.keyChar).is(c);
          the(e.eventObject.type).is("keypress");
        }));
      });
      function fireEvents() {
        bd.forEach(["S", "x"], function(shift) {
          bd.forEach(["C", "x"], function(control) {
            bd.forEach(["A", "x"], function(alt) {
              //fake a keydown event
              bd.command.dispatchAccel({
                type:"keydown",
                keyCode:66,
                shiftKey:shift==="S",
                ctrlKey:control==="C",
                altKey:alt==="A"
              });

              //fake a keyup event
              bd.command.dispatchAccel({
                type:"keyup",
                keyCode:66,
                shiftKey:shift==="S",
                ctrlKey:control==="C",
                altKey:alt==="A"
              });
            });
          });
        });

        //fake a keypres events
        bd.command.dispatchAccel({
          type:"keypress",
          charCode:66,
          shiftKey:true,
          ctrlKey:false,
          altKey:false
        });
         bd.command.dispatchAccel({
          type:"keypress",
          charCode:66,
          shiftKey:false,
          ctrlKey:false,
          altKey:false
        });
         bd.command.dispatchAccel({
          type:"keypress",
          charCode:50,
          shiftKey:false,
          ctrlKey:false,
          altKey:false
        });

        the(handlerCatches).is(3);
      }

      //prevent bd.stopEvent from being called on the fake object since it doesn't actually have stopPropagation and preventDefault methods
      var h= bd.subscribe("bdExecCommandEnd", function(commandEventObject) {
        commandEventObject.stopEvent= false;
      });
      fireEvents();

      h.disconnect();
      bd.forEach(connectionHandles, function(handle) {
        handle.disconnect();
      });
      bd.forEach(fakeCommandIds, function(id) {
        bd.command.removeItem(id);
      });
      bd.command.popAccels();
    })
  ),

  theFunction("[bd.command.suspendAccelOnce]", demo("[*]", function() {
    bd.command.pushAccels();

    bd.command.insertAccel("someCommandItem", 65, "S");
    var handlerCatches= 0;
    var connectHandle= bd.command.connect("someCommandItem", function(e) {
      handlerCatches++;
    });
    //prevent bd.stopEvent from being called on the fake object since it doesn't actually have stopPropagation and preventDefault methods
    var h= bd.subscribe("bdExecCommandEnd", function(commandEventObject) {
      commandEventObject.stopEvent= false;
    });

    bd.command.dispatchAccel({type:"keydown", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keypress", keyChar:"A", shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keyup", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    the(handlerCatches).is(1);

    bd.command.suspendAccelOnce();

    bd.command.dispatchAccel({type:"keydown", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keypress", keyChar:"A", shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keyup", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    the(handlerCatches).is(1);

    bd.command.dispatchAccel({type:"keydown", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keypress", keyChar:"A", shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keyup", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    the(handlerCatches).is(2);

    h.disconnect();
    connectHandle.disconnect();
    bd.command.popAccels();
  })),

  theFunction("[bd.command.suspendAccels]", demo("[*]", function() {
    bd.command.pushAccels();

    bd.command.insertAccel("someCommandItem", 65, "S");
    var handlerCatches= 0;
    var connectHandle= bd.command.connect("someCommandItem", function(e) {
      handlerCatches++;
    });
    //prevent bd.stopEvent from being called on the fake object since it doesn't actually have stopPropagation and preventDefault methods
    var h= bd.subscribe("bdExecCommandEnd", function(commandEventObject) {
      commandEventObject.stopEvent= false;
    });

    bd.command.dispatchAccel({type:"keydown", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keypress", keyChar:"A", shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keyup", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    the(handlerCatches).is(1);

    bd.command.suspendAccels();

    bd.command.dispatchAccel({type:"keydown", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keypress", keyChar:"A", shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keyup", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    the(handlerCatches).is(1);

    bd.command.dispatchAccel({type:"keydown", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keypress", keyChar:"A", shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keyup", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    the(handlerCatches).is(1);

    bd.command.resumeAccels();

    bd.command.dispatchAccel({type:"keydown", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keypress", keyChar:"A", shiftKey:true, ctrlKey:false, altKey:false});
    bd.command.dispatchAccel({type:"keyup", keyCode:65, shiftKey:true, ctrlKey:false, altKey:false});
    the(handlerCatches).is(2);

    h.disconnect();
    connectHandle.disconnect();
    bd.command.popAccels();
  })),

  describe("the function bd.command.suspendAccels", todo()),
  describe("the function bd.command.resumeAccels", todo())
);

});



