(function () {
  // 仅作为启动文件，设置头身脚的视图启动
  angular.module('app', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', setBaseStateConfig]);

  function setBaseStateConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        views: {
          header: {
            templateUrl: './src/modules/header/header.html'
          },
          body: {
            templateUrl: './src/modules/body/body.html'
          },
          footer: {
            templateUrl: './src/modules/footer/footer.html'
          }
        }
      });

    $urlRouterProvider
      .otherwise('home');
  }
})()