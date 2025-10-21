
<!-- 现象： -->
<!-- 1，如果只有一个层，比如osmMap1， 测小框口会透明掉；
,2，如果小窗口和主地图不同，则显示正常
3，layers: [ osmMap2,this.mylayer], 鹰眼中 layers: [osmMap2], 透明出错
4，layers: [ osmMap2,this.mylayer], 鹰眼中 layers: [this.mylayer], 正常显示
原因：不详
临时办法：添加另一个数据源，排列方式参考现象4 -->

/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-05-29
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 关于OverviewMap出现透明问题的多种测试</h3>
		<h4> 大剑师兰特，还是大剑师兰特</h4>
		<div id="vue-openlayers" class="map-x"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import * as control from 'ol/control'
	import OSM from 'ol/source/OSM';

	export default {
		data() {
			return {
				map: null,
				mylayer: null,
			}
		},
		methods: {

			initMap() {
				this.mylayer = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
					})
				})

				let osmMap1 = new Tile({
					source: new OSM()
				});
				
				let osmMap2 = new Tile({
	              source: new XYZ({
					  url: 'http://{a-c}.tile.openstreetmap.jp/{z}/{x}/{y}.png'
				  }),
				});

				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						// this.mylayer,
						osmMap1,
						// osmMap2,
					],
					view: new View({
						projection: "EPSG:3857",
						center: [114.064839, -22.548857],
						zoom: 4
					}),
					controls: control.defaults({
						zoom: false,
						doubleClickZoom: false,
						rotate: false,
						attribution: false
					}).extend([
						new control.OverviewMap({
							 collapsed: false,
							 collapsible: true,
							// rotateWithView: true,
							layers: [this.mylayer]
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
	.container {
		width: 1000px;
		height: 660px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position: relative;
	}

	#vue-openlayers {
		width: 960px;
		height: 540px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
</style>

