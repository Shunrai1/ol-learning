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
		<h3>vue+openlayers: 点击选择feature，设置成特定的颜色</h3>
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
    import Style from 'ol/style/Style'
    import Fill from 'ol/style/Fill'
    import Stroke from 'ol/style/Stroke'
	
	export default {
		data() {
			return {
				map: null,
				vsource: new VectorSource({}),
			}
		},
		methods: {
			selectedStyle() {
				const highlightStyle = new Style({
					fill: new Fill({
						color: 'red',
					}),
					stroke: new Stroke({
						color: '#3399CC',
						width: 2,
					}),
				});
				return highlightStyle
			},

			singleClickFunc() {
				const selected = [];
				this.map.on('singleclick', (e) => {
					this.map.forEachFeatureAtPixel(e.pixel, (f) => {
						const selIndex = selected.indexOf(f);
						if (selIndex < 0) {
							selected.push(f);
							f.setStyle(this.selectedStyle());
						} else {
							selected.splice(selIndex, 1);
							f.setStyle(undefined);
						}
					});
				})
			},

			initMap() {
				const vector = new VectorLayer({
					background: '#FDF5E6',
					source: new VectorSource({
						url: '/data/MapofChina.json',
						format: new GeoJSON(),
					}),
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [vector],
					view: new View({
						center: fromLonLat([119, 39]),
						zoom: 3,
						projection: 'EPSG:3857'
					}),
				});

			},
		},
		mounted() {
			this.initMap();
			this.singleClickFunc()
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



