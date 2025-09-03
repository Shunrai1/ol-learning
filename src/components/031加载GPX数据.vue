/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-06 
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 加载GPX数据，显示图形</h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM';
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Style from 'ol/style/Style'
	import Icon from 'ol/style/Icon'
	import Circle from 'ol/style/Circle'
	import Text from 'ol/style/Text'
	import Fill from 'ol/style/Fill'
	import Stroke from 'ol/style/Stroke'
	import GPX from 'ol/format/GPX';

	export default {
		data() {
			return {
				map: null,
				trackSource: new VectorSource(),

			}
		},
		methods: {

			initMap() {
				let OSMlayer = new Tile({
					source: new OSM(),
					visible: true,
					zIndex: 1,
				})

				const style = {
					'Point': new Style({
						image: new Circle({
							fill: new Fill({
								color: '#00FA9A',
							}),
							radius: 5,
							stroke: new Stroke({
								color: 'blue',
								width: 1,
							}),
						}),
					}),
					'LineString': new Style({
						stroke: new Stroke({
							color: '#FF00FF',
							width: 3,
						}),
					}),
					'MultiLineString': new Style({
						stroke: new Stroke({
							color: 'blue',
							width: 3,
						}),
					}),
				};

				const vectorLayer = new VectorLayer({
					visible: true,
					zIndex: 3,
					source: new VectorSource({
						url: '/data/fells_loop.gpx',
						format: new GPX(),
					}),
					style: function(feature) {
						return style[feature.getGeometry().getType()];
					},
				});


				this.map = new Map({
					target: "vue-openlayers",
					layers: [OSMlayer, vectorLayer],
					view: new View({
						center: [-7916041.528716288, 5228379.045749711],
						zoom: 12,
					}),
				})

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

