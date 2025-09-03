/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-11
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载WMTS数据，显示图形</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers"></div>
		<div id="info"></div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import WMTS from 'ol/source/WMTS';
	import WMTSTileGrid from 'ol/tilegrid/WMTS';
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {transform} from 'ol/proj';
	import Feature from 'ol/Feature'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	// 核心代码块
	import WKT from 'ol/format/WKT';

	export default {
		name: 'read-WKT',
		data() {
			return {
				map: null,
	        }
		},
		methods: {
			readWMTS(){
				var source = new WMTS({
				    url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2013-06-16',
				    layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
				    format: 'image/jpeg',
				    matrixSet: '250m',
				    tileGrid: new WMTSTileGrid({
				      origin: [-180, 90],
				      resolutions: [
				        0.5625,
				        0.28125,
				        0.140625,
				        0.0703125,
				        0.03515625,
				        0.017578125,
				        0.0087890625,
				        0.00439453125,
				        0.002197265625
				      ],
				      matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
				      tileSize: 512
				    })
				  });
				
				  var layer = new TileLayer({
				    source: source,
				    extent: [-180, -90, 180, 90]
				  });
				
				  this.map.addLayer(layer);
			},
			initMap() {

				this.map = new Map({
					layers: [
						new TileLayer({
							source: new OSM()
						}), 
					],
					target: 'vue-openlayers',
					view: new View({
						center: [0, 0],
						projection: "EPSG:4326",
						zoom: 4,
					}),
				});

			},
		},
		mounted() {
			this.initMap();
			this.readWMTS();
		},
	}
</script>

<style scoped>
	.container {
		width: 840px;
		height: 520px;
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


