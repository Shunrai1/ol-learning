/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-01-23
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 通过webgl方式加载矢量图层</h3>
		<p>大剑师兰特，还是大剑师兰特，gis-dajianshi</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import OSM from 'ol/source/OSM'
    import Layer from 'ol/layer/Layer.js';
	import TileLayer from 'ol/layer/WebGLTile.js';
	import VectorSource from 'ol/source/Vector.js';
	import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js';
    import GeoJSON from 'ol/format/GeoJSON.js';
		
	export default {
		name: 'dajianshiDemo',
		data: function() {
			return {
				map: null
			}
		},
		methods: {
			loadData(){
				const style = {
				  'stroke-color': ['*', ['get', 'COLOR'], [220, 220, 220]],
				  'stroke-width': 1.5,
				  'fill-color': ['*', ['get', 'COLOR'], [255, 255, 255, 0.6]],
				};

				class WebGLLayer extends Layer {
				  createRenderer() {
					return new WebGLVectorLayerRenderer(this, {
					  style,
					});
				  }
				}

				let vectorLayer = new WebGLLayer({
				  source: new VectorSource({
				    url: 'https://openlayers.org/data/vector/ecoregions.json',
				    format: new GeoJSON(),
				  }),
				});
				this.map.addLayer(vectorLayer);
			}, 
			
			initMap() {
				const layer = new TileLayer({
					source: new OSM()
				});
				this.map = new Map({
					layers: [
						layer
					],
					target: 'vue-openlayers',
					view: new View({
						center: [0, 0],
						projection: "EPSG:3857",
						zoom: 3,
					}),
				});

			},
		},
		mounted() {
			this.initMap();
			this.loadData();
		}
	}
</script>

<style scoped>
	.container {
		width: 1000px;
		height: 640px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 960px;
		height: 520px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>



