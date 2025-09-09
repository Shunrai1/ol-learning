/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-02-28
*/

<template>
	<div class="container">
		<h3>添加网格线</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
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
	import OSM from 'ol/source/OSM'
	import Graticule from 'ol/layer/Graticule'
	import Stroke from 'ol/style/Stroke'

	export default {
		name: 'FirstMap',
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
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
					})
				})
				let graticule = new Graticule({
					map: this.map,
					strokeStyle: new Stroke({
						color: 'rgba(255, 0, 0, .8)', // 线条颜色
						width: 2, // 线条宽度
						lineDash: [10, 7], // 虚线，每隔4像素
			  }),
					showLabels: true,
					opacity: 0.8, //透明度，默认为1
					visible: true, //是否显示，默认true
					zIndex: 1, //图层渲染的Z索引,默认按加载顺序叠加
					extent: [80, 20, 120, 70], //渲染范围，默认是渲染全部
				})

			}

		},
		mounted() {
			this.initMap();
		}
	}
</script>

<style scoped>
	#vue-openlayers {
		width: 800px;
		height: 400px;
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

