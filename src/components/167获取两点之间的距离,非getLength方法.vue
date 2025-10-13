
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-07
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 获取两点之间的距离</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="default" size="mini" @click="showTwo()">绘制两点并获取距离
			<span v-if="juli!=0">{{juli}}km</span>
			</el-button>
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
	import XYZ from 'ol/source/XYZ'
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
				juli:0
			};
		},

		methods: {
			show(geojsonData) {

				let features = new GeoJSON().readFeatures(geojsonData, {
					dataProjection: 'EPSG:4326', //数据投影格式
					featureProjection: "EPSG:3857" //feature投影格式
				})

				this.turfSource.addFeatures(features)
			},

			clearSource() {
				this.turfSource.clear();
				this.juli=0;
			},
			showTwo() {
			let from = turf.point([-75.343, 39.984]);
			let to = turf.point([-75.534, 39.123]);
			let options = {units: 'kilometers'};
            
			this.show(from)
			this.show(to)
			let distance = turf.distance(from, to, options);
			 this.juli=distance
			 
			 
			let linestring1 = turf.lineString([[-75.343, 39.984], [-75.534, 39.123]], {name: 'line 1'});
			this.show(linestring1)
			},

			initMap() {
				let gaode_Layer = new TileLayer({
					source: new XYZ({
						url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=en&size=1&scl=1&style=7'
					})
				})
				let turfLayer = new VectorLayer({
					source: this.turfSource,
					style: new Style({
							fill: new Fill({
								color: 'rgba(255,0,0,0.2)'
							}),
							stroke: new Stroke({
								width: 2,
								color: "blue",
							}),
						  image: new Circle({  //点样式
							radius: 5, 
							fill: new Fill({
							  color: '#ff0000'
							})
						  }),
						}),

				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						gaode_Layer,
						turfLayer
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-75.343, 39.984]),
						zoom: 8
					}),
				})

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

