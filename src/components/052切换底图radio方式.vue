
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-06-16
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 根据visible的值来更换底图</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>

		<div id="vue-openlayers"></div>
		<el-tooltip class="item" effect="light" placement="left">
			<div slot="content">
				<div class="lh30">
					<el-radio @change="MapChangeType" v-model="mapRadio" label="1">OSM地图</el-radio>
				</div>
				<br />
				<div class="lh30">
					<el-radio @change="MapChangeType" v-model="mapRadio" label="2">谷歌地图</el-radio>
				</div>
			</div>
			<div class="map0"></div>
		</el-tooltip>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import XYZ from "ol/source/XYZ";
	export default {
		data() {
			return {
				map: null,
				osmLayer: null,
				googleLayer: null,
				mapRadio: '1',
			};
		},

		methods: {
			MapChangeType() {
				switch (this.mapRadio) {
					case '1':
						this.osmLayer.setVisible(true);
						this.googleLayer.setVisible(false);
						break;
					case '2':
						this.osmLayer.setVisible(false);
						this.googleLayer.setVisible(true);
						break;
				}
			},

			// 初始化地图     
			initMap() {
				this.osmLayer = new TileLayer({
					source: new OSM(),
					visible: true,
				});
				this.googleLayer = new TileLayer({ //谷歌影像图
					visible: false,
					name: 'googleSLayer',
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m@189&hl=en&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						this.osmLayer,
						this.googleLayer
					],
					view: new View({
						projection: "EPSG:4326",
						center: [139.6485790340825, 35.27194604343114],
						zoom: 14
					}),
				})

			},
		},
		mounted() {
			this.initMap();
			this.osmLayer.setVisible(true);
			this.googleLayer.setVisible(false);
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position: relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 450px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

	.map0 {
		width: 48px;
		height: 48px;
		background: #0ff url(../assets/img/changemap.png) center center no-repeat;
		background-size: 16px 16px;
		position: absolute;
		right: 20px;
		bottom: 200px;
		z-index: 20;
		cursor: pointer;
	}
</style>

