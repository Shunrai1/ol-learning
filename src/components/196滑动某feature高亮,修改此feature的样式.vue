/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-01-10
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 滑动选择某feature高亮，修改此feature的样式</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4 ref="info"></h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
	import Liaoning from '@/assets/data/json/liaoning_province.json' // 热力图数据
	import GeoJSON from 'ol/format/GeoJSON.js'; // 解析geojson格式	
	import {fromLonLat} from 'ol/proj'
	import {Style,Fill,Stroke,Text} from 'ol/style'
	export default {
		data() {
			return {
				map: null,
				highlightStyle: new Style({
					stroke: new Stroke({
						color: '#f00',
						width: 1
					}),
					fill: new Fill({
						color: 'rgba(255, 0, 0, 0.1)'
					}),
					text: new Text({
						font: '12px Calibri, sans-serif',
						fill: new Fill({
							color: '#000'
						}),
						stroke: new Stroke({
							color: '#f00',
							width: 3
						})
					})
				}),
				highlight: null,
				feaSelected: null
			}
		},
		methods: {
			showFea(pixel) {
				if (!this.feaSelected) {
					this.feaSelected = new LayerVector({
						source: new SourceVector(),
						map: this.map,
						style: feature => {
							this.highlightStyle.getText().setText(feature.get('name'))
							return this.highlightStyle
						}
					})
				}

				let feature = this.map.forEachFeatureAtPixel(pixel, feature => feature)

				if (feature) {
					this.$refs.info.innerHTML = feature.get('name') + ': ' + feature.get('adcode')
				} else {
					this.$refs.info.innerHTML = "城市名称：邮编"
				}

				if (feature !== this.highlight) {
					if (this.highlight) {
						this.feaSelected.getSource().removeFeature(this.highlight)
					}
					if (feature) {
						this.feaSelected.getSource().addFeature(feature)
					}
					this.highlight = feature
				}
			},
			initMap() {

				let style = new Style({
					fill: new Fill({
						color: "rgba(255, 255, 255, 0.4)"
					}),
					stroke: new Stroke({
						color: "#0000ff",
						width: 1
					}),
					text: new Text({
						font: "12px Calibri,sans-serif",
						fill: new Fill({
							color: "#000"
						}),
						stroke: new Stroke({
							color: "#ff0",
							width: 3
						})
					})
				});

				let vectorLayer = new LayerVector({
					source: new SourceVector({
						features: new GeoJSON().readFeatures(Liaoning, {
							dataProjection: 'EPSG:4326',
							featureProjection: "EPSG:3857"
						})
					}),
					style: feature => {
						style.getText().setText(feature.get('name'))
						return style
					}
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [vectorLayer],
					view: new View({
						projection: "EPSG:3857",
						center:fromLonLat([121, 40]) ,
						zoom: 6
					})
				})

				this.map.on('pointermove', e => {
					if (e.dragging) {
						return;
					}
					let pixel = this.map.getEventPixel(e.originalEvent)
					this.showFea(pixel)
				})

			}
		},
		mounted() {
			this.initMap();
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 620px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 460px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
</style>

