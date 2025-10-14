/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-25
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 绘制自定义图形，导出为geojson文件</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="drawImage()">绘制图形</el-button>
			<el-button type="primary" size="mini" @click="clearImage()">清除图形</el-button>
			<el-button type="danger" size="mini" @click="exportGeojson()">导出GeoJSON</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Circle from 'ol/style/Circle'
	import Draw, {createBox} from 'ol/interaction/Draw'
	import GeoJSON from 'ol/format/GeoJSON'
	const FileSaver = require('file-saver');

	export default {
		data() {
			return {
				map: null,
				draw: null,
				source: new SourceVector({
					wrapX: false
				})
			}
		},

		methods: {
			initMap() {
				let raster = new Tile({
					source: new OSM()
				});

				let vector = new LayerVector({
					source: this.source,
					style: new Style({
						fill: new Fill({
							color: "orange"
						}),
						stroke: new Stroke({
							width: 2,
							color: "darkgreen",
						}),

					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:4326",
						center: [113.1206, 23.034996],
						zoom: 10
					})
				})

			},
			clearImage() {
				this.source.clear()
			},
			drawImage() {
				// 停止上一次的绘制，没有此代码会出现重叠
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}

				let type = 'Circle'
				let geometryFunction1 = createBox()
				this.draw = new Draw({
					source: this.source,
					type: type,
					geometryFunction: geometryFunction1
				})
				this.map.addInteraction(this.draw)
			},
			exportGeojson() {
				let feadata = new GeoJSON().writeFeatures(this.source.getFeatures(), {
					dataProjection: 'EPSG:4326',
					featureProjection: 'EPSG:4326'
				});
				const content = JSON.stringify(feadata);
				const blob = new Blob([content], {
					type: 'text/plain;charset=utf-8'
				});
				FileSaver.saveAs(blob, 'mydata.geojson');
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
		height: 600px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 430px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

