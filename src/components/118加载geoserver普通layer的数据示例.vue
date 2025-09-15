
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-08-30
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载geoserver普通layer的数据示例</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {TileWMS,ImageWMS} from 'ol/source';
	import OSM from 'ol/source/OSM'

	export default {
		data() {
			return {
				map: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
			};
		},

		methods: {
			showGEO() {
				let mytilelayer = new TileLayer({
					zIndex: 200,
					visiable: true,
					source: new TileWMS({
						url: 'http://192.168.1.16:8080/geoserver/rs_data/wms',
						ratio: 1,
						params: {
							'FORMAT': 'image/png',
							'VERSION': '1.1.0',
							'LAYERS': 'rs_data:GF1B_PMS_E116.2_N40.8_20220221_L1A1228103768', 
							transparent: 'true',
							'STYLES': '',
							angle:0
						},

					}),

				});
				this.map.addLayer(mytilelayer);
			},

			// 初始化地图	 
			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
					],
					view: new View({
						projection: "EPSG:4326",
						center: [116.15, 40.79],
						zoom: 8
					}),
				})
              
			},
		},
		mounted() {
			this.initMap()
			this.showGEO()
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 450px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

