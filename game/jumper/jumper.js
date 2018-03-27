(function() {
  var jumperTimer = null;
  var jumperInterval = 5; // 定时器间隔
  var standBlockObj = {
    'position': game.block.positionArr[0].x1,
    'isFirstFall': false,
    'before': game.block.positionArr[0].x1,
    'current': game.block.positionArr[0].x1
  };

  var score = window.score;
  var canvas =  window.canvas;
  var ctx = window.ctx;
  var leadSize = game.lead.leadInfo.size;
  var leadPosition = game.lead.leadInfo.position;

  var isFirstFall = true;
  var isFirstPush = true;
  var isToLeft = false;
  var canGetScore = true;
  var startTime = 0;            //蓄力开始时间存储值
  var horizontalDirection = 1;  //水平移动方向
  var maxYAddSpeed = 400;       //向下加速度
  var leftLine = canvas.width / 10;//向左对齐水平位置
  var leftSpeed = - 600;         //向左对齐速度

  img.imgMethod.getImage();
  img.imgMethod.checkImageIsAllReady(function() {

    jumperTimer = setInterval(runGame,jumperInterval);

    function runGame() {  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // game.background.draw();
      while (!game.block.checkBlockIsEnough()) {
        game.block.createBlock();
      }
      game.block.draw();
      game.lead.changeMouseState('circle');
      if (game.lead.sportInfo.speed.y < 0) {
        game.lead.changeEyeState('top');
      } else if (game.lead.sportInfo.speed.y > 0) {
        game.lead.changeEyeState('bottom');
      } else {
        game.lead.changeEyeState('center');
        game.lead.changeMouseState('square');
      }
      var leadPositionObj = game.lead.computeLeadPosition(jumperInterval);
      var blockPositionArr = game.block.positionArr;
      if (!isToLeft) {
        blockPositionArr.forEach(function (blockPosition) {
          var beforePosition = {
            'x1': leadPositionObj.x.before,
            'x2': leadPositionObj.x.before + leadSize.x,
            'y': leadPositionObj.y.before
          };
          var afterPosition = {
            'x1': leadPositionObj.x.after,
            'x2': leadPositionObj.x.after + leadSize.x,
            'y': leadPositionObj.y.after
          };
          if ((beforePosition.y < blockPosition.y - leadSize.y && afterPosition.y > blockPosition.y - leadSize.y) || leadPositionObj.y.after === blockPosition.y - leadSize.y) {
            var rate = (blockPosition.y - leadSize.y - afterPosition.y) / (afterPosition.y - beforePosition.y - leadSize.y);
            var deviationX = beforePosition.x1 + (afterPosition.x1 - beforePosition.x1) * rate;
            if (deviationX > blockPosition.x1 - leadSize.x && deviationX < blockPosition.x2) {
              leadPositionObj.y.speed = 0;
              leadPositionObj.x.after = deviationX;
              leadPositionObj.y.after = blockPosition.y - leadSize.y;
              game.lead.changeAddSpeed('x', 0);
              game.lead.changeAddSpeed('y', 0);
              isFirstFall = false;
              standBlockObj.current = blockPosition.x1;
              if (standBlockObj.current !== standBlockObj.before) {
                standBlockObj.isFirstFall = true;
                canGetScore = true;
                if (standBlockObj.isFirstFall) {
                  standBlockObj.before = blockPosition.x1;
                  standBlockObj.isFirstFall = false;
                  getScoreHandle();
                }
              }
            }
          };
          if (afterPosition.y + leadSize.y > blockPosition.y) {
            if ((beforePosition.x2 < blockPosition.x1 && afterPosition.x2 > blockPosition.x1) || afterPosition.x2 === blockPosition.x1) {
              var rate = (blockPosition.x1 - beforePosition.x2) / (afterPosition.x2 - beforePosition.x2);
              var deviationY = beforePosition.y + (afterPosition.y - beforePosition.y) * rate;
              leadPositionObj.y.after = deviationY;
              leadPositionObj.x.after = blockPosition.x1 - leadSize.x;
              horizontalDirection = -1;
            } else if (beforePosition.x1 > blockPosition.x2 && afterPosition.x1 < blockPosition.x2 || afterPosition.x1 === blockPosition.x2) {
              var rate = (blockPosition.x2 - beforePosition.x1) / (afterPosition.x1 - beforePosition.x1);
              var deviationY = beforePosition.y + (afterPosition.y - beforePosition.y) * rate;
              leadPositionObj.y.after = deviationY;
              leadPositionObj.x.after = blockPosition.x2;
              horizontalDirection = 1;
            }
          }
        });
        if (leadPositionObj.y.speed === 0 || isFirstFall) {
          leadPositionObj.x.speed = 0;
        } else {
          leadPositionObj.x.speed = game.lead.sportInfo.maxSpeed.x * horizontalDirection;
        }
      } else {
        var distance = leadPosition.x;
        var preDistance = leftSpeed * jumperInterval / 1000;
        leadPositionObj.x.speed = leftSpeed;
        blockPositionArr.forEach(function (blockPosition) {
          blockPosition.x1 = blockPosition.x1 + preDistance;
          blockPosition.x2 = blockPosition.x2 + preDistance;
        });
        standBlockObj.before = standBlockObj.before + preDistance; //方块归位时需要更新之前踩过方块的记录值
        if (leadPositionObj.x.after <= leftLine) {
          blockPositionArr.forEach(function (blockPosition) {
            if (blockPosition.x2 < 0) {
              blockPositionArr.shift();
            }
          });
          isToLeft = false;
        }
      }
      game.lead.updateLeadPositionAndSpeed(leadPositionObj);
      score.draw();
      game.lead.draw();
      if (checkLeadIsDie()) {
        
      };
    }
  });

  function getScoreHandle() {
    if (canGetScore && !isFirstFall) {
      score.computeScore(1);
    };
    canGetScore = false;
    if (leadPosition.x > leftLine) {
      isToLeft = true;
    }
  }

  function checkLeadIsDie() {
    if (leadPosition.y > canvas.height || leadPosition.x > canvas.width) {
      return true;
    }
    return false;
  }

  function startJump(deviationTime) {
    game.lead.accunulateJump(deviationTime);
    game.lead.changeAddSpeed('y', maxYAddSpeed);
  }

  window.onkeydown = window.ontouchstart = function(event) {
    if(event.keyCode) {
      if (!event.keyCode === 32) {
        return;
      }
    }
    if (isFirstPush && game.lead.sportInfo.speed.y === 0 && !isToLeft) {
      isFirstPush = false;
      startTime = new Date().getTime();
    }
  }

  window.onkeyup = window.ontouchend = function(event) {
    var endTime = 0;
    if (event.keyCode) {
      if (!event.keyCode === 32) {
        return;
      }
    }
    if (game.lead.sportInfo.speed.y === 0 && !isToLeft) {
      isFirstPush = true;
      endTime = new Date().getTime();
      var deviationTime = (endTime - startTime) / 1000;
      horizontalDirection = 1;
      startJump(deviationTime);
    }
  }
})();