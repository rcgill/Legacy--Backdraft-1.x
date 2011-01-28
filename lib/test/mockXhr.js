define(
  "bd/test/mockXhr", [
  "dojo", "bd", "bd/test/namespace"
], function(dojo, bd) {
///
// Defines the class bd.test.mockXhr.

bd.test.mockXhr= bd.declare(
  ///
  // Simulates an XMLHttpRequest object.

  [],
 
  {
  delay:
    ///
    // (integer) The delay in milliseconds before the response is available; used to simulate network IO.
    20,

  readyState:
    ///
    // (0 | 1 | 2 | 3 | 4) As per standard XMLHttpRequest semantics.
    0,

  responseText:
    ///
    // (string) As per standard XMLHttpRequest semantics.
    "",

  responseXML:
    ///
    // (?) As per standard XMLHttpRequest semantics.
    "",

  status:
    ///
    // (integer) As per standard XMLHttpRequest semantics.
    0,

  headers:
    ///
    // (hash)[{}] As per standard XMLHttpRequest semantics.
    {},

  method:
    ///
    // ("GET" | "POST") As set by bd.test.mockXhr.open.
    undefined,

  url:
    ///
    // (string) As set by bd.test.mockXhr.open.
    "",

  asynchronous:
    ///
    // (bool) As set by bd.test.mockXhr.open.
    true,

  user:
    ///
    // (string) As set by bd.test.mockXhr.open.
    "",

  password:
    ///
    // (string) As set by bd.test.mockXhr.open.
    "",

  aborted:
    ///
    // (boolean) True if bd.test.mockXhr.abort has been called; false otherwise.
    // `private
    false,

  service:
    ///
    // (bd.test.mockXhr.service) Function that sets the response given the method, headers, URL, etc; initialized in constructor.
    // `private
    null,

  response:
    ///
    // (hash) The reponse returned by service; should include the properties responseText, responseXML, status.
    // `private
    null,

  constructor: function(
    service //(bd.test.mockXhr.service) Function that returns the response given the method, headers, URL, etc.
  ) {
    ///
    // Create a new instance that answers requests by calling service.
    this.service= service;
  },

  open: function(
    method,       //("POST" | "GET") The HTTP method to use.
    url,          //(string) The URL to which to send the request.
    asynchronous, //(boolean)[true] Perform the operation asynchronously (or not)
    user,         //(string)[""] User name to use for authentication.
    password      //(string)[""] Password to use for authentication.
  ) {
    ///
    // As per standard XMLHttpRequest semantics.
    if (this.readyState!=0) {
      throw Error("XHR already opened");
    }
    this.method= method;
    this.url= url;
    this.asynchronous= !!asynchronous;
    this.user= user;
    this.password= password;
    this.signalReadyState(1);
  },

  setRequestHeader: function(
    key,  //(string) The name of the header key to set.
    value //(string) The value for the header key.
  ) {
    ///
    // As per standard XMLHttpRequest semantics.
    this.headers[key]= value;
  },

  send: function(
    query //(string, optional "") The body of a POST, if any.
  ) {
    ///
    // As per standard XMLHttpRequest semantics.
    this.query= query || "";
    this.signalReadyState(2);
    this.aborted= false;
    this.response= this.service(this);
    this.signalReadyState(3);
    if (this.asynchronous) {
      setTimeout(dojo.hitch(this, "setResponse"), this.response.delay || this.delay);
    } else {
      bd.test.wait(this.response.delay || this.delay);
      this.setResponse();
    }
  },

  abort: function() {
    ///
    // As per standard XMLHttpRequest semantics.
    this.aborted= true;
  },

  setResponse: function() {
    // set the response and advance readState to 4.
    if (!this.aborted) {
      this.status= this.response.status;
      this.responseText= this.response.responseText;
      this.responseXML= this.response.responseXML;
      this.signalReadyState(4);
    }
  },

  signalReadyState: function(
    state //(integer) new readyState value
  ) {
    // called upon a change to readyState; fire onreadstateChange, if any.
    this.readyState= state;
    if (this.onreadystatechange) {
      this.onreadystatechange();
    }
  }
});

var
  dojoXhrObj= null, // The original value at dojo.getXhr.
  mocks= null;      // An array of {filter, service} pairs that says which XHR calls to mock.

dojo.mixin(bd.test.mockXhr, {
  install: function(
    filter, //(bd.test.mockXhr.filter) Predicate that says if a request should return a bd.test.mockXhr based on associated service.
    service //(bd.test.mockXhr.service) When filter returns true, use this service to create a mock XHR object.
  ) {
    ///
    // Advise the bd.test.mockXhr machinery that a particular class of XHR requests (as given by filter) should be mocked (as given by service).
    //
    // Replaces dojo.getXhr with a function that returns mock XHR objects (for requests that match a filter) or the standard XHR object
    // as provided by dojo (if no filter match is found).
    //
    // If several filters are installed that return true for a particulare request, then the most recently inserted filter
    // is selected. This allows client code to insert generalized filters first and then "override" subsets caught by the generalized
    // filter with a more-specific filter.

    if (!dojoXhrObj) {
      mocks= mocks || [];
      dojoXhrObj= dojo.getXhr;
      //TODO: dojo v2.0, remove dojo._xhrObj
      dojo.getXhr= dojo._xhrObj= function(args) {
        var result= null;
        if (mocks && args) {
          dojo.some(mocks, function(item) {
            return item.filter(args) && (result= new bd.test.mockXhr(item.service));
          });
        };
        return result || dojoXhrObj.apply(dojo, arguments);
      };
    }

    mocks.unshift({filter: filter, service:service});
  },

  remove: function(
    filter //(bd.test.mockXhr.filter) A filter previously installed with bd.test.mockXhr.install.
  ) {
    ///
    // Removes a (filter, service) pair previously installed by bd.test.mock.Xhr.install.
    if (mocks) {
      dojo.some(mocks, function(item, i) {
        if (item.filter===filter) {
          mocks.splice(i, 1);
          return true;
        } else {
          return false;
        }
      });
    }
  },

  filter: function(
    args // The "args" argument given to dojo.xhr*
  ){
    ///type
    // Predicate returns true if the filter matches; false otherwise.
  },

  service: function(
    mockXhr //(bd.test.mockXhr) The instance of bd.test.mockXhr to which to response.
  ) {
    ///type
    // Returns a hash that contains the properties status, responseText, and responseXML filled with values
    // to simulate a server's response.
    //
    // The hash can also include the value delay to set an explicit delay time, overriding the property bd.test.mockXhr.delay.
  }
});

});
// Copyright (c) 2000-2009, Altoviso, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.

