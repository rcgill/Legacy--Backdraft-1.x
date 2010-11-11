define(["dojo", "bd", "bd/dom"], function(dojo, bd) {

//#include bd/test/testHelpers
//#commentToString

module("The module bd/hash",
  theClass("bd.hash",
    userDemo("[bd.hash]", function() {
      // create a hash by calling the constructor with no arguments..
      var hash= new bd.hash();

      // unlike JavaScript objects which can accept only strings or symbols as 
      // keys, hashes can accept any type for a key. For example, hash keys as objects...
      var key1= {}, value1= {};
      the(hash.set(key1, value1)).is(hash);
      the(hash.get(key1)).is(value1);

      // or functions...
      var key2= function(){}, value2= {};
      the(hash.set(key2, value2)).is(hash);
      the(hash.get(key2)).is(value2);

      // strings also work
      var key3= "key3", value3= {};
      the(hash.set(key3, value3)).is(hash);
      the(hash.get(key3)).is(value3);

      // arrays work...
      var key4= [1, 2, 3], value4= {};
      the(hash.set(key4, value4)).is(hash);
      the(hash.get(key4)).is(value4);

      //notice at this point we have all kinds of keys...
      the(hash.get(key1)).is(value1);
      the(hash.get(key2)).is(value2);
      the(hash.get(key3)).is(value3);
      the(hash.get(key4)).is(value4);

      // but be careful, by default, hash uses === for key comparisons;
      // therefore it may surprise you that
      the(hash.get([1, 2, 3])).isNot(value4);
      // because [1, 2, 3] is not identical to key4.

      // hashes are mutable
      // deleting an existing key returns true
      the(hash.del(key2)).is(true);
      the(hash.get(key2)).is(bd.notFound);
      // deleting a nonexisting key returns false
      the(hash.del(key2)).is(false);
      var value5= {};
      the(hash.set(key2, value5)).is(hash);
      the(hash.get(key2)).is(value5);
      var value6= {};
      the(hash.set(key2, value6)).is(hash);
      the(hash.get(key2)).is(value6);


      // you can get this to work by creating a hash and passing true to the 
      // constructor saying you want to compare keys by value
      hash= new bd.hash(bd.equal);
      
      // just as before...
      the(hash.set(key1, value1)).is(hash);
      the(hash.get(key1)).is(value1);
      the(hash.set(key2, value2)).is(hash);
      the(hash.get(key2)).is(value2);
      the(hash.set(key3, value3)).is(hash);
      the(hash.get(key3)).is(value3);
      the(hash.set(key4, value4)).is(hash);
      the(hash.get(key4)).is(value4);

      // but now this works...
      the(hash.get([1, 2, 3])).is(value4);
    }),
    theMember("forEach",
      demo("Iterates over all keys, passing the key and value to the callback on each iteration.", function() {
        var hash= new bd.hash();
        var log;
        function logger(key, value) {
          the(this).is(bd.global);
          the(log[key]).is(undefined);
          log[key]= value;
        }
        log= {}; hash.forEach(logger);
        the(log).hasValue({});
        hash.set("k1", "v1");
        log= {}; hash.forEach(logger);
        the(log).hasValue({k1:"v1"});
        hash.set("k2", "v2");
        log= {}; hash.forEach(logger);
        the(log).hasValue({k1:"v1", k2:"v2"});
      }),
      demo("The callback can be specified with the same signature ad bd.hitch.", function() {
        var hash= new bd.hash();
        var log;
        var someObject= {
          logger: function(key, value) {
            the(this).is(someObject);
            the(log[key]).is(undefined);
            log[key]= value;
          },
          logger2: function(partialArg, key, value) {
            the(partialArg).is("now is the time");
            the(this).is(someObject);
            the(log[key]).is(undefined);
            log[key]= value;
          }
        };
        log= {}; hash.forEach(someObject, "logger");
        the(log).hasValue({});
        hash.set("k1", "v1");
        log= {}; hash.forEach(someObject, "logger");
        the(log).hasValue({k1:"v1"});
        hash.set("k2", "v2");
        log= {}; hash.forEach(someObject, "logger");
        the(log).hasValue({k1:"v1", k2:"v2"});
        log= {}; hash.forEach(someObject, someObject.logger);
        the(log).hasValue({k1:"v1", k2:"v2"});
        log= {}; hash.forEach(someObject, "logger2", "now is the time");
        the(log).hasValue({k1:"v1", k2:"v2"});
      })
    )
  )
);

});
// Copyright (c) 2000-2009, ALTOVISO, Inc. (www.altoviso.com). Use, modification, and distribution subject to terms of license.
