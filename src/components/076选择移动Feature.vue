/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-16
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 选取feature，平移feature</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {Select,Translate,defaults as defaultInteractions,} from 'ol/interaction';
	import GeoJSON from 'ol/format/GeoJSON';
	import {fromLonLat} from 'ol/proj';
	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
				const vector = new VectorLayer({
				  background: '#F0FFF0',
				  source: new VectorSource({
					url: '/data/MapofChina.json',
					format: new GeoJSON(),
				  }),
				});
				const select = new Select();
				const translate = new Translate({
				  features: select.getFeatures(),
				});
                console.log(translate);
               
				this.map = new Map({
					target: "vue-openlayers",
					layers: [vector],
					view: new View({
						center: fromLonLat([119, 39]),
						zoom: 3,
						projection: 'EPSG:3857'
					}),
					interactions: defaultInteractions().extend([select, translate]),
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


