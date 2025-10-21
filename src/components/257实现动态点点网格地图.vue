/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-01-23
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 实现动态网格</h3>
		<p>大剑师兰特，还是大剑师兰特，gis-dajianshi</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import olGrid from 'ol-grid';
	import OSM from 'ol/source/OSM'
	import TileLayer from 'ol/layer/Tile.js'
	export default {
		name: 'Mapbox',
		data: function() {
			return {
				map: null
			}
		},
		methods: {
			initMap() {

				const layer = new TileLayer({
					source: new OSM()
				});

				this.map = new Map({
					layers: [
						layer
					],
					target: 'vue-openlayers',
					view: new View({
						center: [0, 0],
						projection: "EPSG:3857",
						zoom: 5,
					}),
				});
				this.map.addInteraction(new olGrid({
					originCoordinate: [150, 150],
					rotationAnchorCoordinate: [0, 0],
					xGridSize: 100,
					yGridSize: 100,
					maxPointsPerSide:20,
				}));
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
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 960px;
		height: 520px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


