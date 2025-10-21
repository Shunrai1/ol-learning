/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-06-18
*/

<template>
	<div class="container">
		<h3>vue+openlayers: Collection的应用方法演示</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="add0()">添加瓦片层</el-button>
			<el-button type="primary" size="mini" @click="add1()">添加多边形层</el-button>
			<el-button type="danger" size="mini" @click="remove1()">移除多边形层</el-button>
			<el-button type="danger" size="mini" @click="remove0()">移除瓦片层</el-button>
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
	import CircleStyle from 'ol/style/Circle'
	import Feature from 'ol/Feature'
	import {MultiPolygon,MultiPoint} from "ol/geom";
	import Collection from 'ol/Collection.js';

	export default {
		data() {
			return {
				map: null,
				source1: new SourceVector({
					wrapX: false
				}),
				source2: new SourceVector({
					wrapX: false
				}),
				MultiPolygonData: [
					[
						[
							[116.805, 39.005],
							[116.106, 38.008],
							[116.508, 37.008],
							[116.805, 39.005]
						]
					],
					[
						[
							[115.805, 38.005],
							[115.106, 37.008],
							[115.508, 36.008],
							[115.805, 38.005]
						]
					],
				],
				MultiPolygonLayer: null,
				MultiPointLayer: null,
				raster:null,
				multiPointData: [
					[115, 39],
					[116.105, 39],
					[117.105, 39.005]
				],
				CollectionLayers:null,
			}
		},

		methods: {
			add0(){
			 this.raster = new Tile({
			 	source: new XYZ({
			 		url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
			 	})
			 });	
			 this.CollectionLayers.push(this.raster)	
			},
			add1(){				
				let MultiPolygonFeature = new Feature({
					geometry: new MultiPolygon(this.MultiPolygonData),
				});
				this.source1.addFeature(MultiPolygonFeature);
				
				this.MultiPolygonLayer = new LayerVector({
					source: this.source1,
					style: new Style({
						fill: new Fill({
							color: "orange"
						}),
						stroke: new Stroke({
							width: 5,
							color: "#2200ff",
						}),
		
					})
				});
				this.CollectionLayers.push(this.MultiPolygonLayer)
			},

			initMap() {
               this.CollectionLayers= new Collection(); //这一段代码非常重要

				this.map = new Map({
					target: "vue-openlayers",
					layers: this.CollectionLayers,
					view: new View({
						projection: "EPSG:4326",
						center: [116.105, 39],
						zoom: 10
					})
				})				
			},
			remove1() {
				this.CollectionLayers.remove(this.MultiPolygonLayer);
			},
			remove0() {
				this.CollectionLayers.remove(this.raster);
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

