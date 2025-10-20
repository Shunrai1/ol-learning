
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-08
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 点击拖动地图播放mp3音频</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {

			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster],
					view: new View({
						projection: "EPSG:3857",
						center: [2617200, 5951081],
						zoom: 5
					})
				})
				
				var boing = new ol.media.Audio({ source:"data/mp3/268828.mp3" });
				this.map.on('click', function(e) {
				  boing.play(0);
				});

				var slide = new ol.media.Audio({ source:"data/mp3/51132.mp3", loop:true });
				this.map.on('movestart', (e)=>{
					this.map.getView().on('propertychange', function(e) {
						slide.play();
					});
				})
				this.map.on('moveend', function(e) {
				  slide.stop();
				});

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
		height: 460px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

