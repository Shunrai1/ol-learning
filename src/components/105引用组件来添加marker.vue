/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-06 18:27:00
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 使用marker-feature来添加marker</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM';
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Marker from 'ol-marker-feature';
	import Popup from 'ol-popup';
	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
				let OSMlayer = new Tile({
					source: new OSM(),
				})
				this.map = new Map({
					target: "vue-openlayers",
					layers: [OSMlayer],
					view: new View({
						center: [113.448, 23.986],
						zoom: 7,
						projection: "EPSG:4326",
					}),
				})

				const marker = new Marker([113.448, 23.986]);
				marker.set('info',
					'<div style="background:#fff; padding:20px;"><h3>我的Marker标题</h3><h4>vue-openlayers的信息内容</h4></div>'
					)
				marker.setMap(this.map);

				const popup = new Popup({
					offset: [0, -32]
				});
				this.map.addOverlay(popup);

				marker.on('click', function() {
					popup.show(marker.getLocation(), marker.get('info'));
				});
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
		height: 590px;
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


