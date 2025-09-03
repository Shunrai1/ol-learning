/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-29
*/

<template>
	<div class="container">
		<h3>vue+openlayers: Popup坐标信息新方法（引用扩展版）</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import 'ol-popup/src/ol-popup.css';
	import {Map,View} from 'ol';
	import {transform} from 'ol/proj';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import {toStringHDMS} from 'ol/coordinate';
	import Popup from 'ol-popup';

	export default {
		name: 'Mapbox',
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
				this.map = new Map({
					layers: [
						new TileLayer({
							title: 'OSM',
							type: 'base',
							visible: true,
							source: new OSM(),
						}),

					],
					target: 'vue-openlayers',
					view: new View({
						center: [13247019.404399557, 4721671.572580107],
						projection: "EPSG:3857",
						// extent: [-572513.341856, 5211017.966314, 916327.095083, 6636950.728974],
						zoom: 12,
					}),
				});
				var popup = new Popup();
				this.map.addOverlay(popup);

				this.map.on('singleclick', function(evt) {
					var prettyCoord = toStringHDMS(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
					popup.show(evt.coordinate, '<div><h2>坐标为</h2><p>' + prettyCoord + '</p></div>');
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
