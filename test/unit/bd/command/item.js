define(["bd", "bd/command/item"], function(bd) {

//#include bd/test/testHelpers
//#commentToString

var 
  testCommandItem, 
  testCommandNamespace,
  testCommandObjects;

module("The module bd/command/item",
  theClass("[bd.command.item]",
    theMember("[constructor]",
      demo("() creates a new instance with all default values.", function() {
        var item= new bd.command.item();
        the(item.id).is("");
        the(item.parentMenuId).is("");
        the(item.groupId).is(item.parentMenuId);
        the(item.text).is("");
        the(item.htmlText).is("");
        the(item.cleanedText).is("");
        the(item.role).is(bd.command.roles.invalid);
        the(item.groupOrder).is(0);
        the(item.itemOrder).is(0);
        the(item.accelKey).is(0);
        the(item.accelShift).is(0);
        the(item.accelText).is(bd.command.defaultValue);
        the(item.statusText).is(bd.command.defaultValue);
        the(item.helpUrl).is("#");
        the(item.tooltipText).is(bd.command.defaultValue);
        the(item.enabledIcon).is(false);
        the(item.disabledIcon).is(false);
        the(item.disabled).is(false);
        the(item.checked).is(bd.command.checked.na);
        the(item.mnemonic).is(null);
      }),
      demo("(args) mixes args into the new instance.", function() {
        var args= {
          id:"myId",
          parentMenuId:"parentMenuId",
          groupId:"groupId",
          text:"myCommandText",
          role:bd.command.command,
          groupOrder:456,
          itemOrder:789,
          accelKey:1234,
          accelShift:"SCA",
          accelText:"my accel text",
          statusText:"my status text",
          helpUrl:"my help url",
          tooltipText:"my tooltip text",
          enabledIcon:true,
          disabledIcon:true
        },
        item= new bd.command.item(args);
        bd.forEachHash(args, function(value, name) {
          the(item[name]).is(value);
        });
      }),
      demo('groupId may be specified explicitly or derived from parentMenuId is missing.', function() {
        var item= new bd.command.item({id:"myCommand", groupId:"myGroup", parentMenuId:"myParentMenu"});
        the(item.id).is("myCommand");
        the(item.groupId).is("myGroup");
        the(item.parentMenuId).is("myParentMenu");
        item= new bd.command.item({id:"myCommand", parentMenuId:"myParentMenu"});
        the(item.id).is("myCommand");
        the(item.groupId).is("myParentMenu");
        the(item.parentMenuId).is("myParentMenu");
      }),
      demo('A menumonic (if any) is derived by preceeding it with a backslash in the command text.', function() {
        the(new bd.command.item({text:"file"}).mnemonic).is(null);
        the(new bd.command.item({text:"\\file"}).mnemonic).is("f");
        the(new bd.command.item({text:"f\\ile"}).mnemonic).is("i");
        the(new bd.command.item({text:"fi\\le"}).mnemonic).is("l");
        the(new bd.command.item({text:"fil\\e"}).mnemonic).is("e");
      }),
      demo('Double backslashes specify a literal backslash.', function() {
        the(new bd.command.item({text:"\\\\file"}).mnemonic).is(null);
        the(new bd.command.item({text:"f\\\\ile"}).mnemonic).is(null);
        the(new bd.command.item({text:"fi\\\\le"}).mnemonic).is(null);
        the(new bd.command.item({text:"fil\\\\e"}).mnemonic).is(null);
        the(new bd.command.item({text:"file\\\\"}).mnemonic).is(null);
      }),
      demo('When a mnemonic is given, the property cleanedText stips the backslash.', function() {
        the(new bd.command.item({text:"\\file"}).cleanedText).is("file");
        the(new bd.command.item({text:"f\\ile"}).cleanedText).is("file");
        the(new bd.command.item({text:"fi\\le"}).cleanedText).is("file");
        the(new bd.command.item({text:"fil\\e"}).cleanedText).is("file");
        the(new bd.command.item({text:"\\\\file"}).cleanedText).is("\\file");
        the(new bd.command.item({text:"f\\\\ile"}).cleanedText).is("f\\ile");
        the(new bd.command.item({text:"fi\\\\le"}).cleanedText).is("fi\\le");
        the(new bd.command.item({text:"fil\\\\e"}).cleanedText).is("fil\\e");
        the(new bd.command.item({text:"file\\\\"}).cleanedText).is("file\\");
      }),
      demo('When a mnemonic is given, the property htmlText spans the mnemonic with the class "menuMnemonic".', function() {
        the(new bd.command.item({text:"\\file"}).htmlText).is("<span class='menuMnemonic'>f</span>ile");
        the(new bd.command.item({text:"f\\ile"}).htmlText).is("f<span class='menuMnemonic'>i</span>le");
        the(new bd.command.item({text:"fi\\le"}).htmlText).is("fi<span class='menuMnemonic'>l</span>e");
        the(new bd.command.item({text:"fil\\e"}).htmlText).is("fil<span class='menuMnemonic'>e</span>");
        the(new bd.command.item({text:"\\\\file"}).htmlText).is("\\file");
        the(new bd.command.item({text:"f\\\\ile"}).htmlText).is("f\\ile");
        the(new bd.command.item({text:"fi\\\\le"}).htmlText).is("fi\\le");
        the(new bd.command.item({text:"fil\\\\e"}).htmlText).is("fil\\e");
        the(new bd.command.item({text:"file\\\\"}).htmlText).is("file\\");
      }),
      demo('The mnemonic "\\" is given by "\\\\\\"', function() {
          var item= new bd.command.item({text:"\\\\\\"});
          the(item.mnemonic).is("\\");
          the(item.cleanedText).is("\\");
          the(item.htmlText).is("<span class=\'menuMnemonic\'>\\</span>");
          item= new bd.command.item({text:"\\\\\\test"});
          the(item.mnemonic).is("\\");
          the(item.cleanedText).is("\\test");
          the(item.htmlText).is("<span class=\'menuMnemonic\'>\\</span>test");
          item= new bd.command.item({text:"te\\\\\\st"});
          the(item.mnemonic).is("\\");
          the(item.cleanedText).is("te\\st");
          the(item.htmlText).is("te<span class=\'menuMnemonic\'>\\</span>st");
          item= new bd.command.item({text:"test\\\\\\"});
          the(item.mnemonic).is("\\");
          the(item.cleanedText).is("test\\");
          the(item.htmlText).is("test<span class=\'menuMnemonic\'>\\</span>");
      }),
      describe("{accelShift:<shift-state>} defines the shift state of the accelerator key.",
        demo('The shift key is detected by the presense of "s" or "shift", case-insensitive, or not.', function() {
          bd.forEach("s.S.shift.SHIFT".split("."), function(shift) {
            var item= new bd.command.item({accelShift:shift});
            the(item.accelShift).is("Sxx");
            item= new bd.command.item({accelShift:"junk" + shift});
            the(item.accelShift).is("Sxx");
            item= new bd.command.item({accelShift:shift + "junk"});
            the(item.accelShift).is("Sxx");
            item= new bd.command.item({accelShift:"junk" + shift + "junk"});
            the(item.accelShift).is("Sxx");
          });
          var item= new bd.command.item({accelShift:"junk"});
          the(item.accelShift).is("xxx");
        }),
        demo('The control key is detected by the presense of "c" or "control", case-insensitive, or not.', function() {
          bd.forEach("c.C.control.CONTROL".split("."), function(control) {
            var item= new bd.command.item({accelShift:control});
            the(item.accelShift).is("xCx");
            item= new bd.command.item({accelShift:"junk" + control});
            the(item.accelShift).is("xCx");
            item= new bd.command.item({accelShift:control + "junk"});
            the(item.accelShift).is("xCx");
            item= new bd.command.item({accelShift:"junk" + control + "junk"});
            the(item.accelShift).is("xCx");
          });
          var item= new bd.command.item({accelShift:"junk"});
          the(item.accelShift).is("xxx");
        }),
        demo('The alt key is detected by the presense of "a" or "alt", case-insensitive, or not.', function() {
          bd.forEach("a.A.alt.ALT".split("."), function(alt) {
            var item= new bd.command.item({accelShift:alt});
            the(item.accelShift).is("xxA");
            item= new bd.command.item({accelShift:"junk" + alt});
            the(item.accelShift).is("xxA");
            item= new bd.command.item({accelShift:alt + "junk"});
            the(item.accelShift).is("xxA");
            item= new bd.command.item({accelShift:"junk" + alt + "junk"});
            the(item.accelShift).is("xxA");
          });
          var item= new bd.command.item({accelShift:"junk"});
          the(item.accelShift).is("xxx");
        }),
        demo('The shift, control, and/or alt flags can be given in any order.', function() {
            bd.forEach("sca.sac.csa.cas.asc.acs".split("."), function(flags) {
              var item= new bd.command.item({accelShift:flags});
              the(item.accelShift).is("SCA");
            });
        }),
        demo('Empty of missing shift flags result in accelShift==0', function() {
          var item= new bd.command.item({accelShift:""});
          the(item.accelShift).is(0);
          item= new bd.command.item({});
          the(item.accelShift).is(0);
        }),
        demo('If shift-state is nonempty, then, absent any real shift states, accelShift=="xxx"', function() {
          var item= new bd.command.item({accelShift:"empty"});
          the(item.accelShift).is("xxx");
        }),
        demo('Use caution specifying junk in shift-states as they may be interpretted as real shift states, e.g. "empty-shift-state" implies "SxA"', function() {
          var item= new bd.command.item({accelShift:"empty-shift-state"});
          the(item.accelShift).is("SxA");
        })
      ),
      describe("If a shift-state is given and a character is given for accelKey, then accelKey is transformed into a key code",
        demo('{accelShift:"shift", accelKey:"a"} is transformed into {accelShift:"Sxx", accelKey:65}', function() {
          var item= new bd.command.item({accelShift:"shift", accelKey:"a"});
            the(item.accelShift).is("Sxx");
            the(item.accelKey).is(65);
        }),
        demo('no transformation occurs with {accelKey:"a"}', function() {
          var item= new bd.command.item({accelKey:"a"});
          the(item.accelShift).is(0);
          the(item.accelKey).is("a");
        })
      ),
      describe("If shift-state is given, a character is given for accelKey, and accelText==bd.defaultValue, then accelText is derived",
        demo('{accelShift:"S", accelKey:"a"} derives accelText "shift+a"', function() {
          var item= new bd.command.item({accelShift:"S", accelKey:"a"});
          the(item.accelText).is("shift+a");
        })
      ),
      describe("If no shift-state is given, a character is given for accelKey, and accelText==bd.defaultValue, then accelText is derived",
        demo('{accelKey:"a"} derives accelText "a"', function() {
          var item= new bd.command.item({accelKey:"a"});
          the(item.accelText).is("a");
        })
      ),
      describe("derived accelText never overrides explicitly set accelText",
        demo('{accelShift:"S", accelKey:"a", accelText:"some accel text"} result in accelText=="some accel text"', function() {
          var item= new bd.command.item({accelShift:"S", accelKey:"a", accelText:"some accel text"});
          the(item.accelText).is("some accel text");
        }),
        demo('{accelKey:"a", accelText:"some accel text"} result in accelText=="some accel text"', function() {
          var item= new bd.command.item({accelKey:"a", accelText:"some accel text"});
          the(item.accelText).is("some accel text");
        })
      ),
      describe("if statusText===bd.defaultValue and role==bd.command.roles.menu, then statusText is derived",
        demo('{text:"file", role:bd.command.role.menu} results in statusText==="click to open the file menu"}', function() {
          var item= new bd.command.item({text:"file", role:bd.command.roles.menu});
          the(item.statusText).is("click to open the file menu");
        }),
        demo('{text:"file", role:bd.command.role.command} results in statusText==="click to execute the file command"}', function() {
          var item= new bd.command.item({text:"file", role:bd.command.roles.command});
          the(item.statusText).is("click to execute the file command");
        })
      ),
      describe("if helpUrl===bd.defaultValue this it is derived as <groupId>#<id>",
        demo('{id:"open", groupId:"file"} results in helpUrl==="open#file"', function() {
          var item= new bd.command.item({id:"open", groupId:"file"});
          the(item.helpUrl).is("file#open");
        }),
        demo('{id:"open"} results in helpUrl==="open#"', function() {
          var item= new bd.command.item({id:"open"});
          the(item.helpUrl).is("#open");
        }),
        demo('{groupId:"file"} results in helpUrl==="#file"', function() {
          var item= new bd.command.item({groupId:"file"});
          the(item.helpUrl).is("file#");
        }),
        demo('{} results in helpUrl==="#"', function() {
          var item= new bd.command.item({});
          the(item.helpUrl).is("#");
        })
      ),
      describe("if tooltipText===bd.defaultValue then it is set equal to statusText",
        demo('{statusText:"hello, world"} results in tooltipText==="hello, world"}', function() {
          var item= new bd.command.item({statusText:"hello, world"});
          the(item.tooltipText).is("hello, world");
        })
      )
    ),
    describe("the method getIcon returns a string that describes the icon (intended to be used as a class string",
      describe("getIcon for a not disabled command",
        demo('returns the enabledIcon property if it is a string, prefixed by "commandIcon "', function () {
          var item= new bd.command.item({enabledIcon:"someEnabledIcon"});
          the(item.getIcon()).is("commandIcon someEnabledIcon");
        }),
        demo('returns the id if enabledIcon is truthy, prefixed by "commandIcon "', function () {
          var item= new bd.command.item({id:"open", enabledIcon:1});
          the(item.getIcon()).is("commandIcon open");
        }),
        demo('returns "", if enabledIcon is not truthy or is missing', function () {
          var item= new bd.command.item({id:"open", enabledIcon:0});
          the(item.getIcon()).is("");
          item= new bd.command.item({id:"open"});
          the(item.getIcon()).is("");
        })
      ),
      describe("getIcon for a disabled command",
        demo('returns the disabledIcon property if it is a string, prefixed by "commandIconDisabled "', function () {
          var item= new bd.command.item({disabledIcon:"someDisabledIcon"});
          item.disabled= true;
          the(item.getIcon()).is("commandIconDisabled someDisabledIcon");
        }),
        demo('return the id if disabledIcon is truthy, prefixed by "commandIconDisabled "', function () {
          var item= new bd.command.item({id:"open", disabledIcon:1});
          item.disabled= true;
          the(item.getIcon()).is("commandIconDisabled open");
        }),
        demo('returns the enabledIcon property if it is a string and disabledIcon is eithr not truthy or is missing, prefixed by "commandIconDisabled "', function () {
          var item= new bd.command.item({enabledIcon:"someEnabledIcon", disabledIcon:0});
          item.disabled= true;
          the(item.getIcon()).is("commandIconDisabled someEnabledIcon");
          item= new bd.command.item({enabledIcon:"someEnabledIcon"});
          item.disabled= true;
          the(item.getIcon()).is("commandIconDisabled someEnabledIcon");
        }),
        demo('return "", if disabledIcon is not truthy', function () {
          var item= new bd.command.item({id:"open", disabledIcon:0});
          item.disabled= true;
          the(item.getIcon()).is("");
        })
      )
    )
  ),

  describe("the class bd.command.namespace creates associative arrays of command items",
    demo("the class is a subclass of bd.namespace", function() {
      var item= new bd.command.namespace();
      the(item).isInstanceOf(bd.namespace);
    }),
    demo("the constructor expect no arguments", function () {
      testCommandNamespace= new bd.command.namespace();
    }),
    demo("add expects a single argument that's a valid command item than contains at least a non-empty id property", function() {
      testCommandObjects= [
        new bd.command.item({id:"file"}),
        new bd.command.item({id:"edit"}),
        new bd.command.item({id:"help"})
      ];
      the(testCommandNamespace.set(testCommandObjects[0])).is(testCommandNamespace);
      the(testCommandNamespace.set(testCommandObjects[1])).is(testCommandNamespace);
      the(testCommandNamespace.set(testCommandObjects[2])).is(testCommandNamespace);
    }),
    describe("add does not check that the passed command item is valid"),
    demo("get expects a bd.command.id", function() {
      the(testCommandNamespace.get("file")).is(testCommandObjects[0]);
      the(testCommandNamespace.get("edit")).is(testCommandObjects[1]);
      the(testCommandNamespace.get("help")).is(testCommandObjects[2]);
    }),
    demo("the method modify edits an item in-place", function() {
      the(testCommandNamespace.get("file").statusText).isNot("here is new status text");
      testCommandNamespace.modify("file", {statusText:"here is new status text"});
      the(testCommandNamespace.get("file").statusText).is("here is new status text");
      the(testCommandNamespace.get("file")).is(testCommandObjects[0]);
    }),
    describe("a get after either an add or modify checks and grooms the command items in the array",
      demo('the groupOrder property is set for all items', function() {
        testCommandNamespace.set(new bd.command.item({id:"fileGroup", itemOrder: 100, role:bd.command.roles.group}));
        testCommandNamespace.set(new bd.command.item({id:"open", groupId:"fileGroup", groupOrder:0}));
        testCommandNamespace.set(new bd.command.item({id:"sendTo"}));
        testCommandNamespace.modify("sendTo", {groupId:"fileGroup", groupOrder:0});
        the(testCommandNamespace.get("open").groupOrder).is(100);
        the(testCommandNamespace.get("sendTo").groupOrder).is(100);
      }),
      describe('a new item can be added with an order relative to an existing item',
        demo('add an item with itemOrder.offset==="after" sets itemOrder after the existing item itemOrder.reference', function() {
          testCommandNamespace.set(new bd.command.item({id:"close", itemOrder:{reference:"open", offset:"after"}, groupId:"fileGroup", parentMenuId:"file", role:bd.command.roles.command}));
          the(testCommandNamespace.get("close").itemOrder>testCommandNamespace.get("open").itemOrder).is(true);
          the(testCommandNamespace.get("close").itemOrder).is(testCommandNamespace.get("open").itemOrder+1);
        }),
        demo('adding and item after an existing item shifts all other items in the group with order >= the existing item up by one', function() {
          testCommandNamespace.set(new bd.command.item({id:"close2", itemOrder:{reference:"open", offset:"after"}, groupId:"fileGroup", parentMenuId:"file", role:bd.command.roles.command}));
          the(testCommandNamespace.get("close2").itemOrder>testCommandNamespace.get("open").itemOrder).is(true);
          the(testCommandNamespace.get("close").itemOrder>testCommandNamespace.get("close2").itemOrder).is(true);
        }),
        demo('add an item with itemOrder.offset==="before" sets itemOrder before the existing item itemOrder.reference', function() {
          testCommandNamespace.set(new bd.command.item({id:"b4sendTo", itemOrder:{reference:"open", offset:"before"}, groupId:"fileGroup", parentMenuId:"file", role:bd.command.roles.command}));
          the(testCommandNamespace.get("b4sendTo").itemOrder<testCommandNamespace.get("open").itemOrder).is(true);
        }),
        demo('add an item with itemOrder==0 addes the item to the end of its group', function() {
          testCommandNamespace.set(new bd.command.item({id:"lastFileCommand", itemOrder:0, groupId:"fileGroup", parentMenuId:"file", role:bd.command.roles.command}));
          the(testCommandNamespace.get("lastFileCommand").itemOrder>testCommandNamespace.get("close").itemOrder).is(true);
        }),
        demo('items can be nested referred so long as the problem is solvable', function() {
          testCommandNamespace.set(new bd.command.item({id:"nestRef0", itemOrder:{reference:"nestRef1", offset:"after"}, groupId:"fileGroup", parentMenuId:"file", role:bd.command.roles.command}));
          testCommandNamespace.set(new bd.command.item({id:"nestRef1", itemOrder:{reference:"nestRef2", offset:"after"}, groupId:"fileGroup", parentMenuId:"file", role:bd.command.roles.command}));
          testCommandNamespace.set(new bd.command.item({id:"nestRef2", itemOrder:{reference:"open", offset:"after"}, groupId:"fileGroup", parentMenuId:"file", role:bd.command.roles.command}));
          the(testCommandNamespace.get("nestRef0").itemOrder>testCommandNamespace.get("nestRef1").itemOrder).is(true);
          the(testCommandNamespace.get("nestRef1").itemOrder>testCommandNamespace.get("nestRef2").itemOrder).is(true);
          the(testCommandNamespace.get("nestRef2").itemOrder>testCommandNamespace.get("open").itemOrder).is(true);
        })
      )
    )
  ),

  describe("the namespace bd.command",
    describe("contains the property itemCache, an instance of bd.command.namespace",
      demo(function() {
        the(bd.command.itemCache.constructor).is(bd.command.namespace);
      }),
      describe("bd.command contains functions to add, get, and delete command items from bd.command.itemCache",
        demo("bd.command.addItem adds a new item to the cache given a hash as expected by the bd.command.item constructor (just like bd.command.namespace.add)", function() {
          var
            commandId= bd.uid(),
            args= {id:commandId};
          the(bd.command.addItem(args)).is(bd.command.itemCache);
          the(bd.command.getItem(commandId).id).is(commandId);
          var command= bd.command.getItem(commandId);
          the(bd.command.removeItem(commandId)).is(command);
          the(bd.command.getItem(commandId)).is(undefined);
        }),
        demo("bd.command.addItems adds an array of new items to the cache given an array of hashes as expected by the bd.command.item constructor", function() {
            var
              commandId1= bd.uid(),
              args1= {id:commandId1},
              commandId2= bd.uid(),
              args2= {id:commandId2};
          the(bd.command.addItems([args1, args2])).is(bd.command.itemCache);
          the(bd.command.getItem(commandId1).id).is(commandId1);
          var command1= bd.command.getItem(commandId1);
          the(bd.command.getItem(commandId2).id).is(commandId2);
          var command2= bd.command.getItem(commandId2);
          the(bd.command.removeItem(commandId1)).is(command1);
          the(bd.command.removeItem(commandId2)).is(command2);
          the(bd.command.getItem(commandId1)).is(undefined);
          the(bd.command.getItem(commandId2)).is(undefined);
        }),
        demo("bd.command.getItem gets items in the cache, given a commandId (just like bd.command.namespace.get)", function() {
            var
              commandId= bd.uid(),
              args= {id:commandId};
            the(bd.command.addItem(args)).is(bd.command.itemCache);
            the(bd.command.getItem(commandId).id).is(commandId);
            var command= bd.command.getItem(commandId);
            the(bd.command.removeItem(commandId)).is(command);
            the(bd.command.getItem(commandId)).is(undefined);
        }),
        demo("bd.command.modifyItem modifies an item in the cache (just like bd.command.namespace.modify)", function() {
            var
              commandId= bd.uid(),
              args= {id:commandId};
            the(bd.command.addItem(args)).is(bd.command.itemCache);
            the(bd.command.getItem(commandId).statusText).isNot("hello, world");
            bd.command.modifyItem(commandId, {statusText:"hello, world"});
            the(bd.command.getItem(commandId).statusText).is("hello, world");
            var command= bd.command.getItem(commandId);
            the(bd.command.removeItem(commandId)).is(command);
            the(bd.command.getItem(commandId)).is(undefined);
        }),
        demo("bd.command.removeItem deletes an item from the cache (just like bd.command.namespace.remove)", function() {
            var
              commandId= bd.uid(),
              args= {id:commandId};
            the(bd.command.addItem(args)).is(bd.command.itemCache);
            the(bd.command.getItem(commandId).id).is(commandId);
            var command= bd.command.getItem(commandId);
            the(bd.command.removeItem(commandId)).is(command);
            the(bd.command.getItem(commandId)).is(undefined);
        })
      )
    ),
    describe("contains the property compare (a function) that calculates the relative of two command items contained in bd.command.itemCache as given by two commandIds",
      demo("order is given by (groupOrder, itemOrder, cleanedText); the fucntion returns 1 iff lhs<rhs, 0 iff lhs==rhs, -1 iff lhs>rhs", function() {
        var
          commandId1= bd.uid(),
          commandId2= bd.uid();
        bd.command.addItem({id:commandId1, groupOrder:2, itemOrder:2, text:"2"});
        bd.command.addItem({id:commandId2, groupOrder:2, itemOrder:2, text:"2"});
        var item2= bd.command.getItem(commandId2);
        the(bd.command.compare(commandId1, commandId2)).is(0);
        item2.cleanedText= "1";
        the(bd.command.compare(commandId1, commandId2)).is(1);
        item2.cleanedText= "3";
        the(bd.command.compare(commandId1, commandId2)).is(-1);
        item2.itemOrder= "1";
        the(bd.command.compare(commandId1, commandId2)).is(1);
        item2.itemOrder= "3";
        the(bd.command.compare(commandId1, commandId2)).is(-1);
        item2.groupOrder= "1";
        the(bd.command.compare(commandId1, commandId2)).is(1);
        item2.groupOrder= "3";
        the(bd.command.compare(commandId1, commandId2)).is(-1);
        bd.command.removeItem(commandId1);
        bd.command.removeItem(commandId2);
      })
    ),

    demo("containes the property itemIdsInOrder (a function), takes a hash with keys of bd.command.ids and returns the bd.command.ids as an array sorted by order given by bd.command.compare", function() {
      bd.command.addItem({id:"A", groupOrder:1});
      bd.command.addItem({id:"Z", groupOrder:2});
      bd.command.addItem({id:"Y", groupOrder:3});
      bd.command.addItem({id:"B", groupOrder:4});
      the(bd.command.itemIdsInOrder({A:true, B:true, Y:true, Z:true})).hasValue(["A", "Z", "Y", "B"]);
      bd.command.removeItem("A");
      bd.command.removeItem("B");
      bd.command.removeItem("Y");
      bd.command.removeItem("Z");
    }),

    demo("contains the property deduceMenu (a function), that takes an array of bd.command.ids that exist in bd.command.itemCache and returns a menu object hierarchy that containes exactly the passed bd.command.ids",
      function() {
      function addChildren(parent, expectedResultParent, numberOfMenus, numberOfCommands, depth) {
        if (depth<0) {
          return;
        }
        var i, commandId;
        for (i= 0; i<numberOfMenus; i++) {
          commandId= bd.uid();
          menuContents.push(commandId);
          expectedResultParent[commandId]= {};
          bd.command.addItem({id:commandId, parentMenuId:parent.id, role:bd.command.roles.menu});
          addChildren(bd.command.getItem(commandId),  expectedResultParent[commandId], numberOfMenus, numberOfCommands, depth-1);
        }
        for (i= 0; i<numberOfCommands; i++) {
          commandId= bd.uid();
          menuContents.push(commandId);
          expectedResultParent[commandId]= true;
          bd.command.addItem({id:commandId, parentMenuId:parent.id, role:bd.command.roles.command});
        }
      }

      var rootCommandId= bd.uid();
      bd.command.addItem({id:rootCommandId});
      var rootCommandItem= bd.command.getItem(rootCommandId);

      var
        menuContents,
        expectedResult;

      function runTest(numberOfMenus, numberOfCommand, depth) {
        menuContents= [];
        expectedResult= {};
        addChildren(rootCommandItem, expectedResult, 2, 2, 2);
        the(bd.command.deduceMenu(menuContents)).hasValue(expectedResult);
        menuContents.reverse();
        the(bd.command.deduceMenu(menuContents)).hasValue(expectedResult);
        bd.forEach(menuContents, function(commandId) {
          bd.command.removeItem(commandId);
        });
      }

      runTest(0, 0, -1);
      runTest(1, 1, 1);
      runTest(1, 1, 2);
      runTest(1, 1, 3);
      runTest(2, 2, 1);
      runTest(2, 2, 2);
      runTest(2, 2, 3);
      runTest(3, 3, 1);
      runTest(3, 3, 2);
      runTest(3, 3, 3);
      bd.command.removeItem(rootCommandId);
    }),
    theFunction("[bd.command.getShiftStateKey]",
      demo('the shift key is detected by the presense of "s" or "shift", case-insensitive, or not', function() {
        dojo.forEach("s.S.shift.SHIFT".split("."), function(shift) {
          the(bd.command.getShiftStateKey(shift)).is("Sxx");
          the(bd.command.getShiftStateKey("junk" + shift)).is("Sxx");
          the(bd.command.getShiftStateKey(shift + "junk")).is("Sxx");
          the(bd.command.getShiftStateKey("junk" + shift + "junk")).is("Sxx");
        });
      }),
      demo('the control key is detected by the presense of "c" or "control", case-insensitive, or not', function() {
        dojo.forEach("c.C.control.CONTROL".split("."), function(control) {
          the(bd.command.getShiftStateKey(control)).is("xCx");
          the(bd.command.getShiftStateKey("junk" + control)).is("xCx");
          the(bd.command.getShiftStateKey(control + "junk")).is("xCx");
          the(bd.command.getShiftStateKey("junk" + control + "junk")).is("xCx");
        });
      }),
      demo('the alt key is detected by the presense of "a" or "alt", case-insensitive, or not', function() {
        dojo.forEach("a.A.alt.ALT".split("."), function(alt) {
          the(bd.command.getShiftStateKey(alt)).is("xxA");
          the(bd.command.getShiftStateKey("junk" + alt)).is("xxA");
          the(bd.command.getShiftStateKey(alt + "junk")).is("xxA");
          the(bd.command.getShiftStateKey("junk" + alt + "junk")).is("xxA");
        });
      }),
      demo('the shift, control, and/or alt flags can be given in any order', function() {
          dojo.forEach("sca.sac.csa.cas.asc.acs".split("."), function(flags) {
            the(bd.command.getShiftStateKey(flags)).is("SCA");
          });
      }),
      demo('empty of missing shift flags result in "xxx"', function() {
        the(bd.command.getShiftStateKey()).is("xxx");
        the(bd.command.getShiftStateKey(0)).is("xxx");
        the(bd.command.getShiftStateKey(false)).is("xxx");
      }),
      demo('if shift-state is nonempty, then, absent any real shift states, accelShift=="xxx"', function() {
        the(bd.command.getShiftStateKey("empty")).is("xxx");
      }),
      demo('use caution specifying junk in shift-states as they may be interpretted as real shift states, e.g. "empty-shift-state" implies "SxA"', function() {
        the(bd.command.getShiftStateKey("empty-shift-state")).is("SxA");
      })
    )
  )
);


});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
