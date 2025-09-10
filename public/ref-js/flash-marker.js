(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.FlashMarker = factory());
}(this, (function () { 'use strict';
    var map = null;
    var canvas = null;
    var canvasList = {};
    var flashMarkerId = 0;
    /**
     * @author lzugis
     * @Date 2017-09-29
     * */
    function CanvasLayer(options) {
        this.options = options || {};
        this.paneName = this.options.paneName || 'labelPane';
        this.zIndex = this.options.zIndex || 0;
        this._map = options.map;
        this.canvasId = options.canvasId;
        map = this._map;
        this._lastDrawTime = null;
        this.show();
    }

    CanvasLayer.prototype.initialize = function () {
        var map = this._map;
        if(!!canvasList[this.canvasId]){
            canvas = this.canvas = canvasList[this.canvasId];
        }else{
            canvas = this.canvas = document.createElement('canvas');
            canvas.id = this.canvasId;
            canvasList[this.canvasId]=canvas;
        }
        var ctx = this.ctx = this.canvas.getContext('2d');
        canvas.style.cssText = 'position:absolute;' + 'left:0;' + 'top:0;' + 'z-index:' + this.zIndex + ';';
        this.adjustSize();
        this.adjustRatio(ctx);
        map.getViewport().appendChild(canvas);
        var that = this;
        map.getView().on('propertychange',function(){
            that.canvas.style.display="none";
        });
        map.on("moveend",function(){
          that.canvas.style.display="block";
          that.adjustSize();
          that._draw();
        });
    };

    CanvasLayer.prototype.adjustSize = function () {
        var size = this._map.getSize();
        // var canvas = this.canvas;
        canvas.width = 200; //size[0]
        canvas.height = 100; //size[1]
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
    };

    CanvasLayer.prototype.adjustRatio = function (ctx) {
        var backingStore = ctx.backingStorePixelRatio || ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
        var pixelRatio = (window.devicePixelRatio || 1) / backingStore;
        var canvasWidth = ctx.canvas.width;
        var canvasHeight = ctx.canvas.height;
        ctx.canvas.width = canvasWidth * pixelRatio;
        ctx.canvas.height = canvasHeight * pixelRatio;
        ctx.canvas.style.width = canvasWidth + 'px';
        ctx.canvas.style.height = canvasHeight + 'px';
        ctx.scale(pixelRatio, pixelRatio);
    };

    CanvasLayer.prototype.draw = function () {
        var self = this;
        var args = arguments;

        clearTimeout(self.timeoutID);
        self.timeoutID = setTimeout(function () {
            self._draw();
        }, 15);
    };

    CanvasLayer.prototype._draw = function () {
        var map = this._map;
        var size = map.getSize();
        var center = map.getView().getCenter();

        if (center) {
            var pixel = map.getPixelFromCoordinate(center);
			// map.getPixelFromCoordinate(center);
			console.log('1');
			console.log(size);
            this.canvas.style.left = pixel[0] - size[0] / 8 + 'px';  //定位根据自己的屏幕来看
            this.canvas.style.top = pixel[1] - size[1] / 8 + 'px';   //定位根据自己的屏幕来看
            this.options.update && this.options.update.call(this);
        }
    };

    CanvasLayer.prototype.getContainer = function () {
        return this.canvas;
    };

    CanvasLayer.prototype.show = function () {
        this.initialize();
        this.canvas.style.display = 'block';
    };

    CanvasLayer.prototype.hide = function () {
        this.canvas.style.display = 'none';
    };

    CanvasLayer.prototype.setZIndex = function (zIndex) {
        this.canvas.style.zIndex = zIndex;
    };

    CanvasLayer.prototype.getZIndex = function () {
        return this.zIndex;
    };

    var global = typeof window === 'undefined' ? {} : window;

    var requestAnimationFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame || global.webkitRequestAnimationFrame || global.msRequestAnimationFrame || function (callback) {
        return global.setTimeout(callback, 1000 / 60);
    };

    function Marker(opts) {
        this.city = opts.name;
        this.location = [opts.lnglat[0], opts.lnglat[1]];
        this.color = opts.color;
        this.type = opts.type || 'circle';
        this.speed = opts.speed || 0.15;
        this.size = 0;
        this.max = opts.max || 20;
    }

    Marker.prototype.draw = function (context) {
        context.save();
        context.beginPath();
        switch (this.type) {
            case 'circle':
                this._drawCircle(context);
                break;
            case 'ellipse':
                this._drawEllipse(context);
                break;
            default:
                break;
        }
        context.closePath();
        context.restore();

        this.size += this.speed;
        if (this.size > this.max) {
            this.size = 0;
        }
    };

    Marker.prototype._drawCircle = function (context) {
        var pixel = this.location;
		// this.pixel||map.getPixelFromCoordinate(this.location);
        context.strokeStyle = this.color;
        context.moveTo(pixel[0] + pixel.size, pixel[1]);
        context.arc(pixel[0], pixel[1], this.size, 0, Math.PI * 2);
        context.stroke();
    };

    Marker.prototype._drawEllipse = function (context) {
        var pixel = this.pixel || map.getPixelFromCoordinate(this.location);
        var x = pixel[0],
            y = pixel[1],
            w = this.size,
            h = this.size / 2,
            kappa = 0.5522848,

            // control point offset horizontal
            ox = w / 2 * kappa,

            // control point offset vertical
            oy = h / 2 * kappa,

            // x-start
            xs = x - w / 2,

            // y-start
            ys = y - h / 2,

            // x-end
            xe = x + w / 2,

            // y-end
            ye = y + h / 2;

        context.strokeStyle = this.color;
        context.moveTo(xs, y);
        context.bezierCurveTo(xs, y - oy, x - ox, ys, x, ys);
        context.bezierCurveTo(x + ox, ys, xe, y - oy, xe, y);
        context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
        context.bezierCurveTo(x - ox, ye, xs, y + oy, xs, y);
        context.stroke();
    };

    function FlashMarker(map, dataSet,canvasId) {
        this.timer = null;
        var that = this;
        var animationLayer = null,
            width = map.getSize()[0],
            height = map.getSize()[1],
            animationFlag = true;
        that.width = width;
        this.dataSet = dataSet;
        this.markers = [];
        that.height = height;
        that.canvasId = (!!canvasId?canvasId:'defaultFlashCanvas');
        this.close();

        var addMarker = function addMarker() {
            if (that.markers.length > 0) return;
            that.markers = [];
            for (var i = 0; i < that.dataSet.length; i++) {
                flashMarkerId++;
                that.dataSet[i]["id"]=flashMarkerId;
                that.markers.push(new Marker(that.dataSet[i]));
            }
        };

        //上层canvas渲染，动画效果
        var render = function render() {
            var animationCtx = animationLayer.canvas.getContext('2d');
            that.animationCtx = animationCtx;
            if (!animationCtx) {
                return;
            }

            if (!animationFlag) {
                animationCtx.clearRect(0, 0, width, height);
                return;
            }

            addMarker();

            animationCtx.fillStyle = 'rgba(0,0,0,.95)';
            var prev = animationCtx.globalCompositeOperation;
            animationCtx.globalCompositeOperation = 'destination-in';
            animationCtx.fillRect(0, 0, width, height);
            animationCtx.globalCompositeOperation = prev;

            for (var i = 0; i < that.markers.length; i++) {
                var marker = that.markers[i];
                marker.draw(animationCtx);
            }
        };
        //初始化
        var init = function init() {
            animationLayer = new CanvasLayer({
                map: map,
                canvasId:that.canvasId,
                update: render
            });

            (function drawFrame() {
                that.timer = requestAnimationFrame(drawFrame);
                render();
            })();
        };

        init();
    }

    FlashMarker.prototype.addFlashMarker = function(opt){//添加新的闪烁点
        flashMarkerId++;
        console.log(opt);
        console.log(flashMarkerId);
        opt['id']=flashMarkerId;
        var marker = new Marker(opt);
        opt["marker"] = marker;
        this.dataSet.push(opt);
        this.markers.push(marker);
        return flashMarkerId;
    }

    FlashMarker.prototype.removeFlashMarker = function(opt){
        var index = -1;
        for(var i = 0;i<this.dataSet.length;i++){
            if(this.dataSet[i]["id"] == opt.id){
                index = i;
                break;
            }
        }
        this.dataSet.splice(index,1);
        this.markers.splice(index,1);
    }

    FlashMarker.prototype.close = function() {
        cancelAnimationFrame(this.timer);
        if(this.animationCtx){
            this.animationCtx.clearRect(0, 0, this.width, this.height);
        }
    }
    return FlashMarker;

})));

