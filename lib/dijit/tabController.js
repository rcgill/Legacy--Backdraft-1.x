define("bd/dijit/tabController", [
  "bd",
  "dijit",
  "bd/containable",
  "bd/dijit/compat",
  "dijit/layout/TabController"
], function(bd, dijit) {
///
// Defines the class bd.dijit.tabController.

return bd.dijit.tabController= bd.declare(
  ///
  // Dojo's dijit.TabController wrapped for use with the Backdraft framework. //Includes the following features:
  // 
  // * A constructor compatible with bd.createWidget.
  // * A `disabled` attribute that prevents all user interaction is true and has no effect otherwise.
  // * A `visible` attribute that shows/hides the widget.
  // * A `focusable` attribute that computes the whether or not the widget can receive the focus based in enabled/visible status.
  // * The bd.containable mixin.
  // 
  // All of these features are implemented uniformily through several mixin classes.
  [
  dijit.TabController,
  bd.containable,
  bd.dijit.disabled,
  bd.dijit.visible,
  bd.dijit.focusable,
  bd.dijit.constructor], {});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

