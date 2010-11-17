var require= {
  baseUrl: "./",
  main: location.search=="?compiled" ? "ccompiled" : "main",
  urlMap: [
    function(name) {
      if (name=="i18n") {
        return "dojo/plugins/i18n";
      }
      if (name=="text") {
        return "dojo/plugins/text";
      }
      return 0;
    }
  ],
  packages: [{
    name:"bd",
    location:"../.."
  },{
    name:"dijit",
    location:"../../../dijit-v2x"
  },{
    name:"dojo",
    location:"../../../dojo-v2x"
  }],
  traceSet: {
    "loader-define":0,
    "loader-onModule":0,
    "loader-runDefQ":0,
    "loader-runFactory":0,
    "loader-execModule":0,
    "loader-execModule-out":0
  }
};
