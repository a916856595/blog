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
               var arrowOuter = ele.find('.arrow-inside');
               var autoImgList = ele.find('.auto-img-item');
               var nowImg = 0;
               var maxImg = ele.find('.auto-img-item').length - 1;
               var transitionFlag = true;
               var toggleInterval = scope.toggleInterval || 5;
               var autoImgInterval = null;
               var d_pointUl = ele.find('ul');
              
               //  追加小圆点
              for (var i = 0; i <= maxImg; i++) {
                var li = document.createElement('li');
                li.index = i;
                $(li).on('click', liClickHandler)
                d_pointUl.append(li);
              }
               ele.on('mouseenter', mouseenterHandler);
               ele.on('mouseleave', mouseleaveHandler);
               autoImgList[nowImg].classList.add('active');
              //  左右切换
               $(arrowOuter.children()[0]).on('click', function(evt){ toggleImg('-', evt) });
               $(arrowOuter.children()[1]).on('click', function(evt){ toggleImg('+', evt) });
              //  自动播放
              setAutoImgInterval();

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
                 arrowOuter.css('display', 'block');
                 stopBable(evt);
               };

               function hideArrow(evt) {
                 arrowOuter.css('display', 'none');
                 stopBable(evt);
               };

               function toggleImg(where, evt) {
                 if (transitionFlag) {
                  transitionFlag = false;
                  if (where === '-') {
                    nowImgRemoveClass();
                    nowImg --;
                    nowImg = nowImg < 0 ? maxImg : nowImg;
                    nowImgAddClass();
                   } else if (where === '+') {
                    nowImgRemoveClass();
                    nowImg ++;
                    nowImg = nowImg > maxImg ? 0 : nowImg;
                    nowImgAddClass();
                   } else {
                    if (where !== nowImg) {
                      nowImgRemoveClass();
                      nowImg = where;
                      nowImgAddClass();
                    }
                   }
                   setTimeout(function(){
                    transitionFlag = true;
                   }, 1000)
                 }

                 function nowImgAddClass () {
                   $(autoImgList[nowImg]).addClass('active');
                 }

                 function nowImgRemoveClass () {
                   $(autoImgList[nowImg]).removeClass('active');
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
         .directive('autoImgItem', [function () {
           return {
             restrict: 'AE',
             replace: true,
             template: '<div class="auto-img-item"><a ui-sref="url"></a></div>',
             scope: {
               url: '@',
               img: '@'
             },
             link: function (scope, ele, attr) {
               ele.css('background', 'url(' + scope.img +')');
             }
           }
         }])
})();