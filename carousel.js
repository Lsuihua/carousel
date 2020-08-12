(function(){
    // 创建一个中简者
    var Carousel = window.Carousel = function(params){
        // 得到画布
        this.canvas = document.getElementById(params.canvasId);
        // 获取上下文
        this.ctx = this.canvas.getContext('2d');
        // 画像比例
        this.scale = params.scale || 1;
        // 奖品资源
        this.resouse = null;
        // 初始化
        this.init();
        // 读取异步数据
        this.loadResource(() => {
            // 开始画转盘
            this.carouselDraw();
        })
    }

    // 初始化
    Carousel.prototype.init = function(){
        // 读取视口宽高
        var windowW = document.documentElement.clientWidth,
            windowH = document.documentElement.clientHeight;
        if(windowW > 414){
            windowW = 414
        }else if(windowW < 320){
            windowW = 320
        }
        if(windowH > 812){
            windowH = 812
        }
        // 匹配视口
        this.canvas.width = windowW;
        this.canvas.height = windowW;
        // 获取最短边半径
        this.canvas.r = Math.min(this.canvas.width,this.canvas.height) / 2 * this.scale;
    }

    // 读取资源数据
    Carousel.prototype.loadResource = function(callBack){
        var self = this;
        // 发请求 获取JSON资源
        this.resouse = [
            {
                "key":1,
                "value":"一等奖",
                "img":""
            },
            {
                "key":0,
                "value":"谢谢参与",
                "img":""
            },
            {
                "key":2,
                "value":"二等奖",
                "img":""
            },
            {
                "key":0,
                "value":"谢谢参与",
                "img":""
            },
            {
                "key":3,
                "value":"三等奖",
                "img":""
            },
            {
                "key":0,
                "value":"谢谢参与",
                "img":""
            }
        ];
        // 请求成功 执行 callBack
        callBack()
    }

    // 画圆背景
    Carousel.prototype.drawFullBg = function(style){
        this.ctx.fillStyle = style || '#000';
        // 绘制
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.r, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    // 画扇形
    Carousel.prototype.drawSector = function(startAngle,endAngle,target){
        /*获取随机颜色*/
        var getRandomColor = function () {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width/2, this.canvas.height/2);
        this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.canvas.r, startAngle, endAngle);
        /*随机颜色*/
        this.ctx.fillStyle = getRandomColor();
        this.ctx.fill();

        // 弧度换算成角度
        var dr = (startAngle + endAngle) /2 * 180 / Math.PI
        // 画文本
        this.ctx.beginPath();
        this.ctx.font = '16px STheiti, SimHei';
        console.log(startAngle,endAngle,dr)
        this.ctx.fillText(target.value, startAngle, endAngle);

        // 画图片
        this.ctx.beginPath();
    }

    // draw
    Carousel.prototype.carouselDraw = function(){
        // 画背景
        this.drawFullBg('red');
        // 画奖品
        // 计算扇形弧度
        var angle = Math.PI * 2 / this.resouse.length;
        for(let i=0;i<this.resouse.length;i++){
            var startAngle = i * angle;
            var endAngle = (i + 1) * angle;
            if(i == 0){
                this.drawSector(startAngle,endAngle,this.resouse[i]);
            }
            
        }
        
    }

    // 抽奖
    Carousel.prototype.start = function (){
        var startBtn = document.getElementById('start');
        startBtn.onclick = function(){
            console.log('抽奖')
        }
    }
})()