
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in CSDN
* @First published time: 2025-03-31
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 极速显示全球2万+浮标位置json数据 </h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import XYZ from 'ol/source/XYZ'
	import Feature from 'ol/Feature'
	import {Point,LineString,Circle,Polygon} from "ol/geom"
	import Style from 'ol/style/Style'
	import GeoJSON from 'ol/format/GeoJSON'
	import WebGLPointsLayer from 'ol/layer/WebGLPoints';
	import geojsonObject from '@/assets/drifters.json';
	import {fromLonLat,toLonLat,transformExtent,transform} from 'ol/proj'

	export default {
		data() {
			return {
				map: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
			};
		},

		methods: {
			// 设置vector样式
			featureStyle() {
				let style = {
					symbol: {
						symbolType: 'image',
						size: 3,
						color: '#ff0000'
					}
				};

				return style
			},

			showPoints() {
				console.log(geojsonObject.length)
				for (let i = 0; i < geojsonObject.length; i++) {
					let pointFeature = new Feature({
						geometry: new Point(fromLonLat([geojsonObject[i].lng, geojsonObject[i].lat])),
					})
					this.dataSource.addFeature(pointFeature)
				}

			},

			initMap() {
				let base_Layer = new TileLayer({
					source: new XYZ({
						url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
					})
				})
				console.log(this.dataSource)
				let feature_Layer = new WebGLPointsLayer({
					source: this.dataSource,
					style: this.featureStyle() //统一设置vector样式
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						base_Layer,
						feature_Layer
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([90, 0]),
						zoom: 1
					}),
				})

			},
		},
		mounted() {
			this.initMap();
			this.showPoints();
		}
	}
</script>
<style scoped>
	.container {
		width: 1000px;
		height: 640px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 960px;
		height: 520px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


