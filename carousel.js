(function () {
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
        self.pd = 30;
        // 奖品资源
        self.resouse = null;
        self.colorList = null;
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
    };

    // 读取资源数据
    Carousel.prototype.loadResource = function (callBack) {
        var self = this;
        // 发请求 获取JSON资源
        this.resouse = [{
                "key": 1,
                "value": "一等奖",
                "img": ""
            },
            {
                "key": 0,
                "value": "谢谢参与",
                "img": ""
            },
            {
                "key": 2,
                "value": "二等奖",
                "img": ""
            },
            {
                "key": 0,
                "value": "谢谢参与",
                "img": ""
            },
            {
                "key": 3,
                "value": "三等奖",
                "img": ""
            },
            {
                "key": 0,
                "value": "谢谢参与",
                "img": ""
            }
        ];
        this.colors = ["#AE3EFF","#4D3FFF","#FC262C","#3A8BFF","#EE7602","#FE339F"];
        // 请求成功 执行 callBack
        callBack();
    };

    // 画圆背景
    Carousel.prototype.drawFullBg = function (style) {
        this.ctx.fillStyle = style || '#facb84';
        // 绘制
        this.ctx.beginPath();
        
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.r, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.strokeStyle = '#ff9800';
        this.ctx.lineWidth = 8;
        this.ctx.stroke();
        this.ctx.fill();
    };

    // 画扇形
    Carousel.prototype.drawSector = function (stRadain, edRadain, target,color) {
        /*获取随机颜色*/
        var getRandomColor = function () {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        };
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.r - this.pd, stRadain, edRadain);
        /*随机颜色*/
        this.ctx.fillStyle = color || getRandomColor();
        this.ctx.closePath();
        // this.ctx.stroke();
        this.ctx.fill();

        // 弧度换算成角度
        var angle = (stRadain + edRadain) / 2 * 180 / Math.PI;
        console.log(angle);

        // 画文本
        this.ctx.save();
        this.ctx.fillStyle = "#fff000";
        this.ctx.beginPath();
        this.ctx.font = '16px bold STheiti, SimHei';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = "middle";
        // this.ctx.fillText(target.value, 300, 300);
        var line_height = 24;
        // translate方法重新映射画布上的 (0,0) 位置
        var translateX = this.canvas.width * 0.5 + Math.cos(angle);
        var translateY = this.canvas.height * 0.5 + Math.sin(angle);
        console.log(translateX,translateY);
        // this.ctx.translate(translateX, translateY);
        // rotate方法旋转当前的绘图，因为文字适合当前扇形中心线垂直的！
        // angle，当前扇形自身旋转的角度 +  baseAngle / 2 中心线多旋转的角度  + 垂直的角度90°
        // this.ctx.rotate(-angle);
        //设置文本位置，居中显示 
        // console.log(angle + Math.PI / 2,this.ctx.measureText(target.value).width / 2);
        this.ctx.fillText(target.value, this.ctx.measureText(target.value).width / 2, this.canvas.width/2);
        //添加对应图标
        // this.ctx.drawImage(target.img,-35,0,60,60);
        // if(index == 0){
        //     ctx.drawImage(imgUrl1,-35,0,60,60);
        // }else if(index == 1){
        //     ctx.drawImage(imgUrl2,-35,0,60,60);
        // }else if(index == 2){
        //     ctx.drawImage(imgUrl3,-35,0,60,60);
        // }else if(index == 3){
        //     ctx.drawImage(imgUrl4,-35,0,60,60);
        // }else if(index == 4){
        //     ctx.drawImage(imgUrl5,-35,0,60,60);
        // }else{
        //     ctx.drawImage(imgUrl6,-35,0,60,60);
        // }
        this.ctx.restore(); //很关键，还原画板的状态到上一个save()状态之前

        // 画图片
        // this.ctx.beginPath();
    };

    // draw
    Carousel.prototype.carouselDraw = function () {
        // 画背景
        this.drawFullBg();
        // 画奖品
        // 计算扇形弧度
        var angle = Math.PI * 2 / this.resouse.length;
        for (var i = 0; i < this.resouse.length; i++) {
            var stRadain = i * angle;
            var edRadain = (i + 1) * angle;
            this.drawSector(stRadain, edRadain, this.resouse[i],this.colors[i]);
        }

    };

    // 抽奖
    Carousel.prototype.start = function () {
        var startBtn = document.getElementById('start');
        startBtn.onclick = function () {
            console.log('抽奖');
        };
    };
})();