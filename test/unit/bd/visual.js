define(["dojo", "bd", "bd/visual"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/visual",
  theClass("[bd.visual]", demo("[*]", function() {
    var myWidgetClass, widget, node, kwargs;

    // create a widget class that is nothing more than a bd.visual
    myWidgetClass= bd.declare([bd.visual], {cssStatefulWatch: {visible:0, focused:0}});
   
    // create on object of that class with no default overrides
    kwargs= {descriptor:{}};

    widget= new myWidgetClass(kwargs);

    the(widget.kwargs).is(kwargs);
    the(widget.descriptor).is(kwargs.descriptor);
   
    node= widget.domNode;
    the(node.nodeName.toLowerCase()).is("div");
    the(dojo.attr(node, "dir")).is(null);
    the(dojo.attr(node, "lang")).is(null);
    the(dojo.attr(node, "title")).is(null);
    // although class wasn't set, getAttribute still returns ""
    the(dojo.attr(node, "class")).is("");
    the(dojo.attr(node, "style")).is(null);
    the(node.childNodes.length).is(0);

    the(widget.get("name")).is("");
    the(widget.get("visible")).is(true);
    the(widget.get("dir")).is("ltr");
    the(widget.get("lang")).is(bd.domAttrNoValue);
    the(widget.get("title")).is(bd.domAttrNoValue);
    the(widget.get("class")).is(bd.domAttrNoValue);
    the(widget.get("style")).is(bd.domAttrNoValue);

    the(dojo.hasClass(node, "Hidden")).is(false);
    the(widget.set("visible", false)).is(true);
    the(widget.get("visible")).is(false);
    the(dojo.hasClass(node, "Hidden")).is(true);
    the(widget.set("visible", true)).is(false);
    the(widget.get("visible")).is(true);
    the(dojo.hasClass(node, "Hidden")).is(false);

    the(widget.set("title", "test1")).is(bd.domAttrNoValue);
    the(widget.get("title")).is("test1");
    the(dojo.attr(node, "title")).is("test1");
    the(widget.set("title", "test2")).is("test1");
    the(widget.get("title")).is("test2");
    the(dojo.attr(node, "title")).is("test2");

    the(widget.set("class", "test1")).is(bd.domAttrNoValue);
    the(widget.get("class")).is("test1");
    the(dojo.attr(node, "class")).is("test1");
    the(widget.set("class", "test2")).is("test1");
    the(widget.get("class")).is("test2");
    the(dojo.attr(node, "class")).is("test2");
    node.setAttribute("class", "test2 extra");
    the(widget.get("class")).is("test2");
    the(widget.set("class", "test3")).is("test2");
    the(widget.get("class")).is("test3");
    var t= dojo.attr(node, "class");
    the(t=="test3 extra" || t=="extra test3").is(true);
    
    // the styles returned are those calculated and formatted by the browser and therefore
    // not guaranteed predictable
    the(widget.set("style", "top:1em;")).is(bd.domAttrNoValue);
    the(widget.set("style", {right:"2em"})).isString();

    kwargs= {descriptor:{
      visible:false,
      dir:"rtl",
      lang:"en-US",
      title:"myWidget",
      "class":"myClass",
      "style":"display:none;"
    }};
    widget= new myWidgetClass(kwargs);
    node= widget.domNode;
    the(dojo.hasClass(node, "Hidden")).is(true);
    the(dojo.hasClass(node, "myClass")).is(true);
    the(widget.get("dir")).is("rtl");
    the(dojo.attr(node, "dir")).is("rtl");
    the(widget.get("lang")).is("en-US");
    the(dojo.attr(node, "lang")).is("en-US");
    the(widget.get("title")).is("myWidget");
    the(dojo.attr(node, "title")).is("myWidget");
    the(dojo.style(node, "display")).is("none");
  }))
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
