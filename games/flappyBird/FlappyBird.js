;(function(window){
	function Flappy (option){
		this.canvas = document.getElementById(option.id);
		this.pen = this.canvas.getContext("2d");
		//设置画布的宽高
		this.width = option.width || 900;
		this.height = option.height || 600;
		//设置和限制小鸟的初始位置
		this.birdX = option.birdX || 150;
		this.birdY = option.birdY || 150;
		this.birdX = this.birdX < 150 ? 150 : this.birdX;
		this.birdX = this.birdX > this.width - 100 ? 150 : this.birdX;
		this.birdY = this.birdY < 150 ? 150 : this.birdY;
		this.birdY = this.birdY > this.height - 100 ? 150 : this.birdY;
		this.type1 = option.type1 || "normal";
		this.type2 = option.type2 || "normal";
		this.fn = option.fn? option.fn:null;

		//全局定时器
		this.timer = null;
		//确认图片是否加载完毕
		this.imgIsLoad = false;
		this.reset();
		this.init();
	}
	Flappy.prototype = {
		"constructor":Flappy,
		//设置canvas的方法
		"set":function(){
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			if(this.type2 == "connect"){
				this.pipesNum = 17;
				this.pipesYSpace = 50;
				this.addSpeedY = 0.06;
			};
			if(this.type1 == "add"){
				this.addSpeedX = 0.0001;
			}
		},
		// 初始化游戏方法
		"init":function(){
			var that = this;
			this.set();
			var timer = null;
				timer = setInterval(function(){
					if(that.imgIsLoad){
						clearInterval(timer);
						that.goOn();
					}
				},5);
			this.loadImg();
		},
		//加载图片完成后继续的设置
		"goOn":function(){
			this.play();
			this.control();
		},
		//游戏进行的方法
		"play":function(){
			var that = this;
			var yPos = this.canvas.height - this.imgs.land.height;
			var xPos = 0;
				this.timer = setInterval(function(){
					if(!that.isPause){
						that.pen.clearRect(0,0,that.canvas.width,that.canvas.height);
						that.drawLand(xPos,yPos,3);
						that.drawSky(0,0,3);
						that.drawPipes(that.pipesSpace,that.pipesNum,that.pipesYSpace);
						that.drawBird(that.X,that.Y);
						that.drawScore();
						that.setBirdPos();
						that.isRunning();
						if(that.isOver){
							clearInterval(that.timer);
						}
						that.speedX += that.addSpeedX;
					}
				},10);
		},
		"setBirdPos":function(){
			this.speedY += this.addSpeedY;
			this.speedY = this.speedY > this.maxSpeedY ? this.maxSpeedY : this.speedY;
			this.speedY = this.speedY < this.minSpeedY ? this.minSpeedY : this.speedY;
			this.birdDeg = this.speedY * this.maxBirdDeg / this.maxSpeedY;
			this.Y += this.speedY;
		},
		"loadImg":function(){
			var that = this;
			var picArr = ["birds","land","pipe1","pipe2","sky"];
			var imgs = {
				"max" : picArr.length,
				"now" : 1
			};
			for(var i = 0 ; i < picArr.length ; i ++){
				imgs[picArr[i]] = new Image();
				imgs[picArr[i]].src = "imgs/" + picArr[i] + ".png";
				imgs[picArr[i]].onload = function(){
					imgs.now ++;
					if(imgs.now > imgs.max){
						that.imgs = imgs;
						that.imgIsLoad = true;
					}
				}
			}
		},
		//用户操作
		"control":function(){
			var that = this;
			window.addEventListener("keydown",function(e){
				if(e.keyCode == 32){
					that.speedY = that.minSpeedY;
					music[0].currentTime = 0;
					music[0].play();
				}else if(e.keyCode == 13){
					that.pause();
				}
			});
			window.addEventListener("touchstart",function(){
				that.speedY = that.minSpeedY;
				music[0].currentTime = 0;
				music[0].play();
			})
		},
		//绘制小鸟的方法
		//x,y为要绘制的小鸟坐标
		"drawBird":function(x,y){
			var birdX = [8,60,113];
			var birdY = 11;
			var width = 34;
			var height = 24;
			var bird = this.imgs.birds
			this.pen.save();
			this.pen.beginPath();
			this.pen.moveTo(0,0);
			this.pen.translate(x,y);
			this.pen.rotate(this.r(this.birdDeg));
			this.pen.drawImage(bird,birdX[this.birdFrame],birdY,width,height,-width/2,-height/2,width,height);
			this.pen.restore();
			this.birdFrame++;
			this.birdFrame %= 3;
		},
		//x,y为第一个陆地的原点坐标,n为需要平铺几个陆地
		"drawLand":function(x,y,n){
			var width = this.imgs.land.width;
			var height = this.imgs.land.height;
			this.pen.beginPath();
			this.pen.moveTo(0,0);
			for(var i = 0 ; i < n ; i ++){
				this.pen.drawImage(this.imgs.land,0,0,width,height,x - this.landFrame + i*width,y,width,height);
			}
			this.landFrame += this.speedX;
			this.landFrame %= 24;
		},
		//x,y为第一个天空的原点坐标,n为需要平铺几个天空
		"drawSky":function(x,y,n){
			var width = this.imgs.sky.width;
			var height = this.imgs.sky.height;
				this.skyHeight = this.canvas.height - this.imgs.land.height;
			var nowWidth = width * this.skyHeight / height;
			this.pen.beginPath();
			this.pen.moveTo(0,0);
			for(var i = 0 ; i < n ; i ++){
				this.pen.drawImage(this.imgs.sky,0,0,width,height,x - this.skyFrame + i*nowWidth,y,nowWidth,this.skyHeight);
			}
			this.skyFrame += this.speedX/2;
			this.skyFrame %= nowWidth;
		},
		//y为水管的y轴间距,n为需要的水管个数,maxY为两个水管之间允许的y轴最大差值
		"drawPipes":function(y,n,maxY){
			var up = this.imgs.pipe2;
			var down = this.imgs.pipe1;
			var width = up.width;
			var height = up.height;
			var start = this.canvas.width;
			var end = - up.width;
			var minPipesY = 50;
			var maxPipesY = this.canvas.height - this.imgs.land.height - minPipesY - y;
			var margin = (this.canvas.width + width)/n - width;
			var randomY = function(){
				return Math.round(Math.random()*(maxPipesY - minPipesY) + minPipesY);
			}
			var pipes1YArr = [];
			//生成Y的随机坐标
			if(this.isPipeYNotSet){
				this.isPipeYNotSet = false;
				this.pipesYArr[0] = randomY();
				for(var i = 1 ; i < n ; i ++){
					this.pipesYArr[i] = this.pipesYArr[i - 1] + Math.floor(Math.random() * maxY) * (Math.round(Math.random()) ? 1 : -1);
					this.pipesYArr[i] = this.pipesYArr[i] < minPipesY ? minPipesY : this.pipesYArr[i];
					this.pipesYArr[i] = this.pipesYArr[i] > maxPipesY ? maxPipesY : this.pipesYArr[i];
				};
			};
			//生成初始X轴坐标并且将水管数据对象
			if(this.isPipeXNotSet){
				this.isPipeXNotSet = false;
				for(var i = 0 ; i < n ; i ++){
					this.scoreOff[i] = true;
					this.pipesXArr[i] = start + i * (margin + width);
					this.crashUp[i] = {};
					this.crashDown[i] = {};
				};
			};
			//生成下半部分水管的坐标
			for(var i = 0 ; i < n ; i ++){
					pipes1YArr.push(this.skyHeight - this.pipesYArr[i] - y)
			}
			this.pen.beginPath();
			//绘制水管
			for(var i = 0 ; i < n ; i ++){
				this.pen.drawImage(up,0,height - this.pipesYArr[i],width,this.pipesYArr[i],this.pipesXArr[i],0,width,this.pipesYArr[i]);
				this.crashUp[i].X = this.pipesXArr[i];
				this.crashUp[i].Y = 0;
				this.crashUp[i].height = this.pipesYArr[i];
				this.pen.drawImage(down,0,0,width,pipes1YArr[i],this.pipesXArr[i],this.skyHeight - pipes1YArr[i],width,pipes1YArr[i]);
				this.crashDown[i].X = this.pipesXArr[i];
				this.crashDown[i].Y = this.skyHeight - pipes1YArr[i]
				this.crashDown[i].height = pipes1YArr[i];
			};
			//分数判定
			for(var i = 0 ; i < n ; i ++){
				if(this.pipesXArr[i] < this.birdX && this.scoreOff[i]){
					this.scoreOff[i] = false;
					this.score ++;
					music[1].play();
				}
			}   
			//水管移动及重构
			for(var i = 0 ; i < n ; i ++){
					this.pipesXArr[i] -= this.speedX;
					if(this.pipesXArr[i] <= end){
						this.pipesXArr[i] = start;
						if(i != 0){
							this.pipesYArr[i] = this.pipesYArr[i - 1] + Math.floor(Math.random() * maxY) * (Math.round(Math.random()) ? 1 : -1);
						}else{
							this.pipesYArr[i] = this.pipesYArr[n - 1] + Math.floor(Math.random() * maxY) * (Math.round(Math.random()) ? 1 : -1);
						}
						this.pipesYArr[i] = this.pipesYArr[i] < minPipesY ? minPipesY : this.pipesYArr[i];
						this.pipesYArr[i] = this.pipesYArr[i] > maxPipesY ? maxPipesY : this.pipesYArr[i];
						this.scoreOff[i] = true;
					};
				};
		},
		"drawScore":function(){
			this.pen.beginPath();
			this.pen.font = "30px MicrosoftYahei"
			this.pen.textBaseline = "top";
			var margin = 40;
			var textLe = this.pen.measureText("score:" + this.score).width;
			var x = this.canvas.width - margin - textLe;
			this.pen.fillText("score:" + this.score,x,margin);
		},
		"isRunning":function(){
			var width = this.imgs.pipe1.width;
			this.pen.beginPath();
			for(var i = 0 ; i < this.pipesNum ; i ++){
				this.pen.rect(this.crashUp[i].X,this.crashUp[i].Y,width,this.crashUp[i].height);
				this.pen.rect(this.crashDown[i].X,this.crashDown[i].Y,width,this.crashDown[i].height);
			};
			if(this.pen.isPointInPath(this.X,this.Y) || this.Y < 0 || this.Y > this.skyHeight){
				this.isOver = true;
				music[3].play();
				if(this.type2 == "normal"){
					if(this.score > this.heighScore){
						this.heighScore = this.score;
					}
				}else if(this.type2 == "connect"){
					if(this.score > this.connectScore){
						this.connectScore = this.score;
					}
				}

				this.fn?this.fn():"";
			};
		},
		//游戏暂停的方法
		"pause":function(){
			if(this.isPause){
				this.isPause = false;
			}else {
				this.isPause = true;
			}
			
		},
		//重置游戏
		"reset":function(){
			//游戏是否失败
			this.isOver = false;
			//游戏是否暂停
			this.isPause = false;
			//分数
			this.score = 0;
			this.scoreOff = [];
			//高分
			this.heighScore = 0;
			this.connectScore = 0;
			//绘制小鸟的位置
			this.X = this.birdX;
			this.Y = this.birdY;
			//运动相关数据
			this.addSpeedX = 0;
			this.speedX = 1.5;
			this.addSpeedY = 0.05; 
			this.speedY = 0;
			this.maxSpeedY = 5;
			this.minSpeedY = - 3;
			this.birdDeg = 0;
			this.maxBirdDeg = 45;
			//小鸟的动画位置计数
			this.birdFrame = 0;
			//陆地相关数据
			this.landFrame = 0;
			//天空相关数据
			this.skyHeight = 0;
			this.skyFrame = 0;
			//水管相关数据
			this.pipesXArr = [];
			this.pipesYArr = [];
			this.pipesFrame = 0;
			this.pipesYSpace = 160;
			this.pipesSpace = 170;
			this.pipesNum = 5;
			this.isPipeXNotSet = true; 
			this.isPipeYNotSet = true; 
			//判断碰撞的矩形数组
			this.crashUp = {};
			this.crashDown = {};
		},
		"restart":function(){
			clearInterval(this.timer);
			this.reset();
			this.set();
			this.play();
		},
		"r":function(deg){
			return deg * Math.PI / 180;
		}
	}
	window.Flappy = Flappy
})(window)

var startBtn = document.querySelector("#start-game");
var startWin = document.querySelector(".start-window");
var selWin = document.querySelector(".sel-game");
var mask = document.querySelector(".mask");
var heighScore = document.querySelector("#highScore");
var score = localStorage.getItem(selWin.dataset["type"] + "Score") || 0;
var nowScore = document.querySelector("#nowScore");
var type1 = document.querySelector("#type1");
var type2 = document.querySelector("#type2");
var pause = document.querySelector(".pause");
var music = document.querySelectorAll("audio");
var reBtn = document.querySelector("#reBtn");
var canvas = document.querySelector("#canvas");
var re = document.querySelector("#re");
//开始按钮
var game = null;
var unWidth = window.screen.availWidth;
var unHeight = window.screen.availHeight;
if(unWidth/unHeight >= 3/2){
	unWidth = unHeight * 3 / 2;
}else{
	unHeight = unWidth * 2 / 3;
};
// canvas.style.width = unWidth - 2 + "px";
// canvas.style.height = unHeight - 2 + "px";
startBtn.addEventListener("click",function(){
	mask.classList.add("hide");
	startWin.classList.add("hide");
    game = new Flappy({
		"id":"canvas",
		"type1":selWin.dataset["speed"],
		"type2":selWin.dataset["type"],
		"fn":function(){
				if(selWin.dataset["type"] == "normal"){
					if(score < game.heighScore){
						score = game.heighScore;
						localStorage.setItem("normalScore",game.heighScore);
					}
				}else if(selWin.dataset["type"] == "connect"){
					if(score < game.connectScore){
						score = game.connectScore;
						localStorage.setItem("connectScore",game.connectScore);
					}
				}
				mask.classList.remove("hide");
				pause.classList.remove("hide");
		}
	});
	game.canvas.classList.remove("hide");
});


startWin.children[1].addEventListener("click",function(){
	selWin.classList.remove("hide");
});
selWin.children[0].addEventListener("click",function(){
	selWin.dataset["speed"] = "normal";
	type1.innerHTML = "普通";
	this.classList.add("active");
	selWin.children[1].classList.remove("active");
});
selWin.children[1].addEventListener("click",function(){
	selWin.dataset["speed"] = "add";
	this.classList.add("active");
	type1.innerHTML = "加速";
	selWin.children[0].classList.remove("active");
});
selWin.children[2].addEventListener("click",function(){
	selWin.dataset["type"] = selWin.dataset["type"] == "connect"? "normal":"connect";
	type2.innerHTML = type2.innerHTML == "无缝" ? "普通":"无缝";
	this.classList.toggle("active");
});
selWin.children[3].addEventListener("click",function(){
	selWin.classList.add("hide");
})
window.addEventListener("keydown",function(e){
	if(e.keyCode == 13){
		if(pause.classList.contains("hide")){
			mask.classList.remove("hide");
			pause.classList.remove("hide");
			heighScore.innerHTML = localStorage.getItem(selWin.dataset["type"]+"Score");
			nowScore.innerHTML = game.score;
		}else{
			mask.classList.add("hide");
			pause.classList.add("hide");
		}
	}
});
conBtn.addEventListener("click",function(){
	mask.classList.add("hide");
	pause.classList.add("hide");
	game.isPause = false;
});
reBtn.addEventListener("click",function(){
	mask.classList.add("hide");
	pause.classList.add("hide");
	game.restart();
});
re.addEventListener("click",function(){
	game.restart();
})