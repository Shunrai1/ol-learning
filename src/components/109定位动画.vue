/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-05
*/


<template>
	<div class="container">
		<h3>vue+openlayers: 定位动画（平移-弹性平移-飞行）</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="pan">平移</el-button>
			<el-button type="primary" size="mini" @click="elastic">弹性平移</el-button>
			<el-button type="primary" size="mini" @click="fly">飞行</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import BingMaps from 'ol/source/BingMaps';
	import * as olEasing from 'ol/easing'
	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			pan() {
				this.map.getView().animate({
					center: [119, 39],
					duration: 2000
				})
			},
			elastic() {
				this.map.getView().animate({
					center: [-36, -22],
					easing: olEasing.easeOut // 动画: 传入动画函数，olEasing是内置动画集
				})
			},
			fly() {
				this.flyTo([-55, 36])
			},
			flyTo(location, done = () => {}) {
				let view = this.map.getView()
				let duration = 2000;
				let zoom = view.getZoom();
				let parts = 2;
				let called = false;

				function callback(complete) {
					--parts;
					if (called) {
						return;
					}
			  if (parts === 0 || !complete) {
						called = true;
						done(complete);
					}
				}
				view.animate({
					center: location,
					duration: duration
			 }, callback);
				view.animate({
					zoom: zoom - 1,
					duration: duration / 2
				}, {
					zoom: zoom,
					duration: duration / 2
				}, callback);
			},


			bing() {
				this.map.getLayers().getArray().forEach((layer) => {
					if (layer) {
						this.map.removeLayer(layer);
					}
				});

				let nsource = new BingMaps({
					key: 'AqQf9nX6PZKkFZOkdOqBOh3vg8xwGV1AYWGqC6EsOoJ0OHSUwm8CN8AhaFpT7mfR',
					imagerySet: "RoadOnDemand",
				})
				let bingMapLayer = new Tile({
					source: nsource
				});
				this.map.addLayer(bingMapLayer);
			},

			initMap() {

				this.map = new Map({
					target: "vue-openlayers",
					layers: [],
					view: new View({
						center: [122, 47],
						zoom: 4,
						projection: "EPSG:4326",
					}),
					loadTilesWhileAnimating: true,
				})
				this.bing()
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
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

