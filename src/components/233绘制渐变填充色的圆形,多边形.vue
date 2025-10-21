
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-04-12
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 绘制带有渐变填充色的圆形、多边形</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="danger" size="mini" @click="drawImage('Circle')">绘制圆形</el-button>
			<el-button type="danger" size="mini" @click="drawImage('Polygon')">绘制多边形</el-button>
		</h4>

		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Draw from 'ol/interaction/Draw'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import {DEVICE_PIXEL_RATIO} from 'ol/has.js';
	export default {
		data() {
			return {
				map: null, // 地图
				draw: null,
				source: new SourceVector({
					wrapX: false
				})
			}
		},

		methods: {
            fStyle(){
				// Gradient and pattern are in canvas pixel space, so we adjust for the
				// renderer's pixel ratio
				const pixelRatio = DEVICE_PIXEL_RATIO;
				
				// Generate a rainbow gradient
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				const gradient = context.createLinearGradient(0, 0, 1024 * pixelRatio, 0);
				gradient.addColorStop(0, 'red');
				gradient.addColorStop(1 / 6, 'orange');
				gradient.addColorStop(2 / 6, 'yellow');
				gradient.addColorStop(3 / 6, 'green');
				gradient.addColorStop(4 / 6, 'aqua');
				gradient.addColorStop(5 / 6, 'blue');
				gradient.addColorStop(1, 'purple');
				return gradient
			},
			drawImage(x) {
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}
				this.draw = new Draw({
					source: this.source,
					type: x,
				})
				this.map.addInteraction(this.draw)
			},
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
					})
				});
			
				let vector = new LayerVector({
					source: this.source,
					style: new Style({
						fill: new Fill({
							color:this.fStyle()
						}),
						stroke: new Stroke({
							width: 2,
							color: "#ff0",
						}),
						image: new Circle({ //点样式
							radius: 5,
							fill: new Fill({
								color: '#ff0000'
							})
						}),
					})
				});
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:4326",
						center: [113.1206, 23.034996],
						zoom: 10
					})
				})
			
			},
			
			
			
		},
		mounted() {
			this.initMap()
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 590px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

