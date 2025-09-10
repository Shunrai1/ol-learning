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
		<h3>vue+openlayers: Drag-and-Drop拖拽文件解析显示图形</h3>
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
	import DragAndDrop from 'ol/interaction/DragAndDrop';
	import {GPX,GeoJSON,IGC,KML,TopoJSON} from 'ol/format';
	export default {
		data() {
			return {
				map: null,
				vsource: new VectorSource({}),
			}
		},
		methods: {
			setInteraction() {
				let dragAndDropInteraction;
				if (dragAndDropInteraction) {
					this.map.removeInteraction(dragAndDropInteraction);
				}
				dragAndDropInteraction = new DragAndDrop({
					formatConstructors: [
						GPX,
						GeoJSON,
						IGC,
						new KML({extractStyles: true}),
						TopoJSON,
					],
				});
				dragAndDropInteraction.on('addfeatures', (event) => {
					const vectorSource = new VectorSource({
						features: event.features,
					});
					this.map.addLayer(
						new VectorLayer({
							source: vectorSource,
						})
					);
					this.map.getView().fit(vectorSource.getExtent());
				});
				this.map.addInteraction(dragAndDropInteraction);
			},

			initMap() {
				let osmLayer = new Tile({
					source: new OSM(),
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						osmLayer,
					],
					view: new View({
						center: [119, 39],
						zoom: 5,
						projection: 'EPSG:4326'
					}),

				});
				this.setInteraction();
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

