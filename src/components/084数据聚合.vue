/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-03
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 聚合数据示例</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
		<div id="info"></div>
	</div>
</template>
<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {transform} from 'ol/proj';
	import {Style,Circle,Stroke,Fill,Text} from 'ol/style'
	import Cluster from 'ol/source/Cluster'
	import Point from 'ol/geom/Point'
	import Feature from 'ol/Feature'

	export default {
		name: 'cluster',
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {

				let count = 200
				let features = []
				let e = 10037508
				for (let i = 0; i < count; ++i) {
					let coordinates = [e * Math.random() - e * Math.random(), e * Math.random() - e * Math.random()]
					features[i] = new Feature(new Point(coordinates))
				}

				let clusterSource = new Cluster({
					// 通过 distance 来控制两个点聚合的间距，如果2个点的间距小于 distance 所设置的数时，就会以聚合的方式显示
					distance: parseInt(40, 10),
					source: new VectorSource({
						features
					})
				})

				// 点的样式
				let styleCache = {}
				let clusterLayer = new VectorLayer({
					source: clusterSource,
					style: feature => { 
						let size = feature.get('features').length
						let style = styleCache[size]
						if (!style) {
							style = new Style({
								image: new Circle({
									radius: 10,
									stroke: new Stroke({
										color: '#fff'
									}),
									fill: new Fill({
										color: 'DarkOrange'
									})
								}),
								text: new Text({
									text: size.toString(), 
									fill: new Fill({
										color: '#fff'
									})
								})
							})

							styleCache[size] = style
						}

						return style
					}
				})

				this.map = new Map({
					layers: [
						new TileLayer({
							source: new OSM()
						}),
						clusterLayer
					],
					target: 'vue-openlayers',
					view: new View({
						center: transform([20, 37.0902], "EPSG:4326", "EPSG:3857"),
						projection: "EPSG:3857",
						zoom: 2,
					}),
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

