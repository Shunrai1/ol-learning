/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-24
*/

<template>
    <div class="container">
        <h3>vue+openlayers:绘制矩形,获取屏幕坐标pixel，transformExtent将区间坐标由4326转换为3857</h3>
        <p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
            <el-button type="primary" size="mini" @click="drawBox()">绘制矩形并显示结果</el-button>
            <el-button type="danger" size="mini" @click="clearSource()">清除图层</el-button>
        </h4>
        <div id="vue-openlayers"></div>
		<div class="info" v-if="isResult">
			<p>所画矩形左上点经纬度： {{ltCoord}} </p>
			<p>所画矩形左上点像素值： {{ltPixel}} </p>
			<p>所画矩形像素宽高度值： {{wh}} </p>
			<p>所画矩形Extent的值： {{origin4326}} </p>
			<p>所画矩形Extent转换值： {{to3857}} </p>			
		</div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import OSM from 'ol/source/OSM'
    import LayerVector from 'ol/layer/Vector'
    import SourceVector from 'ol/source/Vector'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
    import Style from 'ol/style/Style'
    import Circle from 'ol/style/Circle'
    import Draw, {createBox} from 'ol/interaction/Draw'
    import {fromLonLat, toLonLat,transformExtent, transform } from 'ol/proj'

    export default {
        data() {
            return {
                map: null,
                draw: null,
                source: new SourceVector({
                    wrapX: false
                }),
				isResult:false,
				ltCoord:'',
				ltPixel:'',
				wh:'',
				origin4326:'',
				to3857:'',
            }
        },

        methods: {
            initMap() {
                let raster = new Tile({
                    source: new OSM()
                });

                let vector = new LayerVector({
                    source: this.source,
                    style: new Style({
                        fill: new Fill({
                            color: "rgba(0,0,0,0)"
                        }),
                        stroke: new Stroke({
                            width: 2,
                            color: "green",
                        }),

                    })
                });
                this.map = new Map({
                    target: "vue-openlayers",
                    layers: [raster, vector],
                    view: new View({
                        projection: "EPSG:4326",
                        center: [116.1206, 39.034996],
                        zoom: 10
                    })
                })

            },
            clearSource() {
               this.source.clear()
            },
			showInfo(){
				
			},
            drawBox(){
				this.isResult=false;
                // 停止上一次的绘制，没有此代码会出现重叠
                if (this.draw !== null) {
                    this.map.removeInteraction(this.draw)
                }

                let type = 'Circle'
                let geometryFunction1 = createBox()
                this.draw = new Draw({
                    source: this.source,
                    type: type,
                    geometryFunction: geometryFunction1
                })
                this.map.addInteraction(this.draw)

                this.draw.on('drawend', (e) => {
                    if (this.draw !== null) {
                        this.map.removeInteraction(this.draw)
                    }
                    this.map.renderSync(); //请求地图立即渲染，否则截图后会产生透明度白
                    let extent = e.feature.getGeometry().getExtent();

                    //地理坐标转换屏幕坐标 
                    let coord = [Number(extent[0].toFixed(2)), Number(extent[3].toFixed(2))];
                    let leftTopPosition = this.map.getPixelFromCoordinate(coord);
                    let coord1 = [extent[2], extent[1]];
                    let bottomRightPosition = this.map.getPixelFromCoordinate(coord1);
                    //计算框选矩形的宽度以及高度像素
                    let width = Math.abs(bottomRightPosition[0] - leftTopPosition[0]).toFixed(2);
                    let height = Math.abs(bottomRightPosition[1] - leftTopPosition[1]).toFixed(2);
					
					this.ltCoord=JSON.stringify(coord);
					this.ltPixel=JSON.stringify(leftTopPosition[0].toFixed(2)+','+leftTopPosition[1].toFixed(2)); 
					this.wh= 'w：'+ width + 'px，h：' + height +'px';
					this.origin4326=JSON.stringify(extent); 
                    this.to3857=JSON.stringify(transformExtent(extent, 'EPSG:4326', 'EPSG:3857')); 
					this.isResult=true;
                })              

            }
        },
        mounted() {
            this.initMap()
        }
    }
</script>
<style scoped>
    .container {
        width: 840px;
        height: 690px;
        margin: 50px auto;
        border: 1px solid #42B983;
    }
    #vue-openlayers {
        width: 800px;
        height: 420px;
        margin: 0 auto;
        border: 1px solid #42B983;
        position: relative;
    }
	.info p{ line-height: 18px; text-align: left; margin:2px 0; padding-left: 20px;} 
</style>
