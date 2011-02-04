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
		main:"lib/main",
    exclude:[/dijit\/tests\//, /\/robot(x)?/],
    copyDirs:[[".", ".", ["*/.*", "*/tests*" ]]]
	},{
		name:"dojo",
		location:"../../../dojotoolkit/dojo",
		lib:".",
		main:"lib/main-browser",
    exclude:[/dojo\/tests\//, /\/robot(x)?/],
    copyDirs:[[".", ".", ["*/.*", "*/tests*" ]]]
	}],

	deps:["main"],

	build:{
		srcLoader:"../../../bdLoad/lib/require.js",

		replacements: {
			"appFrame.html": [
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
				include:["bd/widget/root", "bd/widget/borderContainer", "bd/widget/statusbar"],
				boot:"boot.js",
        bootText:"require(['main']);\n"
			}
		}
	}
};
