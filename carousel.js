(function(){
    // 创建一个中简者
    var Carousel = window.Carousel = function(params){

        // 得到画布
        this.canvas = document.getElementById(params.canvasId);
        // 获取上下文
        this.ctx = this.canvas.getContext('2d');
        // 画像比例
        this.scale = params.scale || 1;
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
        var resouse = [
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
    Carousel.prototype.draw

    // draw
    Carousel.prototype.carouselDraw = function(){
        this.drawFullBg('red')
    }

    // 抽奖
    Carousel.prototype.start = function (){
        var startBtn = document.getElementById('start');
        startBtn.onclick = function(){
            console.log('抽奖')
        }
    }
})()