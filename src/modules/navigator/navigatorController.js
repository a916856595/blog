(function () {
  angular.module('app')
  .controller('NavigatorController', ['$scope', '$location', '$state', function ($scope, $location, $state){
    var vm = this;
    var url = $location.url().slice(1);
    
    vm.isShowNavigator = false;
    vm.currentUrl = '';

    active();
    function active() {
      toggleNavigatorState(url);
      listenRouterChange();
    }

    function listenRouterChange() {
      $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        vm.currentUrl = toState.name.split('.').join('/');
        toggleNavigatorState(vm.currentUrl);
      });
    }

    function toggleNavigatorState(url) {
      if (url !== 'main/home') {
        vm.isShowNavigator = true;
      } else {
        vm.isShowNavigator = false;
      }
    }
  }])
})();