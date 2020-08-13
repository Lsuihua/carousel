(function(){
    // 创建一个中简者
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
        
        // 转盘速度/能量
        self.speed = 10;
        self.nenrgy = 0;
        // 可转次数
        self.count = 3;

        // 初始化
        self.init();
        // 读取异步数据
        self.loadResource(function() {
            // 开始画转盘
            self.carouselDraw();
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
            curAngel = baseAngle * i,
            targetAngel = baseAngle * (i+1),
            centerAngel = (curAngel + targetAngel) / 2,
            stRadain = i * baseRadain,
            edRadain = (i + 1) * baseRadain,
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

        // 弧度换算成角度
        this.ctx.save();
        this.ctx.fillStyle = "#fff000";
        this.ctx.font = '14px bold STheiti, SimHei';
        this.ctx.textAlign = 'center';
        var x = (this.canvas.r - this.pd - 24) * Math.cos(ctRadain);
        var y = (this.canvas.r - this.pd - 24) * Math.sin(ctRadain);
        // var translateX = this.canvas.width * 0.5 + Math.cos(ctRadain) * (this.canvas.r - this.pd - 20);
        // var translateY = this.canvas.height * 0.5 + Math.sin(ctRadain) * (this.canvas.r - this.pd - 20);
        this.ctx.translate(x, y);
        // rotate方法旋转当前的绘图，因为文字适合当前扇形中心线垂直的！
        // angle，当前扇形自身旋转的角度 +  baseAngle / 2 中心线多旋转的角度  + 垂直的角度90°
        this.ctx.rotate((baseAngle)* Math.PI / 180);
        // 登录状态下不会出现这行文字，点击页面右上角一键登录 );
        //设置文本位置，居中显示 
        this.ctx.fillText(target.value, 0, 0);
        this.ctx.restore();

        // 画文本
        // this.ctx.save();
        // this.ctx.fillStyle = "#fff000";
        // this.ctx.beginPath();
        // this.ctx.font = '18px bold STheiti, SimHei';
        // this.ctx.textAlign = 'center';
        // this.ctx.textBaseline = "middle";
        // // 转移坐标中心点
        // this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
        // // 获取区域中心角度坐标
        // var x = (this.canvas.r - this.pd - 24) * Math.cos(ctRadain);
        // var y = (this.canvas.r - this.pd - 24) * Math.sin(ctRadain);
        
        // // 旋转文字 默认加90°
        // // rotate方法旋转当前的绘图，因为文字适合当前扇形中心线垂直的！
        // // angle，当前扇形自身旋转的角度 +  baseAngle / 2 中心线多旋转的角度  + 垂直的角度90°
        // // this.ctx.rotate(-angle);
        // //设置文本位置，居中显示 
        // // console.log(angle + Math.PI / 2,this.ctx.measureText(target.value).width / 2);
        // console.log("平均角度",centerAngel);
        // // this.ctx.rotate(ctRadain);
        //     // 登录状态下不会出现这行文字，点击页面右上角一键登录);
        // this.ctx.fillText(target.value, x, y);
        
        // // 画图片
        // // this.ctx.beginPath();
        // var self = this;
        // var img = new Image();
        // img.src = target.img;
        // var ximg = (this.canvas.r - this.pd - 50) * Math.cos(ctRadain);
        // var yimg = (this.canvas.r - this.pd - 50) * Math.sin(ctRadain);
        // // self.ctx.save();
        // self.ctx.save();
        // self.ctx.translate(ximg,yimg);
        // // self.ctx.rotate(270);
        // self.ctx.beginPath();
        // self.ctx.drawImage(img,0,160,400,400,0,0,80,80);
        // self.ctx.closePath();
        // self.ctx.restore();

        // self.ctx.restore(); 
    };
    // 画边缘圆点
    Carousel.prototype.drawEdge = function(index){
        this.ctx.save();
        var raDain = Math.PI * 2 / this.edgeNum * index;
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

    //画主体
    Carousel.prototype.carouselDraw = function () {
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

    // 抽奖  抽奖动画
    Carousel.prototype.start = function () {
        var startBtn = document.getElementById('btnControl');
        startBtn.onclick = function (e) {
            console.log('抽奖');
            // 缩放动画
            e.target.className = 'scla-down';
        };
    };
})();