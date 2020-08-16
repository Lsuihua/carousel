(function(){
    // 创建一个中间者
    var Carousel = window.Carousel = function (params) {
        var self = this;
        // 得到画布
        self.canvas = document.getElementById(params.canvasId);
        // 获取上下文
        self.ctx = self.canvas.getContext('2d');
        // 笔触大小
        self.ctx.lineWidth = 10;
        // 画像比例
        self.scale = params.scale || 1;
        // 圆盘边距
        self.pd = 28;
        // 奖品资源
        self.resouse = null;
        self.colorList = null;
        // 边框圆点数量
        self.edgeNum = 24;

        // 音乐资源
        self.bgm = document.getElementById('bgm');
        self.prizeMusic = document.getElementById('rotate-music');
        self.rotateMusic = document.getElementById('prize-music');
        
        // 转盘速度/能量
        self.speed = 1;
        self.rate = 1;
        // 转动周期
        self.cycle = 6;
        // 转动角度
        self.baseRotated = 0;
        self.rotate = 0;
        // 可转次数
        self.count = 300;
        self.timer = null;

        // 抽奖结果
        self.result = null;
        self.state = null;

        // 初始化
        self.init();

        // 读取异步数据
        self.loadResource(function() {
            // 改变this指向 carousel  渲染第一帧;
            window.requestAnimationFrame(self.render.bind(self));
        });
    };

    // 初始化
    Carousel.prototype.init = function () {
        // 读取视口宽高
        var windowW = document.documentElement.clientWidth,
            windowH = document.documentElement.clientHeight;
        if (windowW > 414) {
            windowW = 414;
        } else if (windowW < 320) {
            windowW = 320;
        }
        if (windowH > 812) {
            windowH = 812;
        }
        // 匹配视口
        this.canvas.width = windowW;
        this.canvas.height = windowW;
        // 获取最短边半径
        this.canvas.r = Math.min(this.canvas.width, this.canvas.height) / 2 * this.scale;
        document.querySelector('.main').style.width = windowH;
    };

    // 读取资源数据
    Carousel.prototype.loadResource = function (callBack) {
        var self = this;
        // 发请求 获取JSON资源
        self.resouse = [{
                "key": 1,
                "value": "一等奖",
                "img": "./imgs/mini.jpg"
            },
            {
                "key": 0,
                "value": "谢谢参与",
                "img": "./imgs/null.jpg"
            },
            {
                "key": 2,
                "value": "二等奖",
                "img": "./imgs/p40.jpg"
            },
            {
                "key": 0,
                "value": "谢谢参与",
                "img": "./imgs/null.jpg"
            },
            {
                "key": 3,
                "value": "三等奖",
                "img": "./imgs/xiaomi.jpg"
            },
            {
                "key": 0,
                "value": "谢谢参与",
                "img": "./imgs/null.jpg"
            }
        ];
        self.colors = ["#AE3EFF","#4D3FFF","#FC262C","#3A8BFF","#EE7602","#FE339F"];
        // 请求成功 执行 callBack
        callBack();
    };

    // 画圆背景
    Carousel.prototype.drawFullBg = function (style) {
        this.ctx.save();
        this.ctx.fillStyle = style || '#facb84';
        this.ctx.shadowColor = 'rgba(0,0,0,.3)';
        this.ctx.shadowBlur = 16;
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.r, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.strokeStyle = '#ff9800';
        this.ctx.lineWidth = 8;
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    };

    // 画扇形、文本、图片
    Carousel.prototype.drawSector = function (i, target,color) {
        // 角度 弧度
        var baseRadain = Math.PI * 2 / this.resouse.length,
            baseAngle = 360 / this.resouse.length,
            curAngel = baseAngle * i + this.rotate,
            targetAngel = baseAngle * (i+1) + this.rotate,
            centerAngel = (curAngel + targetAngel) / 2,
            stRadain = i * baseRadain + (this.rotate * Math.PI / 180),
            edRadain = (i + 1) * baseRadain + (this.rotate * Math.PI / 180),
            ctRadain = (stRadain + edRadain) / 2;
        
        /*获取随机颜色*/
        var getRandomColor = function () {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        };

        // 扇形区域
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.r - this.pd, stRadain, edRadain);
        this.ctx.fillStyle = color || getRandomColor();
        this.ctx.closePath();
        this.ctx.fill();
        var that = this;
        var fillGraphic = function(){
            that.ctx.fillStyle = "#fff000";
            that.ctx.font = '14px bold STheiti, SimHei';
            that.ctx.textAlign = 'center';
            // 定位到园中心，获取文字的坐标
            that.ctx.translate(that.canvas.width/2, that.canvas.height/2);
            var x = (that.canvas.r - that.pd * 2) * Math.cos(ctRadain);
            var y = (that.canvas.r - that.pd * 2) * Math.sin(ctRadain);
            //设置文本位置 
            that.ctx.translate(x, y);
            // angle，当前扇形自身旋转的角度 centerAngel  + 垂直的角度90°
            that.ctx.rotate((centerAngel + 90)* Math.PI / 180);
            that.ctx.fillText(target.value, 0, 0);
        };
        // 图文
        if(target.img){
            var img = new Image();
            img.src = target.img;
            img.onload = function(){
                that.ctx.save();
                fillGraphic();
                that.ctx.drawImage(img,0,0,400,400,-25,10,50,50);
                that.ctx.restore();
            };
            img.onerror = function(){
                // 弧度换算成角度
                that.ctx.save();
                fillGraphic();
                that.ctx.restore();
            };
        }else{
            that.ctx.save();
            fillGraphic();
            that.ctx.restore();
        }
        that.ctx.restore();
    };
    // 画边缘圆点
    Carousel.prototype.drawEdge = function(index){
        var raDain = Math.PI * 2 / this.edgeNum * index + (this.rotate * Math.PI / 180);
        this.ctx.save();
        this.ctx.beginPath();
        // 转移中心点
        this.ctx.translate(this.canvas.width/2,this.canvas.height /2);
        // 获取x、y坐标
        var x = (this.canvas.r - this.pd /2) * Math.cos(raDain);
        var y = (this.canvas.r - this.pd /2) * Math.sin(raDain);
        this.ctx.arc( x , y , 5, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.lineWidth = 2;
        // 圆点颜色间隔
        if(index % 2){
            this.ctx.fillStyle = '#ff9800';
            this.ctx.strokeStyle = '#fff';
            this.ctx.stroke();
        }else{
            this.ctx.fillStyle = '#FFEB3B';
            this.ctx.shadowBlur = 2;
            this.ctx.shadowColor = '#ff9800';
        }
        this.ctx.fill();
        this.ctx.restore();
    };

    //渲染
    Carousel.prototype.render = function () {
        // 画背景
        this.drawFullBg();
        // 画扇形主内容
        for (var i = 0; i < this.resouse.length; i++) {
            this.drawSector(i, this.resouse[i],this.colors[i]);
        }
        // 转盘边缘
        for(var j = 0;j<this.edgeNum; j++){
            this.drawEdge(j);
        }
    };

    // 更新
    Carousel.prototype.upDated = function(){
        if(this.state == 'off'){
            this.rate -= 0.02;
            if(this.rate <= 1){
                this.rate = 1;
            }
        }else{
            this.rate += 0.2;
            if(this.rate >= 6){
                this.rate = 6;
            }
        }
        this.rotate = this.rotate + this.speed * this.rate;
    };

    // 开始动画
    Carousel.prototype.animation = function(){
        var self = this;
        if(self.rotate >= self.baseRotated && self.state == 'off'){
            self.rotateMusic.pause();
            // console.log("===========>转盘停止");

            self.rotate = self.baseRotated;
            window.cancelAnimationFrame(self.timer);
            // 停止动画  清空数据 
            self.prizeMusic.play();
            self.timer = null;
            self.state = '';
            self.baseRotated = 0;
            self.rotate = 0;
            return;
        }
        self.timer = window.requestAnimationFrame(function(){
            // 清屏 
            self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
            // 渲染
            self.upDated();
            self.render();
            self.timer = window.requestAnimationFrame(self.animation.bind(self));
        });
    };

    // 请求中奖结果
    Carousel.prototype.requestResult = function(callBack){
        var self = this;
        self.state = 'on';
        var time = setTimeout(function(){
            self.result = {
                "key": 1,
                "value": "一等奖",
                "img": "./imgs/mini.jpg"
            };
            var bsAngle = 360 / self.resouse.length,
                angleInterval = 0;
            // 计算转盘的获奖角度区间
            self.resouse.map(function(item,index){
                if(item.key == self.result.key){
                    var stAngle = bsAngle * index + 5, 
                        edAngle = bsAngle * (index +1) - 5;
                    angleInterval = Math.floor(Math.random() * (edAngle - stAngle + 1) + stAngle);
                }
            });
            console.log("角度区域====>",angleInterval);
            // 计算奖品旋转角度
            self.rotate = self.rotate % 360;
            self.baseRotated = 360 * 3 - 90 - angleInterval;
            clearTimeout(time);
            callBack();
        },2000);
    };

    // 抽奖  抽奖动画
    Carousel.prototype.start = function () {
        var self = this;
        console.log("转动====> 执行动画");
        if(self.state == 'on'){
            // 正在转
            return;
        }
        if(self.count<= 0){
            return console.log("======> 你已没有次数");
        }
        /**
         *  发请求 抽奖动作
         *  执行动画
         *  响应抽奖结果
         *  停止抽奖动画
         *  显示奖品
         */
        self.rotateMusic.play();
        self.animation();
        self.requestResult(function(){
            self.count --;
            self.state = 'off';
        });
    };
})();