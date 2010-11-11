define("bd/widget/messageBox", [
  "bd",
  "bd/widget/dialog",
  "bd/widget/staticText",
  "bd/dijit/button"
], function(bd) {
///
// Defines the message box function.

return bd.widget.messageBox= function(
  title,    //(string) The title of the message box.
  message,  //(string) The message to display in the message box.
  buttons,  //(array of string, optional, ["OK"]) A set of bottons to display under the message.
  callback, //(function(string)) The function to call when the dialog is dismissed by pressing one of the buttons.
  context,  //(object, optional) Context in which to apply callback.
  vargs     //(variableArgs, optional) Zero or more arguments for application of callback.
) {
  ///
  // Displays a message box in the center of the viewport. //When one of the buttons is pressed, the callback is
  // applied to the text of the button; if the close button is pressed on the dialog, callback is applied to "".
  callback= callback && bd.hitchCallback(arguments, 3);
  var theDialog;
  bd.createWidget({descriptor:{
    className:"bd:widget.dialog",
    title:title,
    frameSize: {height:"5em", width:"30em"},
    sizeable: false,
    setFrameSize: function() {
      var h= 0, w= 0, buttonWidth= 0;
      // calculate the required height x width; find the biggest button
      bd.forEach(this.children, function(child, i) {
        var box= dojo.marginBox(child.domNode);
        if (box) {
          h= Math.max(h, box.t + box.h);
          w= Math.max(w, box.l + box.w);
          if (i) {
            dojo.contentBox(child.domNode.firstChild.firstChild);
            buttonWidth= Math.max(buttonWidth, box.w);
          }
        }
      });
      // set the dialog exactly big enough to contain the contents
      dojo.marginBox(this.containerNode, {h:h, w:w});
      // make all the buttons the same size...they look better this way.
      // note: we can't make them the same height because the dojo buttons
      // don't support this.
      // TODO: make a more-flexible button widget
      bd.forEach(this.children, function(child, i) {
        i && dojo.contentBox(child.domNode.firstChild.firstChild, {w:buttonWidth});
      });
    },
    onCancel: function(e) {
      this.endDialog(e);
      callback && callback("");
    },
    children: [{
      className:"bd:widget.staticText",
      value:message,
      "class":"bdMessageBoxText"
    }].concat(bd.map(buttons || ["OK"], function(buttonText) {
      return {
        className:'bd:dijit.button',
        label:buttonText,
        "class":"bdMessageBoxButton",
        onClick:function() {
          this.parent.endDialog();
          callback && callback(buttonText);
        }
      };
    }))
  }}, function(dialog){ 
    theDialog= dialog;
    dialog.show();
    return theDialog;
  });
};

});
// Copyright (c) 2006-2010, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
