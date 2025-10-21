
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-07-04
*/

<template>
	<div class="container">
		<h3>vue+openlayers: EPSG:3857投影下绘制半径为10Km的圆形</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import Feature from 'ol/Feature'
	import {Point,Circle} from "ol/geom";
    import {toLonLat,fromLonLat} from 'ol/proj'
	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			showCircle() {				
					var circle = new Circle(fromLonLat([-122.42, 37.81]), 10000);
					var vectorLayer = new VectorLayer({
					  source: new VectorSource({
						features: [new Feature(circle)]
					  }),
					  style: new Style({
						stroke: new Stroke({
						  color: '#ff0000',
						  width: 2
						}),
						fill: new Fill({
						  color: 'rgba(255, 255, 0, 0.3)'
						})
					  })
					});
					this.map.addLayer(vectorLayer);
			},

			initMap() {
               let googlelayer = new Tile({
               source: new XYZ({
               		url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                  	})
               });
			   
				this.map = new Map({
					target: "vue-openlayers",
					layers: [googlelayer],
					view: new View({
						projection: "EPSG:3857",
						center:fromLonLat([-122.42, 37.81]) ,
						zoom: 10
					})
				})
			},

		},
		mounted() {
			this.initMap();
			this.showCircle();
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
		height: 540px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

