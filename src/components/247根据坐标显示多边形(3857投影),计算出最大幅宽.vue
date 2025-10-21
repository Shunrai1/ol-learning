
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-11-14
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 根据坐标显示多边形（3857投影），计算出最大幅宽</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="success" size="mini" @click="showPolygon()">显示多边形</el-button>
			<el-button type="danger" size="mini" @click="clearSource()">清除图形</el-button>
			最大幅宽值：{{maxLength}}千米
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
	import Feature from 'ol/Feature'
	import Stroke from 'ol/style/Stroke'
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import { Polygon } from "ol/geom"
	import {fromLonLat,toLonLat,transformExtent,transform} from 'ol/proj'
	import * as turf from '@turf/turf'

	export default {
		data() {
			return {
				map: null, // 地图
				source: new SourceVector({
					wrapX: false
				}),
				maxLength: 0,
				polygonData: [
					[-72.16, 41.4134],
					[-72.0176, 41.3896],
					[-72.0643, 41.23],
					[-72.2064, 41.2537],
					[-72.16, 41.4134]
				],
			}
		},
		methods: {
			clearSource() {
				this.source.clear();
				this.maxLength = 0;
			},
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
					})
				});

				let vector = new LayerVector({
					source: this.source,
				});
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [raster, vector],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-72.16, 41.4134]),
						zoom: 10
					})
				})
			},
			// 显示多边形
			showPolygon() {
				let array = this.polygonData;
				let polygonArray = []
				for (let i = 0; i < array.length; i++) {
					let lng = array[i][0];
					let lat = array[i][1];
					let temp = fromLonLat([lng, lat])
					polygonArray.push(temp)
				}

				let polygonFeature = new Feature({
					geometry: new Polygon([polygonArray]),
				})
				this.source.addFeature(polygonFeature)
				this.showFK(); //显示幅宽
			},

			showFK() {
				let extent3857 = this.source.getFeatures()[0].getGeometry().getExtent()
				console.log(extent3857)
				let bbox = transformExtent(extent3857, 'EPSG:3857', 'EPSG:4326')
				console.log(bbox)
				let a1 = bbox[0];
				let a2 = bbox[2];
				let b1 = bbox[1];
				let b2 = bbox[3];
				let c = '';
				if (Math.abs(b1) > Math.abs(b2)) {
					c = b2
				} else {
					c = b1
				}
				let dis = turf.distance(turf.point([a1, c]), turf.point([a2, c]), {
					units: 'kilometers'
				});
				this.maxLength = dis
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
		height: 660px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 480px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


