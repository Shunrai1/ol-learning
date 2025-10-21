
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-30
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 解决setText不能立即更新文字的问题</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click="showPoint()">显示点及文字标签</el-button>
			<el-button type="warning" size="mini" @click="updateText()">更新文字标签内容</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import XYZ from 'ol/source/XYZ'
	import Feature from 'ol/Feature'
	import {Point} from "ol/geom"
	import Style from 'ol/style/Style'
	import Fill from 'ol/style/Fill'
	import Text from 'ol/style/Text'
	import Stroke from 'ol/style/Stroke'
	import CircleStyle from 'ol/style/Circle'

	export default {
		data() {
			return {
				map: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
				pointData: [116, 39],
			};
		},

		methods: {
			updateText() {
				this.dataSource.getFeatures().forEach((item) => {
					item.getStyle().getText().setText("最新的文字");
					item.changed()   //核心代码，让feature立即更新
				})
			},
			// 设置vector样式
			featureStyle() {
				let style = new Style({
					image: new CircleStyle({ //点样式
						radius: 10,
						fill: new Fill({
							color: '#ff0000'
						})
					}),
					text: new Text({
						text: "旧文字",
						textAlign: "center",
						offsetY: -30,
						font: "13px sans-serif",
						fill: new Fill({
							color: "#ff0000",
						}),
					}),

				})
				return style
			},
			// 显示点
			showPoint() {
				let pointFeature = new Feature({
					geometry: new Point(this.pointData),
				})
				pointFeature.setStyle(this.featureStyle()) //设置feature的样式
				this.dataSource.addFeature(pointFeature)
			},

			// 初始化地图     
			initMap() {
				let OSM_Layer = new TileLayer({
					source: new XYZ({
						  url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						  crossOrigin: "anonymous"
					})
				})
				let feature_Layer = new VectorLayer({
					source: this.dataSource,
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
						feature_Layer
					],
					view: new View({
						projection: "EPSG:4326",
						center: [116, 39],
						zoom: 14
					}),
				})

			},
		},
		mounted() {
			this.initMap()
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 570px;
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

