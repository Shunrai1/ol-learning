/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-06
*/

<template>
	<div class="container">
		<h3>vue+openlayers:个性化style </h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import Feature from 'ol/Feature';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import {Circle} from 'ol/geom';
	import {OSM,Vector as VectorSource} from 'ol/source';
	import {Style} from 'ol/style';
	import {Tile as TileLayer,Vector as VectorLayer} from 'ol/layer';
	export default {
		name: 'custom-style',
		data() {
			return {
				map: null,
			}
		},
		methods: {

			initMap() {
				const circleFeature = new Feature({
					geometry: new Circle([13357398.797692968, 4063894.123105166], 50),
				});
				circleFeature.setStyle(
					new Style({
						renderer(coordinates, state) {
							const [
								[x, y],
								[x1, y1]
							] = coordinates;
							const ctx = state.context;
							const dx = x1 - x;
							const dy = y1 - y;
							const radius = Math.sqrt(dx * dx + dy * dy);

							const innerRadius = 0;
							const outerRadius = radius * 1.4;

							const gradient = ctx.createRadialGradient(
								x,
								y,
								innerRadius,
								x,
								y,
								outerRadius
							);
							gradient.addColorStop(0, 'rgba(0,0,255,0)');
							gradient.addColorStop(0.6, 'rgba(0,0,255,0.2)');
							gradient.addColorStop(1, 'rgba(0,0,255,0.8)');
							ctx.beginPath();
							ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
							ctx.fillStyle = gradient;
							ctx.fill();

							ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
							ctx.strokeStyle = 'rgba(0,0,255,1)';
							ctx.stroke();
						},
					})
				);



				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new TileLayer({
							source: new OSM()
						}),
						new VectorLayer({
						      source: new VectorSource({
						        features: [circleFeature],
						      }),
						    }),
					],
					view: new View({
						projection: 'EPSG:3857',
						center: [13357398.797692968, 4063894.123105166],
						zoom: 18,
					})
				})

			}
		},
		mounted() {
			this.initMap()
		}
	}
</script>

<style scoped>
	.container {
		width: 840px;
		height: 520px;
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

