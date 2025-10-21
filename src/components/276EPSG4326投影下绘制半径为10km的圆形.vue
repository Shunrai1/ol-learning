
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-07-03
*/

<template>
	<div class="container">
		<h3>vue+openlayers: EPSG:4326投影下绘制半径为10Km的圆形</h3>
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

	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			showPoint() {				
					// 定义半径，此处我们使用10公里作为示例
					var radiusInKm = 10;
					// 由于EPSG:4326使用经纬度单位，我们需要将半径从公里转换为经纬度单位
					// 这里使用地球平均半径进行简单计算，更精确的计算需要考虑地球的椭球体形状
					var earthRadiusKm = 6371; //地球的平均半径 ，单位公里
					var radPerKm = 180 / (Math.PI * earthRadiusKm); // 每公里对应的经度或纬度变化量（度/公里）

					// 计算转换后的半径（以度为单位）
					var radiusInDegrees = radiusInKm * radPerKm;

					var circle = new Circle([-122.42, 37.81], radiusInDegrees);
					// 创建矢量层和特征，以便在地图上显示圆形
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

					// 将矢量层添加到地图上
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
						projection: "EPSG:4326",
						center: [-122.42, 37.81],
						zoom: 10
					})
				})
			},

		},
		mounted() {
			this.initMap();
			this.showPoint();
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


