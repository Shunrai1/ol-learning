
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-10-21
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 设置地图的反转色、复古色、灰度图、原始图</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="success" size="mini" @click='o()'>原始图</el-button>
			<el-button type="danger" size="mini" @click='i()'>反转色</el-button>
			<el-button type="warning" size="mini" @click='s()'>复古色</el-button>
			<el-button type="info" size="mini" @click='g()'>灰度图</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	export default {
		data() {
			return {
				map: null,
				osmLayer: null,
			};
		},

// grayscale(<percentage>)
// Percentage：百分比。将图像转换成灰色的图片。 当值为100%时，图像会完全变成灰色。 当值为0%时，图像没有任何变化。

// invert(<percentage>)
// Percentage：百分比。反色图像（呈现出照片底片的效果）。当值为100%时，图像会完全反色处理。当值为0%时，图像没有任何变化。

// sepia(<percentage>)
// 对图像进行深褐色处理（怀旧风格）。 当值为100%时，图像完全变成深褐色。当值为0%时，图像没有任何变化。

// none
// 没有使用filter

		methods: {
			o() {
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `none`;
				});
				this.map.updateSize();//更新地图
			},
			i() {				
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `invert(100%)`;
				});
				this.map.updateSize();
			},
			s() {
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `sepia(100%)`;
				});
				this.map.updateSize();
			},
			g() {
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `grayscale(100%)`;
				});
				this.map.updateSize();
			},
   
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

</style>


