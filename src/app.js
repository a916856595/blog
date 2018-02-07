(function () {
  // 作为启动文件，设置路由
  angular.module('app', ['ui.router', 'oc.lazyLoad'])
    .config(['$stateProvider', '$urlRouterProvider', setBaseStateConfig]);

  function setBaseStateConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        views: {
          header: {
            templateUrl: './src/modules/header/header.html',
            controller: 'headerController',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad){
                return $ocLazyLoad.load(['/src/modules/header/header.css', '/src/modules/header/headerService.js', '/src/modules/header/headerController.js'])
              }]
            }
          },
          body: {
            templateUrl: './src/modules/body/body.html',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['/src/modules/body/body.css'])
              }]
            }
          },
          footer: {
            templateUrl: './src/modules/footer/footer.html',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['/src/modules/footer/footer.css'])
              }]
            }
          }
        }
      })
      .state('main.home', {
        url: '/home',
        views: {
          left: {
            templateUrl: './src/modules/home/home.html',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['./src/modules/home/home.css'])
              }]
            }
          },
          aside: {
            templateUrl: './src/modules/aside/aside.html',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['./src/modules/aside/aside.css'])
              }]
            }
          }
        }
      })

    $urlRouterProvider
      .otherwise('/main/home');
  }
})()