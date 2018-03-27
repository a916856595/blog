(function() {
  var leadInfo = game.lead.leadInfo;
  var canvas = window.canvas;
  var ctx = window.ctx;


  function Block() {
    var _this = this;

    this.leadState = 'move';
    this.blockInfo = {
      'minWidth': leadInfo.size.x * 3,
      'maxWidth': leadInfo.size.x * 8,
      'minHeight': canvas.height / 10 * 7.5,
      'maxHeight': canvas.height / 10 * 9,
      'color': '#000'
    }
    this.positionArr = [{
      'x1': canvas.width / 10 - leadInfo.size.x,
      'x2': canvas.width / 10 + leadInfo.size.x * 2,
      'y': canvas.height / 10 * 9
    }];

    this.checkBlockIsEnough = checkBlockIsEnough;
    this.createBlock = createBlock;
    this.draw = draw;

    function checkBlockIsEnough() {
      var maxWidth = canvas.width;
      var lastPointPosition = _this.positionArr[_this.positionArr.length - 1].x2;
      if (lastPointPosition < maxWidth) {
        return false;
      } else {
        return true;
      }
    }

    function createBlock() {
      var maxWidth = canvas.width;
      var lastBlock = _this.positionArr[_this.positionArr.length - 1];

      var newBlockHeight = Math.ceil(_this.blockInfo.minHeight + (_this.blockInfo.maxHeight - _this.blockInfo.minHeight) * Math.random());
      var minDistance = Math.abs((lastBlock.y - newBlockHeight) * 1.5);
      var maxDistance = minDistance * 10;
          maxDistance = maxDistance > 400 ? 400 : maxDistance;
      var width = Math.ceil(_this.blockInfo.minWidth + (_this.blockInfo.maxWidth - _this.blockInfo.minWidth) * Math.random());
      var distance = Math.ceil(minDistance + (maxDistance - minDistance) * randomNoZero());
      var newBlockPosition = {
        'x1': lastBlock.x2 + distance,
        'x2': lastBlock.x2 + distance + width,
        'y': newBlockHeight
      }
      _this.positionArr.push(newBlockPosition);
    }

    function draw() {
      var blockInfo = _this.blockInfo;
      var positionArr = _this.positionArr;

      positionArr.forEach(function(position) {
        var startX = position.x1;
        var startY = position.y;
        var width = position.x2 - position.x1;
        var height = canvas.height - position.y;
        ctx.beginPath();
        ctx.fillStyle = blockInfo.color;
        ctx.fillRect(startX, startY, width, height);
      })
    }
  }

  function randomNoZero() {
    var num = Math.random();
    while (num) {
      return num;
    }
    return randomNoZero();
  }

  game.block = new Block();
})();