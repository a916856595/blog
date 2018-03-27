(function(global) {
  var canvasId = 'canvas-game';
  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext('2d');
  var imgMethod = new ImgMethod();
  var imgObject = {};

  canvas.width = width;
  canvas.height = height;

  function ImgMethod() {
    var _this = this;
    var imageNum = 0;
    var readyImageNum = 0;

    this.isAllImageReady = false;
    this.checkTimer = null;
    this.getImage = getImage;
    this.checkImageIsAllReady = checkImageIsAllReady;
    this.imgObj = {
      'background': 'assets/background.jpg',
      'background2': 'assets/background2.jpg'
    }

    function getImage() {
      for (var imgName in _this.imgObj) {
        imageNum ++;
      }

      for (var imgName in _this.imgObj) {
        var img = new Image();
        img.src = _this.imgObj[imgName];
        img.onload = function () {
          imgObject[imgName] = img;
          readyImageNum ++;
        }
      }
    }

    function checkImageIsAllReady(callback) {
      clearInterval(_this.checkTimer);
      _this.checkTimer = setInterval(function () {
        if (readyImageNum >= imageNum) {
          clearInterval(_this.checkTimer);
          _this.isAllImageReady = true;
          callback && callback();
        }
      }, 10)
    }
  }

  function Score() {
    var _this = this;
    this.score = 0;

    this.computeScore = computeScore;
    this.resetScore = resetScore;
    this.draw = draw;

    function computeScore(number) {
      if (number) {
        _this.score = _this.score + number;
      }
      return _this.score;
    }

    function resetScore(number) {
      if (number) {
        _this.score = number || 0;
      }
    }

    function draw() {
      ctx.beginPath();
      ctx.font = '40px Arial';
      ctx.fillText('score:' + _this.score, 10, 50);
    }
  }
  
  global.score = new Score();
  global.canvas = canvas;
  global.ctx = ctx;
  global.game = {};
  global.img = {
    'imgMethod': imgMethod,
    'imgObject': imgObject
  };
})(window);