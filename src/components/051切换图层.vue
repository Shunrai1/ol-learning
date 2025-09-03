/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-03-29
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 使用layerswitcher切换图层（引用扩展版）</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import {transform} from 'ol/proj';
	import LayerGroup from 'ol/layer/Group';
	import LayerImage from 'ol/layer/Image';
	import LayerTile from 'ol/layer/Tile';
	import SourceImageArcGISRest from 'ol/source/ImageArcGISRest';
	import SourceOSM from 'ol/source/OSM';
	import SourceStamen from 'ol/source/Stamen';
    import 'ol-layerswitcher/src/ol-layerswitcher.css';
	import LayerSwitcher from 'ol-layerswitcher';

	export default {
		name: 'Mapbox',
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
				this.map = new Map({
					layers: [
						new LayerGroup({
							'title': 'Base maps',
							layers: [
								new LayerGroup({
									title: 'Water color with labels',
									type: 'base',
									combine: true,
									visible: false,
									layers: [
										new LayerTile({
											source: new SourceStamen({
												layer: 'watercolor'
											})
										}),
										new LayerTile({
											source: new SourceStamen({
												layer: 'terrain-labels'
											})
										})
									]
								}),
								new LayerTile({
									title: 'Water color',
									type: 'base',
									visible: false,
									source: new SourceStamen({
										layer: 'watercolor'
									})
								}),
								new LayerTile({
									title: 'OSM',
									type: 'base',
									visible: true,
									source: new SourceOSM()
								})
							]
						}),
						new LayerGroup({
							title: 'Overlays',
							layers: [
								new LayerImage({
									title: 'Countries',
									source: new SourceImageArcGISRest({
										ratio: 1,
										params: {
											'LAYERS': 'show:0'
										},
										url: "https://ons-inspire.esriuk.com/arcgis/rest/services/Administrative_Boundaries/Countries_December_2016_Boundaries/MapServer"
									})
								})
							]
						})
					],
					target: 'vue-openlayers',
					view: new View({
						center: [13247019.404399557, 4721671.572580107],
						projection: "EPSG:3857",
						zoom: 4,
					}),
				});

				var layerSwitcher = new LayerSwitcher();
				this.map.addControl(layerSwitcher);

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

