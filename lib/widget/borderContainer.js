define("bd/widget/borderContainer", [
  "bd",
  "dojo",
  "bd/visual",
  "bd/focusable",
  "bd/mouseable",
  "bd/css",
  "bd/mouse"
], function(bd, dojo) {
///
// Defines the bd.widget.borderContainer class.

var
  top     = "top",
  left    = "left",
  bottom  = "bottom",
  right   = "right",
  regions = [top, left, bottom, right],
  others= [
    {top: [left, right], bottom: [left, right]}, //headline
    {left: [top, bottom], right: [top, bottom]}  //sidebar
  ],
  makeDragFunction= function(region, container) {
    // cache a lot of variables to make the actual functions easy to write and fast to compute...
    var
      // the region that's being dragged...
      regionInfo= container[region],
      child= regionInfo.child,
      childNode= regionInfo.child.domNode,
      childBox= regionInfo.box,
      splitterNode= regionInfo.splitter.domNode,
      splitterBox= regionInfo.splitterBox,
      dragMin= regionInfo.dragMin,
      dragMax= regionInfo.dragMax,

      // the other regions tha are affected...
      centerBox= container.centerBox,
      othersAffected= others[this.design=="headline" ? 0 : 1][region],
      affected= []; //a vector of (widget, domNode, marginBox) of the other widgets affected by this drag
    affected.push([container.center, container.center && container.center.domNode, container.centerBox]);
    bd.forEach(others[container.design=="headline" ? 0 : 1][region], function(region) {
      var info= container[region];
      info.child && affected.push([info.child, info.child.domNode, info.box, container[region]]);
      info.splitter && affected.push([info.child, info.splitter.domNode, info.splitterBox]);
    });

    var
      // scratch variables for the compute function
      i, 
      end= affected.length,
      scratchBox1= {},
      scratchBox2= {},
      scratchBox3= {},
      box, widget, size;

    // note: it's just easier to write two functions instead of trying to contort one function for all four circumstances

    function makeTopOrLeft(t, h) {
      return function(delta, live, finish) {
        size= childBox[h];
        delta= Math.max(dragMin, Math.min(size + centerBox[h], size + delta, dragMax)) - size;
        size= childBox[h] + delta;
        scratchBox1[t]= splitterBox[t] + delta;
        dojo.marginBox(splitterNode, scratchBox1);
        if (live || finish) {
          scratchBox2[h]= childBox[h] + delta;
          dojo.marginBox(childNode, scratchBox2);
          child.layout && child.layout(childBox.h + (h=="h" ? delta : 0), childBox.w + (h=="w" ? delta : 0));
          scratchBox3[t]= centerBox[t] + delta;
          scratchBox3[h]= centerBox[h] - delta;
          for (i= 0; i<end; i++) {
            var info= affected[i];
            info[1] && dojo.marginBox(info[1], scratchBox3);
            (widget= info[0]) && widget.layout && widget.layout(info[2].h - (h=="h" ? delta : 0), info[2].w - (h=="w" ? delta : 0));
          }
        }
        if (finish) {
          childBox[h]+= delta;
          splitterBox[t]+= delta;
          regionInfo.size= size;
          for (i= 0; i<end; i++) {
            box= affected[i][2];
            box[t]= scratchBox3[t];
            box[h]= scratchBox3[h];
            affected[i][3] && (affected[i][3].size= box[h]);
          }
        }
      };
    }

    function makeBottomOrRight(t, h) {
      return function(delta, live, finish) {
        size= childBox[h];
        delta= size - Math.max(dragMin, Math.min(size + centerBox[h], size - delta, dragMax));
        size= centerBox[h] - delta;
        scratchBox1[t]= splitterBox[t] + delta;
        dojo.marginBox(splitterNode, scratchBox1);
        if (live || finish) {
          scratchBox2[t]= childBox[t] + delta;
          scratchBox2[h]= childBox[h] - delta;
          dojo.marginBox(childNode, scratchBox2);
          child.layout && child.layout(childBox.h - (h=="h" ? delta : 0), childBox.w - (h=="w" ? delta : 0));
          scratchBox3[h]= centerBox[h] + delta;
          for (i= 0; i<end; i++) {
            affected[i][1] && dojo.marginBox(affected[i][1], scratchBox3);
            (widget= affected[i][0]) && widget.layout && widget.layout(affected[i][2].h + (h=="h" ? delta : 0), affected[i][2].w + (h=="w" ? delta : 0));
          }
        }
        if (finish) {
          childBox[t]+= delta;
          childBox[h]-= delta;
          splitterBox[t]+= delta;
          regionInfo.size= size;
          for (i= 0; i<end; i++) {
            affected[i][2][h]= scratchBox3[h];
            affected[i][3] && (affected[i][3].size= scratchBox3[h]);
          }
        }
      };
    }
    switch (region) {
      case "top": return makeTopOrLeft("t", "h");
      case "left": return makeTopOrLeft("l", "w");
      case "bottom": return makeBottomOrRight("t", "h");
      case "right": return makeBottomOrRight("l", "w");
    }
    return 0;
  };

bd.widget.splitter= bd.declare(
  ///
  // A dragable splitter bar widget for use with bd.widget.borderContainer.
  ///
  // The widget consists of an a "bar" that's presented as a simple, empty, usually colored, div that's intended to be absolutely positioned by the owning
  // border container. The widget is derived from bd.focusable, bd.mouseable, and bd.cssStateful with the focused and hover states watched
  // by bd.cssStateful. This allows the bar to be stylized when the mouse hovers over it (e.g., by changing it's background color).
  // 
  // A non-trivial `onMouseDown` connection point is included that captures the mouse and sends coordinates to a drag function as the mouse
  // is dragged. The drag function, provided by the owning parent, calculates a new position for the bar based on the mouse coordinates and
  // then places the bar at this position. Naturally, the capture process gracefully releases the mouse at the completion of the drag
  // opertation.
  
  //superclasses
  [bd.visual, bd.focusable, bd.mouseable],

  //members
  {
  initAttrs:
    {"class":1, style:1},

  cssStatefulWatch: 
    {visible:0, disabled:0, focused:0, hover:0},

  precreateDom: function() {
    this.inherited(arguments);
    this.cssStatefulBases= /top|bottom/.test(this.region) ? {dijitReset: 0, bdSplitterH:0} : {dijitReset: 0, bdSplitterV:0};
  },

  onMouseDown: function(
    e //(DOM event object) The DOM event object consequent to the mousedown event.
  ){
    ///
    // Stops the event, captures the mouse, sends all mouse movements to a drag function provided by the owning container; 
    // releases capture on mouseup. //Upon capture, adds the DOM class "bdSplitterActive"; removes this class upon capture release.
    dojo.stopEvent(e);
    var
      parent= this.parent,
      region= this.region,
      regionInfo= parent[region],
      coordPlane= /top|bottom/.test(region) ? "clientY" : "clientX",
      coordStart= e[coordPlane],
      lastDelta= 0;

    regionInfo.drag= makeDragFunction(region, parent);
    dojo.addClass(this.domNode, "bdSplitterActive");
    parent.curtain.style.zIndex= 1;
    bd.mouse.capture(this, {
      mousemove: function(e){
        lastDelta= e[coordPlane] - coordStart;
        regionInfo.drag(lastDelta, parent.live, false);
      },
      mouseup: function(e){
        try {
          lastDelta= e[coordPlane] - coordStart;
        } finally {
          bd.mouse.release();
        }
      }
    }, dojo.hitch(this, function() {
      bd.mouse.release();
      parent.curtain.style.zIndex= -1;
      dojo.removeClass(this.domNode, "bdSplitterActive");
      regionInfo.drag(lastDelta, true, true);
    }));
  },

  destroy: function() {
    if (bd.mouse.capture.by===this) {
      bd.mouse.release();
    }
    delete this.parent;
    this.inherited(arguments);
  }
});

return bd.widget.borderContainer= bd.declare(
  ///
  // A container that can hold, manage, and layout up to five children widgets--four in fixed or user-sizeable regions along each side of a center rectangle, and a fifth in the center rectangle.
  ///
  // The container always consists of a center region. Optionally, additional regions may be added along
  // each side (top, bottom, left, right) of the workspace. When both horizontal (top and/or bottom) and vertical
  // (left and/or right) children are added, then one or the other must be dominate (span the entire available
  // area) and the other must be subordinate (span between the inner borders of the dominate containers children).
  // The attribute `design` controls this aspect of the layout, with the value `"headline"` indicating the top/bottom
  // regions are dominate and the value `"sidebar"` indicating the left/right" regions are dominate.
  // 
  // Children are added/removed to/from the top, left, bottom, right, and center regions through the `top`, `left`, `bottom`, `right`,
  // and `center` attributes. Since the center region has no sizing information (it gets whatever is left over from the other regions, 
  // the `center` attribute simply controls the child (if any) that exists in the center region.
  // 
  // The remaining region attributes control a composite value that contains the following properties:
  // 
  // * child: the child widget to place in the region.
  // * splitter: boolean, says the region is sizeable.
  // * splitterClass: (string) gives the class name to use for the region, non-empty implies the property splitter is true.
  // * delegateSize: (boolean) says the child will calculate its desired size during layout.
  // * size: (integer or percent) says the precise size in pixels or percent the child desires.
  // * min: (integer or percent) says the minimize size in pixels or percent the child desires.
  // * max: (integer or percent) says the maximum size in pixels or percent the child desires.
  // 
  // See bd.widget.borderContainer.setRegion for details.
  // 
  // Sizes are advisory, but the border container will attempt to fulfill requests so long as there is enough room to show
  // all existing containers. This can be guaranteed by ensuring the border container itself is never resized smaller than
  // some reasonable minimum, but this is the responsibility of the parent of the border container.
  // 
  // Given a set of children, possibly with splitters and a design attribute, the layout method calculates the layout and
  // absolutely positions the children within the container.
  // 
  // If any border children contain a splitter, then when that splitter is dragged, the associated child and the center region
  // are resized consequent to the drag, restricted by any min/max sizes placed on the region.

  // superclasses
  [bd.visual, bd.focusable],

  //members
  bd.constAttr(
    ///
    // Indicates which border regions are dominate.
    ///
    //("headline", default) The top and/or bottom regions (if any) span the entire width of the container and the left and/or right
    // regions (if any) are fit between the top and/or bottom.
    //("sidebar") The left and/or right regions (if any) span the entire height of the container and the top and/or bottom
    // regions (if any) are fit between the left and/or right.
    "design", 
    "headline" //default value
  ),

  bd.attr(
    ///
    // Controls whether or not child widgets are redrawn when splitter bars are dragged
    ///
    //(boolean, optional, true) Child widgets are redrawn during splitter bar dragging iff true; child widgets 
    // remain stationary during splitter bar dragging otherwise.
    "live",
    true //default value
  ),

  bd.attr(
    ///
    // Gives the class name to use for the splitter bars.
    ///
    //(string, optional, "bd:widget.splitter") The class name to user for the splitter bars.
    "splitterClass",
    "bd:widget.splitter" //default value
  ),

  bd.attr(
    ///
    // Controls the configuration of the top region (if any). //It is not required that all region
    // configuration properties be provided to the setter. When a region is set with a subset of the
    // configuration properties, the current properties or defaults are used to fill in the missing
    // properties. This allows, for example, changing the child while keeping sizing and splitter
    // configuration constant. See bd.widget.borderContainer.setRegion for details.
    ///
    //(bd.widget.borderContainer.regionInfo) The properties controlling the region.
    "top",

    0, //per-instance explicit initialization handled in precreateDom

    function(value) { //setter
      return this.setRegion("top", value);
    },

    function() { //getter
      return this.getRegion("top");
    }
  ),

  bd.attr(
    ///
    // Controls the configuration of the left region (if any). //It is not required that all region
    // configuration properties be provided to the setter. When a region is set with a subset of the
    // configuration properties, the current properties or defaults are used to fill in the missing
    // properties. This allows, for example, changing the child while keeping sizing and splitter
    // configuration constant. See bd.widget.borderContainer.setRegion for details.
    ///
    //(bd.widget.borderContainer.regionInfo) The properties controlling the region.
    "left",

    0, //per-instance explicit initialization handled in precreateDom

    function(value) { //setter
      return this.setRegion("left", value);
    },

    function() { //getter
      return this.getRegion("left");
    }
  ),

  bd.attr(
    ///
    // Controls the configuration of the bottom region (if any). //It is not required that all region
    // configuration properties be provided to the setter. When a region is set with a subset of the
    // configuration properties, the current properties or defaults are used to fill in the missing
    // properties. This allows, for example, changing the child while keeping sizing and splitter
    // configuration constant. See bd.widget.borderContainer.setRegion for details.
    ///
    //(bd.widget.borderContainer.regionInfo) The properties controlling the region.
    "bottom",

    0, //per-instance explicit initialization handled in precreateDom

    function(value) { //setter
      return this.setRegion("bottom", value);
    },

    function() { //getter
      return this.getRegion("bottom");
    }
  ),

  bd.attr(
    ///
    // Controls the configuration of the right region (if any). //It is not required that all region
    // configuration properties be provided to the setter. When a region is set with a subset of the
    // configuration properties, the current properties or defaults are used to fill in the missing
    // properties. This allows, for example, changing the child while keeping sizing and splitter
    // configuration constant. See bd.widget.borderContainer.setRegion for details.
    ///
    //(bd.widget.borderContainer.regionInfo) The properties controlling the region.
    "right",

    0, //per-instance explicit initialization handled in precreateDom

    function(value) { //setter
      return this.setRegion("right", value);
    },

    function() { //getter
      return this.getRegion("right");
    }
  ),

  bd.attr(
    ///
    // Controls the contents of the center region (if any). //Unlike the top, left, bottom, and right regions,
    // the center region has no sizing or splitter configuration.
    ///
    //(widget) The widget to place in the region; null to remove the current widget from the region.
    "center",

    0, //per-instance explicit initialization handled in precreateDom

    function(value) { //setter
      var oldValue= this.center;
      if (value!==oldValue) {
        this.center && this.domNode.removeChild(this.center.domNode);
        this.center= value;
        value.parent= this;
        value && dojo.place(value.domNode, this.domNode, "last");
        this.started && bd.startupChild(value);
      }
    },

    function() { //getter
      return this.center;
    }
  ),

  {
  initAttrs:
    {dir:1, lang:1, "class":1, style:1},

  cssStatefulBases: 
    {dijitReset: 0, bdBorderContainer:1},

  cssStatefulWatch: 
    {visible:0, disabled:0},

  precreateDom: function() {
    ///
    // Initializes a new border container.
    ///
    // The descriptor may contain the properties top, left, bottom, and right of type bd.widget.borderContainer.regionInfo that
    // preconfigure the regions. However, this method of initialization is not typically used. Instead, a particular child
    // usually informs the border container of its layout desires through is the regionInfo property in its parent space. See bd.widget.borderContainer.setRegion.
    this.inherited(arguments);
    dojo.forEach(regions, function(region) {
      this[region]= bd.mix({}, {
        child: 0,         // (widget)
        splitter: 0,      // (widget)
        splitterClass: 0, // (string) class name 
        splitterSize: 0,  // the last calculated size of the splitter (h for top/bottom, w for left/right)
        size: 0,          // number implies px, string implies percent (e.g., "25%")
        delegateSize: 0,  // ask the child how big it wants to be?
        min: "5%",        // number or percent or missing
        max: "80%",       // number of percent or missing
        dragMin: 0,       // pixels last calculated
        dragMax: 0        // pixels last calculated
      }, this.descriptor[region]);
    }, this);
  },

  createDom: function() {
    this.inherited(arguments);
    this.curtain= dojo.create("div", {"class":"bdBorderContainerCurtain"}, this.domNode);
  },

  startup: function(top) {
    if (!this.started) {
      bd.forEach(regions, function(region) {
        bd.startupChild(this[region].child);
      }, this);
      bd.startupChild(this.center);
      this.inherited(arguments);
    }
  },

  startupChild: function(
    region
  ) {
    // note: this routine does not call layout; it is called by either startup or setRegion, both of which
    // ensure layout is called iff required.
    var child= this[region].child;
    if (this.started && child) {
      bd.startupChild(child);
      this[region].splitter && bd.startupChild(this[region].splitter);
    }
  },

  destroy: function() {
    //TODO
  },

  disabledSet: function(
    value
  ) {
    this.curtain.style.zIndex= value ? 3 : -1;
  },

  getRegion: function(
    region //("top", "left", "bottom", "right", "center") Identifies the region of interest.
  ) {
    ///
    // Returns the region information for a the region `region`.
    return bd.mix({}, this[region]);
  },

  setRegion: function(
    region, //("top", "left", "bottom", "right") Identifies the region of interest.
    newRegionInfo //(bd.widget.borderContainer.regionInfo) Specifies new configuration for the region.
  ) {
    ///
    // The entry point to add/modify/remove a top, left, bottom, right region.
    ///
    // Clients should not access this method directly, but rather should set a region's configuration through
    // the `top`, `left`, `bottom`, `right` attributes. That said, all of these setters delegate to this method;
    // and, therefore, function identically as follows:
    // 
    // The region indicated is configured as given by newRegionInfo together with the current configuration for
    // the given region:
    // 
    // * If child is truthy, then any existing child is removed and the given child is placed in the region; if
    //   child is falsy but not undefined, then any existing child is removed from the region; if child is undefined
    //   then nothing is done with the child.
    // * If splitter or splitterClass exists, then the region is made resizeable with a splitter; if splitterClass
    //   is undefined, then the border containers `splitterClass` attribute is used to determine the splitter class. If
    //   splitter and splitterClass are undefined, the the splitter status is not changed.
    // * If delegateSize, size, min, or max are undefined, then the given values are used to control the region's layout; otherwise
    //   the existing value for the particular attribute is not changed.
    // 
    // After the region is reconfigured, the border container's layout is recalculated.
    //
    // Since the center region has no configurable splitters or sizing, it is set directly by the `center` attibute.
    if (!(/top|left|bottom|right/.test(region))) {
      console.warn("illigal region in bd:widget.borderContainer.setRegion", region);
      return {};
    }
    var 
      regionInfo= this[region],
      oldRegionInfo= bd.mix({}, regionInfo),
      removeSplitter= function() {
        if (regionInfo.splitter) {
          regionInfo.splitter.destroy();
          regionInfo.splitter= 0;
        }
      },
      setSplitter= function(splitter, splitterClass, container) {
        if (splitter===undefined) {
          // newRegionInfo didn't mention splitter
          splitterClass= splitterClass || regionInfo.splitterClass;
        } else if (!splitter) {
          // newRegionInfo specifically said no spliter
          splitterClass= 0;
        } else if (splitter) {
          // newRegionInfo specifically said do a splitter
          splitterClass= splitterClass || regionInfo.splitterClass || container.splitterClass;
        } else {
          // if newRegionInfo gave a splitter class or regionInfo has a splitter class; then we have a splitter, and conversely
          splitterClass= splitterClass || regionInfo.splitterClass;
        }
        if (splitterClass) {
          (regionInfo.splitterClass!==splitterClass) && removeSplitter();
          if (regionInfo.child && !regionInfo.splitter) {
            bd.createWidget(
              {descriptor:{className: splitterClass, region:region}},
              function(splitter) { 
                splitter.parent= container;
                dojo.place(splitter.domNode, container.domNode, "last");
                regionInfo.splitter= splitter; 
              } 
            );
          }
        }
      };

    // set child before splitter since a non-null child will also set the splitter
    // and attempting to set the splitter before a non-null child exists won't work
    if ("child" in newRegionInfo) {
      if (newRegionInfo.child && newRegionInfo.child!==regionInfo.child) {
        // adding or changing a child
        regionInfo.child && this.domNode.removeChild(regionInfo.child.domNode);
        regionInfo.child= newRegionInfo.child;
        regionInfo.child.parent= this;
        dojo.place(regionInfo.child.domNode, this.domNode, "last");
        setSplitter(newRegionInfo.splitter, newRegionInfo.splitterClass, this);
        this.startupChild(region);
      } else if (!newRegionInfo.child && regionInfo.child) {
        // removing a child
        this.domNode.removeChild(regionInfo.child.domNode);
        removeSplitter();
      }
    } else if ("splitter" in newRegionInfo || "splitterClass" in newRegionInfo) {
      setSplitter(newRegionInfo.splitter, newRegionInfo.splitterClass, this);
    }

    // order doesn't matter for the rest of the attributes
    for (var p in newRegionInfo) {
      switch (p) {
        case "delegateSize":
        case "size":
        case "min":
        case "max":
          regionInfo[p]= newRegionInfo[p];
        break;
      }
    }

    this.layout();
    return oldRegionInfo;
  },

  addChild: function(
    child,
    regionInfo
  ) {
    // adds a child to this DOM subtree; private; clients should use the top, left, bottom, right attributes.
    if (!regionInfo) {
      regionInfo= bd.getParentProp(child, "regionInfo", 0);
      if (!regionInfo || regionInfo.region=="center") {
        this.set("center", child);
        return;
      }
    }
    this.set(regionInfo.region, bd.mix({}, regionInfo, {child:child}));
  },

  removeChild: function(
    child
  ) {
    // removes a child from this DOM subtree; private; clients should use the top, left, bottom, right attributes.
    var region= (this.left.child===child ? left : (this.right.child===child ? right : (this.top.child===child ? top : (this.bottom.child===child ? bottom : 0))));
    if (region) {
      this.setRegion(region, {child:0});
    } else if (this.center===child) {
      this.center= 0;
    }
    return child;
  },

  layout: function() {
    // computes and sets the position of each child; private
    if (!this.started) {
      return;
    }
    var
      workingRect= bd.mix(dojo.contentBox(this.domNode), {t:0, l:0, b:0, r:0}),
      availableRect= {h:workingRect.h, w:workingRect.w},
      variables= {
        top: ["t", "h"],    // computing top implies top and height
        bottom: ["t", "h"], // etc.
        left: ["l", "w"],   // etc.
        right: ["l", "w"]   // etc.
      },
      getPercent= function(minMax, available, defaultValue) {
        if (bd.isString(minMax)) {
          //it must be a percent
          minMax= Number(minMax.substring(0, minMax.length-1));
          if (isNaN(minMax)) {
            return defaultValue;
          } else {
            return Math.round((minMax * available / 100));
          }
        }
        return minMax;
      },
      placeChild= function(t, h, region, info, splitterSize, splitterNode) {
        var 
          child= info.child,
          childNode= child && child.domNode,
          min= info.min || 0,
          max= info.max || "100%",
          size= info.size,
          box= {},
          childLayoutCalled= 0;
        if (!child || !childNode) {
          return;
        }
        dojo.style(childNode, {position:"absolute"});
        min= info.dragMin= Math.min(Math.max(getPercent(min, availableRect[h], 0), 0), availableRect[h]);
        max= info.dragMax= Math.max(Math.min(getPercent(max, availableRect[h], availableRect[h]), availableRect[h]), min);

        if (info.delegateSize) {
          // delegate sizing to the child...
          // set the child's fixed direction, free its variable direction...
          dojo.style(childNode, t=="t" ? {width:availableRect.w+"px", height:""} : {width:"", height:availableRect.h+"px"});
          if (child.layout) {
            // if the child has layout, let it layout itself and return its margin box
            size= child.layout(t=="t" ? null : availableRect.h, t=="t" ? availableRect.w : null)[h];
            childLayoutCalled= 1;
          } else {
            // otherwise, layout must be CSS determined; therefore, just take its margin box
            size= dojo.marginBox(childNode)[h];
          }
        } else if (bd.isString(size)) {
          size= getPercent(size, availableRect[h], Math.round(availableRect[h] / 4));
        } else {
          // not a string and not falsy; therefore must be a number (px) or not specified (allocate min)
          size= Number(size);
          isNaN(size) && (size= min);
        }
        //at this point, size says how tall(wide) this child would like to be

        //chop it to min/max iff required
        var chopSize= Math.min(Math.max(min, size), max);
        info.size= chopSize;
        box= {
          t: workingRect.t,
          l: workingRect.l,
          h:(h=="h" ? chopSize : workingRect.h), 
          w:(h=="h" ? workingRect.w : chopSize)
        };
        (region=="bottom") && (box.t+= (workingRect.h - chopSize));
        (region=="right") && (box.l+= (workingRect.w - chopSize));
        dojo.marginBox(childNode, (info.box= box));
        if (/top|left/.test(region)) {
          workingRect[t]+= chopSize;
          workingRect[h]-= chopSize;
        } else {
          workingRect[h]-= chopSize;
        }
        if ((!childLayoutCalled || chopSize!=size) && child.layout) {
          child.layout(box.h, box.w);
        }
        if (splitterSize) {
          var splitterBox= info.splitterBox= bd.mix({}, box);
          if (/top|left/.test(region)) {
            splitterBox[t]+= chopSize;
            splitterBox[h]= splitterSize;
            workingRect[t]+= splitterSize;
            workingRect[h]-= splitterSize;
          } else {
            (region=="bottom") && (splitterBox.t-= splitterSize);
            (region=="right") && (splitterBox.l-= splitterSize);
            splitterBox[h]= splitterSize;
            workingRect[h]-= splitterSize;
          }
          dojo.marginBox(splitterNode, splitterBox);
        }
      };
    bd.forEach(this.design=="headline" ? [top, bottom, left, right] : [left, right, top, bottom], function(region) {
      var info= this[region];
      if (info.child) {
        var splitter= info.splitter;
        if (info.splitter) {
          var 
            dimension= {top: 'h', bottom: 'h', left: 'w', right: 'w'}[region],
            splitterSize= info.splitterSize= dojo.marginBox(splitter.domNode)[dimension];
          availableRect[dimension]-= splitterSize;
        }
        placeChild.apply(this, variables[region].concat([region, info, splitterSize, info.splitter.domNode]));
      }
    }, this);
    var center= this.center;
    if (center) {
      dojo.style(this.center.domNode, {position:"absolute"});
      dojo.marginBox(center.domNode, {t:workingRect.t, l:workingRect.l, h:workingRect.h, w:workingRect.w});
      center.layout && center.layout(workingRect.h, workingRect.w);
    }
    this.centerBox= workingRect;
  }
});

bd.docGen("bd.widget.borderContainer", {
  regionInfo: {
    ///type
    // Contains configuration values for a top, left, bottom, or right region.

    child:
      ///
      //(widget) The widget to place in the region,
      //(falsy) The current widget should be removed from the region.
      bd.nodoc,

    splitter:
      ///
      //(boolean) Truthy says the region should be resizable with a splitter bar; falsy indicates the converse.
      bd.nodoc,

    splitterClass:
      ///
      //(string) Gives the class name for the splitter bar that should be used for the region. A non-empty value implies the splitter property is true.
      bd.nodoc,

    delegateSize:
      ///
      //(boolean) Truthy says the layout routine should query the child for its desired size; falsy says use another means to determine the child.
      bd.nodoc,

    size:
      ///
      //(integer) The hard size in pixels desired by the child.
      //(percent) A string of the form /d?d%/ (e.g., "20%") that gives the percent of the total available height (for the top/bottom regions) or width (for the left/right regions) desired by the child.
      bd.nodoc,

    mins:
      ///
      //(integer) The minimum size in pixels desired by the child.
      //(percent) A string of the form /d?d%/ (e.g., "20%") that gives the minimum percent of the total available height (for the top/bottom regions) or width (for the left/right regions) desired by the child.
      bd.nodoc,

    size:
      ///
      //(integer) The maximum size in pixels desired by the child.
      //(percent) A string of the form /d?d%/ (e.g., "20%") that gives the maximum percent of the total available height (for the top/bottom regions) or width (for the left/right regions) desired by the child.
      bd.nodoc
  }
});
});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
