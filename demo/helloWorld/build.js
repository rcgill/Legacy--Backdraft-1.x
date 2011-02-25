{
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
    trees:[
      [".", ".", "config.js", "build.js"]
    ],
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

	replacements:{
		"./helloWorld.html": [
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
			include:["bd/widget/root"],
			boot:"./boot.js",
      bootText:"require(['main']);\n"
		}
	},

  dojoPragmaKwArgs:{
    asynchLoader:1
  }
}
