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
		<h3>vue+openlayers：加载geotiff文件，并在地图上显示</h3>
		<p>大剑师兰特，还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>               
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
    import WebGLTileLayer from 'ol/layer/WebGLTile.js';
	import XYZ from 'ol/source/XYZ'
	import GeoTIFF from 'ol/source/GeoTIFF';
	import {fromLonLat,toLonLat,transform} from "ol/proj";

	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
				// geotiff图层
				const source = new GeoTIFF({
				  sources: [
				    {
						url: '/data/demo.tif', //24.6Mb
						//下面的官方提供的地址,overviews相当于缩略图,加载更快
				      //url: 'https://openlayers.org/data/raster/no-overviews.tif',
				      // overviews: ['https://openlayers.org/data/raster/no-overviews.tif.ovr'],
				    },
				  ],
				});
				
				let geoLayer = new WebGLTileLayer({
					source: source 
				});

				// 底图
				let arcgisLayer = new Tile({
					source: new XYZ({
						url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
					})
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [arcgisLayer, geoLayer],
					view: new View({
						center: fromLonLat([2, 26]),
						zoom: 8
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

