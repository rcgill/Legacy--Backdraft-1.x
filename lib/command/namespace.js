define("bd/command/namespace", ["bd"], function(bd) {
///
// Augments the bd namespace with the bd.command namespace.
///
//note
// Typically, client programs do not load this module directly, but rather load one or more of the bd/command/accelerators,
// bd/command/dispatch, or bd/command/item modules.  See module.bd.command.acclerators, module.bd.command.dispatch,
// module.bd.command.item.

bd.command=
  ///namespace
  // Contains the Backdraft command machinery.
  bd.command || {};

return bd.command;

});
