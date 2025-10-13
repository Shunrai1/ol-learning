
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
		<h3>vue+openlayers: 绘制线段并生成贝塞尔曲线</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="showLine()">绘制多线段</el-button>
			<el-button type="warning" size="mini" @click="showB()">绘制贝塞尔曲线</el-button>
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
				line:null,
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
			},
			showLine() {
				this.line = turf.lineString([
				  [-76.091308, 18.427501],
				  [-76.695556, 18.729501],
				  [-76.552734, 19.40443],
				  [-74.61914, 19.134789],
				  [-73.652343, 20.07657],
				  [-73.157958, 20.210656]
				]);
              this.show(this.line)
			},
			showB(){
				if(this.line!=null){
				let curved = turf.bezierSpline(this.line);
				this.show(curved)
				}

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
								color: "#f0f",
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
						center: fromLonLat([-74.61914, 19.134789]),
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


