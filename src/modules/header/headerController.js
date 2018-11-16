(function () {
  angular.module('app')
  .controller('headerController', ['$scope', '$window', '$state', '$location', 'headerService', 'windowResizeService', function ($scope, $window, $state, $location, headerService, windowResizeService){
         $scope.headerVar = {
           toggleBtnIsShow: false,
           menuIsShow: true,
           toggleMenu: headerService.toggleMenu
         };

         active();

        function active() {
          checkScreenWidth();
          windowResizeService.pushItem(checkScreenWidth);
          checkRouterAuto();
        }

        function checkScreenWidth() {
          var docWidth = $window.document.body.offsetWidth;
          if (docWidth >= 768) {
            $scope.headerVar.toggleBtnIsShow = false;
            $scope.headerVar.menuIsShow = true;
          } else {
            $scope.headerVar.toggleBtnIsShow = true;
            $scope.headerVar.menuIsShow = false;
          }
          flag = 1;
        }

        function checkRouterAuto() {
          $scope.$on('$stateChangeSuccess', function (e, current, pre) {
            if ($location.url() === '/main') {
              $state.go('main.home');
            }
          });
        }
      }])
})();