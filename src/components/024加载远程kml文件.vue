/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-29
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载远程KML文件示例</h3>
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
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {transform} from 'ol/proj';
	// 核心代码块
	import KML from 'ol/format/KML';

	export default {
		name: 'remote-KML',
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
				const vector = new VectorLayer({
					source: new VectorSource({
						url: 'https://openlayers.org/en/latest/examples/data/kml/states.kml',
						format: new KML(),
					}),
				});
				this.map = new Map({
					layers: [
						new TileLayer({
							source: new OSM()
						}),
						vector
					],
					target: 'vue-openlayers',
					view: new View({
						center: transform([-95.7129, 37.0902],"EPSG:4326","EPSG:3857"),
						projection: "EPSG:3857",
						zoom: 3,
					}),
				});

			},
		},
		mounted() {
			this.initMap();
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

