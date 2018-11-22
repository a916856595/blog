'use strict';
(function() {
  angular.module('app')
    .component('breadNavigatorComponent', {
      templateUrl: '/src/components/breadNavigator/breadNavigator.html',
      controller: 'breadNavigatorComponentController',
      controllerAs: 'vm',
      bindings: {
        url: '<'
      }
    })
    .controller('breadNavigatorComponentController', ['$scope', function ($scope) {
      var vm = this;
      var routerArr = [];
      var routerTransitionData = [{
        url: 'main',
        name: '首页',
        router: 'main.home',
        children: [{
            url: 'home',
            name: '首页',
            router: 'main.home',
            isRouterOfFather: true,
            children: []
          }, {
            url: 'article',
            name: '文章',
            router: '',
            children: [{
              url: 'list',
              name: '文章列表',
              isRouterOfFather: true,
              router: 'main.article.list',
              children: []
            }, {
              url: 'detail',
              name: '文章详情',
              isRouterOfFather: false,
              router: 'main.article.detail',
              children: []
            }]
          }, {
            url: 'login',
            name: '登录',
            router: 'main.login',
            children: []
          }
        ]
      }];
      vm.routerResultArr = [];

      function watchValueChange() {
        routerArr = vm.url.split('/');
        updateNavigatorInfo();
      }

      function updateNavigatorInfo() {
        var currentObj = routerTransitionData;
        vm.routerResultArr = [];
        _.forEach(routerArr, function (item, index) {
          _.forEach(currentObj, function (childItem) {
            if (childItem.url === item) {
              currentObj = childItem;
            }
          });

          var url = currentObj.router;
          if (!url) {
            _.forEach(currentObj.children, function (childItem) {
              if (childItem.isRouterOfFather) {
                url = childItem.router
              }
            })
          }

          vm.routerResultArr.push({
            name: currentObj.name,
            url: url
          });
          currentObj = currentObj.children;
        });
      }

      vm.$onChanges = watchValueChange;
    }])
})();