
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-10-20
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 使用图来标识不同地图，点击更换底图</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>

		<div id="vue-openlayers"></div>
		<el-tooltip class="item" effect="light" placement="left">
			<div slot="content">
				<div class="mapbox">
					<li @click="MapChangeType('1')" :class="active[0]?'activeStyle':''"><img src="../assets/img/osm-map.png">
						<div class="on">OSM</div>
					</li>
					<li @click="MapChangeType('2')" :class="active[1]?'activeStyle':''"><img src="../assets/img/stamen-map.png">
						<div class="on">Stamen</div>
					</li>
					<li @click="MapChangeType('3')" :class="active[2]?'activeStyle':''"><img src="../assets/img/google-map.png">
						<div class="on">Google</div>
					</li>

				</div>
			</div>
			<div class="map0"></div>
		</el-tooltip>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {
		Map,
		View
	} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import Stamen from 'ol/source/Stamen';
	import XYZ from "ol/source/XYZ";
	export default {
		data() {
			return {
				map: null,
				osmLayer: null,
				googleLayer: null,
				stamenLayer: null,
                active:[true,false,false]
       
			};
		},

		methods: {
			MapChangeType(x) {
				switch (x) {
					case '1':
						this.osmLayer.setVisible(true);
						this.stamenLayer.setVisible(false);
						this.googleLayer.setVisible(false);
						this.active=[true,false,false]
						break;
					case '2':
						this.osmLayer.setVisible(false);
						this.stamenLayer.setVisible(true);
						this.googleLayer.setVisible(false);
						this.active=[false,true,false]
						break;
					case '3':
						this.osmLayer.setVisible(false);
						this.stamenLayer.setVisible(false);
						this.googleLayer.setVisible(true);
						this.active=[false,false,true]
						break;
				}
			},

			// 初始化地图     
			initMap() {
				this.osmLayer = new TileLayer({
					source: new OSM(),
					visible: true,
				});
				this.stamenLayer = new TileLayer({
					source: new Stamen({
						layer: 'terrain'
					}),
					visible: false,
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
						this.stamenLayer,
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
		background: #fff url(../assets/img/changemap.png) center center no-repeat;
		background-size: 16px 16px;
		position: absolute;
		right: 20px;
		bottom: 400px;
		z-index: 20;
		cursor: pointer;
	}

	.mapbox {
		width: 330px;
		height: 60px;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
	}

	.mapbox li {
		width: 100px;
		height: 50px;
		margin: 5px 0;
		display: block;
		position: relative;
		cursor: pointer;
	}

	.mapbox li .on {
		height: 16px;
		width: 100px;
		background-color: rgba(0, 0, 0, 0.3);
		color: #fff;
		font-size: 12px;
		position: absolute;
		bottom: 0;
		left: 0;
		display: none;
		text-align: center;
	}
    .mapbox li:hover .on{ display: block;}
	.activeStyle {
		width: 100px;
		height: 50px;
		border: 1px solid #f00;
	}
</style>

