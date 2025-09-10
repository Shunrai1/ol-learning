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
		<h3>vue+openlayers: 添加地图地点搜索定位功能</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import LayerTile from 'ol/layer/Tile';
	import SourceOSM from 'ol/source/OSM';
	import 'ol-popup/src/ol-popup.css';
	import Popup from 'ol-popup';
	import 'ol-geocoder/dist/ol-geocoder.css';
	import Geocoder from 'ol-geocoder';

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
						new LayerTile({
							title: 'OSM',
							type: 'base',
							visible: true,
							source: new SourceOSM()
						}),
					],
					target: 'vue-openlayers',
					view: new View({
						center: [13247019.404399557, 4721671.572580107],
						projection: "EPSG:3857",
						zoom: 4,
					}),
				});

				const popup = new Popup();
				const geocoder = new Geocoder('nominatim', {
					provider: 'photon',
					targetType: 'glass-button',
					lang: 'en',
					placeholder: 'Search for ...',
					limit: 5,
					keepOpen: false,
				});

				this.map.addControl(geocoder);
				this.map.addOverlay(popup);
				// Listen when an address is chosen
				geocoder.on('addresschosen', (evt) => {
					window.setTimeout(() => {
						popup.show(evt.coordinate, evt.address.formatted);
					}, 3000);
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

