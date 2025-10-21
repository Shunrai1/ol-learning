
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-07-18
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 利用 LineString 显示线段</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="drawImage()">显示线段</el-button>
			<el-button type="danger" size="mini" @click="clearImage()">清除图形</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Feature from 'ol/Feature'
	import {LineString} from "ol/geom";

	export default {
		data() {
			return {
				map: null,
				source: new SourceVector({
					wrapX: false
				}),
				LineData: [
					[119, 39.5],
					[119.1, 39.6],
					[119, 39.7]
				],
				LineLayer: null,
			}
		},

		methods: {
			drawImage() {
				let LineFeature = new Feature({
					geometry: new LineString(this.LineData),
				});
				this.source.addFeature(LineFeature);
			},

			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
					})
				});

				this.LineLayer = new LayerVector({
					source: this.source,
					style: new Style({
						stroke: new Stroke({
							width: 5,
							color: "#ff0000",
						}),

					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster, this.LineLayer],
					view: new View({
						projection: "EPSG:4326",
						center: [119.1, 39.6],
						zoom: 10
					})
				})

			},
			clearImage() {
				this.source.clear()
			},

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
	}

	#vue-openlayers {
		width: 960px;
		height: 490px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

