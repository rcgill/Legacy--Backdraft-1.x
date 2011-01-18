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
      "helloWorld.html": ["../../../bdLoad/lib/require.js", "boot.js"]
    },

    layers:{
      main:{
        include:["bd/widget/root"],
        boot:"boot.js"
      }
    }
  }
});
