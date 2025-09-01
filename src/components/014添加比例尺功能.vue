/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-02-25
*/

<template>
	<div class="container">
		<h3>比例尺示例教程</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers" class="map-x"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {
		Map,
		View
	} from 'ol'
	import Tile from 'ol/layer/Tile'
	import {
		OSM
	} from 'ol/source'
//以下代码行为关注点
	import * as control from 'ol/control'

	export default {
		name: 'zoom',
		data() {
			return {
				map: null
			}
		},
		methods: {
			initMap() {
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new OSM()
						})
					],
					view: new View({
						projection: "EPSG:4326",
						center: [114.064839, 22.548857],
						zoom: 4
					}),
//以下代码块为主要的关注点
					controls: control.defaults({
						zoom: false,
						doubleClickZoom: false,
						rotate: false,
						attribution: false
					}).extend([
						new control.ScaleLine({
							units: 'metric',
							//单位包括：degrees：度数；imperial：imperial inch；us：us incn；nautical：nautical mile；metric：千米
						})
					]),
				})
			}
		},
		mounted() {
			this.initMap()
		}
	}
</script>

<style scoped>
	.container{
		width: 840px;
		height: 520px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
</style>

