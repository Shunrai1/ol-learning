/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-08-15
*/

<template>
	<div class="container">
		<h4>
			<el-button size="mini" type="primary" @click='showGEO()'>开启Sence</el-button>
			<el-button size="mini" type="primary" @click='closeGEO()'>关闭Sence</el-button>
			<el-button size="mini" type="primary" @click='showAOI(0)'>开启AOI</el-button>
			<el-button size="mini" type="primary" @click='closeAOI()'>关闭AOI</el-button>
		</h4>
		<div id="map"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map'
	import View from 'ol/View'
	import OSM from'ol/source/OSM'
	import {Tile as TileLayer,Image as ImageLayer,Group as GroupLayer} from 'ol/layer';
	import {TileWMS,ImageWMS} from 'ol/source';
	import XYZ from "ol/source/XYZ";
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Feature from 'ol/Feature'
	import {Point,LineString,Polygon} from "ol/geom"
	import Style from 'ol/style/Style'
	import Icon from 'ol/style/Icon'
	import Text from 'ol/style/Text'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Circle from 'ol/style/Circle'
	import * as control from 'ol/control';
	import * as Interaction from 'ol/interaction';
	import getExtent from 'ol/extent';
	import {
		useGeographic,
		get as getProjection,
		fromLonLat,
		toLonLat,
		transform
	} from "ol/proj";
	import {
		getCenter
	} from 'ol/extent'
	export default {
		data() {
			return {
				AOIs: [{
					layerName: 'AOI001',
					isAOI: false,
					bound:  [
							{
							  "lat": 51.413,
							  "lng": -64.539
							},
							{
							  "lat": 51.3662,
							  "lng": -64.2347
							},
							{
							  "lat": 51.1747,
							  "lng": -64.3104
							},
							{
							  "lat": 51.2213,
							  "lng": -64.6135
							},
							{
							  "lat": 51.413,
							  "lng": -64.539
							}
						  ]
				}, ],
				map: null,
			}
		},
		methods: {
			showAOI(i) {
                                this.closeAOI();
				let polygonArray = []
				let array = this.AOIs[i].bound;
				for (let j = 0; j < array.length; j++) {
					let lng = array[j].lng;
					let lat = array[j].lat;
					let temp = fromLonLat([lng, lat])
					polygonArray.push(temp)
				}
			
				const tipFeature = new Feature({
					geometry: new Polygon([polygonArray]),
				});
			
				let vecLayer = new VectorLayer({
					visiable: true,
					zIndex: 201,
					source: new VectorSource({
						features: [tipFeature],
					}),
					style: new Style({
						stroke: new Stroke({
							color: '#f00',
							width: 2
						}),
						fill: new Fill({
							color: [255, 0, 0, 0.001]
						})
					})
				})
				vecLayer.set('name', this.AOIs[i].layerName);
				this.map.addLayer(vecLayer);
				this.$set(this.AOIs[i], "isAOI", true);
				this.fixExtent(i);			
			},
			
			closeAOI(){

				for (let i = 0; i < this.AOIs.length; i++) {
					let that = this;
					this.map.getLayers().forEach(function(layer, index, array) {
						if (layer && layer.get("name") == that.AOIs[i].layerName) {
							that.map.removeLayer(layer)
						}
					})
				}
			},
			
			closeGEO(){
				let that = this;
				this.map.getLayers().forEach(function(layer, index, array) {
					if (layer && layer.get("name") == 'abc') {
						that.map.removeLayer(layer)
					}
				})
			},
			
			
			showGEO() {
                                 this.closeGEO();
				let mytilelayer = new TileLayer({
					zIndex: 200,
					visiable: true,
					source: new TileWMS({
						url: 'http://x.x.x.x:8080/geoserver/rs_data/wms',
						ratio: 1,
						params: {
							'FORMAT': 'image/png',
							'VERSION': '1.1.0',
							'LAYERS': 'Geoserver的图层名称',
							transparent: 'true',
							'STYLES': '',
							angle:0
						},

					}),

				});
				mytilelayer.set('name', 'abc');
				this.map.addLayer(mytilelayer);
			},
			fixExtent(i) {
				let polygonArray = []
				let array = this.AOIs[i].bound;
				for (let j = 0; j < array.length; j++) {
					let lng = array[j].lng;
					let lat = array[j].lat;
					let temp = fromLonLat([lng, lat])
					polygonArray.push(temp)
				}

				let geometry = new Polygon([
					polygonArray
				]);
				let size = this.map.getSize();
				this.map.getView().fit(geometry, {
					size: size,
					padding: [200, 200, 200, 200]
				})
			},

			initMap() {
				let googleRLayer = new TileLayer({ //谷歌地图
					name: 'googleRLayer',
					zIndex: 1,
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=y@189&hl=en&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
				});


				this.map = new Map({
					target: 'map',
					layers: [googleRLayer],
					view: new View({
						projection: "EPSG:3857",
						 center: fromLonLat([-64.539,51.41]), 
						zoom: 12
					}),
				})
			},


		},
		mounted() {
			this.initMap();
			this.showAOI(0);
			this.showGEO()
		}
	}
</script>
<style scoped>
	.container {
		width: 100%;
		height:96vh;
	}

	#map {
		width: 100%;
		height:100%;
		position: relative;
	}
</style>
