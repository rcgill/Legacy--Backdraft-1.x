var require= {
  baseUrl: "./",
  main: "main",
  urlMap: [
    function(name) {
      if (name=="./i18n.js") {
        return "../../../dojo-sie/dojo/lib/plugins/i18n.js";
      }
      if (name=="./text.js") {
        return "../../../dojo-sie/dojo/lib/plugins/text.js";
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
    "loader-defineModule":0,
    "loader-runDefQ":0,
    "loader-runFactory":0,
    "loader-execModule":0,
    "loader-execModule-out":0
  }
};
