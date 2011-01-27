var require= {
	paths:{
		"i18n":"../../../dojotoolkit/dojo/lib/plugins/i18n",
		"text":"../../../dojotoolkit/dojo/lib/plugins/text"
	},

	packages:[{
		name:"bd",
		location:"../.."
	},{
		name:"dijit",
		location:"../../../dojotoolkit/dijit",
		lib:".",
		main:"lib/main"
	},{
		name:"dojo",
		location:"../../../dojotoolkit/dojo",
		lib:".",
		main:"lib/main-browser"
	}],

	deps:["main"],

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
};
