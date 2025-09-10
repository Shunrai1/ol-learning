/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-25
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 游龙动画效果</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import OSM from 'ol/source/OSM';
	import TileLayer from 'ol/layer/Tile';
	import View from 'ol/View';
	import {Circle as CircleStyle,Fill,Stroke,Style} from 'ol/style';
	import {MultiPoint,Point} from 'ol/geom';
	import {getVectorContext} from 'ol/render'

	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {

			initMap() {
				const tileLayer = new TileLayer({
					source: new OSM(),
				});

				this.map = new Map({
					target: 'vue-openlayers',
					layers: [tileLayer],
					view: new View({
						center: [0, 0],
						zoom: 2
					}),
				});

				const imageStyle = new Style({
					image: new CircleStyle({
						radius: 10,
						fill: new Fill({
							color: 'LimeGreen'
						}),
						stroke: new Stroke({
							color: 'yellow',
							width: 1
						}),
					}),
				});

				const headInnerImageStyle = new Style({
					image: new CircleStyle({
						radius: 8,
						fill: new Fill({
							color: 'red'
						}),
					}),
				});

				const headOuterImageStyle = new Style({
					image: new CircleStyle({
						radius: 10,
						fill: new Fill({
							color: 'black'
						}),
					}),
				});

				const n = 200;
				const omegaTheta = 30000; // Rotation period in ms
				const R = 7e6;
				const r = 2e6;
				const p = 2e6;
				tileLayer.on('postrender', (event)=>{
					const vectorContext = getVectorContext(event);
					const frameState = event.frameState;
					const theta = (2 * Math.PI * frameState.time) / omegaTheta;
					const coordinates = [];
					let i;
					for (i = 0; i < n; ++i) {
						const t = theta + (2 * Math.PI * i) / n;
						const x = (R + r) * Math.cos(t) + p * Math.cos(((R + r) * t) / r);
						const y = (R + r) * Math.sin(t) + p * Math.sin(((R + r) * t) / r);
						coordinates.push([x, y]);
					}
					vectorContext.setStyle(imageStyle);
					vectorContext.drawGeometry(new MultiPoint(coordinates));

					const headPoint = new Point(coordinates[coordinates.length - 1]);

					vectorContext.setStyle(headOuterImageStyle);
					vectorContext.drawGeometry(headPoint);

					vectorContext.setStyle(headInnerImageStyle);
					vectorContext.drawGeometry(headPoint);

					this.map.render();
				});
				this.map.render();
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
		height: 590px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


