/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-05-15
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 绘制多边形，生成geojson数据，计算出面积</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="drawImage()">绘制图形</el-button>
			<el-button type="success" size="mini" @click="showGeojson()">生成GeoJSON数据</el-button>
			<el-button type="primary" size="mini" @click="calculate()">计算出面积</el-button>
			<el-button type="danger" size="mini" @click="clearImage()">清除图形</el-button>
			<span v-if="isCalc">面积为：{{ area}} 平方米</span>
		</h4>
		<div id="vue-openlayers"></div>
		<div class="geoBox" v-if=" isGeo">
			{{geoData}}
		</div>
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
	import Circle from 'ol/style/Circle'
	import GeoJSON from 'ol/format/GeoJSON'
	import * as turf from '@turf/turf'
	import {fromLonLat} from 'ol/proj'
	import Draw from 'ol/interaction/Draw'

	export default {
		data() {
			return {
				map: null,
				draw: null,
				source: new SourceVector({
					wrapX: false
				}),
				area: 0,
				isCalc: false,
				isGeo: false,
				geoData: {},
			}
		},

		methods: {
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
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
						projection: "EPSG:3857",
						center: fromLonLat([113.1206, 23.034996]),
						zoom: 10
					})
				})

			},
			calculate() {
				this.isGeo = false;
				let temp = JSON.parse(this.geoData)
				this.area = turf.area(temp)
				this.isCalc = true;
			},
			clearImage() {
				this.source.clear();
				this.isCalc = false;
				this.isGeo = false;
			},
			drawImage() {
				// 停止上一次的绘制，没有此代码会出现重叠
				if (this.draw !== null) {
					this.map.removeInteraction(this.draw)
				}
				this.draw = new Draw({
					source: this.source,
					type: 'Polygon',
				})
				this.map.addInteraction(this.draw)
				this.draw.on('drawend', (evt) => {
					this.map.removeInteraction(this.draw)
				})
			},
			showGeojson() {
				this.isGeo = true;
				this.geoData = new GeoJSON().writeFeatures(this.source.getFeatures(), {
					dataProjection: 'EPSG:4326',
					featureProjection: 'EPSG:3857' //绘制后的
				});

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
		position: relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 430px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}

	.geoBox {
		position: absolute;
		width: 90%;
		height: 300px;
		overflow-y: auto;
		z-index: 5;
		left: 5%;
		bottom: 30px;
		background-color: aliceblue;
		padding: 10px;
	}
</style>


