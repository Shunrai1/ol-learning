/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-01-05
*/

<template>
	<div class="container">
		<h3>vue+openlayers：加载geotiff的瓦片数据</h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import WebGLTileLayer from 'ol/layer/WebGLTile.js';
	import TileGrid from 'ol/tilegrid/TileGrid.js';
	import {sourcesFromTileGrid} from 'ol/source.js';
	import GeoTIFF from 'ol/source/GeoTIFF';
	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {

			let tileGrid = new TileGrid({
			  extent: [-180, -90, 180, 90],
			  resolutions: [0.703125, 0.3515625, 0.17578125, 8.7890625e-2, 4.39453125e-2],
			  tileSizes: [
				[512, 256],
				[1024, 512],
				[2048, 1024],
				[4096, 2048],
				[4096, 4096],
			  ],
			});

			const geoLayer = new WebGLTileLayer({
			  sources: sourcesFromTileGrid(
				tileGrid,
				([z, x, y]) =>
				  new GeoTIFF({
					sources: [
					  {
						url: `https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/${z}/${y}/${x}.tif`,
					  },
					],
				  })
			  ),
			});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [ geoLayer],
					view: new View({
						center: [0, 0],
						zoom: 0,
						projection: 'EPSG:4326',
						showFullExtent: true,
					})
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
		height: 640px;
		margin: 0 auto;
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


