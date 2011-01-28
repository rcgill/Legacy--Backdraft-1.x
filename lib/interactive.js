define("bd/interactive", [
  "bd", 
  "bd/visual"
], function(bd) {
///
// Defines the bd.interactive class.

bd.interactive= bd.declare(
  ///
  // Mixin class for objects (widgets) that are interactive and can therefore be disabled.
  ///
  // Recall that bd.visual provides a constant attribute value of `true` for disabled since bd.visual
  // does not provide any kind of user interaction capabilities. This class is usually mixed when deriving classes from bd.visual
  // that add interaction capabilities.

  //superclasses
  [],

  //members
  bd.attr(
    ///
    //(boolean) true if the widget is disabled; false otherwise.
    ///
    // Indicates whether or not the widget or any of its decendents can accept the focus. //True indicates the widget
    // iwill not react to any user input (keyboard or mouse); false indicates the widget is capable of and will react
    // to some kinds of user interaction.
    "disabled",
  
    false //default value
  )
);

});
