(function () {
  angular.module('app')
    .factory('headerService', ['$timeout', '$window', 'configService', 'windowResizeService', function ($timeout, $window, configService, windowResizeService){
          var headerService = {
                toggleMenu: function() {
                this.menuIsShow = !this.menuIsShow; 
                }
          };

          return headerService;
        }]);
})();