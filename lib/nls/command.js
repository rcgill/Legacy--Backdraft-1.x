(function() {
var
  // shorthand...
  C= 1, //bd.command.roles.command
  M= 2, //bd.command.roles.menu
  G= 3, //bd.command.roles.group
  SCA= "SCA",
  SCx= "SCx",
  SxA= "SxA",
  Sxx= "Sxx",
  xCA= "xCA",
  xCx= "xCx",
  xxA= "xxA",
  xxx= "xxx",

rawItems=
//
// 0: id
// 1: icon
// 2: text
// 3: role
// 4: prent menu id
// 5: group id
// 6: accelerator key
// 7: accelerator shift state
// 8: status text
//0                   1    2                          3   4           5                   6      7     8
[
["top",               0,   "",                        M],
["focusMainMenu",     0,   "",                        C,  "top",      "top",              "F10", xxx, ""], //never shown on a menu; exclusively used as an accelerator
["suspendAccelerator",0,   "",                        C,  "top",      "top",              27,    Sxx, ""], //suspend accelerator processing for the next key
["file",              0,   "\\File",                  M,  "top",      "top",              0,     0,   "Operations on files"],
["edit",              0,   "\\Edit",                  M,  "top",      "top",              0,     0,   "Edit operations for the current active/selected object"],
["view",              0,   "\\View",                  M,  "top",      "top",              0,     0,   "Arrange/scale the view"],
["actions",           0,   "\\Actions",               M,  "top",      "top",              0,     0,   "Actions to execute on the current active/selected object"],
["navigate",          0,   "\\Navigate",              M,  "top",      "top",              0,     0,   "Change the current active/selected object"],
["history",           0,   "\\History",               M,  "top",      "top",              0,     0,   "List previously active objects"],
["bookmarks",         0,   "\\Bookmarks",             M,  "top",      "top",              0,     0,   "List navagable locations of interest"],
["insert",            0,   "\\Insert",                M,  "top",      "top",              0,     0,   "Insert an item"],
["format",            0,   "\\Format",                M,  "top",      "top",              0,     0,   "Format the current active/selected object"],
["arrange",           0,   "\\Arrange",               M,  "top",      "top",              0,     0,   "Arrange the current active/selected object"],
["data",              0,   "\\Data",                  M,  "top",      "top",              0,     0,   "Operate on data"],
["tools",             0,   "\\Tools",                 M,  "top",      "top",              0,     0,   "Select and use a tool"],
["window",            0,   "\\Window",                M,  "top",      "top",              0,     0,   "Change the current active window"],
["debug",             0,   "\\Debug",                 M,  "top",      "top",              0,     0,   "Debugging tools"],
["help",              0,   "\\Help",                  M,  "top",      "top",              0,     0,   "Find help"],

["filePrimaryOps",    0,   "",                        G],
["new",               0,   "\\New",                   C,  "file",     "filePrimaryOps",   'n',   xCx, "Create a new object"],
["open",              0,   "\\Open",                  C,  "file",     "filePrimaryOps",   'o',   xCx, "Open an existing file"],
["close",             0,   "\\Close",                 C,  "file",     "filePrimaryOps",   0,     0,   "Close the current object"],
["exit",              0,   "\\Exit",                  C,  "file",     "filePrimaryOps",   0,     0,   "Quit the application"],

["fileSaveOps",       0,   "",                        G],
["save",              0,   "\\Save",                  C,  "file",     "fileSaveOps",      's',   xCx, "Save the current object"],
["saveAs",            0,   "Save as...",              C,  "file",     "fileSaveOps",      0,     0,   "Save the current object under a new name"],
["saveAll",           0,   "Save \\All",              C,  "file",     "fileSaveOps",      's',   SCx, "Save all open objects"],

["propertyOps",       0,   "",                        G],
["properties",        0,   "Properties",              C,  "file",     "propertyOps",      's',   xCx, "Inspect the properties of the current object"],

["authenticationOps", 0,   "",                        G],
["logoff",            0,   "Logoff",                  C,  "file",     "authenticationOps",'s',   xCx, "Log out of the application"],

["fieldEditOps",      0,   "",                        G],
["undo",              0,   "Undo",                    C,  "edit",     "fieldEditOps",     0,     0,   "Undo the last edit operation"],
["redo",              0,   "Redo",                    C,  "edit",     "fieldEditOps",     0,     0,   "Undo the last undo operation"],
["clear",             0,   "Clear",                   C,  "edit",     "fieldEditOps",     0,     0,   "Clear the selection"],

["cutOps",            0,   "",                        G],
["cut",               0,   "Cu\\t",                   C,  "edit",     "cutOps",           'x',   xCx, ""],
["copy",              0,   "\\Copy",                  C,  "edit",     "cutOps",           'c',   xCx, "Copy the current selection to the clipboard and then delete it"],
["paste",             0,   "\\Paste",                 C,  "edit",     "cutOps",           'v',   xCx, "Paste the current contents of the clipboard"],
["pasteSpecial",      0,   "Paste Special...",        C,  "edit",     "cutOps",           0,     0,   "Select a format to paste from the clipboard"],

["viewOps",           0,   "",                        G],
["splitVertical",     0,   "Split Verically",         C,  "view",     "viewOps",          0,     0,   "Split the display into two columns"],
["splitHorizontal",   0,   "Split Horizontally",      C,  "view",     "viewOps",          0,     0,   "Split the display into two rows"],

["navigateOps",       0,   "",                        G],
["back",              1,   "Back",                    C,  "navigate", "navigateOps",      'b',   xCx, "Go back to the previous location"],
["forward",           1,   "Forward",                 C,  "navigate", "navigateOps",      'f',   xCx, "Go forward to the next location"],
["recent",            1,   "Recent",                  M,  "navigate", "navigateOps",      0,     0,   "Select a recent location"],
["next",              0,   "Next",                    C,  "navigate", "navigateOps",      9,     xxx, "tab", "Go to the next location in the active navagable set"],
["previous",          0,   "Previous",                C,  "navigate", "navigateOps",      9,     Sxx, "shift+tab", "Go to the previous location in the active navagable set"],
["home",              0,   "Home",                    C,  "navigate", "navigateOps",      0,     0,   "Go to the first location in the active navagable set"],
["end",               0,   "End",                     C,  "navigate", "navigateOps",      0,     0,   "Go to the last location in the active navagable set"],
["find",              0,   "Find...",                 C,  "navigate", "navigateOps",      0,     0,   "Find an object"],
["search",            0,   "Search...",               C,  "navigate", "navigateOps",      0,     0,   "Search for an object"],

["navigateBehaviors", 0,   "",                        G],
["trapTabInPane",     0,   "Trap Tab in Pane",        C,  "navigate", "navigateBehaviors",0,     0,   "Prevent the tab key from navigating out of the active pane."],
["trapTabInApp",      0,   "Trap Tab in App",         C,  "navigate", "navigateBehaviors",0,     0,   "Prevent the tab key from navigating out of the application."],

["debugOps",          0,   "",                        G],
["rowsets",           0,   "Rowsets",                 M,  "debug",    "debugOps",         0,     0,   "Display/edit rowset data"],

["helpOps",           0,   "",                        G],
["appHelp",           0,   "Documentation",           C,  "help",     "helpOps",          0,     0,   "Get help with this application"],
["appTutorial",       0,   "Tutorial",                C,  "help",     "helpOps",          0,     0,   "Get to the tutorial for this application"],
["searchHelp",        0,   "Search Documentation...", C,  "help",     "helpOps",          0,     0,   "Search for a particular help topic"],
["appNews",           0,   "News",                    C,  "help",     "helpOps",          0,     0,   "Get news about this application"],
["fileTicket",        0,   "File Ticket",             C,  "help",     "helpOps",          0,     0,   "File a support ticket"],
["contactSupport",    0,   "Contact Support",         C,  "help",     "helpOps",          0,     0,   "Contact technical support"],
["contact",           0,   "Contact",                 C,  "help",     "helpOps",          0,     0,   "Contact information for this application"],
["about",             0,   "About",                   C,  "help",     "helpOps",          0,     0,   "Get information about this application"],

["dialogOps",         0,   "",                        G],
["dialogOk",          0,   "",                        C,  "",         "dialogOps",        13,    xxx,   "Send the input to the application"],
["dialogCancel",      0,   "",                        C,  "",         "dialogOps",        27,    xxx,   "Cancel this operation"]

];

var items= {};
for (var i= 0, end= rawItems.length; i<end; i++) {
  var
    item= rawItems[i],
    accelText= -1,
    statusText= item[8] || null;
  if (item.length==10) {
    accelText= item[8];
    statusText= item[9];
  }
  items[item[0]]= {
    id:item[0],
    enabledIcon:item[1],
    text:item[2],
    role:item[3],
    parentMenuId:item[4] || null,
    groupId:item[5] || null,
    accelKey:item[6] || null,
    accelShift:item[7] || null,
    accelText:accelText,
    statusText:statusText,
    itemOrder:(i+1)*100};
};

define({root: items});

})();
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

