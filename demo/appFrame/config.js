require({
  paths:{
    "i18n":"../../../dojo-v2x/lib/plugins/i18n",
    "text":"../../../dojo-v2x/lib/plugins/text"
  },

  packages:[{
    name:"bd",
    location:"../.."
  },{
    name:"dijit",
    location:"../../../dijit-v2x"
  },{
    name:"dojo",
    location:"../../../dojo-v2x"
  }],

  load:["main"],

  build:{
    srcLoader:"../../../bdLoad/lib/require.js",

    replacements: {
      "appFrame.html": ["../../../bdLoad/lib/require.js", "boot.js"]
    },

    layers:{
      main:{
        include:["bd/widget/root", "bd/widget/borderContainer", "bd/widget/statusbar"],
        boot:"boot.js"
      }
    }
  }
});
