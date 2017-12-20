(function () {
  angular.module('app')
         .factory('toolService', [function () {
           return {
             objectToString: objectToString,
             isFunction: isFunction,
             isObject: isObject,
             isArray: isArray,
             isNumber: isNumber,
             isString: isString,
             isBealoon: isBealoon,
             isNull: isNull,
             isUndefined: isUndefined
           };

           function objectToString (obj) {
            var object = {};
            return object.toString.apply(obj)
           };

           function isFunction (func) {
             return objectToString(func) === '[object Function]' ? true : false;
           };

           function isObject (obj) {
             return objectToString(obj) === '[object Object]' ? true : false;
           };

           function isArray (arr) {
             return objectToString(arr) === '[object Array]' ? true : false;
           };

           function isNumber (num) {
             return objectToString(num) === '[object Number]' ? true : false;
           };

           function isString (str) {
             return objectToString(str) === '[object String]' ? true : false;
           };

           function isBealoon (bea) {
             return objectToString(bea) === '[object Bealoon]' ? true : false;
           };

           function isNull (nul) {
             return objectToString(nul) === '[object Null]' ? true : false;
           };

           function isUndefined (und) {
             return objectToString(und) === '[object Undefined]' ? true : false;
           };
         }])
})()