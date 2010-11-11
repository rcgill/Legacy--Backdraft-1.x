define(["dojo", "bd", "bd/test/mockXhr"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module(
  userDemo(function() {
    //we'll install a filter that will catch any URL that includes "unit.bd.test.mockXhr.filterDemo"

    //first let's see that dojo.xhr works for a valid url and fails otherwise...
    var
      realUrl= dojo.url("bd-unit/test/mockXhr"),             //this module, so it should work!
      fakeUrl= dojo.url("bd-unit/test/mockXhr/mockXhrDemo"), //no such resource exists, so it should fail
      succeeded;

    //we'll use synchronous XHRs so this demo doesn't have to be asynchronous to check results, but
    //asynchronous XHRs work equally well.

    var thisModuleText= "";
    succeeded= null;
    dojo.xhrGet({
      url:realUrl,
      sync:true,
      load:function(text) {succeeded= true; thisModuleText= text;},
      error:function() {succeeded= false;}
    });
    the(succeeded).is(true);

    //now let's see that dojo.xhr fails for a url the server doesn't know about...
    succeeded= null;
    dojo.xhrGet({
      url:fakeUrl,
      sync:true,
      load:function() {succeeded= true;},
      error:function() {succeeded= false;}
    });
    the(succeeded).is(false);

    //now we'll install a mock XHR that services the fakeUrl...

    //here's the filter; we put it in a named object so we can remove it later...
    //the filter will catch any URL that includes "mockXhrDemo"
    function filter(args) {
      return /mockXhrDemo/.test(args.url);
    }

    //here's the service function that echos back the passed argument as a JSON object...
    function service(mockXhr) {
      //just return a result that is the JSON of the non-function objects of the mockXhr...
      var result= {};
      bd.forEachHash(mockXhr, function(value, name) {
        if (!dojo.isFunction(value)) {
          result[name]= value;
        }
      });
      return {
        responseText:dojo.toJson(result),
        responseXML:null,
        status:200
      };
    }

    bd.test.mockXhr.install(filter, service);

    //now let's try the dojo.xhrGet again...
    succeeded= null;
    dojo.xhrGet({
      url:fakeUrl,
      sync:true,
      handleAs:"json",
      load:function(response) {
        succeeded= true;
        the(response.url).is(fakeUrl);
        the(response.method).is("GET");
        the(response.asynchronous).is(false);
      },
      error:function() {succeeded= false;}
    });
    the(succeeded).is(true);

    //of course requests not caught by the filter work just as before...
    succeeded= null;
    dojo.xhrGet({
      url:realUrl,
      sync:true,
      load:function(text) {
        succeeded= true;
        the(text).is(thisModuleText);
      },
      error:function() {succeeded= false;}
    });
    the(succeeded).is(true);

    //clean up so other tests work; normally client code just sets some filters and forgets them forever...
    bd.test.mockXhr.remove(filter);

    //should be back to failing...
    succeeded= null;
    dojo.xhrGet({
      url:fakeUrl,
      sync:true,
      load:function() {succeeded= true;},
      error:function() {succeeded= false;}
    });
    the(succeeded).is(false);
  }),

  demo("Asynchronous Demonstration", function(space) {
    var
      fakeUrl= dojo.moduleUrl("unit.bd.test.mockXhr", "mockXhrDemo.js")+"", //no such resource exists, so it should fail
      succeeded;

    //here's the filter; we put it in a named object so we can remove it later...
    //the filter will catch any URL that includes "mockXhrDemo"
    function filter(args) {
      return /mockXhrDemo/.test(args.url);
    }

    //here's the service function that echos back the passed argument as a JSON object...
    function service(mockXhr) {
      //just return a result that is the JSON of the non-function objects of the mockXhr...
      var result= {};
      bd.forEachHash(mockXhr, function(value, name) {
        if (!dojo.isFunction(value)) {
          result[name]= value;
        }
      });
      return {
        responseText:dojo.toJson(result),
        responseXML:null,
        status:200
      };
    }

    //install a filter that will catch any URL that includes "mockXhrDemo"
    bd.test.mockXhr.install(filter, service);

    //asynchronous dojo.xhrGet...
    succeeded= null;
    dojo.xhrGet({
      url:fakeUrl,
      sync:false,
      handleAs:"json",
      load:function(response) {
        bd.test.pushActiveSpace(space);
        succeeded= true;
        the(response.url).is(fakeUrl);
        the(response.method).is("GET");
        the(response.asynchronous).is(true);
        bd.test.popActiveSpace();
      },
      error:function() {succeeded= false;}
    });
    // asynchronous so we haven't succeeded yet
    the(succeeded).is(null);

    //clean up so other tests work; normally client code just sets some filters and forgets them forever...
    bd.test.mockXhr.remove(filter);

    return space.watch(10, 7000, function() {
      if (succeeded!==null) {
        the(succeeded).is(true);
        return true;
      } else {
        return false;
      }
    });
  }),

  demo("Manipulating Raw Mock XHRs", function(space) {
    var
      fakeUrl= dojo.moduleUrl("unit.bd.test.mockXhr", "mockXhrDemo.js")+"", //no such resource exists, so it should fail
      succeeded;

    //here's the filter; we put it in a named object so we can remove it later...
    //the filter will catch any URL that includes "mockXhrDemo"
    function filter(args) {
      return /mockXhrDemo/.test(args.url);
    }

    //here's the service function that echos back the passed argument as a JSON object...
    var result= {
      responseText:"some result",
      responseXML:null,
      status:200
    };
    function service(mockXhr) {
      return result;
    }

    //install a filter that will catch any URL that includes "mockXhrDemo"
    bd.test.mockXhr.install(filter, service);

    var xhr= dojo._xhrObj({url:fakeUrl});

    the(xhr.service).is(service);
    the(xhr.readyState).is(0);
    //although other properties are, in fact, set at this point, client code cannot rely on this

    var watchReadyState= 0;
    xhr.onreadystatechange= function() {
      the(xhr.readyState).is(watchReadyState+1);
      watchReadyState= xhr.readyState;
    };

    xhr.open("GET", fakeUrl, false);
    the(xhr.method).is("GET");
    the(xhr.url).is(fakeUrl);
    the(xhr.asynchronous).is(false);
    the(xhr.user).is(undefined);
    the(xhr.password).is(undefined);
    the(xhr.readyState).is(1);
    the(watchReadyState).is(1);

    xhr.setRequestHeader("myKey1", "myValue1");
    xhr.setRequestHeader("myKey2", "myValue2");
    the(xhr.headers.myKey1).is("myValue1");
    the(xhr.headers.myKey2).is("myValue2");

    //attempt to open twice throws
    the(function() {
      xhr.open("GET", "fakeUrl");
    }).raises();

    xhr.send();
    the(xhr.query).is("");
    the(xhr.readyState).is(4);
    the(watchReadyState).is(4);
    the(xhr.response).is(result);
    the(xhr.responseText).is("some result");
    the(xhr.responseXML).is(null);
    the(xhr.status).is(200);

    //again, this time asynchronously...
    xhr= dojo._xhrObj({url:fakeUrl});
    watchReadyState= 0;
    xhr.onreadystatechange= function() {
      bd.test.pushActiveSpace(space);
      the(xhr.readyState).is(watchReadyState+1);
      watchReadyState= xhr.readyState;
      bd.test.popActiveSpace();
    };
    xhr.open("POST", fakeUrl, true, "rawld", "password");
    the(xhr.method).is("POST");
    the(xhr.url).is(fakeUrl);
    the(xhr.asynchronous).is(true);
    the(xhr.user).is("rawld");
    the(xhr.password).is("password");
    the(xhr.readyState).is(1);
    the(watchReadyState).is(1);


    xhr.send();
    the(xhr.query).is("");
    the(xhr.readyState).is(3);
    the(watchReadyState).is(3);
    the(xhr.response).is(result);

    //clean up so other tests work; normally client code just sets some filters and forgets them forever...
    bd.test.mockXhr.remove(filter);

    return space.watch(10, 1000, function() {
      if (xhr.readyState==4) {
        the(xhr.readyState).is(4);
        the(xhr.responseText).is("some result");
        the(xhr.responseXML).is(null);
        the(xhr.status).is(200);
        return true;
      } else {
        return false;
      }
    });
  })
);
});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
