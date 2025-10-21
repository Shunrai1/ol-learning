
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-14
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 实现云雾缭绕，白鸽飞翔的效果</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import 'ol-ext/dist/ol-ext.min.css'
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import ImageLayer from 'ol/layer/Image.js';
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {TileWMS,ImageWMS} from 'ol/source';
	import {fromLonLat} from 'ol/proj'
	import XYZ from 'ol/source/XYZ'
	import Cloud from 'ol-ext/control/Cloud.js'

	export default {
		data() {
			return {
				map: null,
				myImageLayer: null,
				dataSource: null,
				name:'点击图形后显示名称',
			};
		},

		methods: {

			// 初始化地图     
			initMap() {
				let google_Layer = new TileLayer({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),

				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						google_Layer,
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-74.8, 6.13]),
						zoom: 8
					}),
				})
				
				 var ctrl = new Cloud({ 
				      opacity:0.3, 
				      density:2, 
				      windSpeed:2 ,
				      windAngle:30*Math.PI/180 
				    });
				    this.map.addControl(ctrl);
				
			},
		},
		mounted() {
			this.initMap();

		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 640px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 520px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


