/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-30
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 加载Geojson数据（url引用方式，非readFeatures）</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import VectorSource from 'ol/source/Vector';
	import VectorLayer from 'ol/layer/Vector';
	import GeoJSON from 'ol/format/GeoJSON';
	import {Tile} from 'ol/layer';
	import OSM from 'ol/source/OSM';
	import {fromLonLat} from 'ol/proj';

	// 引用数据

	export default {
		name: 'geoJSON',
		data() {
			return {
				map: null,
				view: new View({
					projection: "EPSG:3857",
					center: fromLonLat([8.2275, 46.8185]), // 瑞士
					zoom: 6
				})
			}
		},
		methods: {
			initMap() {

				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new OSM()
						}),
						new VectorLayer({
							source: new VectorSource({
							            url: "/switzerland.geojson",
										// 以下代码存在跨域错误
										// url: "https://github.com/openlayers/openlayers/blob/main/examples/data/geojson/switzerland.geojson",										
							            format: new GeoJSON()
							          })
						}),

					],
					view: this.view
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
		height: 550px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

