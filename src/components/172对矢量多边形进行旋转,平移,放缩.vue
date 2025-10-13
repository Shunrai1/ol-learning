
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-08
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 对多边形进行旋转、平移、放缩处理</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="success" size="mini" @click="vec1()">原图形</el-button>
			<el-button type="primary" size="mini" @click="rotate1()">旋转</el-button>
			<el-button type="primary" size="mini" @click="translate1()">平移</el-button>
			<el-button type="primary" size="mini" @click="scale1()">放缩</el-button>
			<el-button type="danger" size="mini" @click="clearSource()">清除图层</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map'
	import View from 'ol/View'
	import TileLayer from 'ol/layer/Tile'
	import VectorSource from 'ol/source/Vector'
	import VectorLayer from 'ol/layer/Vector'
	import OSM from 'ol/source/OSM'
	import {transform,fromLonLat,toLonLat} from 'ol/proj';
	import * as turf from '@turf/turf'
	import GeoJSON from 'ol/format/GeoJSON'
	import {Fill,Stroke,Style,Circle,Icon,Image} from 'ol/style'
	import {Point,LineString,Polygon,MultiPoint,MultiPolygon,MultiLineString} from "ol/geom"
	import RegularShape from 'ol/style/RegularShape';

	export default {
		data() {
			return {
				map: null,
				turfSource: new VectorSource({
					wrapX: false
				}),
				polygon1: null,
			};
		},
		methods: {
			show(geojsonData, x) {
				let features = new GeoJSON().readFeatures(geojsonData, {
					dataProjection: 'EPSG:4326', //数据投影格式
					featureProjection: "EPSG:3857" //feature投影格式
				})
				if (x == 1) {
					features.forEach((f) => {f.setProperties({'stroke': "#F0F","fill": "transparent"});})
				}
				if (x == 2) {
					features.forEach((f) => {f.setProperties({'stroke': "#0FF","fill": "transparent"});})
				}
				if (x == 3) {
					features.forEach((f) => {f.setProperties({'stroke': "#FF0","fill": "transparent"});})
				}

				this.turfSource.addFeatures(features)
			},

			vec1() {
				this.show(this.polygon1)
			},

			clearSource() {
				this.turfSource.clear();
			},
			rotate1() {
			let options = {pivot: [141, -26]};
			let rotated = turf.transformRotate(this.polygon1, 10, options);
			this.show(rotated, 1)
			},
			translate1(){
			let translated = turf.transformTranslate(this.polygon1, 100,35);
			this.show(translated, 2)
			},
			scale1(){
			let scaled = turf.transformScale(this.polygon1, 2);  
			this.show(scaled, 3)	
			},

			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})
				let turfLayer = new VectorLayer({
					source: this.turfSource,
					style: function(feature) {
						return new Style({
							fill: new Fill({
								color: feature.get("fill"),
							}),
							stroke: new Stroke({
								color: feature.get("stroke"),
								width: 3,
							}),
						});
					},
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
						turfLayer
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([140, -28]),
						zoom: 3
					}),
				})
				
				this.polygon1 = turf.polygon([[
				  [127, -26],
				  [141, -26],
				  [141, -21],
				  [128, -21],
				  [127, -26]
				]], {
				  "fill": "transparent",
				  'stroke':"#F00"
				});
								
			},
		},
		mounted() {
			this.initMap();
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


