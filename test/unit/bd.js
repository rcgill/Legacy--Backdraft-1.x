// The root module "bd-unit".
// 
// This is the root module for the backdraft unit 
// tests tree. When smoke loads this module (as a root module), it calls the 
// following function, passing the url that was used to get this resource. 
// With this knowledge, we can set up a dojo.urlMap entry to map 
// "bd-unit/some/other/module" to "<url for this module>/some/other/module", thus
// allowing this and its children modules to be loaded without hard-coding the
// actual url at which the unit test tree lives in the application.

function(
  rootName, //(string) the name to give this module; "" says use default name
  url       //(URL) the URL that was used to load this module
) {
  rootName= rootName || "bd-unit";
  bd.test.proc.get(rootName).doc= "backdraft unit tests";
  dojo.urlMap.unshift([new RegExp("^" + dojo.regexp.escapeString(rootName)), url]);
 
  var modules= [
    "async",
    "clone",
    "collections",
    "command/accelerators",
    "command/dispatch",
    "command/item",
    "connect",
    "connectable",
    "containable",
    //"container", TODO
    "creators",
    "css",
    "cssStateful",
    "declare",
    "descriptor/cache",
    "descriptor/processor",
    //"dijit/*" //TODO
    "dom",
    "equal",
    //"focusable", TODO
    "frenzy",
    "hash",
    //"htmlGen", TODO
    "id",
    "interactive",
    "kernel",
    "lang",
    //"mouse",
    //"mouseable",
    "namespace",
    //"navigator",
    //"start",
    "stateful",
    "string",
    "symbols",
    "test",
    "test/loader",
    //"test/proc",
    "test/publisher",
    //"test/space",
    "test/result",
    "test/mockXhr",
    "test/matchers",
    "visual"//,
    //"widget/*",
  ];
 
  dojo.forEach(modules, function(name) {
    bd.test.loader.load(rootName + "/" + name);
  });
}
