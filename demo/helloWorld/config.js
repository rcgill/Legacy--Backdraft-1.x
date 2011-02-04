var require= {
	paths:{
		"i18n":"../../../dojotoolkit/dojo/lib/plugins/i18n",
		"text":"../../../dojotoolkit/dojo/lib/plugins/text"
	},

	packages:[{
		name:"bd",
		location:"../.."
	},{
		name:"dojo",
		location:"../../../dojotoolkit/dojo",
		lib:".",
		main:"lib/main-browser",
    exclude:[/dojo\/tests\//, /\/robot(x)?/],
    copyDirs:[[".", ".", ["*/.*", "*/tests*" ]]]
	},{
		name:"dijit",
		location:"../../../dojotoolkit/dijit",
		lib:".",
		main:"lib/main",
    exclude:[/dijit\/tests\//, /\/robot(x)?/],
    copyDirs:[[".", ".", ["*/.*", "*/tests*" ]]]
	}],

	deps:["main"],

	build:{
		srcLoader:"../../../bdLoad/lib/require.js",

		replacements:{
			"helloWorld.html": [
        ['css.css', "css/css.css"],
        ['<script src="config.js"></script>', ""],
        ["../../../bdLoad/lib/require.js", "boot.js"]
      ]
		},

    cssCompactSet:{
      "./css/css.css":"./css.css"
    },

		layers:{
			main:{
				include:["bd/widget/root"],
				boot:"boot.js",
        bootText:"require(['main']);\n"
			}
		}
	}
};
