
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-05-27
*/
<template>
	<div class="container">
		<h3>vue+openlayers:一次性清除所有控件（亲测好用）</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="danger" size="mini" @click='clearAll()'> 清除所有控件</el-button>
		</h4>
		<div id="vue-openlayers" class="map-x"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import * as control from 'ol/control'

	export default {
		data() {
			return {
				map: null
			}
		},
		methods: {

			clearAll() {
				this.map.getControls().getArray().slice(0).forEach((one) => {
					if (one) {
						this.map.removeControl(one);
					}
				});
			},

			initMap() {
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new XYZ({
								url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
							})
						})
					],
					view: new View({
						projection: "EPSG:3857",
						center: [114.064839, -22.548857],
						zoom: 4
					}),
					controls: control.defaults({
						zoom: true,
						doubleClickZoom: false,
						rotate: false,
						attribution: false
					}).extend([
						new control.OverviewMap({
							collapsed: true,
							collapsible: true,
							rotateWithView: true,
						}),
						new control.FullScreen(),
						new control.ZoomSlider()
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
		height: 480px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
</style>


