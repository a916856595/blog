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
          navigator: {
            templateUrl: './src/modules/navigator/navigator.html',
            controller: 'NavigatorController',
            controllerAs: 'vm',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['/src/modules/navigator/navigator.css', '/src/modules/navigator/navigatorController.js'])
              }]
            }
          },
          body: {
            template: '<div class="body-box"><div class="type-area">' + 
              '<div ui-view="top"></div>' +
              '<div ui-view="left" class="col-all-12 col-min-10 left-view"></div>' +
              '<div ui-view="aside" class="col-all-12 col-min-2 aside-view"></div>' +
            '</div></div>'
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
          top: {
            templateUrl: './src/modules/body/body.html',
            controller: 'BodyController',
            controllerAs: 'vm',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['/src/modules/body/bodyController.js'])
              }]
            }
          },
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

      .state('main.article', {
        url: '/article',
        views: {
          top: {
            template: '<div ui-view="article"></div>',
          }
        }
      })
      .state('main.article.list', {
        url: '/list',
        views: {
          article: {
            templateUrl: './src/modules/article/articleList.html',
            controller: 'ArticleListController',
            controllerAs: 'vm',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['./src/modules/article/article.css', './src/modules/article/articleList.html', './src/modules/article/articleList.controller.js'])
              }]
            }
          }
        }
      })
      .state('main.article.detail', {
        url: '/detail',
        views: {
          article: {
            templateUrl: './src/modules/article/articleDetail.html',
            controller: 'ArticleDetailController',
            controllerAs: 'vm',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['./src/modules/article/article.css', './src/modules/article/articleDetail.html', './src/modules/article/articleDetail.controller.js'])
              }]
            }
          }
        }
      })

      .state('main.login', {
        url: '/login',
        views: {
          top: {
            templateUrl: './src/modules/login/login.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            resolve: {
              load: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load(['./src/modules/login/login.controller.js'])
              }]
            }
          }
        }
      })

    $urlRouterProvider
      .otherwise('/main/home');
  }
})()