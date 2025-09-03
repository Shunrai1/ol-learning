/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-27
*/

<template>
	<div class="container">
		<h3>vue+openlayers：利用canvas clip 实现探照灯效果</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import TileLayer from 'ol/layer/Tile';
	import View from 'ol/View';
	import OSM from 'ol/source/OSM';
	import XYZ from "ol/source/XYZ";
	import {
		fromLonLat
	} from 'ol/proj';
	import {
		getRenderPixel
	} from 'ol/render';

	export default {
		data() {
			return {  
			};
		},

		methods: {

			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})
				let StamenMap = new TileLayer({
					source: new XYZ({
								url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
					})
				});


				let map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
						StamenMap,
					],
					view: new View({
						projection: "EPSG:4326",
						center: [116, 39],
						zoom: 4
					}),
				});
			
				let radius = 75;
				// 按上/下键会增大/减小 radius 并触发 map.render() 重绘
				document.addEventListener('keydown', function(evt) {
					if (evt.which === 38) {
			 		radius = Math.min(radius + 5, 150);
						map.render();
						evt.preventDefault();
					} else if (evt.which === 40) {
						radius = Math.max(radius - 5, 25);
						map.render();
						evt.preventDefault();
					}
				});

                const contain = document.getElementById('vue-openlayers');
				let mousePosition = null;
				contain.addEventListener('mousemove', function(event) {
					mousePosition = map.getEventPixel(event);
					map.render();
				});

				contain.addEventListener('mouseout', function() {
					mousePosition = null;
					map.render();
				});


				StamenMap.on('prerender', function(event) {
					const ctx = event.context;
					ctx.save();
			        ctx.beginPath();
					if (mousePosition) {
						const pixel = getRenderPixel(event, mousePosition);
						const offset = getRenderPixel(event, [
							mousePosition[0] + radius,
							mousePosition[1],
						]);
						const canvasRadius = Math.sqrt(
							Math.pow(offset[0] - pixel[0], 2) + Math.pow(offset[1] - pixel[1], 2)
						);
						ctx.arc(pixel[0], pixel[1], canvasRadius, 0, 2 * Math.PI);
						ctx.lineWidth = (5 * canvasRadius) / radius;
						ctx.strokeStyle = 'rgba(0,0,0,0.5)';
						ctx.stroke();
					}
					ctx.clip();  //只显示选区中的内容
				});

				StamenMap.on('postrender', function(event) {
					const ctx = event.context;
					ctx.restore();
				});

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
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 440px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


