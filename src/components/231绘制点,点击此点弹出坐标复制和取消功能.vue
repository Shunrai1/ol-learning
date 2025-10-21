

/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-04-11
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 绘制点、点击此点弹出坐标复制和取消功能</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="drawPoint()">绘制一个点</el-button>
		</h4>

		<div id="vue-openlayers"></div>
		<div id="popup-box" class="ol-popup">
			<div id="popup-content">
				  <li @click="copy()">{{ coord }}</li>
				  <li @click="cancel()">取消</li>
			</div>
		</div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {
		Map,
		View
	} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Draw from 'ol/interaction/Draw'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Icon from 'ol/style/Icon'
	import Circle from 'ol/style/Circle'
	import Overlay from 'ol/Overlay';


	export default {
		data() {
			return {
				map: null, // 地图
				draw: null,
				pointSource: new SourceVector({
					wrapX: false
				}),
				coord:'',
				overlayer:null,
			}
		},

		methods: {
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
				});

				let pointVector = new LayerVector({
					source: this.pointSource,
					// Vector层显示的样式
					style: new Style({
						fill: new Fill({
							color: "#00f"
						}),
						stroke: new Stroke({
							width: 2,
							color: "#ff0",
						}),
						image: new Icon({
                        rotation:0,                        
                        crossOrigin: 'anonymous',
                        anchor: [0.5, 1.5],
                        src: require('@/assets/img/location.png')
                    }),
					})
				});
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [raster, pointVector],
					view: new View({
						projection: "EPSG:4326",
						center: [113.1206, 23.034996],
						zoom: 10
					})
				})
				
				
			},
			cancel(){
                this.overlayer.setPosition(undefined)
				this.pointSource.clear();
			},
			copy(){
				     let that=this
				      this.$copyText(this.coord).then(
				        function(e) {
				           that.$message.success('复制成功！')
				        },
				        function(e) {
				          that.$message.success('复制失败！')
				        }
				      );
			},
			
			drawPoint() {
				this.pointSource.clear();
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}

				this.draw = new Draw({
					source: this.pointSource,
					type: 'Point',
				})
				this.map.addInteraction(this.draw)
				let that = this
				this.draw.on('drawend', (evt) => {
					that.map.removeInteraction(that.draw)
				})
			},

			clickPoint() {
				// 设置浮层
				const box = document.getElementById('popup-box');
				this.overlayer = new Overlay({
					element: box,
					autoPan: {
						animation: {
							duration: 250,
						},
					},
				});
				this.map.addOverlay(this.overlayer);

				// 显示内容
				let _that = this;
				this.map.on('click', (e) => {
					let feature = this.map.forEachFeatureAtPixel(
						e.pixel,
						(feature, layer) => {
							return feature
						}
					)
					if (feature) {

						let points=feature.getGeometry().flatCoordinates;
						 this.coord=points[0].toFixed(5)+','+ points[1].toFixed(5)
						 
						_that.overlayer.setPosition(e.coordinate);
					} else {
						_that.overlayer.setPosition(undefined);
					}
				});
			},


		},
		mounted() {
			this.initMap();
			// this.drawPoint();
			this.clickPoint()
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 590px;
		margin: 30px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
	    .ol-popup {
	        position: absolute;
	        background-color: rgba(0, 0, 0, 0.8);
	        padding: 5px;
	        bottom: 12px;
	        left: 20px;
	        color: #FFFFFF;
	        width: 140px;
	    }
	
	    .ol-popup:after {
	        border: solid transparent;
	        content: " ";
	        position: absolute;
	        pointer-events: none;
			border-right-color: rgba(0, 0, 0, 0.8);
			border-width: 10px;
			left: -10px;
			top:65%;
			margin-left: -10px;
	    }

	    #popup-content{ width: 140px; height: 90px;  }
        #popup-content li{ width: 138px; height:40px; line-height: 40px;display: block; border:1px solid #fff;cursor: pointer;}

</style>


