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
		files:[
      // the loader...
      ["../../../bdLoad/lib/require.js", "./require.js"]
    ],

    destPaths:{
      // put i18n and text in the root of the default package
    },

	  packages:[{
      // since dojo uses the "text!" and "i18n!" plugin, and these are not really in the default package tree
      // we must tell bdBuild to discover them by explicitly asking for them which will cause paths
      // to be inspected
      name:"*",
      modules:{
        i18n:1,
        text:1
      }
    },{
  		name:"dijit",
      trees:[
        // this is the lib tree without the svn, tests, or robot modules
        [".", ".", "*/.*", "*/dijit/tests/*", /\/robot(x)?/]
      ]
  	},{
  		name:"dojo",
      trees:[
        // this is the lib tree without the tests, svn, plugins, or temp files
        [".", ".", "*/dojo/tests/*", /\/robot(x)?/, "*/.*", "*/dojo/lib/plugins"]
      ]
  	}],

		replacements: {
			"./appFrame.html": [
        ['css.css', "css/css.css"],
        ['<script src="config.js"></script>', ""],
        ["../../../bdLoad/lib/require.js", "boot.js"]
      ]
		},

    compactCssSet:{
      "./css.css":"./css/css.css"
    },

		layers:{
			main:{
				include:["bd/widget/root", "bd/widget/borderContainer", "bd/widget/statusbar"],
				boot:"./boot.js",
        bootText:"require(['main']);\n"
			}
		},

    dojoPragmaKwArgs:{
      asynchLoader:1
    }
	}
};
