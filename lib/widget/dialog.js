define("bd/widget/dialog", [
  "dojo", "dijit", "bd",
  "i18n!dijit/nls/common",
  "i18n!bd/nls/command",
  "bd/visual",
  "bd/focusable",
  "bd/mouseable",
  "bd/container",
  "bd/navigator",
  "bd/command/accelerators",
  "bd/htmlGen",
  "bd/async",
  "bd/mouse",
  "bd/css",
  "dojo/dnd/Moveable",
  "dojo/dnd/TimedMoveable",
  "require"
], function(dojo, dijit, bd, dijitI18nCommon, dialogCommands) {
///
// Defines the bd.widget.dialog and associated machinery.


 
bd.forEach(["next", "previous", "dialogOk", "dialogCancel"], function(commandId) {
  bd.command.addItem(dialogCommands[commandId]);
});


var 
  dialogCurtain= 0,
  getDialogCurtain= function() {
    return dialogCurtain || (dialogCurtain= dojo.create("div", {"class":"bdDialogCurtain"}, dojo.body(), "first"));
  };

bd.dialogStack= 
  ///
  // The current stack of active dialog box widgets. //The dialog box machinery installs a "curtain" (implemented
  // as a semitransparent div node absolutely positioned over the entire document (height, width, and z-index) *except*
  // for the currently active dialog (if any) which is on top of the curtain. This has the effect of rendering all of the
  // document DOM tree disabled except for the currently active dialog. 
  // 
  // As dialog boxes are nested and dismissed, the z-index is computed as follows:
  // 
  // * the dialog box at bd.dialogStack[i] has a z-index of ((i+1) * 1000) + 1
  // * the curtain has a z-index of one less than the z-index of the active dialog box, or -1000 if no dialog
  //   box is active.
  // 
  // This algorithm gives dialog boxes a wide operating range for their own z-index requirements.
  // 
  // bd.widget.dialog implements this algorithm. If client code defines other dialog box classes (possibly not
  // derived from bd.widget.dialog), they should use this algorithm, bd.dialogStack, and the
  // dialog curtain to ensure interoperability with the framework. The function bd.setDialogCurtain is available to
  // help with this task.
  [];

bd.setDialogCurtain= function(
    zIndex //(integer) The CSS z-index value to set.
  ) {
    ///
    // Sets the Backdraft dialog manager's curtain's z-index; see bd.dialogStack.
    dojo.style(getDialogCurtain(), zIndex==-1000 ? {display:"none"} : {display:"", zIndex:zIndex});
  };

return bd.widget.dialog= bd.declare(
  ///
  // A sizeable, positionable, draggable modal dialog box. //In addition to coordinating with the dialog manager
  // as described in bd.dialogStack, this class pushes the current accelerators when a dialog instance
  // becomes the active and restores the accelerators when the dialog is hidden. This effectively disables global command accelerator
  // machinery when a dialog is active.

  // superclasses
  [bd.visual, bd.navigator, bd.mouseable, bd.container],

  //members
  bd.constAttr(
   ///
   // Indicates whether or not the dialog can be moved by dragging the title bar
   //(boolean, optional, true) The dialog can be dragged if truthy, and conversely.

   "draggable",

   true //default value
  ),

  bd.attr(
    ///
    // Gives the reference box from which to calculate the dialog's size and position. //See bd.widget.dialog.position.
    ///
    //(object with property domNode) The reference box is given by the margin box of the property domNode.
    //(DOM node) The reference box is given by the margin box of the DOM node.
    //(bd.css.abbreviatedBox) The reference box is the given rectangle in viewport coordinates (pixels).
    //(falsy, default) The reference box is the rectangle given by the entire viewport. 

    "positRef",

    0 // default value
  ),

  bd.attr(
    ///
    // Gives the position with respect to the `positRef` attribute at which to place the dialog.
    ///
    //(bd.css.cornerPosit, optional, "cc-cc") The position with respect to the `positRef` attribute at which to place the dialog.

    "posit",

    "cc-cc" // default value
  ),

  bd.attr(
    ///
    // Indicates if the dialog box is sizeable. //If the dialog box is sizeable, then hovering the mouse on the frame
    // causes the appropriate resizing cursor to appear; pressing the left mouse button and dragging the mouse causes
    // mouse capture and the box is resized consequent to the drag.
    ///
    //(boolean, optional, true) If truthy, the dialog box is sizeable, and conversely.

    "sizeable",

    true // default value
  ),

  bd.attr(
    ///
    // Controls the size of the dialog box content frame. //The content frame is defined as the entire dialog except the title bar 
    // and frame; this part of the dialog is contained in the `containerNode` property.
    // 
    //(CSS style object) A CSS style object suitable for dojo.style.
    //(falsy, default) The size of the container node is not initialized/set by the class machinery.

    "frameSize",

    0, // default value

    function(value) { //setter
      var oldValue= this.frameSize;
      if (oldValue!=value) {
        this.containerNode && dojo.style(this.containerNode, value);
        this.started && this.position();
      }
      return oldValue;
    }
  ),

  bd.attr(
    ///
    // Controls the minimum size of the dialog box content frame (see bd.widget.dialog.frameSize).
    ///
    //(bd.css.abbriviatedBox with h and w metrics, optional, {h:25, w:50}) The minimum dimensions in pixels for the content frame.

    "frameSizeMin",

    {h:25, w:50}, //default value

    function(value) { //setter
      if (isNaN(value.h) || isNan(value.w)) {
        return bd.failed;
      }
      var oldValue= this.frameSizeMin;
      if (oldValue!=value) {
        if (value.h<oldValue.h || value.h<oldValue.h && this.started) {
          this.position();
        }
      }
      return oldValue;
    }
  ),

  bd.attr(
    ///
    // Controls automatic destruction of the dialog box. //When all side effects of a dialog are completed
    // in the onOK/onCancel connection points, `this.persist` can be set to false, thereby eliminating any need for 
    // client code to manage the dialog after showing it (i.e., client code doesn't even need to keep a reference to
    // the dialog--it will be cleaned up and fully destroyed automatically). On the other hand, if a particular single
    // instance is intended to be shown/hidden frequently, `this.persist` can be set to true and client code
    // can keep a reference to an already-constructed dialog, simplifying and speeding display.
    // 
    //(boolean, optional, false) Automatically destroy the dialog box upon during `this.endDialog` processing if false, and conversely.

    "persist",

    false // default value
  ),

  bd.attr(
    ///
    // Causes navigation to cycle within the dialog. See bd.navigator.cycleNavigation.
    ///
    //(boolean, optional, true) Truthy if navigation should cycle within the children controlled by this navigator, and conversely.

    "cycleNavigation",

    true // default value
  ),

  {
  template: bd.compileHtmlTemplate(
    {div: [{dclass:"bdDialog", id:"{id}", widgetId:"{id}"}, "domNode", [
      {div: [{dclass:"bdDialogTitleBar"}, "titleBarNode", [
        {span: [{dclass:"bdDialogTitle", id:"{id}_title"}, ["{title}"]]},
        {div: [{dclass:"bdDialogClose", title:"{buttonCancel}"}, "closeButtonNode", {click:"onCancel", mouseenter:"onCloseEnter", mouseleave:"onCloseLeave"}, [
          {span: [{dclass:"bdDialogCloseIcon"}]},
          {span: [{dclass:"bdDialogCloseText"}, "closeText", ["\u2715"]]}]]}]]},
      {div: [{dclass:"bdDialogContentFrame {class}"}, "containerNode"]}]]}),

  titleBarNode:
    ///
    // Holds a reference to the DOM node that contains the title bar.
    0,

  containerNode:
    ///
    // Holds a reference to the DOM node that contains the content frame
    0,

  buttonCloseNode:
    ///
    // Holds a reference to the DOM node that contains the close button on the title bar.
    0,

  createDom: function() {
      //TODO: improve template to pass dir and lang
      //TODO: improve template to utilize i18n!dijit/nls/common
      this.l10n= dijitI18nCommon;
      this.domNode= bd.generateHtmlTemplate(this.template, this, {id:this.id, "class":this["class"], title:this.title, buttonCancel:"cancel"});
      this.dir!==undefined && dojo.attr(this.domNode, "dir", this.dir);
      this.lang!==undefined && dojo.attr(this.domNode, "lang", this.lang);
      this.style!==undefined && dojo.style(this.domNode, this.style);
      this.frameSize && dojo.style(this.containerNode, this.frameSize);
  },

  postcreateDom: function() {
    this.inherited(arguments);
    if (this.titleBarNode && this.draggable) {
      this._moveable= (dojo.isIE == 6) ?
        new dojo.dnd.TimedMoveable(this.domNode, { handle: this.titleBarNode }) :   // prevent overload, see #5285
        new dojo.dnd.Moveable(this.domNode, { handle: this.titleBarNode, timeout: 0 });
      dojo.subscribe("/dnd/move/stop", this, "endDrag");
    } else {
      dojo.addClass(node,"dijitDialogFixed");
    }
    bd.subscribe("bd/viewportResize", "position", this);
    bd.subscribe("bd/viewportScroll", "position", this);
  },

  endDrag: function(e) {
    if (e && e.node && e.node===this.domNode) {
      var
        vp= dijit.getViewport(),
        p= e._leftTop || dojo.coords(e.node, true);
      this._relativePosition= {
        t: p.t - vp.t,
        l: p.l - vp.l
      };
    }
  },

//TODO show and focus and analgous
//TODO make sure the CSS for dialog gives overflow auto, posit relative
//TODO save _savedFocus

  destroy: function() {
    if (this._moveable) {
      this._moveable.destroy();
    }
    dojo.forEach(this._modalconnects, dojo.disconnect);
    this._savedFocus && this._savedFocus.focus();
    this.inherited(arguments);
  },

  position: function() {
    ///
    // Sets the size and position of the dialog box each time show is called.
    ///
    // The desired dialog box size is given by the size of the containerNode + the titleNode's height.
    // The size of the containerNode may be set by:
    // 
    //  * Using CSS styling on the various nodes.
    //  * The `frameSize` attribute; see bd.widget.dialog.frameSize.
    // 
    // Explicitly setting the frameSize is not guaranteed to work since this routine may adjust the
    // size.
    // 
    // The desired dialog box position is calculated relative as given by the attribute `posit` to a reference
    // rectangle as given by property `positRef`. See bd.widget.dialog.posit and bd.widget.dialog.positRef.
    // 
    // The positioning algorithm attemps to size and place the dialog as requested. However, if the viewport causes
    // the dialog to be clipped, then it will be moved up/down and/or left/right in an attempt to put
    // the dialog is a position where it all fits. If the dialog still overflows, then the dialog will be
    // resized down to the minimim sizes given by the attribute `frameSizeMin`. Finally, if the dialog is still too
    // big for the viewport (really, the viewport is still too small), then the dialog's CSS styling dictates
    // how to handle the overflow.
    // 
    // If the viewport is shrunk while the dialog is showing, a check is made to ensure at least the minimum size
    // of the dialog is showing; if not, then it is repositioned; if so, the dialog size and position is left unchanged.
    // This should prevent a viewport shrinking from hiding an showing dialog; thereby seeming to lock the program.

    var viewport, positRef, refRect, mb, t, l, posit, contentFrameMb, delta;

    // get the viewport rectangle
    viewport= dojo.window.getBox(),
    viewport.t= 0;
    viewport.l= 0;

    // get the reference rectangle
    positRef= this.positRef,
    refRect= (!positRef ? viewport : (positRef.domNode ? dojo.position(positRef.domNode) : (bd.isDomNode(positRef) ? dojo.position(positRef) : positRef)));
    refRect= {
      t: isNaN(refRect.y) ? 0 : Number(refRect.y),
      l: isNaN(refRect.x) ? 0 : Number(refRect.x),
      h: isNaN(refRect.h) ? viewport.h : Number(refRect.h),
      w: isNaN(refRect.w) ? viewport.w : Number(refRect.w)
    };
    this.setFrameSize && this.setFrameSize();
    mb= dojo.marginBox(this.domNode);

    // place the dialog as requested
    posit= this.posit || "cc-cc";
    t= bd.css.cornerCalculators.getTop(posit, mb, refRect);
    l= bd.css.cornerCalculators.getLeft(posit, mb, refRect);    
    // if the dialog overflows, try to move it so it fits...
    if (t + mb.h > viewport.h) {
      // dialog goes out the bottom; therefore, align with bottom...
      t= viewport.h - mb.h;
    }
    if (l + mb.w > viewport.w) {
      // dialog goes out the right; therefore, align with right...
      l= viewport.w - mb.w;
    }
    // if it is positioned above and/or left, correct to top and/or left
    t= t<0 ? 0 : t;
    l= l<0 ? 0 : l;
    (t!=mb.t || l!=mb.l) && dojo.marginBox(this.domNode, {t:t, l:l});

    // finally, if it still doesn't fit, make it fit iff sizeable
    // note: at this point t and/or l will be at 0 if it overflows h and/or w
    if (this.sizeable) {
      if (mb.h > viewport.h) {
        contentFrameMb= dojo.marginBox(this.containerNode);
        contentFrameMb.h-= (this.frameSizeMin ? Math.min(mb.h -viewport.h, contentFrameMb.h - this.frameSizeMin.h) : (mb.h -viewport.h));
      }
      if (mb.w > viewport.w) {
        contentFrameMb= contentFramewMb || dojo.marginBox(this.containerNode);
        contentFrameMb.w-= (this.frameSizeMin ? Math.min(mb.w -viewport.w, contentFrameMb.w - this.frameSizeMin.w) : (mb.w -viewport.w));
      }
      contentFrameMb && dojo.marginBox(this.containerNode, contentFrameMb);
    }
  },

  startup: function() {
    if (this.started) {
      return;
    }
    bd.dialogStack.push(this);
    var 
      depth= this.depth= bd.dialogStack.length,
      zIndex= 1000 + (depth * 100);
    bd.setDialogCurtain(zIndex);
    dojo.style(this.domNode, {zIndex: zIndex+1});
    dojo.body().appendChild(this.domNode);
    this.position();
    this.inherited(arguments, [true]);
    bd.command.pushAccels(["next", "previous", "dialogOk", "dialogCancel"]);
    bd.command.pushContext();
    bd.command.connect("dialogOk", "onAccelOk", this);
    bd.command.connect("dialogCancel", "onAccelCancel", this);
    bd.command.connect("next", bd.navigator.commandHandler);
    bd.command.connect("previous", bd.navigator.commandHandler);
    this.refocus= dijit._activeStack.slice(0);
    this.focus();
  },

  stop: function() {
    if (!this.started) {
      return;
    }
    bd.dialogStack.pop();
    var depth= bd.dialogStack.length;
    bd.setDialogCurtain(depth==0 ? -1000 : (1000 + ((depth) * 100)));
    this.inherited(arguments);
    bd.command.popAccels();
    bd.command.popContext();
    dojo.body().removeChild(this.domNode);
    var stack= this.refocus, foundFocusableWidget= false, widget;
    while (stack.length) {
      widget= bd.object.get(stack.pop());
      if (widget && widget.get("focusable")) {
        widget.focus();
        foundFocusableWidget= true;
      }
    }
    !foundFocusableWidget && dijit._setStack([]);
  },

  show: function() {
    ///
    // Show the dialog.
    this.startup();
  },

  hide: function() {
    ///
    // Hide the dialog.
    this.stop();
  },

  onCloseEnter: function() {
    dojo.addClass(this.closeButtonNode, "bdDialogCloseButtonHover");
  },

  onCloseLeave: function() {
    dojo.removeClass(this.closeButtonNode, "bdDialogCloseButtonHover");
  },

  setCursor: function(
    e //(DOM event object) The object that caused the event.
  ) {
    var 
      posit= dojo.position(this.domNode),
      y= e.clientY,
      x= e.clientX,
      dragZone=
        (y < posit.y+15 ? "T" : (y > posit.y+posit.h-15 ? "B" : "C")) +
        (x < posit.x+15 ? "L" : (x > posit.x+posit.w-15 ? "R" : "C")),
      cursor= "bdDialogSizeCursor" + dragZone;
    if (this.cursor!==cursor) {
      this.cursor && dojo.toggleClass(this.domNode, this.cursor);
      this.cursor= cursor;
      dojo.toggleClass(this.domNode, this.cursor);
    }
    return dragZone;
  },

  onMouseOver: function(
    e //(DOM event object) The object that caused the event.
  ) {
    if (this.sizeable && e.target===this.domNode) {
      this.setCursor(e);
    }
  },

  onMouseMove: function(
    e //(DOM event object) The object that caused the event.
  ) {
    if (this.sizeable && e.target===this.domNode) {
      this.setCursor(e);
    }
  },

  onMouseOut: function(
    e //(DOM event object) The object that caused the event.
  ) {
    if (this.sizeable && e.target===this.domNode) {
      if (this.cursor) {
        dojo.toggleClass(this.domNode, this.cursor);
        delete this.cursor;
      }
    }
  },

  onMouseDown: function(
    e //(DOM event object) The object that caused the event.
  ){
    if (this.sizeable && e.target===this.domNode) {
      dojo.stopEvent(e);
      var
        which= this.setCursor(e),
        moveTop= /TL|TC|TR/.test(which),
        moveBottom= /BL|BC|BR/.test(which),
        moveLeft= /TL|CL|BL/.test(which),
        moveRight= /TR|CR|BR/.test(which),
        start= e,
        mb= dojo.marginBox(this.domNode),
        frameMb= dojo.marginBox(this.containerNode),
        viewport= dojo.window.getBox(),
        me= this,
        doMove= function(e) {
          var
            deltaX= e.clientX - start.clientX,
            deltaY= e.clientY - start.clientY,
            deltaMb= {t:mb.t, l:mb.l},
            deltaFrameMb= {h:frameMb.h, w:frameMb.w};
          if (moveTop) {
            deltaY= Math.min(Math.max(-mb.t + viewport.t, deltaY), mb.h - me.frameSizeMin.h);
            deltaMb.t+= deltaY;
            deltaFrameMb.h-= deltaY;          
          } else if (moveBottom) {
            deltaY= Math.min(Math.max(-mb.h + me.frameSizeMin.h, deltaY), viewport.h + viewport.t - mb.t - mb.h);
            deltaFrameMb.h+= deltaY;
          }
          if (moveLeft) {
            deltaX= Math.min(Math.max(-mb.l + viewport.l, deltaX), mb.w - me.frameSizeMin.w);
            deltaMb.l+= deltaX;
            deltaFrameMb.w-= deltaX;          
          } else if (moveRight) {
            deltaX= Math.min(Math.max(-mb.w + me.frameSizeMin.w, deltaX), viewport.w + viewport.l - mb.l - mb.w);
            deltaFrameMb.w+= deltaX;
          }
          dojo.marginBox(me.domNode, deltaMb);
          dojo.marginBox(me.containerNode, deltaFrameMb);
        };
      bd.mouse.capture(this, {
        mousemove: function(e){
          doMove(e);
        },
        mouseup: function(e){
          bd.mouse.release();
          doMove(e);
          me.setCursor(e);
          me.layout();
        }
      });
   }
  },

  endDialog: function(
    e //(DOM event object) The object that caused the event.
  ) {
    ///
    // Stops the event (if any), hides the dialog, and optionally destroys the dialog instance.
    e && dojo.stopEvent(e);
    this.hide();
    !this.persist && this.destroy();
  },

  onCancel: function(
    e //(DOM event object) The object that caused the event.
  ) {
    ///
    // The close button was pressed (or equivalent). //Default processing ends
    // the dialog via the `endDialog` method. This method may be called by client code 
    // to explicitly cancel the dialog.
    this.endDialog(e);
  },

  onOk: function(
    e //(DOM event object) The object that caused the event.
  ) {
    ///
    // Nontrivial connection point to indicate the dialog was "accepted". //Default processing ends
    // the dialog via the `endDialog` method. This method is usually called by client code consequent to
    // some user action (typically, pressing an OK button contained within the dialog).
    this.endDialog(e);
  },

  onAccelCancel: function(
    e //(bd.command.eventObject) The object that caused the event.
  ) {
    this.onCancel(e.eventObject);
  },

  onAccelOk: function(
    e //(bd.command.eventObject) The object that caused the event.
  ) {
    this.onOk(e.eventObject);
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
