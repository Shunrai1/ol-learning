/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-08
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 实现风场快速移动效果</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import {transform} from 'ol/proj';
	import {WindLayer} from 'ol-wind';

	export default {
		name: 'wind',
		data() {
			return {
				map: null,
			}
		},
		methods: {

			initMap() {
				let StamenLayer = new TileLayer({
					source: new OSM({})
				})

				this.map = new Map({
					layers: [
						StamenLayer
					],
					target: 'vue-openlayers',
					view: new View({
						center: transform([20, 37.0902], "EPSG:4326", "EPSG:3857"),
						projection: "EPSG:3857",
						zoom: 2,
					}),
				});
				let that = this;
				fetch('https://sakitam-1255686840.cos.ap-beijing.myqcloud.com/public/codepen/json/out.json')
					.then(res => res.json())
					.then(res => {
						const windLayer = new WindLayer(res, {
							wrapX: true,
							forceRender: false,
							windOptions: {
								colorScale: [
									"rgb(36,104, 180)",
									"rgb(60,157, 194)",
									"rgb(128,205,193 )",
									"rgb(151,218,168 )",
									"rgb(198,231,181)",
									"rgb(238,247,217)",
									"rgb(255,238,159)",
				   		            "rgb(252,217,125)",
									"rgb(255,182,100)",
									"rgb(252,150,75)",
									"rgb(250,112,52)",
									"rgb(245,64,32)",
									"rgb(237,45,28)",
									"rgb(220,24,32)",
									"rgb(180,0,35)"
								],
								velocityScale: 0.02,
								// paths: 5000,
								lineWidth: 2,
								frameRate: 16,
							 maxAge: 60,
								globalAlpha: 0.9,
								generateParticleOption: true,
								paths: () => { // can be number or function
									const zoom = that.map.getView().getZoom();
									return zoom * 1000;
								},
							},
						});

						that.map.addLayer(windLayer);
					});
			},
		},
		mounted() {
			this.initMap();
		},
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
		height: 450px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

