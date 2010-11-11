define("bd/htmlGen", ["bd"], function(bd) {
///
// Augments the bd namespace with the Backdraft HTML template functions.

var
  escapeString= function(s) {
    if (bd.isString(s)) {
      return s.replace(/"/g, "\\\"");
    } else {
      return s + "";
    }
  };

bd.compileHtmlTemplate= function(element) {
  ///
  // Compiles a Backdraft HTML template for use with bd.generateHtmlTemplage.
  var
    attachPoint,
    connects,
    children,
    text= "", 
    tag, 
    contents, 
    attributes,
    a, 
    pairs= [], 
    childResult, 
    childrenHaveProcessing= 0, 
    i= 0, 
    length,
    result;
  if (bd.isString(element)) {
    return {text:element};
  }
  for (tag in element) {
    //there's always exactly one tag in element
    contents= element[tag];
    length= contents.length;
    //contents [i==0] holds the attributes
    attributes= contents[i++];
    for (a in attributes) {
      if (a=="dclass") {
        pairs.push("class=\"" + attributes[a] + "\"");
      } else {
        pairs.push(a + "=\"" + escapeString(attributes[a]) + "\"");
      }
    }
    attributes= (pairs.length ? (" " + pairs.join(" ")) : "");
    text+= "<" + tag + attributes + ">";
    //contents[next] holds the attach point (if any)
    if (i<length && bd.isString(contents[i])) {
      attachPoint= contents[i++];
    }
    //contents[next] holds the connect hash (if any)
    if (i<length && !bd.isArray(contents[i])) {
      connects= contents[i++];
    }
    //contents[next] holds the children array (if any)
    if (i<length) {
      children= [];
      bd.forEach(contents[i], function(element, childIndex) {
        childResult= bd.compileHtmlTemplate(element);
        text+= childResult.text;
        if (childResult.attachPoint || childResult.connects || childResult.children) {
          childrenHaveProcessing= true;
          children.push({attachPoint: childResult.attachPoint, connects: childResult.connects, children:childResult.children});
        } else {
          children.push(0);
        }
      });
      if (!childrenHaveProcessing) {
        children= 0;
      }
    }
    text+= "</" + tag + ">";
  }
  result= {text:text};
  attachPoint && (result.attachPoint= attachPoint);
  connects && (result.connects= connects);
  children && (result.children= children);
  return result;
};

bd.connectHtmlTemplate= function(
  domNode,  //(DOM node) The DOM subtree.
  template,   //(object) A Backdraft template previously compiled by bd.compileHtmlTemplate.
  context    //(object) The context the informs the connections.
) {
  ///
  // Connects a new DOM subtree to properties as given in context.
  if (template.attachPoint) {
    context[template.attachPoint]= domNode;
  }
  bd.forEachHash(template.connects, function(listener, event) {
    bd.connect(domNode, event, listener, context);
  });
  bd.forEach(template.children, function(childTemplate, i) {
    childTemplate && bd.connectHtmlTemplate(domNode.childNodes[i], childTemplate, context);
  });
};

bd.generateHtmlTemplate= function(
  template,   //(object) A Backdraft template previously compiled by bd.compileHtmlTemplate.
  context,    //(object) The context in which to build the DOM tree.
  replacements //(hash) A hash of replacement text referenced by template.
) {
  ///
  // Generates and connects a DOM subtree given a compiled Backdraft HTML template.
  var innerHTML= (replacements ? template.text.replace(/([^\\])\{([^\}]+)\}/g, function(theMatch, c, name) { return c+ replacements[name]; }) : template.text);
  getSandbox().innerHTML= innerHTML;
  bd.connectHtmlTemplate(sandbox.firstChild, template, context);
  return sandbox.removeChild(sandbox.firstChild);
};

var 
  sandbox= 0,
  getSandbox= function() {
    return sandbox || (sandbox= dojo.create("div"));
  };

});
