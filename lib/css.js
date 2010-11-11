define("bd/css", [
  "dojo", "bd"
], function(dojo, bd) {
///
// Augments the bd namespace with CSS convenience functions.

bd.css=
  ///namespace 
  // Contains a set of convenience functions to help with CSS tasks.
 bd.css || {};

bd.docGen("bd.css", {
  abbreviatedBox: {
    ///type
    // Provides none, one, some, or all of the top, right, bottom, left, height, and width
    // measurements of a box. //The key attribute of this type is specifying these metrics without
    // having to "spell out" the attribute (e.g., just write "t" instead of "top"). For example,
    // in order to get the CSS style string:
    //c "top: 5em; left: 10em; height: 15em; width: 60em;"
    /// Simply write
    //c bd.css.emBox({t:5, l:10, h:15, w:60}); 
    
    t:
      ///
      //The "top" attribute.
      //(number or string) Valid metric as defined by usage context (see bd.css.box, bd.css.emBox).
      undefined,

    r:
      ///
      // The "right" attribute.
      //(number or string) Valid metric as defined by usage context (see bd.css.box, bd.css.emBox).
      undefined,

    b:
      ///
      // The "bottom" attribute.
      //(number or string) Valid metric as defined by usage context (see bd.css.box, bd.css.emBox).
      undefined,

    l:
      ///
      // The "left" attribute.
      //(number or string) Valid metric as defined by usage context (see bd.css.box, bd.css.emBox).
      undefined,

    h:
      ///
      // The "height" attribute.
      //(number or string) Valid metric as defined by usage context (see bd.css.box, bd.css.emBox).
      undefined,

    w:
      ///
      // The "width" attribute.
      //(number or string) Valid metric as defined by usage context (see bd.css.box, bd.css.emBox).
      undefined
  },
  cornerPosit:
    ///type
    // A string of the form (t|c|b)(l|c|r)-(t|c|b)(l|c|r) that says how to position one box with respect to another.  //The
    // characters t, c, b, l, and r, stand for top, center, bottom, left, and right, respectively. The first pair give the
    // target box position while the second pair give the reference box position. For example "BR-TL" says position the bottom-right
    // corner of the target box at the same coordinate as the top-left corner of the reference box. See bd.css.cornerCalculators.
    0
});

bd.mix(bd.css, {
  metric:
    function(
      value //(string) a CSS length (e.g., "25%"); missing units implies pixels (e.g., "25" implies "25px").
            //(number) a CSS length to be interpreted as pixels (e.g., 25 implies "25px").
    ) {
      ///
      // Converts value to a valid CSS length string. //A string of dijits or a number without units imply units of "px".
      if (bd.isString(value)){
        if (/^\d+$/.test(value)) {
          //size is a raw number; therefore, it must be pixels
          value= value + "px";
        }
      } else {
        value= value + "px";
      }
      return value; ///(string) A valid CSS metric with units.
    },

  emBox:
    function(
      box //(bd.css.abbreviatedBox) Box to convert.
    ){
      ///
      // Converts box to a valid object containing CSS box metrics suitable as a setter
      // value for dojo.style. //Assumes box units are "em".
      // Box metrics must be numbers or strings that convert to numbers. For example,
      // in order to get...
      //c {top: "5em", left: "10em", height: "15em", width: "60em"}
      /// Simply write...
      //c bd.css.emBox({t:5, l:10, h:15, w:60}); 
      var result= {};
      box.t!==undefined && (result.top= box.t + "em");
      box.b!==undefined && (result.bottom= box.b + "em");
      box.l!==undefined && (result.left= box.l + "em");
      box.r!==undefined && (result.right= box.r + "em");
      box.h!==undefined && (result.height= box.h + "em");
      box.w!==undefined && (result.width= box.w + "em");
      return result; ///(object) A valid object to pass to dojo.style with box metrics.
    },

  box:
    function(
      box //(bd.css.abbreviatedBox) Box to convert.
    ){
      ///
      // Converts box to a valid object containing CSS box metrics suitable as a setter
      // value for dojo.style. //Assumes box units are "px" if 
      // missing. Box metrics must be values that convert to valid CSS metrics as
      // given by bd.css.metric. For example, in order to get the CSS style string:
      //c {top: "5px", left: "10px", height: "15%", width: "50%"}
      /// Simply write,
      //c bd.css.box({t:5, l:10, h:"15%", w:"50%"}); 
      var result= {};
      box.t!==undefined && (result.top= bd.css.metric(box.t));
      box.b!==undefined && (result.bottom= bd.css.metric(box.b));
      box.l!==undefined && (result.left= bd.css.metric(box.l));
      box.r!==undefined && (result.right= bd.css.metric(box.r));
      box.h!==undefined && (result.height= bd.css.metric(box.h));
      box.w!==undefined && (result.width= bd.css.metric(box.w));
      return result; ///(object) A valid object to pass to dojo.style with box metrics.
    },

  clearPosit:
    function(
      node //(DOM node) The node to clear.
    ){
      ///
      // Sets the top, bottom, left, and right CSS properties to empty string.
      dojo.style(node, {top:'', bottom:'', left:'', right:''});
      return node; ///(DOM node) The node argument; allows for chaining function calls on the node.
    },

  clearSize:
    function(
      node //(DOM node) The node to clear.
    ){
      ///
      // Sets the height and width CSS properties to empty string.
      dojo.style(node, {height:'', width:''});
      return node; ///(DOM node) The node argument; allows for chaining function calls on the node.
    },

  clearPositAndSize:
    function(
      node //(DOM node) the node to clear.
    ){
      ///
      // Sets the top, bottom, left, right, height, and width CSS properties to empty string.
      dojo.style(node, {top:'', bottom:'', left:'', right:'', height:'', width:''});
      return node; ///(DOM node) The node argument; allows for chaining function calls on the node.
    },

  cornerCalculators:
    ///namespace
    // Defines functions that compute the (top, left) coordinates of a target box with respect to a reference box.
    {}
});

bd.mix(bd.css.cornerCalculators, {
  left_ll: function(target, ref) {
    ///
    // Align the left side of the target with the left side of the reference.
    return ref.l; 
  },
  left_cl: function(target, ref) {
    ///
    // Align the horizontal center of the target with the left side of the reference.
    return ref.l - Math.floor(target.w / 2); 
  },
  left_rl: function(target, ref) {
    ///
    // Align the right side of the target with the left side of the reference.
    return ref.l - target.w; 
  },

  left_lc: function(target, ref) {
    ///
    // Align the left side of the target with the horizontal center of the reference.
    return ref.l + Math.floor(ref.w / 2); 
  },
  left_cc: function(target, ref) {
    ///
    // Align the horizontal center of the target with the horizontal center of the reference.
    return ref.l + Math.floor(ref.w / 2) - Math.floor(target.w / 2); 
  },
  left_rc: function(target, ref) {
    ///
    // Align the right side of the target with the horizontal center of the reference.
    return ref.l + Math.floor(ref.w / 2) - target.w; 
  },

  left_lr: function(target, ref) {
    ///
    // Align the left side of the target with the right side of the reference.
    return ref.l + ref.w; 
  },
  left_cr: function(target, ref) {
    ///
    // Align the horizontal center of the target with the right side of the reference.
    return ref.l + ref.w - Math.floor(target.w / 2); 
  },
  left_rr: function(target, ref) {
    ///
    // Align the right side of the target with the right side of the reference.
    return ref.l + ref.w - target.w; 
  },

  top_tt: function(target, ref) {
    ///
    // Align the top side of the target with the top side of the reference.
    return ref.t; 
  },
  top_ct: function(target, ref) {
    ///
    // Align the vertical center of the target with the top side of the reference.
    return ref.t - Math.floor(target.h / 2); 
  },
  top_bt: function(target, ref) {
    ///
    // Align the bottom side of the target with the top side of the reference.
    return ref.t - target.h; 
  },

  top_tc: function(target, ref) {
    ///
    // Align the top side of the target with the vertical center of the reference.
    return ref.t + Math.floor(ref.h / 2); 
  },
  top_cc: function(target, ref) {
    ///
    // Align the vertical center of the target with the vertical center of the reference.
    return ref.t + Math.floor(ref.h / 2) - Math.floor(target.h / 2); 
  },
  top_bc: function(target, ref) {
    ///
    // Align the bottom side of the target with the vertical center of the reference.
    return ref.t + Math.floor(ref.h / 2) - target.h; 
  },

  top_tb: function(target, ref) {
    ///
    // Align the top side of the target with the botom side of the reference.
    return ref.t + ref.h; 
  },
  top_cb: function(target, ref) {
    ///
    // Align the vertical center of the target with the bottom side of the reference.
    return ref.t + ref.h - Math.floor(target.h / 2); 
  },
  top_bb: function(target, ref) {
    ///
    // Align the bottom side of the target with the bottom side of the reference.
    return ref.t + ref.h - target.h; 
  },

  getTop:
    function(
      posit,       //(bd.css.cornerPosit) The position to compute targetBox with respect to referenceBox.
      targetBox,   //(bd.css.abbreviatedBox) The target box.
      referenceBox //(bd.css.abbreviatedBox) The reference box.
    ) {
      ///
      // Returns the top coordinate of targetBox with respect to referenceBox at posit.
      return this["top_" + posit.charAt(0)+posit.charAt(3)](targetBox, referenceBox);
    },
  getLeft:
    function(
      posit,       //(bd.css.cornerPosit) The position to compute targetBox with respect to referenceBox.
      targetBox,   //(bd.css.abbreviatedBox) The target box.
      referenceBox //(bd.css.abbreviatedBox) The reference box.
    ) {
      ///
      // Returns the left coordinate of targetBox with respect to referenceBox at posit.
      return this["left_" + posit.charAt(1)+posit.charAt(4)](targetBox, referenceBox);
    }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
