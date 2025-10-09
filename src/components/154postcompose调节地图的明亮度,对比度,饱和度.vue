
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
		<h3>vue+openlayers: 调节地图的明亮度、对比度、饱和度</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<div class="one">
				明亮度：<el-slider class="slider" v-model="v1" :format-tooltip="format" @change="b(v1)"></el-slider>
			</div>
			<div class="one">
				对比度：
				<el-slider class="slider" v-model="v2" :format-tooltip="format" @change="c(v2)"></el-slider>
			</div>
			<div class="one">
				饱和度：
				<el-slider class="slider" v-model="v3" :format-tooltip="format" @change="s(v3)"></el-slider>
			</div>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import Stamen from 'ol/source/Stamen';

	export default {
		data() {
			return {
				map: null,
				osmLayer: null,
				stamenLayer: null,
				v1: 100,
				v2: 100,
				v3: 100
			};
		},

		methods: {
			format(val) {
				return val / 100
			},

			b(v) {
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `brightness(${v/100})`;
				});
				this.map.updateSize();
			},
			c(v) {
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `contrast(${v/100})`;
				});
				this.map.updateSize();
			},
			s(v) {
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `saturate(${v})`;
				});
				this.map.updateSize();
			},

			// 初始化地图     
			initMap() {
				this.osmLayer = new TileLayer({
					source: new OSM(),
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						this.osmLayer,
					],
					view: new View({
						projection: "EPSG:4326",
						center: [139.6485790340825, 35.27194604343114],
						zoom: 14
					}),
				})
				this.map.on('postcompose', (event) => {
					let v = this.v2 / 100
					document.querySelector('canvas').style.filter = `contrast(${v})`;
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
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position: relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

	h4 {
		width: 810px;
		margin: 0 auto;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
	}
	.one {width: 250px;}
	.slider {width: 60%;margin: 0 auto;}
</style>


