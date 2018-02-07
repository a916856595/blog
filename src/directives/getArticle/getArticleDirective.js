(function (){
  angular.module('app')
         .directive('getArticle', ['$http', function($http) {
           return {
             restrict: 'EA',
             replace: true,
             template: `<div>
                          <div class="head color-bg">
                            <p>{{response.type}}</p>
                          </div>
                          <div class="content">
                            <p>{{response.title}}</p>
                            <p>{{response.content}}</p>
                          </div>
                        </div>`,
             scope: {
               getArticle: '@'
             },
             link: function(scope, ele, attr) {
              $http.get('/getArticle.asp?path=' + scope.getArticle).then(function (result) {
                scope.response = result.data;
                $http.get(scope.response.content).then(function (content) {
                  scope.response.content = content.data;
                }, function (msg) {
                  throw(msg);
                })
              }, function (msg) {
                throw(msg);
              })
            }
           }
         }])
})();