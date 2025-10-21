
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-16
*/

<template>
	<div class="container">
		<h3>vue+openlayers:以静态图片作为底图，并在上面绘制矢量多边形</h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="showPolygon()">显示多边形</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import Image from 'ol/layer/Image';
	import ImageStatic from 'ol/source/ImageStatic';
	import Projection from 'ol/proj/Projection';
	import Feature from 'ol/Feature'
	import {Point,LineString,Circle,Polygon} from "ol/geom"
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'

	export default {
		data() {
			return {
				map: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
				polygonData: [
					[
						[294.91001050745706, 938.617652941687],
						[297.8789335078354, 902.0013197431665],
						[1540.38576522045355, 902.9909355756765],
						[1238.4065335554335, 941.5865570663532],
					]
				]
			};
		},
		methods: {
			showPolygon() {
				let polygonFeature = new Feature({
					geometry: new Polygon(this.polygonData),
				})
				this.dataSource.addFeature(polygonFeature)
			},

			// 初始化地图     
			initMap() {

				let extent = [0, 0, 1920, 1080];
				let projection = new Projection({
					code: 'proj',
					units: 'pixels',
					extent: extent
				});

				let myLayer = new Image({
					source: new ImageStatic({
						url: '/data/mall-map.jpg',
						projection: projection,
						imageExtent: extent
					})
				})

				let feature_Layer = new VectorLayer({
					source: this.dataSource,
					style:new Style({
						fill: new Fill({
							color: "#f00"
						}),
						stroke: new Stroke({
							width: 2,
							color: "#f0f",
						}),
					})
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						myLayer,
						feature_Layer
					],
					view: new View({
						extent: extent,
						projection: projection,
						center: [960, 540],
						zoom: 3
					})
				})
			},
		},
		mounted() {
			this.initMap();
		}
	}
</script>
<style scoped>
	.container {
		width: 1000px;
		height: 640px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 960px;
		height: 480px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


