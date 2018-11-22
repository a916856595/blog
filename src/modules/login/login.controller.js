(function () {
  angular.module('app')
  .controller('LoginController', ['$scope', '$window', '$state', '$http', function ($scope, $window, $state, $http){
    var vm = this;
    vm.account = '';
    vm.password = '';

    function login() {
      var data = {
        account: vm.account,
        password: vm.password
      };
      // $http.post('/request/login/login.asp', data, {
      //   headers: {
      //     "Content-type":"application/x-www-form-urlencoded"
      //   }
      // }).then(function (result) {
      //   console.log(result);
      // }, function (err) {
      //   console.log(err);
      // })
      $http({
        method:'post',
        url:'/request/login/login.asp',
        data: data,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      }).then(function (result) {
        console.log(result)
      }, function (err) {
        console.log(err)
      });
    }

    vm.login = login;
    console.log('login')
  }]);
})();