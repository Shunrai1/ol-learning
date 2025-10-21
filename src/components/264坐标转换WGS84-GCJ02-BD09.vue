/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-04-09
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 坐标转换 WGS84-GCJ02-BD09</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="showPoint1()">wgs84坐标点</el-button>
			<el-button type="danger" size="mini" @click="showPoint2()">gcj02坐标点</el-button>
			<el-button type="success" size="mini" @click="showPoint3()">bd09坐标点</el-button>
			<el-button type="info" size="mini" @click="clear()">清除</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import XYZ from "ol/source/XYZ";
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Feature from 'ol/Feature'
	import Point from "ol/geom/Point"
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import CircleStyle from 'ol/style/Circle'
	import {TileImage } from "ol/source";
	import TileGrid from "ol/tilegrid/TileGrid";
	import {
		fromLonLat
	} from 'ol/proj'

	export default {
		data() {
			return {
				map: null,
				GDlayer: null,
				googleLayer: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
				pointData: [122.1466624, 37.5159488],
			};
		},

		methods: {
			clear() {
				this.dataSource.clear();
			},
			outofchina(lat, lon) {
				if ((lon > 72.004 || lon < 137.8347) && (lat > 0.8293 || lat < 55.8271)) {
					return false;
				} else {
					return true;
				}
			},
			transformLat(x, y) {
				let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 8.2 * Math.sqrt(Math.abs(x));
				ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
				ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
				ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
				return ret;
			},
			transformLon(x, y) {
				let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 6.1 * Math.sqrt(Math.abs(x));
				ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
				ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
				ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
				return ret;
			},

			WGS84_gcj02(wgLon, wgLat) {

				if (this.outofchina(wgLat, wgLon)) {
					return [wgLon, wgLat]
				}
				var a = 6378245.0;
				var ee = 0.00669342162296594323;
				var pi = 3.14159265358979324;
				var dLat = this.transformLat(wgLon - 105.0, wgLat - 35.0);
				var dLon = this.transformLon(wgLon - 105.0, wgLat - 35.0);
				var radLat = wgLat / 180.0 * pi;
				var magic = Math.sin(radLat);
				magic = 1 - ee * magic * magic;
				var sqrtMagic = Math.sqrt(magic);
				dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
				dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
				var mgLat = wgLat + dLat;
				var mgLon = wgLon + dLon;
				return [mgLon, mgLat];
			},

			gcj02_Bd09(lon, lat) {
				let x_pi=Math.PI*3000/180;
				let x = lon;
				let	y = lat;
				let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
				let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
				let tempLon = z * Math.cos(theta) + 0.0065;
				let tempLat = z * Math.sin(theta) + 0.006;
				let gps = [tempLon,tempLat];
				return gps;
			},

           showPoint3() {
			   let gd_coordinate=this.gcj02_Bd09(this.pointData[0], this.pointData[1])

			   let pointFeature = new Feature({
			   	geometry: new Point(fromLonLat(gd_coordinate)),
			   })
			   pointFeature.setStyle(new Style({
			   	image: new CircleStyle({ //点样式
			   		radius: 10,
			   		fill: new Fill({
			   			color: '#00ff00'
			   		})
			   	}),
			   }))			   
			   this.dataSource.addFeature(pointFeature)			   
		   },

			showPoint2() {

				 let gd_coordinate = this.WGS84_gcj02(this.pointData[0], this.pointData[1])
				let pointFeature = new Feature({
					geometry: new Point(fromLonLat(gd_coordinate)),
				})
				pointFeature.setStyle(new Style({
					image: new CircleStyle({ //点样式
						radius: 10,
						fill: new Fill({
							color: '#ff0000'
						})
					}),
				}))
				
				this.dataSource.addFeature(pointFeature)
			},

			showPoint1() {

				let pointFeature = new Feature({
					geometry: new Point(fromLonLat(this.pointData)),
				})
				pointFeature.setStyle(new Style({
					image: new CircleStyle({ //点样式
						radius: 10,
						fill: new Fill({
							color: '#0000ff'
						})
					}),
				}))

				this.dataSource.addFeature(pointFeature)
			},

			// 初始化地图     
			initMap() {
				let feature_Layer = new VectorLayer({
					source: this.dataSource,
				})
				this.GDlayer = new TileLayer({
					source: new XYZ({
						url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7'
					}),
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						this.GDlayer,
						feature_Layer
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([122.1466624, 37.5159488]),
						zoom: 15
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
		position: relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 10px auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


