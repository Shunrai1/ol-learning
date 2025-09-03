/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-12
*/

<template>
	<div class="container">
		<h3>vue+openlayers：显示鼠标的经纬度坐标</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers" class="map-x">
			<div id="mouse"></div>
		</div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {
		Map,
		View
	} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
    import * as control from 'ol/control'
	import MousePosition from "ol/control/MousePosition.js";
	import { format } from "ol/coordinate";

	export default {
		name: 'FirstMap',
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
				let mousePositionControl = new MousePosition({
					coordinateFormat: (coordinate) => {
						return format(coordinate, "经度:{x}     纬度:{y}", 2);
					},
					projection: "EPSG:4326",
					target: 'mouse',
				});
				
				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						new Tile({
							source: new OSM({
								wrapX: true
							})
						})
					],
					view: new View({
						projection: "EPSG:4326",
						center: [114.064839, 22.548857],
						zoom: 8
					}),
					controls: [mousePositionControl]
				})
			}

		},
		mounted() {
			this.initMap();
		}
	}
</script>

<style scoped>
	.container{
		width: 840px;
		height: 540px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

	h3 {
		line-height: 40px;
	}
	 #mouse{ position: absolute; bottom: 10px; left: 10px; z-index: 10; width: 180px;
	height: 32px;color:#f00; background: #fff; vertical-align: baseline;}
</style>

