(function () {
  angular.module('app')
         .directive('autoImg', [function () {
           return {
             restrict: 'AE',
             templateUrl: '/src/directives/autoImg/autoImgTemplate.html',
             scope: {
               toggleInterval: '@'
             },
             replace: true,
             transclude: true,
             link: function (scope, ele, attr) {
               var $ = angular.element;
               var nowImg = 0;
               var maxImg = ele.find('.auto-img-item').length - 1;
               var transitionFlag = true;
               var toggleInterval = scope.toggleInterval || 5;
               var autoImgInterval = null;
               var d_arrowOuter = ele.find('.arrow-inside');
               var d_autoImgList = ele.find('.auto-img-item');
               var d_pointUl = ele.find('ul');
              
               if (maxImg > 0) {
                  //  追加小圆点
                 for (var i = 0; i <= maxImg; i++) {
                   var d_li = document.createElement('li');
                   i === 0 ? $(d_li).addClass('active'): null;
                   d_li.index = i;
                   $(d_li).on('click', liClickHandler)
                   d_pointUl.append(d_li);
                 }

                 var d_pointLis = $(d_pointUl).children();

                 ele.on('mouseenter', mouseenterHandler);
                 ele.on('mouseleave', mouseleaveHandler);
                 
                 $(d_pointLis[nowImg]).addClass('active');
                 //  左右切换
                 $(d_arrowOuter.children()[0]).on('click', function(evt){ toggleImg('-', evt) });
                 $(d_arrowOuter.children()[1]).on('click', function(evt){ toggleImg('+', evt) });
                 //  自动播放
                 setAutoImgInterval();
               } else {
                //  单张图片取消显示圆点ul
                 d_pointUl.remove();
               }
              
               $(d_autoImgList[nowImg]).addClass('active');

               function stopBable(e) {
                 if (!e) {
                   return;
                 }
                 if (e.stopPropagation) {
                   e.stopPropagation();
                 } else {
                   e.cancalBable = true;
                 }
               };

               function showArrow(evt) {
                d_arrowOuter.css('display', 'block');
                 stopBable(evt);
               };

               function hideArrow(evt) {
                d_arrowOuter.css('display', 'none');
                 stopBable(evt);
               };

               function toggleImg(where, evt) {
                 if (transitionFlag) {
                  transitionFlag = false;
                  if (where === '-') {
                    removeNowImgAndPointClass();
                    nowImg --;
                    nowImg = nowImg < 0 ? maxImg : nowImg;
                    addNowImgAndPointClass();
                   } else if (where === '+') {
                    removeNowImgAndPointClass();
                    nowImg ++;
                    nowImg = nowImg > maxImg ? 0 : nowImg;
                    addNowImgAndPointClass();
                   } else {
                    if (where !== nowImg) {
                      removeNowImgAndPointClass();
                      nowImg = where;
                      addNowImgAndPointClass();
                    }
                   }
                   setTimeout(function(){
                    transitionFlag = true;
                   }, 1000)
                 }

                 function addNowImgAndPointClass () {
                   $(d_autoImgList[nowImg]).addClass('active');
                   $(d_pointLis[nowImg]).addClass('active');
                 }

                 function removeNowImgAndPointClass () {
                   $(d_autoImgList[nowImg]).removeClass('active');
                   $(d_pointLis[nowImg]).removeClass('active');
                 }
                 stopBable(evt);
               };

               function setAutoImgInterval() {
                 autoImgInterval = setInterval(function(){
                   toggleImg('+');
                 }, toggleInterval * 1000);
               };

               function clearAutoImgInterval() {
                 clearInterval(autoImgInterval);
                 autoImgInterval = null;
               };

               function mouseenterHandler() {
                showArrow();
                clearAutoImgInterval();
               };

               function mouseleaveHandler() {
                hideArrow();
                setAutoImgInterval();
               };

               function liClickHandler(evt){ 
                 toggleImg(this.index, evt);
               };
             }
           }
         }])
         .directive('autoImgItem', ['$state', '$window', function ($state, $window) {
           return {
             rquire: 'autoImg',
             restrict: 'AE',
             replace: true,
             template: '<div class="auto-img-item"><a></a></div>',
             scope: {
               url: '@',
               img: '@'
             },
             link: function (scope, ele, attr, ctrl) {
               ele.css('background-image', 'url(' + scope.img +')');
               if (scope.url) {
                 ele.children().on('click', goState);

                 function goState() {
                  var reg = /.html$/;
                   if (reg.test(scope.url)) {
                     $window.open(scope.url);
                   } else {
                     $state.go(scope.url);
                   }
                };
               }
             }
           }
         }])
})();