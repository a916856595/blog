(function(){
  angular.module('app')
         .service('windowResizeService',['$timeout', '$window', 'toolService', function ($timeout, $window, toolService) {
           var flag = 1;
           var queue = [];
           this.pushItem = function(func){
             if(toolService.isFunction(func)){
               queue.push(func);
             }
           }

           this.deleteItem = function(funcName){
             var name;
             if (toolService.isFunction(funcName) && toolService.isString(funcName())) {
               name = funcName();
             }else if (toolService.isString(funcName)) {
               name = funcName;
             };
             if (name) {
               var length = queue.length;
               for (var i = 0; i < length; i++) {
                 if (queue[i].name === name){
                   queue.splice(i, 1);
                   return true;
                 }
               }
               return false;
             }
             return false;
           };

           function runQueue() {
             var length = queue.length;
             if (length) {
               for(var i = 0; i < length; i++) {
                 queue[i]();
               }
             }
             flag = 1;
           }

           $window.onresize = function () {
             if (flag) {
               flag = 0;
               $timeout(runQueue, 800);
             }
           }
         }])
})();