
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-01-24
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 通过WebGLVectorLayerRenderer方式加载海量多边形数据</h3>
		<p>大剑师兰特，还是大剑师兰特，gis-dajianshi</p>
		<h4>
			 <el-button type="primary" size="mini" @click="addSences()">加载数据</el-button>
			 <el-button type="danger" size="mini" @click="clear()">清除</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import XYZ from 'ol/source/XYZ'
    import Layer from 'ol/layer/Layer.js';
	import TileLayer from 'ol/layer/WebGLTile.js';
	import { fromLonLat } from 'ol/proj';
    import Feature from 'ol/Feature'
    import {Point, LineString, Circle, Polygon} from "ol/geom"
    import Style from 'ol/style/Style'
	import VectorSource from 'ol/source/Vector.js';
	import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
    import GeoJSON from 'ol/format/GeoJSON.js';
	import scenes from '@/assets/data/json/scenes.json'	
	export default {
		name: 'dajianshiDemo',
		data: function() {
			return {
				map: null,
				sData:scenes,
				dataSource: new VectorSource({ wrapX: false }), 
			}
		},
		methods: {
			clear(){
				this.dataSource.clear();
			},
			addSences(){				
				let arr=this.sData.data.images;
				let  newarray=arr.map((item)=>{
					return item.boundaries
				})
               
			     newarray.forEach((array)=>{
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
					  this.dataSource.addFeature(polygonFeature)		 				 
				 })	

			},
			
			initMap() {
				const style = {
				  'stroke-color': ['*', ['get', 'COLOR'], [220, 0, 0]],
				  // 'stroke-width': 1.5,
				  'fill-color': ['*', ['get', 'COLOR'], [255, 255, 255, 0.3]],
				};
				
				class WebGLLayer extends Layer {
				  createRenderer() {
					return new WebGLVectorLayerRenderer(this, {
					  style,
					});
				  }
				}
				let vectorLayer = new WebGLLayer({
				  source: this.dataSource,
				});

				const layer = new TileLayer({
					source: new XYZ({
					url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
					})
				});
				this.map = new Map({
					layers: [
						layer,vectorLayer
					],
					target: 'vue-openlayers',
					view: new View({
						center: [0, 0],
						projection: "EPSG:3857",
						zoom: 4,
					}),
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
		width: 1000px;
		height: 650px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}
	#vue-openlayers {
		width: 960px;
		height: 480px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

