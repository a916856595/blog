(function () {
  angular.module('app')
  .controller('BodyController', ['$scope', '$location', '$state', function ($scope, $location, $state){
    var vm = this;
    var url = $location.url();
    
    vm.isShowAutoImg = false;

    active();

    function active() {
      if (url === '/main/home') {
        vm.isShowAutoImg = true;
      }
    }
  }])
})();