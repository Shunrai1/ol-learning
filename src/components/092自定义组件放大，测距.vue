
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-06-01
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 自定义组件（放大、缩小、长度测量、面积测量）</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div class="controlbox">
			<div class="getlength0" @click="getlength0('length')"></div>
			<div class="getarea0" @click="getarea0('area')"></div>
			<div class="zoomIn" @click="zoomin0()"></div>
			<div class="zoomOut" @click="zoomout0()"></div>
		</div>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import MeasureTool from "@/assets/js/measure.js"
	import * as control from 'ol/control';
	export default {
		data() {
			return {
				map: null,
			}
		},

		methods: {
			zoomin0() {
				let czoom = this.map.getView().getZoom();
				this.map.getView().setZoom(czoom + 1)
			},
			zoomout0() {
				let czoom = this.map.getView().getZoom();
				this.map.getView().setZoom(czoom - 1)
			},
			getlength0(x) {
				this.clearMeasure()
				MeasureTool.measure(this.map, x, true);
			},
			getarea0(x) {
				this.clearMeasure()
				MeasureTool.measure(this.map, x, true);
			},
			clearMeasure() { //清除图层，中间参数为空
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
						zoom: 2
					}),
					controls: control.defaults({
						zoom: false,
						rotate: false,
						attribution: false
					}).extend([])
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
		position: relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

	.controlbox {
		position: absolute;
		z-index: 200;
		bottom: 50px;
		width: 18px;
		padding: 5px 7px;
		height: 120px;
		right: 30px;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-content: space-between;
		flex-direction: column;
		background-color: #fff;
	}

	.getlength0 {
		width: 18px;
		height: 30px;
		background: url(../assets/img/getlength.png) center center no-repeat;
		background-size: 16px 16px;
	}

	.getarea0 {
		width: 18px;
		height: 30px;
		background: url(../assets/img/getarea.png) center center no-repeat;
		background-size: 16px 16px;
	}

	.zoomIn {
		width: 18px;
		height: 30px;
		background: url(../assets/img/zoomin.png) center center no-repeat;
		background-size: 16px 16px;
	}

	.zoomOut {
		width: 18px;
		height: 30px;
		background: url(../assets/img/zoomout.png) center center no-repeat;
		background-size: 16px 16px;
	}
</style>

