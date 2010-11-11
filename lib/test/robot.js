define("bd/test/robot", [
  "bd", "bd/test/namespace"
], function(bd) {
bd.test.robot= {
  htmlEvent: function(node, eventType) {
    //seee https://developer.mozilla.org/en/DOM/event.initEvent
    var 
      e= document.createEvent('HTMLEvents'),
      behavior= this.eventBehavior[eventType];
    e.initEvent(eventType, behavior[1], behavior[0]);
    node.dispatchEvent(e);
  },

  mouseEvent: function(node, eventType, shift, control, alt, meta, clientX, clientY, screenX, screenY, detail, relatedTarget) {
    //see https://developer.mozilla.org/en/DOM/event.initMouseEvent
    var button= 0;
    if (eventType.charAt(1)=="-") {
      button= eventType.charAt(0).toLowerCase();
      button= button=="r" ? 2 : (button=="c" ? 1 : 0);
      eventType= eventType.substring(2);
    }     
    clientX= clientX || 0;
    clientY= clientY || 0;
    //if no screen coords were given, just assume the browser viewport's origin is at the top-left of the screen
    screenX= screenX || clientX;
    screenY= screenY || clientY;
    detail= detail || 1;
    relatedTarget= relatedTarget || null;
    var 
      e = document.createEvent('MouseEvents'),
      behavior= this.eventBehavior[eventType];
    e.initMouseEvent(eventType, behavior[1], behavior[0], window, detail, screenX, screenY, clientX, clientY, control, alt, shift, meta, button, relatedTarget);
    node.dispatchEvent(e);
  },

  uiEvent: function(node, eventType, detail) {
    //seee https://developer.mozilla.org/en/DOM/event.initUIEvent
    var 
      e = document.createEvent('UIEvents'),
      behavior= this.eventBehavior[eventType];
    e.initUIEvent(eventType, eProps[1], eProps[0], window, detail||1);
    node.dispatchEvent(e);
  },

  keyboardEvent: function(node, eventType, keyCode, charCode, shift, control, alt, meta) {
    //see https://developer.mozilla.org/en/DOM/event.initKeyEvent
    var 
      e= document.createEvent("KeyboardEvent"),
      behavior= this.eventBehavior[eventType];
    e.initKeyEvent(eventType, behavior[1], behavior[0], window,  control, alt, shift, meta, keyCode, charCode);
    node.dispatchEvent(e);
  },

  eventBehavior: {
    //event-name --> [bubbles, cancelable]
  
    //html events...
    abort: [1, 0],
    blur: [0, 0],
    change: [1, 0],
    error: [1, 0],
    focus: [0, 0],
    load: [0, 0],
    reset: [1, 0],
    resize: [1, 0],
    scroll: [1, 0],
    select: [1, 0],
    submit: [1, 0],
    unload: [0, 0],
  
    //mouse events...
    click: [1, 1],
    mousedown: [1, 1],
    mousemove: [1, 0],
    mouseout: [1, 1],
    mouseover: [1, 1],
    mouseup: [1, 1],
  
    //UI events...
    DOMActivate: [1, 1],
    DOMFocusIn: [1, 0],
    DOMFocusOut: [1, 0],
  
    //keyboard events (note: there is no startard for this behavior)...
    keydown: [1, 1],
    keypress: [1, 1],
    keyup: [1, 1]
  },

  keymap: {
    // key --> [shift, keyCode, charCode]
    // this is the firefox-US-en map, replace with another map for other browsers as required
    "f1":[0, 112, 0],
    "f2":[0, 113, 0],
    "f3":[0, 114, 0],
    "f4":[0, 115, 0],
    "f5":[0, 116, 0],
    "f6":[0, 117, 0],
    "f7":[0, 118, 0],
    "f8":[0, 119, 0],
    "f9":[0, 120, 0],
    "f10":[0, 121, 0],
    "f11":[0, 122, 0],
    "f12":[0, 123, 0],
    "escape":[0, 27, 0],
    "tab":[0, 9, 0],
    "\t":[0, 9, 0],
    "backspace":[0, 8, 0],
    "\b":[0, 8, 0],
    "home":[0, 36, 0],
    "end":[0, 35, 0],
    "pageUp":[0, 33, 0],
    "pageDown":[0, 34, 0],
    "up":[0, 38, 0],
    "down":[0, 40, 0],
    "left":[0, 37, 0],
    "right":[0, 39, 0],
    "ins":[0, 45, 0],
    "del":[0, 46, 0],
    "`":[0, 192, 96],
    "1":[0, 49, 49],
    "2":[0, 50, 50],
    "3":[0, 51, 51],
    "4":[0, 52, 52],
    "5":[0, 53, 53],
    "6":[0, 54, 54],
    "7":[0, 55, 55],
    "8":[0, 56, 56],
    "9":[0, 57, 57],
    "0":[0, 48, 48],
    "-":[0, 109, 45],
    "=":[0, 61, 61],
    "q":[0, 81, 113],
    "w":[0, 87, 119],
    "e":[0, 69, 101],
    "r":[0, 82, 114],
    "t":[0, 84, 116],
    "y":[0, 89, 121],
    "u":[0, 85, 117],
    "i":[0, 73, 105],
    "o":[0, 79, 111],
    "p":[0, 80, 112],
    "[0, ":[0, 219, 91],
    "]":[0, 221, 93],
    "\\":[0, 220, 92],
    "a":[0, 65,97],
    "s":[0, 83, 115],
    "d":[0, 68, 100],
    "f":[0, 70, 102],
    "g":[0, 71, 103],
    "h":[0, 72, 104],
    "j":[0, 74, 106],
    "k":[0, 75, 107],
    "l":[0, 76, 108],
    ";":[0, 59, 59],
    "'":[0, 222, 39],
    "z":[0, 90, 122],
    "x":[0, 88, 120],
    "c":[0, 67, 99],
    "v":[0, 86, 118],
    "b":[0, 66, 98],
    "n":[0, 78, 110],
    "m":[0, 77, 109],
    ",":[0, 188, 44], 
    ".":[0, 190, 46], 
    "/":[0, 191, 47],
    " ":[0, 32, 32],
    
    //shifted keys
    "~":[1, 192, 126],
    "!":[1, 49, 33],
    "@":[1, 50, 64],
    "#":[1, 51, 35],
    "$":[1, 52, 36],
    "%":[1, 53, 37],
    "^":[1, 54, 94],
    "&":[1, 55, 38],
    "*":[1, 56, 42],
    "(":[1, 57, 40],
    ")":[1, 48, 41],
    "_":[1, 109, 95],
    "+":[1, 61, 43],
    "Q":[1, 81, 81],
    "W":[1, 87, 87],
    "E":[1, 69, 69],
    "R":[1, 82, 82],
    "T":[1, 84, 84],
    "Y":[1, 89, 89],
    "U":[1, 85, 85],
    "I":[1, 73, 73],
    "O":[1, 79, 79],
    "P":[1, 80, 80],
    "{":[1, 219, 123],
    "}":[1, 221, 125],
    "|":[1, 220, 124], 
    "A":[1, 65, 65],
    "S":[1, 83, 83],
    "D":[1, 68, 68],
    "F":[1, 70, 70],
    "G":[1, 71, 71],
    "H":[1, 72, 72],
    "J":[1, 74, 74],
    "K":[1, 75, 75],
    "L":[1, 76, 76],
    ":":[1, 59, 58],
    "|":[1, 222, 34],
    "Z":[1, 90, 90],
    "X":[1, 88, 88],
    "C":[1, 67, 67],
    "V":[1, 86, 86],
    "B":[1, 66, 66],
    "N":[1, 78, 78],
    "M":[1, 77, 77],
    "<":[1, 188,60], 
    ">":[1, 190,62], 
    "?":[1, 191, 63]
  }
};

return bd.test.robot;

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

