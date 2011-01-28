define("bd/dijit/toolbar", [
  "bd",
  "dijit",
  "bd/containable",
  "bd/dijit/compat",
  "dijit/Toolbar"
], function(bd, dijit) {
///
// Defines the class bd.dijit.toolbar.

return bd.dijit.toolbar= bd.declare(
  ///
  // Dojo's dijit.Toolbar wrapped for use with the Backdraft framework. //Includes the following features:
  // 
  // * A constructor compatible with bd.createWidget.
  // * A `disabled` attribute that prevents all user interaction is true and has no effect otherwise.
  // * A `visible` attribute that shows/hides the widget.
  // * A `focusable` attribute that computes the whether or not the widget can receive the focus based in enabled/visible status.
  // * The bd.containable mixin.
  // 
  // All of these features are implemented uniformily through several mixin classes.
  [
  dijit.Toolbar,
  bd.containable,
  bd.dijit.disabled,
  bd.dijit.visible,
  bd.dijit.focusable,
  bd.dijit.constructor], {});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

