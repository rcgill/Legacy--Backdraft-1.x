# backdraft

backdraft is a free and open source JavaScript framework for building browser-hosted GUIs 100% within the browser—no
plugin, no server-side programming—with all the awesomeness of a native app, but without all the pain.

backdraft fundamentally changes the mental model of browser programming by lifting the programmer out of the HTML/DOM
tar pit into a modern and rich programming environment. HTML is abstracted away and replaced with a hierarchy of
intelligent programming components—no more markup, no more JavaScript snippets sprinkled throughout a static document.

**Program the browser with a programming language that uses markup rather than the other way around!**

# Project Home

This is a mirror of the official backdraft repository that's maintained at [http://bdframework.org](http://bdframework.org
"backdraft project home") (warning: this repository may be slightly out of date compared to the official repository).

# Key Attributes

##100% browser-side, no plugin

backdraft abstracts the primitive browser programing environment into a function and class library that allows you to
build programs with more and better features while writing fewer lines of code, faster.  Unlike other JavaScript
libraries that require thinking about HTML and the DOM, a Backdraft application is written 100% in JavaScript. Backdraft
requires no plugin, precompiling, or server-side programming.

##open source

backdraft is free and open source software. It is released under a BSD-style license. You can do
anything you want with it including using it to build commercial closed-source applications.

##standards-based

backdraft is built on top of standard-complying JavaScript, HTML, CSS, and the document object
model. Backdraft programs are compatible with any standards-compliant browser, no matter the platform.

##browser&#x2194;compute

backdraft supports an exciting new model for application construction called
browser-compute. Browser-compute decreases construction complexity, cost, and time when building powerful,
GUI-controlled applications, particularly applications that simultaneously target multiple operating systems
(Windows to Android) and/or multiple platforms (desktop to phones). You can learn more about browser-compute at
[browser-compute](http://www.altoviso.com/articles/iface-compute.pdf).

# Key Features

##metacircular evaluator

Dynamically creates hierarchies of components based on a simple JavaScript domain specific language. This machinery
allows complex programs to be decomposed into manageable components during design and build and then recomposed into
large and dynamic systems during runtimes.

##command subsystem

Machinery to manage the display (text, i18n, icons, help, and the rest), detection, and dispatch of menu, accelerator,
and programmatic commands.

##widget construction subsystem

A carefully factored, orthogonal set of classes that make building custom widgets easy. For example, backdraft's state
button widget (a multi-state radio button with built-in keyboard accelerators) requires about 75 lines of code and does
*not* use any HTML input controls.

##widgets

Several example widgets built on top of the widget construction subsystem are included. Also, all standard Dojo widgets
(that is, those included in Dijit) are wrapped so they may be used within the backdraft framework. Standard widget
interfaces have been defined so that widgets from other projects/products may be similarly wrapped.

##compute proxy

Machinery that manages all out-of-process service transactions under a single, uniform, asynchronous, remote procedure
call abstraction. This machinery handles error detection and recovery, multi-call bundling, throttling, out-of-order
responses, and improves the performance of the client-server channel. Optionally, the compute proxy can be configured to
implement mock services (for testing without a server) and security protocols.

##test framework

The test framework includes a dynamic loader (which allows reloading single application and/or test modules without
restarting the application), machinery to manage test code hierarchies, advanced scaffold functions that can dynamically
replace/monitor/mock any function, flexible result recording, and nearly 40 matcher functions.

##JavaScript and DOM extensions

Several foundational features, including support for array and hash collections, searching, sorting, symbol management,
dialog management, and others.

##Dojo

Backdraft is built on top of the extremely powerful Dojo JavaScript toolkit. Further, several areas of Dojo are extended
to raise the level of abstraction yet higher.



#Support

All support for this project is handled through the [ticket system](http://bdframework.org/repo/rptview?rn=1). If you
have a question, find a bug, have patch, or want to request an enhancement, please open a new ticket. Please make an
attempt to find an answer by utilizing the resources available on the
[documentation](http://bdframework.org/docs.html) and [demonstrations](http://bdframework.org/demos.html) pages
before filing a help ticket.

#Commercial Support

Commercial support is available from [ALTOVISO LLC](http://www.altoviso.com). ALTOVISO also has the capability to
construct custom (closed source) applications as per your particular requirements. You can contact ALTOVISO by dialing
+1.866.398.9209 x700 (United States, Pacific Time) or by email at
[support@altoviso.com](mailto:support@altoviso.com)</p>

#Donate

Please help keep this project going strong and [donate](http://bdframework.org/index.html#donate)!
