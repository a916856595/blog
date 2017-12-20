angular.module('app')
  .controller('headerController', ['$scope', '$window', 'headerService', 'windowResizeService', function ($scope, $window, headerService, windowResizeService){
         $scope.headerVar = {
           toggleBtnIsShow: false,
           menuIsShow: true,
           toggleMenu: headerService.toggleMenu
         }

          checkScreenWidth();
          windowResizeService.pushItem(checkScreenWidth);

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
          };
       }])