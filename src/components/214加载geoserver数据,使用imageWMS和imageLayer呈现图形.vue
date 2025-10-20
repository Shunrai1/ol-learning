
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-10
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载geoserver数据，使用ImageWMS和ImageLayer呈现图形</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="danger" size="mini" @click="showGEO()">显示geoserver矢量数据</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import ImageLayer from 'ol/layer/Image.js';
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {TileWMS,ImageWMS} from 'ol/source';
	import {fromLonLat} from 'ol/proj'
	import XYZ from 'ol/source/XYZ'

	export default {
		data() {
			return {
				map: null,
				myImageLayer: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
			};
		},

		methods: {
			showGEO() {
				this.myImageLayer = new ImageLayer({
					zIndex: 200,
					visiable: true,
					source: new ImageWMS({
						url: 'http://<xxxxxxx>/geoserver/vs_data/wms',
						ratio: 1,
						params: {
							'FORMAT': 'image/png',
							'VERSION': '1.1.0',
							'LAYERS': 'vs_data:tile',  
							transparent: 'true',
							'STYLES': '',
							angle: 0,
							tiled: false,
						},

					}),

				});
				this.map.addLayer(this.myImageLayer);
			},

			// 初始化地图     
			initMap() {
				let OSM_Layer = new TileLayer({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),

				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-74.8, 6.13]),
						zoom: 8
					}),
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
		height: 640px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


