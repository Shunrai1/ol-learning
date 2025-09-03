/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-23
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 测量距离和面积（ 引用封装代码版 ）</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="success" size="mini" @click='getLength("length")'>测量长度 </el-button>
			<el-button type="success" size="mini" @click='getArea("area")'>测量面积 </el-button>
			<el-button type="warning" size="mini" @click='clear()'>清除</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import MeasureTool from "@/assets/js/measure.js"
	export default {
		data() {
			return {
				map: null,
			}
		},

		methods: {
			getLength(x) {
				this.clear()
				MeasureTool.measure(this.map, x, true);
			},
			getArea(x) {
				this.clear()
				MeasureTool.measure(this.map, x, true);
			},
			clear() {  //清除图层，中间参数为空
				MeasureTool.measure(this.map, "", false);
			},
			initMap() {
				let raster = new Tile({
					source: new OSM(),
					name: "OSM"
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster],
					view: new View({
						center: [-12000000, 4700000],
						zoom: 10
					})
				})
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
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

